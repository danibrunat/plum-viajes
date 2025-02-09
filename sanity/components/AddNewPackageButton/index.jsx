import { IntentLink } from "sanity/router";

const AddNewPackageButton = () => (
  <div className="mb-4">
    <IntentLink
      intent="create"
      params={{ type: "packages" }}
      className="inline-block"
      layout="fullscreen"
    >
      <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition">
        Añadir Nuevo Paquete
      </button>
    </IntentLink>
  </div>
);

export default AddNewPackageButton;
