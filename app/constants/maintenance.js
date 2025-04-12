/**
 * Configuración del modo mantenimiento
 *
 * Para activar el modo mantenimiento, establecer MAINTENANCE_MODE = true
 * Para desactivar el modo mantenimiento, establecer MAINTENANCE_MODE = false
 */
export const MAINTENANCE_MODE = true;

/**
 * Configuración de mensajes para la página de mantenimiento
 */
export const MAINTENANCE_CONFIG = {
  title: "Sitio en Mantenimiento",
  message:
    "Estamos realizando mejoras en nuestro sitio para brindarte una mejor experiencia.",
  submessage: "Estaremos de vuelta muy pronto. ¡Gracias por tu paciencia!",
  contactInfo:
    "Si necesitas asistencia inmediata, contáctanos al +54 11 1234-5678",
  estimatedTime: "Tiempo estimado: 3 horas", // Opcional
};

/**
 * URLs que se excluyen del modo mantenimiento
 * Se pueden seguir accediendo incluso cuando el sitio está en mantenimiento
 */
export const MAINTENANCE_EXCLUDED_PATHS = [
  "/api/", // Las APIs seguirán funcionando
  "/_next/", // Recursos de Next.js
  "/favicon.ico",
  "/robots.txt",
  "/images",
];
