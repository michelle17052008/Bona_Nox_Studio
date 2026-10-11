import { Pencil, Trash2 } from "lucide-react";
import type { WorkRow } from "@/lib/content-queries";

interface ItemGridProps {
  items: WorkRow[];
  onEdit: (item: WorkRow) => void;
  onDelete: (id: string) => void;
}

export function ItemGrid({
  items,
  onEdit,
  onDelete,
}: ItemGridProps) {
  if (!items.length) {
    return (
      <div className="rounded-2xl border border-dashed p-10 text-center text-foreground/60">
        No hay elementos todavía.
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <article
          key={item.id}
          className="overflow-hidden rounded-2xl border bg-card shadow-sm transition hover:shadow-md"
        >
          <div className="aspect-[4/3] overflow-hidden bg-muted">
            {item.image_url ? (
              <img
                src={item.image_url}
                alt={item.title}
                className="h-full w-full object-cover transition hover:scale-105"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-foreground/50">
                Sin imagen
              </div>
            )}
          </div>

          <div className="space-y-2 p-4">

            <div className="flex items-start justify-between gap-2">
              <h3 className="font-heading text-lg">
                {item.title}
              </h3>

              <span className="rounded-full bg-muted px-2 py-1 text-[10px] uppercase">
                {item.category}
              </span>
            </div>

            {item.caption && (
              <p className="line-clamp-2 text-sm text-foreground/70">
                {item.caption}
              </p>
            )}

            <div className="flex justify-end gap-2 pt-2">

              <button
                onClick={() => onEdit(item)}
                className="inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs transition hover:bg-muted"
              >
                <Pencil size={14} />
                Editar
              </button>

              <button
                onClick={() => onDelete(item.id)}
                className="inline-flex items-center gap-2 rounded-full border border-red-500 px-3 py-2 text-xs text-red-500 transition hover:bg-red-500 hover:text-white"
              >
                <Trash2 size={14} />
                Eliminar
              </button>

            </div>

          </div>
        </article>
      ))}
    </div>
  );
}