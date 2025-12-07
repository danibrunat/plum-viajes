"use server";

import ContactService from "../services/contact.service";

export async function submitContactForm(formData, consumer = "contact") {
  try {
    const sendEmailResponse = await ContactService.sendMail(formData, consumer);
    return sendEmailResponse;
  } catch (error) {
    return { success: false, error };
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
