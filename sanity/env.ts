import dayjs from "dayjs";
export const apiVersion = dayjs().format("YYYY-MM-DD");

export const dataset = "production";

export const projectId = "q5tnasgw";

const token = `${process.env.SANITY_STUDIO_AUTH_TOKEN}`;
console.log("token", token);
export const previewToken = token;

export const useCdn = false;
