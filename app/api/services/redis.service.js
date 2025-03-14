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
      await redis.set(key, jsonValue, { EX: expireInSeconds });
    } catch (error) {
      console.error(`Error setting key "${key}":`, error);
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
        const jsonValue = JSON.stringify(item.value); // Asegurar serialización
        pipeline.set(item.key, jsonValue, { ex: item.expireInSeconds || 3600 });
      });
      await pipeline.exec();
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
};

export default RedisService;
