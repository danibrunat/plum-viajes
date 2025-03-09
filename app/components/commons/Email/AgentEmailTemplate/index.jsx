import { Html, Heading, Text } from "@react-email/components";

const AgentEmailTemplate = ({
  name,
  surname,
  phoneType,
  phoneNumber,
  email,
  inquiry,
  ringMe,
}) => {
  return (
    <Html lang="en">
      <Heading as="h1">Nueva consulta de agente</Heading>
      <Text>
        Se ha recibido una nueva consulta a través del formulario de agentes de
        viajes.
      </Text>
      <Text>Nombre: {name}</Text>
      <Text>Apellido: {surname}</Text>
      <Text>Email: {email}</Text>
      <Text>
        Teléfono: {phoneType} {phoneNumber}
      </Text>
      <Text>Consulta: {inquiry}</Text>
      <Text>
        ¿Desea ser contactado telefónicamente?: {ringMe ? "Sí" : "No"}
      </Text>
    </Html>
  );
};

export default AgentEmailTemplate;
