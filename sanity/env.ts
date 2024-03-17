export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-02";

export const dataset = "production";

export const projectId = "q5tnasgw";

const token = `${process.env.NEXT_PUBLIC_SANITY_AUTH_TOKEN}`;
export const previewToken = token;

export const useCdn = false;

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage);
  }

  return v;
}
