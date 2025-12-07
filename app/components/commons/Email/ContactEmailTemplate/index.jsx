import {
  Body,
  Container,
  Head,
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

const ContactEmailTemplate = ({
  name,
  surname,
  destination,
  departureDate,
  nightsQty,
  adultsQty,
  childQty,
}) => {
  const fullName = [formatValue(name, ""), formatValue(surname, "")]
    .join(" ")
    .trim()
    .replace(/\s+/g, " ");

  const totalPassengers =
    (parseInt(adultsQty) || 0) + (parseInt(childQty) || 0);

  return (
    <Html lang="es">
      <Head />
      <Preview>
        ✈️ Recibimos tu consulta - Plum Viajes
      </Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          {/* Header */}
          <Section style={styles.header}>
            <Text style={styles.logoText}>PLUM VIAJES</Text>
          </Section>

          {/* Greeting */}
          <Section style={styles.content}>
            <Text style={styles.greeting}>
              ¡Hola{fullName ? `, ${fullName}` : ""}! 👋
            </Text>
            <Text style={styles.message}>
              Recibimos tu consulta y ya estamos trabajando en ella. 
              Un especialista te contactará pronto con la mejor propuesta para tu viaje.
            </Text>
          </Section>

          {/* Trip Summary Card */}
          <Section style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Tu viaje</Text>
            
            <Row style={styles.summaryRow}>
              <Column style={styles.summaryIconCol}>
                <Text style={styles.summaryIcon}>📍</Text>
              </Column>
              <Column>
                <Text style={styles.summaryLabel}>Destino</Text>
                <Text style={styles.summaryValue}>
                  {formatValue(destination, "A definir")}
                </Text>
              </Column>
            </Row>

            <Row style={styles.summaryRow}>
              <Column style={styles.summaryIconCol}>
                <Text style={styles.summaryIcon}>📅</Text>
              </Column>
              <Column>
                <Text style={styles.summaryLabel}>Fecha de salida</Text>
                <Text style={styles.summaryValue}>
                  {formatValue(departureDate, "Flexible")}
                </Text>
              </Column>
            </Row>

            <Row style={styles.statsRow}>
              <Column style={styles.statBox}>
                <Text style={styles.statNumber}>{formatValue(nightsQty, "-")}</Text>
                <Text style={styles.statLabel}>noches</Text>
              </Column>
              <Column style={styles.statBox}>
                <Text style={styles.statNumber}>{totalPassengers || "-"}</Text>
                <Text style={styles.statLabel}>pasajeros</Text>
              </Column>
            </Row>
          </Section>

          {/* Next Steps */}
          <Section style={styles.content}>
            <Text style={styles.nextStepsTitle}>¿Qué sigue?</Text>
            <Text style={styles.nextStepsText}>
              📞 Te contactaremos en las próximas horas
            </Text>
            <Text style={styles.nextStepsText}>
              💬 Respondé este email si querés agregar algo
            </Text>
          </Section>

          {/* Footer */}
          <Section style={styles.footer}>
            <Text style={styles.footerThanks}>
              ¡Gracias por elegirnos! ✨
            </Text>
            <Text style={styles.footerText}>
              Plum Viajes · ventas@plumviajes.com.ar · +54 11 3087 5513
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
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  },
  container: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    overflow: "hidden",
    maxWidth: "480px",
    margin: "0 auto",
    boxShadow:
      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  },
  header: {
    backgroundColor: "#2c388b",
    padding: "24px",
    textAlign: "center",
  },
  logoText: {
    color: "#ffffff",
    fontSize: "20px",
    fontWeight: "bold",
    margin: 0,
    letterSpacing: "2px",
  },
  content: {
    padding: "24px",
  },
  greeting: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#111827",
    margin: "0 0 12px 0",
  },
  message: {
    fontSize: "15px",
    lineHeight: "24px",
    color: "#4b5563",
    margin: 0,
  },
  summaryCard: {
    backgroundColor: "#fef3c7",
    margin: "0 24px",
    padding: "20px",
    borderRadius: "12px",
  },
  summaryTitle: {
    fontSize: "11px",
    fontWeight: "600",
    color: "#92400e",
    textTransform: "uppercase",
    letterSpacing: "1px",
    margin: "0 0 16px 0",
  },
  summaryRow: {
    marginBottom: "12px",
  },
  summaryIconCol: {
    width: "32px",
    verticalAlign: "top",
  },
  summaryIcon: {
    fontSize: "16px",
    margin: 0,
  },
  summaryLabel: {
    fontSize: "11px",
    color: "#92400e",
    margin: "0 0 2px 0",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  summaryValue: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#78350f",
    margin: 0,
  },
  statsRow: {
    marginTop: "16px",
    borderTop: "1px solid rgba(146, 64, 14, 0.2)",
    paddingTop: "16px",
  },
  statBox: {
    textAlign: "center",
    width: "50%",
  },
  statNumber: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#78350f",
    margin: 0,
  },
  statLabel: {
    fontSize: "12px",
    color: "#92400e",
    margin: 0,
  },
  nextStepsTitle: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#111827",
    margin: "0 0 12px 0",
  },
  nextStepsText: {
    fontSize: "14px",
    color: "#4b5563",
    margin: "0 0 8px 0",
  },
  footer: {
    padding: "24px",
    textAlign: "center",
    borderTop: "1px solid #e5e7eb",
  },
  footerThanks: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#2c388b",
    margin: "0 0 8px 0",
  },
  footerText: {
    fontSize: "12px",
    color: "#9ca3af",
    margin: 0,
  },
};

export default ContactEmailTemplate;
