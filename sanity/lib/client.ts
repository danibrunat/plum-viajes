import { createClient } from "next-sanity";

import { apiVersion, dataset, previewToken, projectId, useCdn } from "../env";

export const client = createClient({
  apiVersion,
  dataset,
  projectId,
  useCdn,
  token: previewToken,
});
