"use server";

import ContactService from "../services/contact.service";
import { verifyRecaptcha } from "../services/recaptcha.service";

export async function submitContactForm(formData, consumer = "contact") {
  try {
    const data =
      formData instanceof FormData
        ? Object.fromEntries(formData.entries())
        : formData;

    // Verificar reCAPTCHA
    const recaptchaToken = data.recaptchaToken;
    const recaptchaResult = await verifyRecaptcha(recaptchaToken);
    
    if (!recaptchaResult.success) {
      return { 
        success: false, 
        error: recaptchaResult.error || "Verificación de captcha fallida" 
      };
    }

    // Eliminar el token del formData antes de enviarlo al servicio de email
    if (formData instanceof FormData) {
      formData.delete("recaptchaToken");
    } else {
      delete data.recaptchaToken;
    }

    const sendEmailResponse = await ContactService.sendMail(
      formData instanceof FormData ? formData : data, 
      consumer
    );
    return sendEmailResponse;
  } catch (error) {
    console.error("[forms] Error en submitContactForm:", error);
    return { success: false, error: error.message || "Error al enviar el formulario" };
  }
}

export async function submitAgentContactForm(formData) {
  try {
    const sendEmailResponse = await ContactService.sendMail(formData, "agent");
    return sendEmailResponse;
  } catch (error) {
    return { success: false, error };
  }
}

/**
 * Server action para suscripción al newsletter
 * @param {FormData|Object} formData - Datos del formulario con name y email
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function submitNewsletterSubscription(formData) {
  try {
    const data =
      formData instanceof FormData
        ? Object.fromEntries(formData.entries())
        : formData;

    // Validación básica
    if (!data.email?.trim()) {
      return { success: false, error: "El email es requerido" };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email.trim())) {
      return { success: false, error: "El email no es válido" };
    }

    const sendEmailResponse = await ContactService.sendNewsletterSubscription({
      name: data.name?.trim() || "",
      email: data.email.trim(),
    });

    return sendEmailResponse;
  } catch (error) {
    console.error("[forms] Error en submitNewsletterSubscription:", error);
    return { success: false, error: error.message || "Error al procesar la suscripción" };
  }
}

export async function submitGenericForm(formData) {}
