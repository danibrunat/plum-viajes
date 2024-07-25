const baseUrl = process.env.URL;

export const urls = {
  packages: {
    avail: {
      pbase: {
        url: () => `${baseUrl}/api/packages/availability/pbase`,
        options: (body) => ({ body: JSON.stringify(body), method: "POST" }),
      },
    },
  },
};
