import { OLA } from "../../../services/ola.service";
import PackageApiService from "../../../services/packages.service";
import { ProviderService } from "../../../services/providers.service";
import CryptoService from "../../../services/cypto.service";

async function fetchOlaPackages(searchParams) {
  const getPackagesFaresRequest = OLA.avail.getRequest(searchParams);

  try {
    const olaAvailRequest = await fetch(
      OLA.avail.url(),
      OLA.avail.options(getPackagesFaresRequest)
    );
    const olaAvailResponse = await olaAvailRequest.json();

    const pkgWithIdentifiedDepartures = olaAvailResponse.map((pkg) => {
      return {
        ...pkg,
        id: CryptoService.generateDepartureId(
          "ola",
          pkg.Flight.Trips.Trip[0].DepartureDate
        ),
      };
    });

    const departuresGroup = PackageApiService.departures.ola.getDeparturesGroup(
      pkgWithIdentifiedDepartures
    );

    const mapResponse = ProviderService.mapper(
      pkgWithIdentifiedDepartures,
      "ola",
      "avail"
    );

    const groupedResponse = ProviderService.ola.grouper(mapResponse, "id");

    const response = {
      packages: groupedResponse,
      departuresGroup,
    };

    return response;
  } catch (error) {
    console.error("Error fetching OLA packages", error);
  }
}

export async function POST(req) {
  const body = await req.json();
  const olaPackages = await fetchOlaPackages(body);
  return Response.json(olaPackages);
}
