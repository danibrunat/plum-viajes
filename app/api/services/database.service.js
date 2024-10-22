import { createServerClient } from "@supabase/ssr";
import { createBrowserClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const browserClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

const serverClient = (cookieStore) => {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
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

const DatabaseService = {
  get: async (table) => {
    const cookieStore = cookies();
    const supabase = serverClient(cookieStore);
    // TODO: Handle error with api request handler.
    const { data, error } = await supabase.from("hotels").select();
    return data;
  },
  getByIdEqual: async (table, id) => {
    const cookieStore = cookies();
    const supabase = serverClient(cookieStore);
    const { data, error } = await supabase.from(table).select().eq("id", id);
    return data;
  },
  getByIdEqualAndCustomSelect: async (table, selectQuery, id) => {
    const cookieStore = cookies();
    const supabase = serverClient(cookieStore);
    const { data, error } = await supabase
      .from(table)
      .select(selectQuery)
      .eq("id", id);
    return data;
  },
  getByFieldIlike: async (table, field, ilikeParam) => {
    const cookieStore = cookies();
    const supabase = serverClient(cookieStore);
    const { data, error } = await supabase
      .from(table)
      .select()
      .ilike(field, `%${ilikeParam}%`);
    return data;
  },
};

export default DatabaseService;
