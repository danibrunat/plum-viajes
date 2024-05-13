"use server";
import { sendEmail } from "./emails";

export async function submitContactForm(formData) {
  try {
    const sendEmailResponse = await sendEmail(formData);
    return sendEmailResponse;
  } catch (error) {
    return error;
  }
}

export async function submitAboutUsContactForm(formData) {
  return {
    statusCode: 200,

    message: `Form submitted`,
  };
}

export async function submitGenericForm(formData) {
  console.log("formData", formData);
}
