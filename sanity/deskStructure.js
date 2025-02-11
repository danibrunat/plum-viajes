import {
  CogIcon,
  DocumentTextIcon,
  EarthGlobeIcon,
  PackageIcon,
  ArrowRightIcon,
} from "@sanity/icons";
import ProviderPackages from "./components/ProviderPackages";
import PlumPackages from "./components/PlumPackages";

const hiddenDocTypes = (listItem) =>
  !["page", "route", "siteConfig", "providerPackages", "packages"].includes(
    listItem.getId()
  );

export const deskStructure = (S) => {
  return S.list()
    .title("Administración")
    .items([
      S.listItem()
        .title("Gestión del Sitio")
        .icon(CogIcon)
        .child(
          S.document()
            .schemaType("siteConfig")
            .documentId("siteConfig")
            .title("Configuración del Sitio")
        ),

      S.divider(),

      S.listItem()
        .title("Páginas")
        .icon(DocumentTextIcon)
        .child(S.documentTypeList("page").title("Páginas")),

      S.listItem()
        .title("Rutas")
        .icon(ArrowRightIcon)
        .child(S.documentTypeList("route").title("Rutas")),

      S.divider(),

      S.listItem()
        .title("Paquetes Propios")
        .icon(PackageIcon)
        .child(S.component(PlumPackages).title("Lista de Paquetes")),

      S.listItem()
        .title("Paquetes de Proveedores")
        .icon(PackageIcon)
        .child(
          S.component().id("providerPackages").component(ProviderPackages)
        ),

      S.divider(),

      S.listItem()
        .title("Otros Documentos")
        .icon(EarthGlobeIcon)
        .child(
          S.list()
            .title("Contenido Variado")
            .items(S.documentTypeListItems().filter(hiddenDocTypes))
        ),
    ]);
};
