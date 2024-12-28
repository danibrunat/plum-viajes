"only server";

import type { QueryParams } from "@sanity/client";
import { client } from "./client";
import { previewToken } from "../env";

const DEFAULT_PARAMS = {} as QueryParams;
const DEFAULT_TAGS = [] as string[];

export const token = previewToken;

export async function sanityFetch<QueryResponse>({
  query,
  params = DEFAULT_PARAMS,
  tags = DEFAULT_TAGS,
}: {
  query: string;
  params?: QueryParams;
  tags?: string[];
}): Promise<QueryResponse> {
  // Evitamos llamar a draftMode si no está en un contexto de solicitud HTTP
  const useCdn = process.env.NODE_ENV === "production"; // Usar CDN solo en producción

  return client.withConfig({ useCdn }).fetch<QueryResponse>(query, params, {
    // cache: "no-store",
    // ...(isDraftMode && {
    //     token: token,
    //     perspective: "previewDrafts",
    // }),

    next: { revalidate: 0 },
    // next: {
    //     tags,
    // },
  });
}
