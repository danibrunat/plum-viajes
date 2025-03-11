import { useEffect, useReducer, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { OLA } from "../../../app/api/services/ola.service";
import { ProviderService } from "../../../app/api/services/providers.service";
import PackageService from "../../../app/services/package.service";
import { fetchTags } from "../../services/tagService";
import { client } from "../../lib/client";
import Dates from "../../../app/services/dates.service";
import { ApiUtils } from "../../../app/api/services/apiUtils.service";
import { Api } from "../../../app/services/api.service";
import { CONSUMERS } from "../../../app/constants/site";

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
  isLoading: false,
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

  useEffect(() => {
    if (state.selectedPackage) {
      // Al seleccionar un paquete, recupera los tags previamente asignados
      loadPackageTags(state.selectedPackage.id);
    }
  }, [state.selectedPackage]);

  const loadAvailableTags = async () => {
    try {
      const tags = await fetchTags();
      dispatch({ type: "SET_AVAILABLE_TAGS", payload: tags });
    } catch (error) {
      console.error("Error fetching tags", error);
    }
  };

  const loadPackageTags = async (packageId) => {
    try {
      const sanityPackagesQuery = `*[_type == "taggedPackages" && packageId == "${packageId}"]{tags[]->{_id}}`;
      const sanityPackage = await client.fetch(sanityPackagesQuery);

      if (sanityPackage.length > 0 && sanityPackage[0].tags) {
        const assignedTagIds = sanityPackage[0].tags.map((tag) => tag._id);
        dispatch({ type: "SET_SELECTED_TAGS", payload: assignedTagIds });
      }
    } catch (error) {
      console.error("Error loading package tags", error);
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
            tags: matchingPackage.tags.map((tag) => ({
              id: tag._id,
              name: tag.name,
            })),
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
    const { finalPrice, currency } = PackageService.prices.getPkgPrice(
      selectedPkg.departures[0].prices,
      CONSUMERS.TAGGED_PKG
    );

    console.log("selectedPkg", selectedPkg);

    if (selectedPkg) {
      try {
        const cityIdRequest = await ApiUtils.requestHandler(
          fetch(
            Api.cities.getByCode.url(formWatch.arrivalCity.value),
            Api.cities.getByCode.options()
          ),
          "Fetch Cities"
        );
        const cityIdResponse = await cityIdRequest.json();
        const departureIdRequest = await fetch(
          Api.crypto.getDepartureId.url(),
          Api.crypto.getDepartureId.options({
            provider: "ola",
            departureFrom: selectedPkg.departures[0].date,
          })
        );

        const { departureId } = await departureIdRequest.json();
        await client.createOrReplace({
          _id: `tagged-package-${packageId}`,
          _type: "taggedPackages",
          packageId: selectedPkg.id,
          productType: "package",
          price: finalPrice,
          destination: cityIdResponse.map((city) => ({
            _type: "reference",
            _ref: city._id,
            _key: uuidv4(),
          })), // Ahora es un array de referencias
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
          departureId,
          departureFrom: selectedPkg.departures[0].date,
          priceId: selectedPkg.departures[0].prices.id,
        });

        console.log("Tags saved successfully");
        dispatch({ type: "RESET_SELECTED_TAGS" }); // Limpiar tags seleccionados después de guardar

        // Realizar una nueva búsqueda para refrescar la pantalla
        await handleSearch();
      } catch (error) {
        console.error("Error saving tags", error);
      }
    }
  };

  return {
    ...state,
    setOpen: (value) => dispatch({ type: "SET_OPEN", payload: value }),
    setSelectedPackage: (pkg) =>
      dispatch({ type: "SET_SELECTED_PACKAGE", payload: pkg }),
    handleSearch,
    handleTagAssign,
    handleTagSave,
  };
};
