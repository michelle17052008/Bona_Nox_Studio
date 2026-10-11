import { createServerFn } from "@tanstack/react-start";

export const listWorks = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  const { data, error } = await supabaseAdmin
  .from("works")
  .select(`
    id,
    title,
    caption,
    category,
    subcategory,
    image_url,
    position,
    gallery_urls
  `)
  .order("position", { ascending: true });
  if (error) throw new Error(error.message);

  return data ?? [];
});