import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import AgentEmailTemplate from "../components/commons/Email/AgentEmailTemplate";
import ContactAdminEmailTemplate from "../components/commons/Email/ContactAdminEmailTemplate";
import ContactEmailTemplate from "../components/commons/Email/ContactEmailTemplate";
import NewsletterAdminEmailTemplate from "../components/commons/Email/NewsletterAdminEmailTemplate";

// ============================================
// SMTP Configuration with caching (singleton pattern)
// ============================================
let cachedTransporter = null;
let transporterConfigSignature = null;

const getSmtpConfig = () => {
  const host = process.env.SMTP_HOST?.trim();
  const port = process.env.SMTP_PORT?.trim();
  const username = process.env.SMTP_USERNAME?.trim();
  const password = process.env.SMTP_PASSWORD?.trim();

  if (!host || !port || !username || !password) {
    return null;
  }

  const portNumber = Number(port);
  if (!Number.isInteger(portNumber) || portNumber <= 0) {
    console.warn(`[contact-service] SMTP_PORT inválido: ${port}`);
    return null;
  }

  const secureEnv = process.env.SMTP_SECURE?.trim().toLowerCase();
  const secure = secureEnv 
    ? ["true", "1"].includes(secureEnv) 
    : portNumber === 465;

  return { host, port: portNumber, secure, username, password };
};

const getTransporter = () => {
  const config = getSmtpConfig();
  
  if (!config) {
    console.warn("[contact-service] Configuración SMTP incompleta. El envío de emails está deshabilitado.");
    return null;
  }

  const signature = `${config.host}:${config.port}:${config.secure}:${config.username}`;

  // Return cached transporter if config hasn't changed
  if (cachedTransporter && transporterConfigSignature === signature) {
    return cachedTransporter;
  }

  try {
    cachedTransporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: {
        user: config.username,
        pass: config.password,
      },
    });
    transporterConfigSignature = signature;
    return cachedTransporter;
  } catch (error) {
    console.error("[contact-service] Error al crear transporter SMTP:", error);
    cachedTransporter = null;
    transporterConfigSignature = null;
    return null;
  }
};

// ============================================
// Email address resolution
// ============================================
const ADMIN_CONTACT_EMAIL =
  process.env.SMTP_ADMIN_EMAIL?.trim() || "ventas@plumviajes.com.ar";

/**
 * Extrae las edades de los menores desde los datos del formulario
 * @param {Object} data - Datos del formulario con childAge_0, childAge_1, etc.
 * @returns {string[]} Array de edades como strings
 */
const extractChildrenAges = (data) => {
  const ages = [];
  let index = 0;
  while (data[`childAge_${index}`] !== undefined) {
    const age = data[`childAge_${index}`];
    if (age) ages.push(age);
    index++;
  }
  return ages;
};

const resolveFromAddress = () => {
  const fromEmail = process.env.SMTP_FROM_EMAIL?.trim() || process.env.SMTP_USERNAME?.trim();

  if (!fromEmail) {
    throw new Error("Falta configurar SMTP_FROM_EMAIL o SMTP_USERNAME");
  }

  const fromName = process.env.SMTP_FROM_NAME?.trim();
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
            childrenAges: extractChildrenAges(data),
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
            childrenAges: extractChildrenAges(data),
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
    const transporter = getTransporter();
    
    if (!transporter) {
      console.error("[contact-service] No hay transporter SMTP disponible. Email no enviado.");
      return { 
        success: false, 
        error: "Configuración SMTP no disponible. Contacte al administrador." 
      };
    }

    const data =
      formData instanceof FormData
        ? Object.fromEntries(formData.entries())
        : formData;

    try {
      const fromAddress = resolveFromAddress();

      // Preparar ambos emails en paralelo para evitar timeout en serverless
      const [emailHtml, adminHtml] = await Promise.all([
        this.buildEmailContent(formType, data),
        ADMIN_CONTACT_EMAIL ? this.buildAdminEmailContent(formType, data) : Promise.resolve(null),
      ]);

      // Email al usuario que hizo la consulta
      const mailOptions = {
        from: fromAddress,
        to: [data.email],
        subject:
          formType === "agent"
            ? `Consulta de agente: ${data.name} ${data.surname}`
            : `✈️ Recibimos tu consulta, ${data.name || "viajero"}!`,
        html: emailHtml,
      };

      // Preparar email al admin si está configurado
      let adminMailOptions = null;
      if (ADMIN_CONTACT_EMAIL && adminHtml) {
        const adminSubject =
          formType === "agent"
            ? `Nueva consulta de agente: ${data.name || "Sin nombre"} ${data.surname || ""}`
            : `Nueva consulta desde la web: ${data.name || "Sin nombre"} ${data.surname || ""}`;

        adminMailOptions = {
          from: fromAddress,
          to: [ADMIN_CONTACT_EMAIL],
          subject: adminSubject.trim(),
          html: adminHtml,
        };
      }

      // Enviar ambos emails en paralelo con timeout de 8s (Vercel tiene límite de 10s)
      const sendPromises = [transporter.sendMail(mailOptions)];
      if (adminMailOptions) {
        sendPromises.push(transporter.sendMail(adminMailOptions));
      }

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("SMTP timeout: el servidor tardó más de 8 segundos")), 8000)
      );

      const results = await Promise.race([
        Promise.all(sendPromises),
        timeoutPromise,
      ]);

      const normalizedResponse = {
        messageId: results[0].messageId,
        response: results[0].response,
        accepted: results[0].accepted,
        rejected: results[0].rejected,
        envelope: results[0].envelope,
      };

      const adminResponse = results[1]
        ? {
            messageId: results[1].messageId,
            response: results[1].response,
            accepted: results[1].accepted,
            rejected: results[1].rejected,
            envelope: results[1].envelope,
          }
        : null;

      return { success: true, response: normalizedResponse, adminResponse };
    } catch (error) {
      console.error("[contact-service] Error al enviar email:", error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Envía un email al administrador notificando una nueva suscripción al newsletter
   * @param {Object} data - Datos del suscriptor
   * @param {string} data.name - Nombre del suscriptor
   * @param {string} data.email - Email del suscriptor
   * @returns {Promise<{success: boolean, response?: Object, error?: string}>}
   */
  async sendNewsletterSubscription(data) {
    const transporter = getTransporter();

    if (!transporter) {
      console.error("[contact-service] No hay transporter SMTP disponible. Email de newsletter no enviado.");
      return {
        success: false,
        error: "Configuración SMTP no disponible. Contacte al administrador.",
      };
    }

    if (!ADMIN_CONTACT_EMAIL) {
      console.error("[contact-service] No hay SMTP_ADMIN_EMAIL configurado.");
      return {
        success: false,
        error: "Email de administrador no configurado.",
      };
    }

    try {
      const emailHtml = await render(
        NewsletterAdminEmailTemplate({
          name: data.name,
          email: data.email,
        })
      );

      const fromAddress = resolveFromAddress();
      const subscriberName = data.name?.trim() || "Sin nombre";

      const mailOptions = {
        from: fromAddress,
        to: [ADMIN_CONTACT_EMAIL],
        subject: `📬 Nuevo suscriptor al newsletter: ${subscriberName}`,
        html: emailHtml,
      };

      // Timeout de 8s para evitar que Vercel corte la función
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("SMTP timeout: el servidor tardó más de 8 segundos")), 8000)
      );

      const sendResult = await Promise.race([
        transporter.sendMail(mailOptions),
        timeoutPromise,
      ]);

      const normalizedResponse = {
        messageId: sendResult.messageId,
        response: sendResult.response,
        accepted: sendResult.accepted,
        rejected: sendResult.rejected,
        envelope: sendResult.envelope,
      };

      return { success: true, response: normalizedResponse };
    } catch (error) {
      console.error("[contact-service] Error al enviar email de newsletter:", error);
      return { success: false, error: error.message };
    }
  },
};

export default ContactService;
