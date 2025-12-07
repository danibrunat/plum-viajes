import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
  Row,
  Column,
} from "@react-email/components";

const formatValue = (value, fallback = "Sin especificar") => {
  if (value === null || value === undefined) return fallback;
  const trimmed = String(value).trim();
  return trimmed.length ? trimmed : fallback;
};

const formatYesNo = (value) => {
  const normalized = String(value ?? "")
    .trim()
    .toLowerCase();
  const truthyValues = ["true", "1", "si", "sí", "yes", "y", "on"];
  return truthyValues.includes(normalized) ? "Sí" : "No";
};

const formatPhone = (type, areaCode, number) => {
  const typeLabel = type === "cellphone" ? "Cel" : type === "home" ? "Fijo" : "";
  const pieces = [
    typeLabel,
    formatValue(areaCode, ""),
    formatValue(number, ""),
  ]
    .map((piece) => piece.trim())
    .filter(Boolean);

  return pieces.length ? pieces.join(" ") : "No proporcionado";
};

const formatMealPlan = (plan) => {
  const plans = {
    breakfast: "Desayuno",
    halfPension: "Media pensión",
    fullPension: "Pensión completa",
    allInclusive: "All Inclusive",
  };
  return plans[plan] || formatValue(plan, "A definir");
};

const ContactAdminEmailTemplate = ({
  name,
  surname,
  phoneType,
  phoneAreaCode,
  phoneNumber,
  contactTime,
  email,
  destination,
  departureDate,
  nightsQty,
  adultsQty,
  childQty,
  mealPlan,
  inquiry,
  ringMe,
  notifyPromotions,
}) => {
  const fullName = [formatValue(name, ""), formatValue(surname, "")]
    .join(" ")
    .trim()
    .replace(/\s+/g, " ");

  const currentDate = new Date().toLocaleDateString("es-AR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Html lang="es">
      <Head />
      <Preview>
        🔔 Nueva consulta de {fullName || "cliente"} - {formatValue(destination, "Destino a definir")}
      </Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          {/* Header con gradiente */}
          <Section style={styles.header}>
            <Text style={styles.logoText}>PLUM VIAJES</Text>
            <Text style={styles.headerSubtitle}>Panel de Consultas</Text>
          </Section>

          {/* Badge de nueva consulta */}
          <Section style={styles.alertBadge}>
            <Text style={styles.alertText}>📩 NUEVA CONSULTA RECIBIDA</Text>
            <Text style={styles.alertDate}>{currentDate}</Text>
          </Section>

          {/* Información del cliente */}
          <Section style={styles.card}>
            <Text style={styles.cardTitle}>👤 Datos del Cliente</Text>
            <table style={styles.table}>
              <tbody>
                <tr>
                  <td style={styles.labelCell}>Nombre completo</td>
                  <td style={styles.valueCell}>{fullName || "No proporcionado"}</td>
                </tr>
                <tr>
                  <td style={styles.labelCell}>Email</td>
                  <td style={styles.valueCell}>
                    <a href={`mailto:${email}`} style={styles.link}>{formatValue(email, "No proporcionado")}</a>
                  </td>
                </tr>
                <tr>
                  <td style={styles.labelCell}>Teléfono</td>
                  <td style={styles.valueCell}>
                    {formatPhone(phoneType, phoneAreaCode, phoneNumber)}
                    {formatYesNo(ringMe) === "Sí" && (
                      <span style={styles.callBadge}>📞 Solicita llamado</span>
                    )}
                  </td>
                </tr>
                <tr>
                  <td style={styles.labelCell}>Horario preferido</td>
                  <td style={styles.valueCell}>{formatValue(contactTime, "Sin preferencia")}</td>
                </tr>
              </tbody>
            </table>
          </Section>

          {/* Detalles del viaje */}
          <Section style={styles.card}>
            <Text style={styles.cardTitle}>✈️ Detalles del Viaje</Text>
            <table style={styles.table}>
              <tbody>
                <tr>
                  <td style={styles.labelCell}>Destino</td>
                  <td style={{...styles.valueCell, ...styles.highlight}}>{formatValue(destination, "A definir")}</td>
                </tr>
                <tr>
                  <td style={styles.labelCell}>Fecha de salida</td>
                  <td style={styles.valueCell}>{formatValue(departureDate, "Flexible")}</td>
                </tr>
                <tr>
                  <td style={styles.labelCell}>Duración</td>
                  <td style={styles.valueCell}>{formatValue(nightsQty, "—")} noches</td>
                </tr>
              </tbody>
            </table>
            
            {/* Pasajeros en grid */}
            <Row style={styles.passengersRow}>
              <Column style={styles.passengerBox}>
                <Text style={styles.passengerNumber}>{formatValue(adultsQty, "0")}</Text>
                <Text style={styles.passengerLabel}>Adultos</Text>
              </Column>
              <Column style={styles.passengerBox}>
                <Text style={styles.passengerNumber}>{formatValue(childQty, "0")}</Text>
                <Text style={styles.passengerLabel}>Menores</Text>
              </Column>
              <Column style={styles.passengerBox}>
                <Text style={styles.passengerNumber}>{formatMealPlan(mealPlan)}</Text>
                <Text style={styles.passengerLabel}>Régimen</Text>
              </Column>
            </Row>
          </Section>

          {/* Consulta del cliente */}
          <Section style={styles.card}>
            <Text style={styles.cardTitle}>💬 Consulta del Cliente</Text>
            <Text style={styles.inquiryText}>
              {formatValue(inquiry, "El cliente no dejó comentarios adicionales.")}
            </Text>
          </Section>

          {/* Preferencias */}
          <Section style={styles.preferencesSection}>
            <Row>
              <Column style={styles.preferenceItem}>
                <Text style={styles.preferenceIcon}>{formatYesNo(ringMe) === "Sí" ? "✅" : "❌"}</Text>
                <Text style={styles.preferenceText}>Solicita llamado</Text>
              </Column>
              <Column style={styles.preferenceItem}>
                <Text style={styles.preferenceIcon}>{formatYesNo(notifyPromotions) === "Sí" ? "✅" : "❌"}</Text>
                <Text style={styles.preferenceText}>Acepta promociones</Text>
              </Column>
            </Row>
          </Section>

          <Hr style={styles.hr} />

          {/* Call to action */}
          <Section style={styles.ctaSection}>
            <Text style={styles.ctaText}>
              ⚡ Respondé a este correo para contactar directamente al cliente
            </Text>
          </Section>

          {/* Footer */}
          <Section style={styles.footer}>
            <Text style={styles.footerText}>
              Sistema de notificaciones · Plum Viajes
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

const styles = {
  body: {
    backgroundColor: "#f3f4f6",
    margin: 0,
    padding: "32px 16px",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  },
  container: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    overflow: "hidden",
    maxWidth: "600px",
    margin: "0 auto",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  },
  header: {
    backgroundColor: "#2c388b",
    padding: "24px",
    textAlign: "center",
  },
  logoText: {
    color: "#ffffff",
    fontSize: "24px",
    fontWeight: "bold",
    margin: "0 0 4px 0",
    letterSpacing: "2px",
  },
  headerSubtitle: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: "13px",
    margin: 0,
    textTransform: "uppercase",
    letterSpacing: "1px",
  },
  alertBadge: {
    backgroundColor: "#fef3c7",
    borderLeft: "4px solid #f59e0b",
    padding: "16px 20px",
    margin: "0",
  },
  alertText: {
    color: "#92400e",
    fontSize: "14px",
    fontWeight: "600",
    margin: "0 0 4px 0",
  },
  alertDate: {
    color: "#a16207",
    fontSize: "12px",
    margin: 0,
  },
  card: {
    padding: "20px 24px",
    borderBottom: "1px solid #e5e7eb",
  },
  cardTitle: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#374151",
    margin: "0 0 16px 0",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  labelCell: {
    padding: "8px 12px 8px 0",
    fontSize: "13px",
    color: "#6b7280",
    width: "140px",
    verticalAlign: "top",
  },
  valueCell: {
    padding: "8px 0",
    fontSize: "14px",
    color: "#111827",
    fontWeight: "500",
  },
  highlight: {
    color: "#2c388b",
    fontSize: "16px",
    fontWeight: "700",
  },
  link: {
    color: "#2563eb",
    textDecoration: "none",
  },
  callBadge: {
    display: "inline-block",
    marginLeft: "8px",
    padding: "2px 8px",
    backgroundColor: "#dcfce7",
    color: "#166534",
    fontSize: "11px",
    borderRadius: "12px",
    fontWeight: "600",
  },
  passengersRow: {
    marginTop: "16px",
  },
  passengerBox: {
    backgroundColor: "#f9fafb",
    borderRadius: "8px",
    padding: "12px",
    textAlign: "center",
    margin: "0 4px",
  },
  passengerNumber: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#2c388b",
    margin: "0 0 4px 0",
  },
  passengerLabel: {
    fontSize: "11px",
    color: "#6b7280",
    margin: 0,
    textTransform: "uppercase",
  },
  inquiryText: {
    fontSize: "14px",
    lineHeight: "22px",
    color: "#374151",
    backgroundColor: "#f9fafb",
    padding: "16px",
    borderRadius: "8px",
    margin: 0,
    borderLeft: "3px solid #2c388b",
  },
  preferencesSection: {
    padding: "16px 24px",
    backgroundColor: "#f9fafb",
  },
  preferenceItem: {
    textAlign: "center",
  },
  preferenceIcon: {
    fontSize: "20px",
    margin: "0 0 4px 0",
  },
  preferenceText: {
    fontSize: "12px",
    color: "#6b7280",
    margin: 0,
  },
  hr: {
    border: "none",
    margin: 0,
  },
  ctaSection: {
    padding: "20px 24px",
    backgroundColor: "#eff6ff",
    textAlign: "center",
  },
  ctaText: {
    fontSize: "13px",
    color: "#1e40af",
    margin: 0,
    fontWeight: "500",
  },
  footer: {
    padding: "16px 24px",
    textAlign: "center",
  },
  footerText: {
    fontSize: "11px",
    color: "#9ca3af",
    margin: 0,
  },
};

export default ContactAdminEmailTemplate;
