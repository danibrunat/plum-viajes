export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION;

export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;

const token = `${process.env.SANITY_STUDIO_AUTH_TOKEN}`;
export const previewToken = token;

export const useCdn = false;
