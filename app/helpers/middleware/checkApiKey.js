export function checkApiKey(req) {
  const authorization = req.headers.get("authorization");
  const apiKey = process.env.NEXT_PUBLIC_API_KEY;
  const authorizationKey = `Bearer ${apiKey}`;

  /* if (!authorization || authorization !== authorizationKey) {
    return Response.json(
      { error: true, reason: "Unauthorized" },
      { status: 401 }
    );
  } */
}
