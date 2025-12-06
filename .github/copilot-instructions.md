# Plum Viajes - AI Coding Guidelines

## Project Overview
Next.js 16 travel agency platform integrating multiple travel package providers (OLA, etc.) with Sanity CMS, Upstash Redis caching, and a multi-tier API authentication system. Deployed on Vercel.

## Architecture

### API Layer Structure (`app/api/`)
- **Public API routes** (`/api/packages`, `/api/hotels`, `/api/cities`): Consumer-facing endpoints with caching
- **Provider routes** (`/api/providers/ola/`): Direct integrations with external travel APIs (SOAP/XML)
- **Business logic** (`/api/services/pcom.service.js`): "pcom" = Package Commerce layer that applies business rules, filtering, and pricing logic
- **Raw data** (`/api/services/pbase`): Base data without business transformations

### Data Flow Pattern
```
Frontend → /api/packages/availability → CacheService → pcom.service → providers/ola → External SOAP API
```

### Service Organization (`app/services/` vs `app/api/services/`)
- `app/services/`: Frontend-consumable services (api.service.js defines endpoints)
- `app/api/services/`: Backend-only services (cache, filters, providers, redis)

## Key Patterns

### API Authentication (`app/lib/auth/`)
```javascript
import { auth } from "../../lib/auth/index.js";

// Protected route (default)
export const GET = auth.protect(handler);

// Public endpoint
export const GET = auth.public(handler);

// Internal-only (same-origin)
export const GET = auth.internal(handler);
```

### Cache Service Usage
```javascript
import { CacheService } from "../../api/services/cache";

// Always check cache before external calls
const cached = await CacheService.packages.getAvailabilityFromCache(searchParams, filters);
if (cached) return Response.json(cached);

// After fetching, cache the response
await CacheService.packages.setAvailabilityCache(searchParams, filters, response);
```

**TTLs configured in**: `app/constants/cachePolicies.js`
**Disable cache globally**: Set `DISABLE_CACHE=true` or edit `CACHE_ENABLED` in cachePolicies.js

### Sanity CMS Integration
- Queries defined in: `app/lib/queries.ts` (GROQ syntax)
- Fetching: Use `sanityFetch({ query, params })` from `app/lib/sanityFetch.js`
- CRUD operations: `sanityCreate`, `sanityPatch`, `sanityDelete` available

### Dynamic Sections (CMS-driven pages)
Pages use `RenderSections.js` to dynamically render components based on Sanity `_type`:
```javascript
// Section components must be exported from app/components/sections/index.js
// Section _type "heroWithImages" → HeroWithImages component
```

## Developer Commands
```bash
pnpm dev              # Start with Turbopack
pnpm generate-api-key # Create external API key for providers
pnpm check-api-keys   # Verify API key configuration
pnpm test-auth        # Test authentication system
```

## File Conventions

### Constants (`app/constants/`)
- `cachePolicies.js`: All TTLs and cache configuration
- `site.js`: FLOW_STAGES, CONSUMERS enums for price calculations
- `origins.js`, `destinations.js`: Static location data

### Helpers Location
- API/backend helpers: `app/helpers/api/` or `app/api/services/`
- Frontend helpers: `app/helpers/` (strings.js, validation.js)
- Shared utilities: `utils/` (root level)

## External Integrations

### OLA Travel Provider
- SOAP/XML communication via `app/api/services/xml.service.js`
- Environment: `OLA_URL` for endpoint
- Routes: `app/api/providers/ola/avail/`, `app/api/providers/ola/detail/`

### Redis (Upstash)
- Service: `app/api/services/redis.service.js`
- Key patterns: `pkg:avail:*`, `pkg:detail:*`, `city:*`, `hotel:*`
- Always use `CacheService` wrapper, not direct Redis calls

## Code Organization Rules

### Pattern Observation (CRITICAL)
Before writing any code, **always observe existing patterns** in the project:
1. Search for similar implementations before creating new ones
2. Check `app/helpers/`, `app/api/services/`, and `utils/` for existing utilities
3. Follow the same structure and naming conventions already established

### No Code Duplication
- **Never duplicate code** - always reuse existing functions and components
- If a helper is needed, first search the codebase to see if it already exists
- If creating something new, ensure it's placed where it can be reused

### Helper Separation (Mandatory)
- **Never define helper functions inside components** - extract them to dedicated files
- Component files should only contain component logic and JSX
- Helpers go in:
  - `app/helpers/` for frontend utilities
  - `app/helpers/api/` for API-specific helpers  
  - `app/api/services/` for backend service logic
  - `utils/` for shared cross-cutting utilities

## General Conventions
- All code (variables, functions, filenames) must be in **English**
- Use descriptive names over short ones (`isUserAuthenticated` not `isAuth`)
- Check `app/constants/` before creating new config values
- API keys for external providers: `EXTERNAL_API_KEY_[PROVIDER_NAME]` format
