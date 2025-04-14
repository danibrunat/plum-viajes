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

export async function submitGenericForm(formData) {}
