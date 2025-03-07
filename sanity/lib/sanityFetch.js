"only server";

import { client } from "./client";
import { previewToken } from "../env";

const DEFAULT_PARAMS = {};
const DEFAULT_TAGS = [];

export const token = previewToken;

export async function sanityFetch({
  query,
  params = DEFAULT_PARAMS,
  tags = DEFAULT_TAGS,
}) {
  // Usar CDN solo en producción
  const useCdn = process.env.NODE_ENV === "production";
  return client.withConfig({ useCdn }).fetch(query, params, {
    next: { revalidate: 0 },
  });
}

// Función para insertar un hotel en Sanity
export async function sanityCreate(object) {
  return client.create(object);
}
