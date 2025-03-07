export const ApiUtils = {
  requestHandler: async (handler, caller = "default") => {
    try {
      const apiRequest = async () => await handler;
      // Call the handler passed to this function
      return await apiRequest();
    } catch (error) {
      console.error("Error in caller -> :", caller);
      console.log(`and the error was -> `, error);

      // Return a standardized error response
      return new Response(
        {
          success: false,
          message: "Internal server error",
        },
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  },
  getAuthorizationToken: () =>
    `Bearer ${process.env.NEXT_PUBLIC_API_KEY || process.env.SANITY_STUDIO_NEXT_API_KEY}`,
  // `Bearer pLuMViaj35`,
  getCommonHeaders: () => ({
    Authorization: ApiUtils.getAuthorizationToken(),
  }),
};
