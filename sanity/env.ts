import dayjs from "dayjs";
export const apiVersion = dayjs().format("YYYY-MM-DD");

export const dataset = "production";

export const projectId = "q5tnasgw";

const token = `${process.env.SANITY_STUDIO_AUTH_TOKEN ?? process.env.NEXT_PUBLIC_SANITY_AUTH_TOKEN}`;
export const previewToken = token;

export const useCdn = false;
