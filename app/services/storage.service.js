// lib/services/StorageService.js

const StorageService = {
  session: {
    /**
     * Obtiene un valor del sessionStorage.
     * El valor se decodifica de Base64 y se parsea a JSON.
     * @param {string} key - La clave a obtener.
     * @returns {any|null} - El valor almacenado o null si no existe.
     */
    get(key) {
      if (typeof window === "undefined") {
        console.warn("sessionStorage no está disponible en el servidor.");
        return null;
      }

      const encodedValue = sessionStorage.getItem(key);
      if (!encodedValue) return null;

      try {
        const decodedValue = atob(encodedValue);
        return JSON.parse(decodedValue);
      } catch (error) {
        console.error("Error decoding session data:", error);
        return null;
      }
    },

    /**
     * Almacena un valor en el sessionStorage.
     * El valor se serializa a JSON y se codifica en Base64.
     * @param {string} key - La clave a almacenar.
     * @param {any} value - El valor a guardar.
     */
    set(key, value) {
      if (typeof window === "undefined") {
        console.warn("sessionStorage no está disponible en el servidor.");
        return;
      }

      try {
        const encodedValue = btoa(JSON.stringify(value));
        sessionStorage.setItem(key, encodedValue);
      } catch (error) {
        console.error("Error setting session data:", error);
      }
    },

    /**
     * Elimina un elemento del sessionStorage.
     * @param {string} key - La clave a eliminar.
     */
    delete(key) {
      if (typeof window === "undefined") {
        console.warn("sessionStorage no está disponible en el servidor.");
        return;
      }

      sessionStorage.removeItem(key);
    },

    /**
     * Limpia todos los datos almacenados en sessionStorage.
     */
    clear() {
      if (typeof window === "undefined") {
        console.warn("sessionStorage no está disponible en el servidor.");
        return;
      }

      sessionStorage.clear();
    },

    /**
     * Obtiene un array con todas las claves almacenadas en sessionStorage.
     * @returns {string[]} - Array de claves.
     */
    keys() {
      if (typeof window === "undefined") {
        console.warn("sessionStorage no está disponible en el servidor.");
        return [];
      }

      return Object.keys(sessionStorage);
    },
  },
};

export default StorageService;
