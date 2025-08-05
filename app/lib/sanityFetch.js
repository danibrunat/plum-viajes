"only server";

import { client } from "./client";
import { previewToken } from "./env";

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
  return client.withConfig({ useCdn: false }).fetch(query, params);
}

// Función para insertar un hotel en Sanity
export async function sanityCreate(object) {
  return client.create(object);
}

// Función para eliminar documentos por IDs
export async function sanityDelete(documentIds) {
  if (!Array.isArray(documentIds) || documentIds.length === 0) {
    throw new Error("documentIds must be a non-empty array");
  }

  // Crear transacción para eliminar múltiples documentos
  const transaction = client.transaction();
  documentIds.forEach((id) => {
    transaction.delete(id);
  });

  return transaction.commit();
}

// Función para eliminar documentos por query
export async function sanityDeleteByQuery(query) {
  // Primero obtener los IDs de los documentos que coinciden con el query
  const documents = await sanityFetch({
    query: `${query} {_id}`,
  });

  if (!documents || documents.length === 0) {
    return { deleted: 0, message: "No documents found to delete" };
  }

  const documentIds = documents.map((doc) => doc._id);
  await sanityDelete(documentIds);

  return {
    deleted: documentIds.length,
    message: `Successfully deleted ${documentIds.length} documents`,
    deletedIds: documentIds,
  };
}

// Función para hacer patch de un documento
export async function sanityPatch(documentId, patchOperations) {
  if (!documentId) {
    throw new Error("documentId is required for patch operation");
  }

  let patch = client.patch(documentId);

  // Aplicar las operaciones de patch
  if (patchOperations.set) {
    patch = patch.set(patchOperations.set);
  }

  if (patchOperations.unset) {
    patch = patch.unset(patchOperations.unset);
  }

  if (patchOperations.inc) {
    patch = patch.inc(patchOperations.inc);
  }

  if (patchOperations.dec) {
    patch = patch.dec(patchOperations.dec);
  }

  return patch.commit();
}
