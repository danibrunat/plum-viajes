// services/tagService.js
import { sanityFetch } from "../lib/sanityFetch";
import { groq } from "next-sanity";

export const fetchTags = async () => {
  const query = groq`*[_type == "tag"]{_id, name}`;
  try {
    return await sanityFetch({ query });
  } catch (error) {
    console.error("Error fetching tags from Sanity", error);
  }
};
