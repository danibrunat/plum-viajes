import { groq } from "next-sanity";
import { sanityFetch } from "../lib/sanityFetch";
import { getSlugVariations, slugParamToPath } from "../../utils/urls";

export async function getData(params) {
  let data;
  const pageFragment = groq`
...,
content[] {
  ...,
  cta {
    ...,
    route->
  },
  ctas[] {
    ...,
    route->
  }
}`;

  const slug = slugParamToPath(params?.slug);
  const pageQuery = groq`*[_type == "route" && slug.current in $possibleSlugs]{
          page-> {
            ${pageFragment}
          }
        }`;

  // Frontpage - fetch the linked `frontpage` from the global configuration document.
  if (slug === "/") {
    const frontQuery = groq`
        *[_id == "siteConfig"][0]{
          frontpage -> {
            ${pageFragment}
          }
        }
      `;
    data = await sanityFetch({ query: frontQuery }).then((res) =>
      res?.frontpage ? { ...res.frontpage, slug } : undefined
    );
  } else {
    // Regular route
    data = await sanityFetch({
      query: pageQuery,
      params: { possibleSlugs: getSlugVariations(slug) },
    }).then((res) => {
      return res[0]?.page ? { ...res[0].page, slug } : undefined;
    });
  }

  if (!data?._type === "page") {
    throw new Error("page not found");
  }
  return data;
}
