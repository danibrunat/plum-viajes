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
  const pieces = [
    formatValue(type, ""),
    formatValue(areaCode, ""),
    formatValue(number, ""),
  ]
    .map((piece) => piece.trim())
    .filter(Boolean);

  return pieces.length ? pieces.join(" ") : "No detalla";
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

  return (
    <Html lang="es">
      <Head />
      <Preview>
        Nueva consulta web - {fullName || "Pasajero sin nombre"}
      </Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Heading as="h1" style={styles.heading}>
            Nueva consulta recibida desde la web
          </Heading>
          <Text style={styles.text}>
            Llegó una nueva solicitud mediante el formulario de contacto. Estos
            son los datos proporcionados por la persona interesada:
          </Text>

          <Section style={styles.section}>
            <Text style={styles.item}>
              <strong>Nombre completo:</strong> {fullName || "No detalla"}
            </Text>
            <Text style={styles.item}>
              <strong>Email:</strong> {formatValue(email, "No detalla")}
            </Text>
            <Text style={styles.item}>
              <strong>Teléfono:</strong>{" "}
              {formatPhone(phoneType, phoneAreaCode, phoneNumber)}
            </Text>
            <Text style={styles.item}>
              <strong>Horario preferido:</strong>{" "}
              {formatValue(contactTime, "Sin preferencia")}
            </Text>
          </Section>

          <Section style={styles.section}>
            <Text style={styles.item}>
              <strong>Destino deseado:</strong>{" "}
              {formatValue(destination, "A definir")}
            </Text>
            <Text style={styles.item}>
              <strong>Fecha de salida estimada:</strong>{" "}
              {formatValue(departureDate, "Sin fecha")}
            </Text>
            <Text style={styles.item}>
              <strong>Noches:</strong> {formatValue(nightsQty, "No detalla")}
            </Text>
            <Text style={styles.item}>
              <strong>Adultos:</strong> {formatValue(adultsQty, "No detalla")}
            </Text>
            <Text style={styles.item}>
              <strong>Niños:</strong> {formatValue(childQty, "Sin niños")}
            </Text>
            <Text style={styles.item}>
              <strong>Régimen de comidas:</strong>{" "}
              {formatValue(mealPlan, "A definir")}
            </Text>
          </Section>

          <Section style={styles.section}>
            <Text style={styles.item}>
              <strong>Consulta / comentarios:</strong>{" "}
              {formatValue(inquiry, "Sin comentarios adicionales")}
            </Text>
            <Text style={styles.item}>
              <strong>Solicita llamado:</strong> {formatYesNo(ringMe)}
            </Text>
            <Text style={styles.item}>
              <strong>Acepta promociones:</strong>{" "}
              {formatYesNo(notifyPromotions)}
            </Text>
          </Section>

          <Hr style={styles.hr} />
          <Text style={styles.text}>
            Recordá responderle a la brevedad para mantener una buena
            experiencia de cliente. Podés responder directamente a este correo
            para iniciar la conversación.
          </Text>

          <Text style={styles.footer}>
            Sistema de notificaciones de Plum Viajes
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

const styles = {
  body: {
    backgroundColor: "#f4f4f4",
    margin: 0,
    padding: "24px",
    fontFamily: "Helvetica, Arial, sans-serif",
    color: "#1f2933",
  },
  container: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    padding: "24px",
    border: "1px solid #e5e7eb",
    maxWidth: "640px",
  },
  heading: {
    fontSize: "22px",
    marginBottom: "16px",
    color: "#0f172a",
  },
  text: {
    fontSize: "15px",
    lineHeight: "24px",
    margin: "0 0 16px",
  },
  section: {
    backgroundColor: "#f9fafb",
    borderRadius: "10px",
    padding: "16px",
    marginBottom: "16px",
  },
  item: {
    fontSize: "14px",
    margin: "0 0 10px",
    color: "#111827",
  },
  hr: {
    border: "none",
    borderTop: "1px solid #e5e7eb",
    margin: "24px 0",
  },
  footer: {
    fontSize: "12px",
    color: "#6b7280",
    margin: 0,
  },
};

export default ContactAdminEmailTemplate;
