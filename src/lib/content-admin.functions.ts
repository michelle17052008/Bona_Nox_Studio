import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

// Definimos la estructura de datos
const workInput = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1).max(200),
  caption: z.string().max(500).default(""),
  category: z.string().min(1).max(50),
  subcategory: z.string().max(50).nullable().optional(),
  image_url: z.string().min(1).max(1000),
  gallery_urls: z.array(z.string()).default([]),
  position: z.number().int().min(0).max(9999).default(0),
});

const idInput = z.object({ id: z.string().uuid() });

function normalizeSubcategory<T extends { subcategory?: string | null | undefined }>(value: T) {
  return {
    ...value,
    subcategory: value.subcategory?.trim() ? value.subcategory.trim() : undefined,
  };
}

export const upsertWork = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => workInput.parse(d))
  .handler(async ({ data, context }) => {
    const payload = normalizeSubcategory(data);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await context.supabase.from("works").upsert(payload as any);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteWork = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => idInput.parse(d))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("works").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

