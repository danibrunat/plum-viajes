/**
 * Servicio de verificación de reCAPTCHA
 * Verifica tokens de reCAPTCHA v2 con la API de Google
 */

const RECAPTCHA_VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";

/**
 * Verifica un token de reCAPTCHA con la API de Google
 * @param {string} token - El token generado por el widget de reCAPTCHA
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function verifyRecaptcha(token) {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  if (!secretKey) {
    console.error("[recaptcha-service] RECAPTCHA_SECRET_KEY no está configurada");
    // En desarrollo, si no hay secret key, permitir pasar (con warning)
    if (process.env.NODE_ENV === "development") {
      console.warn("[recaptcha-service] Modo desarrollo: saltando verificación de reCAPTCHA");
      return { success: true };
    }
    return { success: false, error: "Configuración de reCAPTCHA incompleta" };
  }

  if (!token) {
    return { success: false, error: "Token de reCAPTCHA no proporcionado" };
  }

  try {
    const response = await fetch(RECAPTCHA_VERIFY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        secret: secretKey,
        response: token,
      }),
    });

    const data = await response.json();

    if (data.success) {
      return { success: true };
    }

    // Google devuelve error-codes cuando falla
    const errorCodes = data["error-codes"] || [];
    console.warn("[recaptcha-service] Verificación fallida:", errorCodes);

    // Mapear códigos de error a mensajes amigables
    const errorMessages = {
      "missing-input-secret": "Error de configuración del servidor",
      "invalid-input-secret": "Error de configuración del servidor",
      "missing-input-response": "Token de verificación no proporcionado",
      "invalid-input-response": "Token de verificación inválido o expirado",
      "bad-request": "Solicitud inválida",
      "timeout-or-duplicate": "El token expiró o ya fue usado. Por favor, intentá de nuevo.",
    };

    const errorMessage = errorCodes
      .map((code) => errorMessages[code] || code)
      .join(", ");

    return { success: false, error: errorMessage || "Verificación de reCAPTCHA fallida" };
  } catch (error) {
    console.error("[recaptcha-service] Error al verificar reCAPTCHA:", error);
    return { success: false, error: "Error al verificar el captcha" };
  }
}
