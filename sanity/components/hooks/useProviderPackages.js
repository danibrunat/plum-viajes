import { useEffect, useReducer, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { OLA } from "../../../app/api/services/ola.service";
import { ProviderService } from "../../../app/api/services/providers.service";
import { fetchTags } from "../../services/tagService";
import { getPkgPrice } from "../../../app/packages/avail/_components/PkgGrid/PkgGridItem";
import { client } from "../../lib/client";
import Dates from "../../../app/services/dates.service";

const DEFAULT_FROM_DATE = Dates.get().toFormat("YYYY-MM-DD");
const DEFAULT_TO_DATE = Dates.getWithAddYears(1).toFormat("YYYY-MM-DD");

// Definir el estado inicial
const initialState = {
  packages: [],
  open: false,
  selectedPackage: null,
  availableTags: [],
  selectedTags: [],
  selectedProviders: [],
  isLoading: false, // Añadir estado de carga
};

// Definir el reducer que gestionará las acciones
const reducer = (state, action) => {
  switch (action.type) {
    case "SET_PACKAGES":
      return { ...state, packages: action.payload };
    case "SET_OPEN":
      return { ...state, open: action.payload };
    case "SET_SELECTED_PACKAGE":
      return { ...state, selectedPackage: action.payload };
    case "SET_AVAILABLE_TAGS":
      return { ...state, availableTags: action.payload };
    case "SET_SELECTED_TAGS":
      return { ...state, selectedTags: action.payload };
    case "TOGGLE_TAG":
      return {
        ...state,
        selectedTags: state.selectedTags.includes(action.payload)
          ? state.selectedTags.filter((id) => id !== action.payload)
          : [...state.selectedTags, action.payload],
      };
    case "TOGGLE_PROVIDER":
      return {
        ...state,
        selectedProviders: state.selectedProviders.includes(action.payload)
          ? state.selectedProviders.filter((p) => p !== action.payload)
          : [...state.selectedProviders, action.payload],
      };
    case "RESET_SELECTED_TAGS":
      return { ...state, selectedTags: [] };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
};

export const useProviderPackages = (formWatch) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (state.availableTags.length === 0) {
      loadAvailableTags();
    }
  }, []);

  const loadAvailableTags = async () => {
    try {
      const tags = await fetchTags();
      dispatch({ type: "SET_AVAILABLE_TAGS", payload: tags });
    } catch (error) {
      console.error("Error fetching tags", error);
    }
  };

  const handleSearch = async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    const getPackagesFaresRequest = OLA.avail.getRequest({
      departureCity: formWatch?.departureCity?.value ?? "BUE",
      arrivalCity: formWatch?.arrivalCity?.value,
      startDate: DEFAULT_FROM_DATE,
      endDate: DEFAULT_TO_DATE,
    });

    try {
      const olaAvailRequest = await fetch(
        OLA.avail.url(),
        OLA.avail.options(getPackagesFaresRequest)
      );
      const olaAvailResponse = await olaAvailRequest.json();
      const results = ProviderService.ola.grouper(
        ProviderService.mapper(olaAvailResponse, "ola", "avail"),
        "id"
      );

      // Obtener los IDs de los paquetes
      const packageIds = results.map((pkg) => pkg.id);

      // Hacer una consulta a Sanity para obtener los tags de los paquetes
      const sanityPackagesQuery = `*[_type == "taggedPackages" && packageId in [${packageIds
        .map((id) => `"${id}"`)
        .join(", ")}]]{packageId, tags[]->{_id, name}}`;

      const sanityPackages = await client.fetch(sanityPackagesQuery);

      // Asignar los tags a los paquetes
      const updatedPackages = results.map((pkg) => {
        const matchingPackage = sanityPackages.find(
          (sanityPkg) => sanityPkg.packageId === pkg.id
        );
        if (matchingPackage && matchingPackage.tags) {
          return {
            ...pkg,
            tags: matchingPackage.tags.map((tag) => tag.name), // Asignar solo los IDs de los tags
          };
        }
        return pkg;
      });
      dispatch({ type: "SET_PACKAGES", payload: updatedPackages });
    } catch (error) {
      console.error("Error fetching OLA packages", error);
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const handleTagAssign = (tagId) => {
    dispatch({ type: "TOGGLE_TAG", payload: tagId });
  };

  const handleTagSave = async (packageId) => {
    const selectedPkg = state.packages.find((pkg) => pkg.id === packageId);
    const { finalPrice, currency } = getPkgPrice(selectedPkg.prices);
    if (selectedPkg) {
      try {
        await client.createOrReplace({
          _id: `tagged-package-${packageId}`,
          _type: "taggedPackages",
          packageId: selectedPkg.id,
          productType: "package",
          price: finalPrice,
          currency,
          nights: Number(selectedPkg.nights),
          title: selectedPkg.title,
          provider: selectedPkg.provider,
          thumbnail: selectedPkg.thumbnails[0].sourceUrl,
          tags: state.selectedTags.map((tagId) => ({
            _type: "reference",
            _ref: tagId,
            _key: uuidv4(),
          })),
        });
        console.log("Tags saved successfully");
        dispatch({ type: "RESET_SELECTED_TAGS" }); // Limpiar tags seleccionados después de guardar
      } catch (error) {
        console.error("Error saving tags", error);
      }
    }
  };

  const handleProviderChange = (providerValue) => {
    dispatch({ type: "TOGGLE_PROVIDER", payload: providerValue });
  };

  return {
    ...state,
    setOpen: (value) => dispatch({ type: "SET_OPEN", payload: value }),
    setSelectedPackage: (pkg) =>
      dispatch({ type: "SET_SELECTED_PACKAGE", payload: pkg }),
    handleSearch,
    handleTagAssign,
    handleTagSave,
    handleProviderChange,
  };
};
