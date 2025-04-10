import { Redis } from "@upstash/redis";
const isFrontEndCall = typeof process.env.SANITY_STUDIO_URL === "undefined";

const redis = new Redis({
  url: isFrontEndCall
    ? process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_URL
    : process.env.SANITY_STUDIO_UPSTASH_REDIS_REST_URL,
  token: isFrontEndCall
    ? process.env.UPSTASH_REDIS_REST_TOKEN
    : process.env.SANITY_STUDIO_UPSTASH_REDIS_REST_TOKEN,
});

export default redis;
