import { Html, Heading, Text } from "@react-email/components";
const ContactEmailTemplate = ({
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
  return (
    <Html lang="en">
      <Heading as="h1">Nueva consulta enviada</Heading>
      <Text>Entró una nueva consulta a través del formulario de contacto</Text>
      <Text>Nombre: {name}</Text>
      <Text>Apellido: {surname}</Text>
      <Text>Email: {email}</Text>
      <Text>
        Teléfono: {phoneType} {phoneAreaCode} {phoneNumber}{" "}
      </Text>
      <Text>Destino: {destination}</Text>
      <Text>Fecha de salida: {departureDate}</Text>
      <Text>Noches: {nightsQty}</Text>
      <Text>Adultos: {adultsQty}</Text>
      <Text>Niños: {childQty}</Text>
      <Text>Meal Plan: {mealPlan}</Text>
      <Text>Su consulta fue: {inquiry}</Text>
      <Text>Quiere que lo llamen?: {ringMe}</Text>
      <Text>Quiere recibir promociones?: {notifyPromotions}</Text>
    </Html>
  );
};
export default ContactEmailTemplate;
