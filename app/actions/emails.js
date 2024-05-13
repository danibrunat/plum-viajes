"use server";
import { Resend } from "resend";
import EmailTemplate from "../components/commons/Email/EmailTemplate";
import { render } from "@react-email/render";

export const sendEmail = async (formData) => {
  const name = formData.get("name");
  const surname = formData.get("surname");
  const phoneType = formData.get("phoneType");
  const phoneAreaCode = formData.get("phoneAreaCode");
  const phoneNumber = formData.get("phoneNumber");
  const contactTime = formData.get("contactTime");
  const email = formData.get("email");
  const destination = formData.get("destination");
  const departureDate = formData.get("departureDate");
  const nightsQty = formData.get("nightsQty");
  const adultsQty = formData.get("adultsQty");
  const childQty = formData.get("childQty");
  const mealPlan = formData.get("mealPlan");
  const inquiry = formData.get("inquiry");
  const ringMe = formData.get("ringMe");
  const notifyPromotions = formData.get("notifyPromotions");
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);

    const resendResponse = await resend.emails.send({
      from: "Confirmación de Contacto <posventaplumviajes@resend.dev>",
      to: [email],
      subject: "Contacto a través de la web " + name + " " + surname,
      html: render(
        EmailTemplate({
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
        })
      ),
    });
    return {
      error: null,
      success: true,
    };
  } catch (error) {
    console.log(error);
    return {
      error: error.message,
      success: false,
    };
  }
};
