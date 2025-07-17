import redis from "../lib/redis";

const RedisService = {
  /**
   * Guarda un valor en Redis (convertido a JSON) con un TTL opcional.
   * @param {string} key - La clave para el dato.
   * @param {any} value - El valor a almacenar.
   * @param {number} expireInSeconds - Tiempo de expiración en segundos (default: 3600).
   */
  set: async (key, value, expireInSeconds = 3600) => {
    try {
      const jsonValue = JSON.stringify(value);
      console.log("Setting key:", key, "with TTL:", expireInSeconds, "seconds");

      // Opción 1: Usando setex (recomendado para Upstash)
      await redis.setex(key, expireInSeconds, jsonValue);

      // Opción 2: Si setex no funciona, usar expire después de set
      // await redis.set(key, jsonValue);
      // await redis.expire(key, expireInSeconds);

      console.log("Successfully set key:", key);
    } catch (error) {
      console.error(`Error setting key "${key}":`, error);

      // Fallback: intentar con set + expire
      try {
        console.log("Trying fallback method: set + expire");
        await redis.set(key, JSON.stringify(value));
        await redis.expire(key, expireInSeconds);
        console.log("Fallback successful for key:", key);
      } catch (fallbackError) {
        console.error(`Fallback also failed for key "${key}":`, fallbackError);
      }
    }
  },

  /**
   * Obtiene un valor de Redis y lo convierte desde JSON.
   * @param {string} key - La clave a consultar.
   * @returns {Promise<any|null>} - El valor almacenado o null si no existe.
   */
  get: async (key) => {
    try {
      return await redis.get(key);
    } catch (error) {
      console.error(`Error getting key "${key}":`, error);
      return null;
    }
  },

  /**
   * Elimina un valor de Redis.
   * @param {string} key - La clave a eliminar.
   */
  delete: async (key) => {
    try {
      await redis.del(key);
    } catch (error) {
      console.error(`Error deleting key "${key}":`, error);
    }
  },

  /**
   * Obtiene el TTL (tiempo de vida) de una clave en Redis.
   * @param {string} key - La clave a consultar.
   * @returns {Promise<number>} - TTL en segundos, -1 si no tiene TTL, -2 si no existe.
   */
  getTTL: async (key) => {
    try {
      return await redis.ttl(key);
    } catch (error) {
      console.error(`Error getting TTL for key "${key}":`, error);
      return -2;
    }
  },

  /**
   * Verifica si una clave existe en Redis.
   * @param {string} key - La clave a verificar.
   * @returns {Promise<boolean>} - true si existe, false si no existe.
   */
  exists: async (key) => {
    try {
      const result = await redis.exists(key);
      return result === 1;
    } catch (error) {
      console.error(`Error checking existence of key "${key}":`, error);
      return false;
    }
  },

  /**
   * Crea y retorna un pipeline para agrupar comandos.
   * @returns {Pipeline} Instancia del pipeline.
   */
  pipeline: () => redis.pipeline(),

  /**
   * Ejecuta múltiples comandos SET en un pipeline.
   * @param {Array<{ key: string, value: any, expireInSeconds?: number }>} items - Arreglo de operaciones.
   */
  pipelineSet: async (items) => {
    try {
      const pipeline = redis.pipeline();
      items.forEach((item) => {
        const jsonValue = JSON.stringify(item.value);
        const ttl = item.expireInSeconds || 3600;
        console.log("Pipeline setting key:", item.key, "with TTL:", ttl);

        // Para Upstash Redis en pipeline, usar setex
        pipeline.setex(item.key, ttl, jsonValue);
      });
      const results = await pipeline.exec();
      console.log("Pipeline execution results:", results);
    } catch (error) {
      console.error("Error in pipelineSet:", error);
    }
  },

  /**
   * Realiza múltiples GET en un pipeline para consultar la existencia de varias keys.
   * @param {Array<string>} keys - Array de claves a consultar.
   * @returns {Promise<Array<any|null>>} - Array con los valores (o null para las keys no existentes).
   */
  pipelineGet: async (keys) => {
    try {
      // Verificar si el array de keys está vacío
      if (!keys || !Array.isArray(keys) || keys.length === 0) {
        return [];
      }

      const pipeline = redis.pipeline();
      keys.forEach((key) => pipeline.get(key));

      const results = await pipeline.exec();

      if (!Array.isArray(results)) {
        console.error(
          "pipelineGet failed: Unexpected response from Redis",
          results
        );
        return keys.map(() => null); // Retornar un array de nulls del mismo tamaño que keys
      }

      return results.map(([error, data]) => {
        if (error) {
          console.error("Redis pipelineGet error:", error);
          return null;
        }
        return data ? JSON.parse(data) : null;
      });
    } catch (error) {
      console.error("Error in pipelineGet:", error);
      return keys.map(() => null); // En caso de error, devolver un array de nulls
    }
  },

  /**
   * Obtiene claves que coincidan con un patrón.
   * @param {string} pattern - Patrón de búsqueda (ej: "pkg:avail:*")
   * @returns {Promise<Array<string>>} - Array de claves que coinciden
   */
  getKeysByPattern: async (pattern) => {
    try {
      console.log(`🔍 Buscando claves con patrón: ${pattern}`);
      const keys = await redis.keys(pattern);
      console.log(`📊 Encontradas ${keys.length} claves`);
      return keys || [];
    } catch (error) {
      console.error(`Error buscando claves con patrón "${pattern}":`, error);
      return [];
    }
  },

  /**
   * Elimina múltiples claves de Redis.
   * @param {Array<string>} keys - Array de claves a eliminar
   * @returns {Promise<number>} - Número de claves eliminadas
   */
  deleteMultiple: async (keys) => {
    try {
      if (!keys || !Array.isArray(keys) || keys.length === 0) {
        return 0;
      }

      console.log(`🗑️ Eliminando ${keys.length} claves de Redis`);
      const result = await redis.del(...keys);
      console.log(`✅ Eliminadas ${result} claves`);
      return result;
    } catch (error) {
      console.error("Error eliminando múltiples claves:", error);
      return 0;
    }
  },
};

export default RedisService;
