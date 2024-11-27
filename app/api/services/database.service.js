import { createServerClient } from "@supabase/ssr";

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
};

export default DatabaseService;
