import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import AgentEmailTemplate from "../components/commons/Email/AgentEmailTemplate";
import ContactAdminEmailTemplate from "../components/commons/Email/ContactAdminEmailTemplate";
import ContactEmailTemplate from "../components/commons/Email/ContactEmailTemplate";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: `${process.env.SMTP_SECURE}`.toLowerCase() === "true",
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
  },
});

const ADMIN_CONTACT_EMAIL =
  process.env.SMTP_ADMIN_EMAIL || "consultas@plumviajes.com.ar";

const resolveFromAddress = () => {
  const fromEmail = process.env.SMTP_FROM_EMAIL || process.env.SMTP_USERNAME;

  if (!fromEmail) {
    throw new Error("Falta configurar SMTP_FROM_EMAIL o SMTP_USERNAME");
  }

  const fromName = process.env.SMTP_FROM_NAME;
  return fromName ? `${fromName} <${fromEmail}>` : fromEmail;
};

const ContactService = {
  async buildEmailContent(formType, data) {
    switch (formType) {
      case "contact":
        return await render(
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
        return await render(
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
  },

  async buildAdminEmailContent(formType, data) {
    switch (formType) {
      case "contact":
        return await render(
          ContactAdminEmailTemplate({
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
        return await render(
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
        throw new Error("Tipo de formulario no soportado para administrador");
    }
  },

  async sendMail(formData, formType = "contact") {
    const data =
      formData instanceof FormData
        ? Object.fromEntries(formData.entries())
        : formData;

    try {
      const emailHtml = await this.buildEmailContent(formType, data);
      const fromAddress = resolveFromAddress();

      const mailOptions = {
        from: fromAddress,
        to: [data.email],
        subject:
          formType === "agent"
            ? `Consulta de agente: ${data.name} ${data.surname}`
            : `Contacto a través de la web: ${data.name} ${data.surname}`,
        html: emailHtml,
      };

      const sendResult = await transporter.sendMail(mailOptions);
      const normalizedResponse = {
        messageId: sendResult.messageId,
        response: sendResult.response,
        accepted: sendResult.accepted,
        rejected: sendResult.rejected,
        envelope: sendResult.envelope,
      };

      let adminResponse = null;

      if (ADMIN_CONTACT_EMAIL) {
        const adminHtml = await this.buildAdminEmailContent(formType, data);
        const adminSubject =
          formType === "agent"
            ? `Nueva consulta de agente: ${data.name || "Sin nombre"} ${
                data.surname || ""
              }`
            : `Nueva consulta desde la web: ${data.name || "Sin nombre"} ${
                data.surname || ""
              }`;

        const adminMailOptions = {
          from: fromAddress,
          to: [ADMIN_CONTACT_EMAIL],
          subject: adminSubject.trim(),
          html: adminHtml,
        };

        const adminSendResult = await transporter.sendMail(adminMailOptions);
        adminResponse = {
          messageId: adminSendResult.messageId,
          response: adminSendResult.response,
          accepted: adminSendResult.accepted,
          rejected: adminSendResult.rejected,
          envelope: adminSendResult.envelope,
        };
      }

      console.log("emailSendResult", {
        user: normalizedResponse,
        admin: adminResponse,
      });
      return { success: true, response: normalizedResponse, adminResponse };
    } catch (error) {
      console.log("Error al enviar mail:", error);
      return { success: false, error: error.message };
    }
  },
};

export default ContactService;
