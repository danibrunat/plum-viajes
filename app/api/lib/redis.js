import { Redis } from "@upstash/redis";

const redis = new Redis({
  url:
    process.env.UPSTASH_REDIS_REST_URL ||
    process.env.SANITY_STUDIO_UPSTASH_REDIS_REST_URL,
  token:
    process.env.UPSTASH_REDIS_REST_TOKEN ||
    process.env.SANITY_STUDIO_UPSTASH_REDIS_REST_TOKEN,
});

export default redis;
