// We filter document types defined in structure to prevent
// them from being listed twice
const hiddenDocTypes = (listItem) =>
  !["page", "route", "siteConfig"].includes(listItem.getId());

export const deskStructure = (S) =>
  S.list()
    .title("Administración")
    .items([
      S.documentListItem().schemaType("siteConfig").title("Site config"),
      S.documentTypeListItem("page").title("Páginas"),
      S.documentTypeListItem("route").title("Rutas"),
      ...S.documentTypeListItems().filter(hiddenDocTypes),
    ]);
