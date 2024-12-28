// We filter document types defined in structure to prevent
import ProviderPackages from "./components/ProviderPackages";

// them from being listed twice
const hiddenDocTypes = (listItem) =>
  !["page", "route", "siteConfig", "providerPackages"].includes(
    listItem.getId()
  );

export const deskStructure = (S) => {
  return S.list()
    .title("Administración")
    .items([
      S.documentListItem().schemaType("siteConfig").title("Site config"),
      //S.documentListItem().schemaType("providerPackages").title("Paquetes de Proveedores"),
      S.divider(), // Optional separator

      S.documentTypeListItem("page").title("Páginas"),
      S.divider(), // Optional separator

      S.documentTypeListItem("route").title("Rutas"),
      S.divider(), // Optional separator
      S.listItem()
        .title("Paquetes de Proveedores")
        .child(
          S.component().id("providerPackages").component(ProviderPackages)
        ),
      S.divider(), // Optional separator

      ...S.documentTypeListItems().filter(hiddenDocTypes),
    ]);
};
