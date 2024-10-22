const rateLimit = new Map(); // In-memory map for rate limiting

export async function applyRateLimit(req) {
  const ip =
    req.headers["x-forwarded-for"] ||
    req.ip ||
    req.headers["x-real-ip"] ||
    "127.0.0.1";

  const currentTime = Date.now();
  const windowTime = 15 * 60 * 1000; // 15 minutes
  const requestLimit = 100; // Max 100 requests

  const rateInfo = rateLimit.get(ip) || {
    count: 0,
    firstRequestTime: currentTime,
  };

  if (currentTime - rateInfo.firstRequestTime < windowTime) {
    if (rateInfo.count >= requestLimit) {
      return new Response("Too many requests", { status: 429 });
    }
    rateInfo.count += 1;
  } else {
    rateInfo.count = 1;
    rateInfo.firstRequestTime = currentTime;
  }

  rateLimit.set(ip, rateInfo);
}
