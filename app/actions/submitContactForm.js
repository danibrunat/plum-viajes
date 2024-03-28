"use server";

export async function submitContactForm(formData) {
  // we're gonna put a delay in here to simulate some kind of data processing like persisting data
  // await new Promise((resolve) => setTimeout(resolve, 1000));

  console.log("server action", formData);

  return {
    statusCode: 200,

    message: `Form submitted`,
  };
}
