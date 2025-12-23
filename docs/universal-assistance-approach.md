# Universal Assistance Integration – Approach

## Goals
- Add travel assistance product with availability, detail, and checkout flows specific to Universal Assistance (UA).
- Use Mercado Pago Checkout Pro (redirect) with synchronous UA issuance after approved payment.
- Persist orders/payments/status history in Supabase (server-side only).
- Keep current packages flow untouched; new UI lives under /assistance/*.

## Architecture Overview
- **API facade**: /api/assistance/* exposes stable contracts for frontend (quote, create order, get order, Mercado Pago return helper) and /api/webhooks/mercadopago for payment events.
- **Business services**: app/api/services/ua/* orchestrates orders, payments, issuance, and status transitions; uses Supabase repositories and UA/Mercado Pago clients.
- **Provider UA**: app/api/providers/universal-assistance/* handles external SOAP/REST calls (quote, issue, cancel/change) using existing XmlService patterns; responses normalized in a mapper.
- **Supabase persistence**: server-role client only; stores orders, payment attempts, and status history. Redis only for idempotency (webhook replay protection) if needed.
- **Payments**: Mercado Pago preference creation on order create; webhook validates secret/idempotency, updates payment state, then calls UA issue.
- **Emails**: reuse SMTP + React Email; send confirmation with UA policy/voucher; optional incident email on failure.
- **Backoffice operador**: minimal UI (or Sanity Studio) to mark cancel/change manually; triggers UA cancel/change via service.

## API Surface (initial)
- POST /api/assistance/quote → UA quote (with optional cache) based on traveler data.
- POST /api/assistance/orders → create UA order, persist in Supabase, create Mercado Pago preference, return init_point/redirect_url + internal orderId.
- GET /api/assistance/orders/[id] → fetch order + latest status/payment/UA codes.
- POST /api/webhooks/mercadopago → validate secret + idempotency, fetch payment if needed, update payment record and order status, then issue UA synchronously; on success store UA reservation/policy IDs.
- (Optional) POST /api/assistance/orders/[id]/cancel and /change-dates for operador-only actions (auth/internal).

## Supabase Schema (proposed)
- ua_orders: id (uuid), order_number (serial), status, customer_name/email/phone, coverage_plan, travel_dates, travelers jsonb, total_amount numeric, currency, ua_reservation_code, ua_policy_id, metadata jsonb, created_at/updated_at.
- ua_payments: id (uuid), order_id (fk), provider ("mercadopago"), status, amount, currency, provider_payment_id, merchant_order_id, provider_payload jsonb, created_at/updated_at.
- ua_order_status_history: id (uuid), order_id (fk), status, reason, actor (text), created_at.
- ua_order_statuses (lookup, optional): code, label, is_terminal. Codes: PAYMENT_PENDING, PAID, ISSUE_IN_PROGRESS, ISSUED, ISSUE_FAILED, CANCELLED.

## Frontend Flows (new screens)
- **Availability (/assistance/avail)**: search form (origin/dest?, dates, travelers, plan type); results list with price, coverage highlights, CTA “View details”. Fetches POST /api/assistance/quote.
- **Detail (/assistance/detail)**: shows coverage breakdown, exclusions, price options (per traveler/party), FAQs, and summary sidebar with CTA “Checkout”. Uses data from quote selection + optional refresh.
- **Checkout (/assistance/checkout)**: collects traveler details + contact, shows total, creates order via POST /api/assistance/orders, redirects to Mercado Pago init_point.
- **Return (/assistance/checkout/return)**: reads MP status params, calls GET order to show success/failure; on success displays UA policy codes; on failure offers retry.

## Services Layout (plum-viajes)
- app/api/services/supabase/server.js → service-role client (env: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY).
- app/api/services/ua/uaOrders.repository.js → CRUD orders/payments/history (raw Supabase calls).
- app/api/services/ua/uaOrders.service.js → workflows: create order, record payment, transition status, trigger UA issue, append history, send emails.
- app/api/services/ua/uaMercadoPago.service.js → create preference, fetch payment details, signature/secret validation helpers.
- app/api/services/ua/uaProvider.service.js → UA API client + mappers (quote, issue, cancel/change).

## Sequence (happy path)
1) User searches availability → /api/assistance/quote → UA provider → normalized response → UI list.
2) User opens detail → existing quote data or refresh → shows coverage + price → clicks Checkout.
3) Checkout POST /api/assistance/orders → create order (Supabase) → create MP preference → return init_point → redirect.
4) Mercado Pago processes payment.
5) Webhook POST /api/webhooks/mercadopago → validate secret/idempotency → fetch payment → update ua_payments + ua_orders status=PAID → call UA issue → store ua_reservation_code/policy_id → history entry → send confirmation email.
6) User returns to /assistance/checkout/return → GET order → show success with policy/voucher or failure with retry.

## Estimates (rough, hours)
- Supabase setup + schema + env wiring: 8–12
- UA provider client (quote/issue) + mapper: 16–24
- Orders service + repositories + status history: 14–20
- Mercado Pago (preference, webhook, idempotency): 12–18
- Frontend (availability, detail, checkout, return states): 16–24
- Emails (templates + triggers): 6–10
- Backoffice operador (read/list + manual cancel/change flow): 8–12
- QA/hardening (timeouts, retries, errors, logging): 10–16
**Total estimado:** 90–136 horas (ajustar según alcance de backoffice y complejidad UA).

## Assumptions / Risks
- UA issuance is synchronous and stable; if not, need ISSUE_IN_PROGRESS + async retry.
- Mercado Pago Checkout Pro redirect; webhook always sent; return URL alone is insufficient.
- No automated refunds; operador cancels/gestiona manualmente.
- Supabase used only server-side; no CSP changes. If using browser client, add connect-src for Supabase host in vercel.json.
- Idempotency for webhooks based on provider_payment_id or event_id; may use Redis to short-circuit replays.
