import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface EditWorkModalProps {
  title: string;
  categories: string[];
  initial: any;
  saving: boolean;
  onClose: () => void;
  onSubmit: (value: any) => void;
}

const CATEGORY_LABELS: Record<string, string> = {
  posters: "Pósteres",
  album_covers: "Portadas de álbumes musicales",
  editorial: "Diseño editorial",
};

const SUBCATEGORY_OPTIONS: Record<
  string,
  { value: string; label: string }[]
> = {
  posters: [
    { value: "music", label: "Música" },
    { value: "cinema", label: "Cine" },
    { value: "games", label: "Videojuegos" },
    { value: "concept", label: "Conceptual" },
    { value: "events", label: "Eventos" },
  ],

  editorial: [
    { value: "covers", label: "Portadas" },
    { value: "books", label: "Libros" },
    { value: "magazines", label: "Revistas" },
    { value: "catalogs", label: "Catálogos" },
    { value: "ebooks", label: "eBooks" },
  ],
};

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="font-heading text-[11px] uppercase tracking-wider text-foreground/70">
        {label}
      </label>

      <div className="mt-1">
        {children}
      </div>
    </div>
  );
}

export function EditWorkModal({
  title,
  categories,
  initial,
  saving,
  onClose,
  onSubmit,
}: EditWorkModalProps) {
  const [form, setForm] = useState(() => ({
    ...initial,
    title: initial.title ?? "",
    caption: initial.caption ?? "",
    category: initial.category ?? categories[0] ?? "",
    subcategory: initial.subcategory ?? "",
    image_url: initial.image_url ?? "",
    gallery_urls: Array.isArray(initial.gallery_urls)
  ? initial.gallery_urls
  : typeof initial.gallery_urls === "string"
    ? (() => {
        try {
          const parsed = JSON.parse(initial.gallery_urls);
          return Array.isArray(parsed) ? parsed : [];
        } catch {
          return [];
        }
      })()
    : [],
    position: initial.position ?? 0,
  }));

  const [uploading, setUploading] = useState(false);

  const subcategories =
    SUBCATEGORY_OPTIONS[form.category] ?? [];

  function handleCategoryChange(category: string) {
    setForm((prev: any) => ({
      ...prev,
      category,
      subcategory: "",
    }));
  }

  async function uploadFiles(
    files: FileList | null,
    gallery = false
  ) {
    if (!files?.length) return;

    setUploading(true);

    try {
      const uploaded: string[] = [];

      for (const file of Array.from(files)) {
        const ext =
          file.name.split(".").pop() ?? "png";

        const path =
          `${Date.now()}-${Math.random()
            .toString(36)
            .slice(2, 8)}.${ext}`;

        const { error } =
          await supabase.storage
            .from("media")
            .upload(path, file, {
              contentType: file.type,
            });

        if (error) throw error;

        const {
          data,
          error: signedError,
        } =
          await supabase.storage
            .from("media")
            .createSignedUrl(
              path,
              60 * 60 * 24 * 365 * 10
            );

        if (signedError) throw signedError;

        uploaded.push(data.signedUrl);
      }

      if (gallery) {
        setForm((prev: any) => ({
          ...prev,
          gallery_urls: [
            ...(prev.gallery_urls ?? []),
            ...uploaded,
          ],
        }));

        toast.success(
          `${uploaded.length} imagen${
            uploaded.length === 1 ? "" : "es"
          } añadida${
            uploaded.length === 1 ? "" : "s"
          } a la galería`
        );
      } else {
        setForm((prev: any) => ({
          ...prev,
          image_url: uploaded[0],
        }));

        toast.success("Imagen subida correctamente");
      }
    } catch (err: any) {
      toast.error(
        err.message ?? "Error al subir la imagen"
      );
    } finally {
      setUploading(false);
    }
  }

  function removeGalleryImage(index: number) {
    setForm((prev: any) => ({
      ...prev,
      gallery_urls: prev.gallery_urls.filter(
        (_: string, i: number) => i !== index
      ),
    }));
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/60 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-auto rounded-2xl bg-background p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-display text-2xl">
          {title}
        </h2>

        <div className="mt-6 space-y-4">

          <Field label="Título">
            <input
              className="w-full rounded-md border px-3 py-2 text-sm"
              value={form.title}
              onChange={(e) =>
                setForm((prev: any) => ({
                  ...prev,
                  title: e.target.value,
                }))
              }
            />
          </Field>

          <Field label="Descripción">
            <textarea
              className="w-full rounded-md border px-3 py-2 text-sm"
              rows={3}
              value={form.caption}
              onChange={(e) =>
                setForm((prev: any) => ({
                  ...prev,
                  caption: e.target.value,
                }))
              }
            />
          </Field>

          <Field label="Categoría">
            <select
              className="w-full rounded-md border px-3 py-2 text-sm"
              value={form.category}
              onChange={(e) =>
                handleCategoryChange(e.target.value)
              }
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {CATEGORY_LABELS[cat] ?? cat}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Subcategoría">
            <select
              className="w-full rounded-md border px-3 py-2 text-sm"
              value={form.subcategory}
              onChange={(e) =>
                setForm((prev: any) => ({
                  ...prev,
                  subcategory: e.target.value,
                }))
              }
              disabled={subcategories.length === 0}
            >
              <option value="">
                Selecciona una subcategoría
              </option>

              {subcategories.map((sub) => (
                <option
                  key={sub.value}
                  value={sub.value}
                >
                  {sub.label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Imagen principal">
            {form.image_url && (
              <img
                src={form.image_url}
                alt=""
                className="mb-3 h-40 w-full rounded-lg object-cover"
              />
            )}

            <label className="inline-flex cursor-pointer rounded-full border px-4 py-2 text-xs transition hover:bg-foreground hover:text-background">
              {uploading
                ? "Subiendo..."
                : form.image_url
                  ? "Cambiar imagen"
                  : "Seleccionar imagen"}

              <input
                type="file"
                accept="image/*"
                hidden
                disabled={uploading}
                onChange={(e) =>
                  uploadFiles(e.target.files)
                }
              />
            </label>

            {form.image_url && (
              <p className="mt-2 truncate text-[10px] text-foreground/50">
                Imagen cargada correctamente
              </p>
            )}
          </Field>

          <Field label="Galería">
            <div className="space-y-3">
              {form.gallery_urls.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {form.gallery_urls.map(
                    (url: string, index: number) => (
                      <div
                        key={`${url}-${index}`}
                        className="group relative overflow-hidden rounded-lg border"
                      >
                        <img
                          src={url}
                          alt=""
                          className="h-24 w-full object-cover"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            removeGalleryImage(index)
                          }
                          className="absolute right-1 top-1 rounded-full bg-background/90 px-2 py-1 text-[10px] opacity-0 transition group-hover:opacity-100"
                        >
                          ✕
                        </button>
                      </div>
                    )
                  )}
                </div>
              )}

              <label className="inline-flex cursor-pointer rounded-full border px-4 py-2 text-xs transition hover:bg-foreground hover:text-background">
                {uploading
                  ? "Subiendo..."
                  : "Añadir imágenes"}

                <input
                  type="file"
                  accept="image/*"
                  multiple
                  hidden
                  disabled={uploading}
                  onChange={(e) =>
                    uploadFiles(e.target.files, true)
                  }
                />
              </label>

              <p className="text-[10px] text-foreground/50">
                Puedes seleccionar varias imágenes a la vez.
              </p>
            </div>
          </Field>

          <Field label="Orden">
            <input
              type="number"
              className="w-full rounded-md border px-3 py-2 text-sm"
              value={form.position}
              onChange={(e) =>
                setForm((prev: any) => ({
                  ...prev,
                  position: Number(e.target.value),
                }))
              }
            />
          </Field>

        </div>

        <div className="mt-8 flex justify-end gap-2">

          <button
            type="button"
            className="rounded-full border px-5 py-2 text-sm"
            onClick={onClose}
          >
            Cancelar
          </button>

          <button
            type="button"
            disabled={
              saving ||
              uploading ||
              !form.title.trim() ||
              !form.image_url
            }
            onClick={() =>
              onSubmit({
                ...form,
                title: form.title.trim(),
                caption: form.caption.trim(),
                subcategory:
                  form.subcategory || undefined,
                gallery_urls: form.gallery_urls ?? [],
              })
            }
            className="rounded-full bg-foreground px-5 py-2 text-sm text-background disabled:opacity-50"
          >
            {saving
              ? "Guardando..."
              : "Guardar"}
          </button>

        </div>
      </div>
    </div>
  );
}