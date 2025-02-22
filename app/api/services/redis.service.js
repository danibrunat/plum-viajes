import redis from "../lib/redis";

const RedisService = {
  /**
   * Guarda un valor en Redis (convertido a JSON) con un TTL opcional.
   * @param {string} key - La clave para el dato.
   * @param {any} value - El valor a almacenar.
   * @param {number} expireInSeconds - Tiempo de expiración en segundos (default: 3600).
   */
  async set(key, value, expireInSeconds = 3600) {
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
   * @returns {any|null} - El valor almacenado o null si no existe.
   */
  async get(key) {
    try {
      const data = await redis.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error(`Error getting key "${key}":`, error);
      return null;
    }
  },

  /**
   * Elimina un valor de Redis.
   * @param {string} key - La clave a eliminar.
   */
  async delete(key) {
    try {
      await redis.del(key);
    } catch (error) {
      console.error(`Error deleting key "${key}":`, error);
    }
  },
};

export default RedisService;
