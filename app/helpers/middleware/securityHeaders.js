export function setSecurityHeaders(req, res) {
  res.headers.set("X-DNS-Prefetch-Control", "off");
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("X-XSS-Protection", "1; mode=block");
  res.headers.set("Referrer-Policy", "no-referrer");
}
