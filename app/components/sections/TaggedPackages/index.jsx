import { groq } from "next-sanity";
import { sanityFetch } from "../../../../sanity/lib/sanityFetch";
import TaggedCarousel from "./TaggedCarousel";

export default async function TaggedPackages(props) {
  const { tag } = props;

  if (!tag || !tag._ref) return null; // Aseguramos que tag tenga un _ref

  // Query a Sanity para obtener los taggedPackages que contienen el tag en su campo 'tags' (referencia)
  const taggedPackagesQuery = groq`
  {
    "packages": *[(_type == "taggedPackages" || _type == "packages") && references($tagRef)]{
      ...,
      tags[]->{
        name
      }
    },
    "tagInfo": *[_type == "tag" && _id == $tagRef][0]{
      name
    }
  }
`;

  // Parametrizamos la consulta para pasar el _ref del tag
  const params = { tagRef: tag._ref };

  // Mostramos el placeholder mientras los datos se están obteniendo
  let taggedPackagesResponse = [];
  try {
    const sanityQuery = await sanityFetch({
      query: taggedPackagesQuery,
      params,
    });
    taggedPackagesResponse = await sanityQuery;
  } catch (error) {
    console.error("Error fetching tagged packages:", error);
    return <div>Error loading packages</div>;
  }

  if (taggedPackagesResponse.packages.length === 0) return null; // Si no hay taggedPackages, no renderizamos nada
  // Renderizamos el carousel con los datos obtenidos o el placeholder si están vacíos
  return (
    <section className="mx-20">
      <h1 className="text-2xl">{taggedPackagesResponse.tagInfo.name}</h1>
      <TaggedCarousel
        taggedPackagesResponse={taggedPackagesResponse.packages}
      />
    </section>
  );
}
