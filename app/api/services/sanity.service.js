import { createServerClient } from "@supabase/ssr";
import { sanityFetch } from "../../../sanity/lib/sanityFetch";
import { groq } from "next-sanity";
import { ApiUtils } from "./apiUtils.service";

// Function to create a Supabase client for server-side operations
const serverClient = (cookieStore) => {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        // Method to get all cookies from the cookie store
        getAll() {
          return cookieStore.getAll();
        },
        // Method to set all cookies in the cookie store
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
};

// Database service object containing various methods for database operations
const DatabaseService = {
  // Method to get all records from a specified table
  getFromSanity: async (query) => {
    const sanityQuery = await ApiUtils.requestHandler(
      sanityFetch({ query }),
      "Sanity fetch"
    );
    const response = await sanityQuery;

    return response;
  },
  get: async (table) => {
    const cookieStore = require("next/headers").cookies();
    const supabase = serverClient(cookieStore);
    // TODO: Handle error with api request handler.
    const { data, error } = await supabase.from(table).select();
    return data;
  },
  // Method to get all records from a table where the id matches a specified value
  getAllByIdEqual: async (table, id) => {
    const cookieStore = require("next/headers").cookies();
    const supabase = serverClient(cookieStore);
    const { data, error } = await supabase.from(table).select().eq("id", id);
    return data[0];
  },
  // Method to get all records from a table where a specified field matches a specified value
  getAllByFieldEqual: async (table, field, equalParam) => {
    const cookieStore = require("next/headers").cookies();
    const supabase = serverClient(cookieStore);
    const { data, error } = await supabase
      .from(table)
      .select()
      .eq(field, equalParam);
    return data;
  },
  getAllByFieldEqualOr: async (table, orParams) => {
    const cookieStore = require("next/headers").cookies();
    const supabase = serverClient(cookieStore);
    const { data, error } = await supabase.from(table).select().or(orParams);
    return data;
  },
  getAllByFieldEqualOrAndCustomSelect: async (table, selectQuery, orParams) => {
    const cookieStore = require("next/headers").cookies();
    const supabase = serverClient(cookieStore);
    const { data, error } = await supabase
      .from(table)
      .select(selectQuery)
      .or(orParams);
    return data;
  },
  // Method to get records with a custom select query where a specified field matches a specified value
  getAllByFieldEqualAndCustomSelect: async (
    table,
    selectQuery,
    field,
    equalParam
  ) => {
    const cookieStore = require("next/headers").cookies();
    const supabase = serverClient(cookieStore);
    const { data, error } = await supabase
      .from(table)
      .select(selectQuery)
      .eq(field, equalParam);
    return data;
  },
  // Method to get a single record by id with a custom select query
  getByIdEqualAndCustomSelect: async (table, selectQuery, id) => {
    const cookieStore = require("next/headers").cookies();
    const supabase = serverClient(cookieStore);
    const { data, error } = await supabase
      .from(table)
      .select(selectQuery)
      .eq("id", id);

    return data[0];
  },
  // Method to get records where a specified field matches a pattern using ILIKE
  getByFieldIlike: async (table, field, ilikeParam) => {
    const cookieStore = require("next/headers").cookies();
    const supabase = serverClient(cookieStore);
    const { data, error } = await supabase
      .from(table)
      .select()
      .ilike(field, `%${ilikeParam}%`);
    return data;
  },
  getByFieldIlikeAndCustomSelect: async (
    table,
    selectQuery,
    field,
    ilikeParam
  ) => {
    const cookieStore = require("next/headers").cookies();
    const supabase = serverClient(cookieStore);
    const { data, error } = await supabase
      .from(table)
      .select(selectQuery)
      .ilike(field, `%${ilikeParam}%`);
    return data;
  },
  // Method to get the public URL of a storage item
  getStorageItemPublicUrl: async (bucketName, filePath) => {
    const cookieStore = require("next/headers").cookies();
    const supabase = serverClient(cookieStore);

    const { data, error } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    if (error) {
      console.error("Error fetching public URL:", error);
      return null;
    }

    return data.publicUrl;
  },
  listImagesFromBucketNestedFolder: async (bucketName, folderId) => {
    const cookieStore = require("next/headers").cookies();
    const supabase = serverClient(cookieStore);

    try {
      // Listar todos los archivos en la carpeta cuyo nombre es igual al hotelId
      const { data: files, error: listError } = await supabase.storage
        .from(bucketName)
        .list(folderId);

      console.log("data", files);

      if (listError) {
        console.error("Error listing images:", listError.message);
        return [];
      }

      // Mapear los archivos para obtener sus URLs públicas
      const imageUrls = files
        .map((file) => {
          const { data: publicUrlData, error: publicUrlError } =
            supabase.storage
              .from(bucketName)
              .getPublicUrl(`${folderId}/${file.name}`);

          if (publicUrlError) {
            console.error(
              "Error generating public URL:",
              publicUrlError.message
            );
            return null;
          }

          return publicUrlData.publicUrl;
        })
        .filter((url) => url !== null); // Filtrar URLs nulas en caso de errores

      return imageUrls;
    } catch (error) {
      console.error("Error fetching images:", error.message);
      return [];
    }
  },
};

export default DatabaseService;
