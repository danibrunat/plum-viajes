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

const NewsletterAdminEmailTemplate = ({ name, email }) => {
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
        📬 Nuevo suscriptor al newsletter: {formatValue(name, "Sin nombre")}
      </Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          {/* Header */}
          <Section style={styles.header}>
            <Text style={styles.logoText}>PLUM VIAJES</Text>
          </Section>

          {/* Datos del suscriptor */}
          <Section style={styles.card}>
            <Text style={styles.cardTitle}>👤 Datos del Suscriptor</Text>
            
            <Row style={styles.dataRow}>
              <Column style={styles.iconColumn}>
                <Text style={styles.icon}>👤</Text>
              </Column>
              <Column style={styles.dataColumn}>
                <Text style={styles.dataLabel}>Nombre</Text>
                <Text style={styles.dataValue}>{formatValue(name, "No proporcionado")}</Text>
              </Column>
            </Row>

            <Row style={styles.dataRow}>
              <Column style={styles.iconColumn}>
                <Text style={styles.icon}>📧</Text>
              </Column>
              <Column style={styles.dataColumn}>
                <Text style={styles.dataLabel}>Email</Text>
                <Text style={styles.dataValue}>
                  <a href={`mailto:${email}`} style={styles.link}>
                    {formatValue(email, "No proporcionado")}
                  </a>
                </Text>
              </Column>
            </Row>
          </Section>

          {/* Acción sugerida */}
          <Section style={styles.actionCard}>
            <Text style={styles.actionIcon}>✅</Text>
            <Text style={styles.actionTitle}>Acción requerida</Text>
            <Text style={styles.actionText}>
              Agregá este contacto a la lista de distribución del newsletter para que comience a recibir las promociones.
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
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  },
  container: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    overflow: "hidden",
    maxWidth: "500px",
    margin: "0 auto",
    boxShadow:
      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  },
  header: {
    backgroundColor: "#FF9901",
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
    color: "rgba(255, 255, 255, 0.9)",
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
    padding: "24px",
  },
  cardTitle: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#374151",
    margin: "0 0 20px 0",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  dataRow: {
    marginBottom: "16px",
  },
  iconColumn: {
    width: "40px",
    verticalAlign: "top",
  },
  icon: {
    fontSize: "20px",
    margin: 0,
  },
  dataColumn: {
    verticalAlign: "top",
  },
  dataLabel: {
    fontSize: "11px",
    color: "#6b7280",
    margin: "0 0 2px 0",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  dataValue: {
    fontSize: "16px",
    color: "#111827",
    fontWeight: "500",
    margin: 0,
  },
  link: {
    color: "#2563eb",
    textDecoration: "none",
  },
  actionCard: {
    backgroundColor: "#ecfdf5",
    padding: "20px 24px",
    textAlign: "center",
    borderTop: "1px solid #e5e7eb",
  },
  actionIcon: {
    fontSize: "32px",
    margin: "0 0 8px 0",
  },
  actionTitle: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#065f46",
    margin: "0 0 8px 0",
  },
  actionText: {
    fontSize: "13px",
    color: "#047857",
    margin: 0,
    lineHeight: "20px",
  },
  footer: {
    padding: "16px 24px",
    textAlign: "center",
    borderTop: "1px solid #e5e7eb",
  },
  footerText: {
    fontSize: "11px",
    color: "#9ca3af",
    margin: 0,
  },
};

export default NewsletterAdminEmailTemplate;
