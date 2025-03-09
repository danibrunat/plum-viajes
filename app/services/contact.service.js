// services/contact.service.js
"use server";
import { Resend } from "resend";
import { render } from "@react-email/render";
import AgentEmailTemplate from "../components/commons/Email/AgentEmailTemplate";
import ContactEmailTemplate from "../components/commons/Email/ContactEmailTemplate";

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

function buildEmailContent(formType, data) {
  switch (formType) {
    case "contact":
      return render(
        ContactEmailTemplate({
          name: data.name,
          surname: data.surname,
          phoneType: data.phoneType,
          phoneAreaCode: data.phoneAreaCode,
          phoneNumber: data.phoneNumber,
          contactTime: data.contactTime,
          email: data.email,
          destination: data.destination,
          departureDate: data.departureDate,
          nightsQty: data.nightsQty,
          adultsQty: data.adultsQty,
          childQty: data.childQty,
          mealPlan: data.mealPlan,
          inquiry: data.inquiry,
          ringMe: data.ringMe,
          notifyPromotions: data.notifyPromotions,
        })
      );
    case "agent":
      return render(
        AgentEmailTemplate({
          name: data.name,
          surname: data.surname,
          phoneType: data.phoneType,
          phoneNumber: data.phoneNumber,
          email: data.email,
          inquiry: data.inquiry,
          ringMe: data.ringMe,
        })
      );
    default:
      throw new Error("Tipo de formulario no soportado");
  }
}

export async function sendMail(formData, formType = "contact") {
  // Convertir FormData a objeto si es necesario
  const data =
    formData instanceof FormData
      ? Object.fromEntries(formData.entries())
      : formData;

  try {
    const emailHtml = buildEmailContent(formType, data);

    const mailOptions = {
      from: "Confirmación de Contacto <posventaplumviajes@resend.dev>",
      to: [data.email],
      subject:
        formType === "agent"
          ? `Consulta de agente: ${data.name} ${data.surname}`
          : `Contacto a través de la web: ${data.name} ${data.surname}`,
      html: emailHtml,
    };

    const resendResponse = await resend.emails.send(mailOptions);

    // Convierte la respuesta en un objeto plano
    const plainResponse = JSON.parse(JSON.stringify(resendResponse));

    console.log("resendResponse", plainResponse);
    return { success: true, response: plainResponse };
  } catch (error) {
    console.log("Error al enviar mail:", error);
    return { success: false, error: error.message };
  }
}
