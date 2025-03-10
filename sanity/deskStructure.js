import { CogIcon, DocumentTextIcon, EarthGlobeIcon } from "@sanity/icons";
import ProviderPackages from "./components/ProviderPackages";
import PlumPackages from "./components/PlumPackages";
import { FaBoxOpen, FaBoxes, FaPager, FaRoad } from "react-icons/fa";

const hiddenDocTypes = (listItem) =>
  ![
    "page",
    "route",
    "siteConfig",
    "providerPackages",
    "packages",
    "landing",
  ].includes(listItem.getId());

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
        .icon(FaRoad)
        .child(S.documentTypeList("route").title("Rutas")),

      S.divider(),

      S.listItem()
        .title("Paquetes Propios")
        .icon(FaBoxOpen)
        .child(S.component(PlumPackages).title("Lista de Paquetes")),

      S.listItem()
        .title("Paquetes de Proveedores")
        .icon(FaBoxes)
        .child(
          S.component().id("providerPackages").component(ProviderPackages)
        ),

      S.listItem()
        .title("Landings por Destino")
        .icon(FaPager)
        .child(S.documentTypeList("landing").title("Landings por destino")),

      S.listItem()
        .title("Paquetes de proveedores Taggeados")
        .icon(FaPager)
        .child(
          S.documentTypeList("taggedPackages").title(
            "Paquetes que han sido taggeados de proveedores. Utilizá esta pantalla para modificar datos relacionados a ellos."
          )
        ),
      S.divider(),

      S.listItem()
        .title("Otros Documentos")
        .icon(EarthGlobeIcon)
        .child(
          S.list()
            .title("Datos comunes al resto de schemas")
            .items(S.documentTypeListItems().filter(hiddenDocTypes))
        ),
    ]);
};
