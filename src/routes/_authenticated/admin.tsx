import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { worksQuery, type WorkRow } from "@/lib/content-queries";
import { upsertWork, deleteWork } from "@/lib/content-admin.functions";
import { retryContactMessageEmail } from "@/lib/contact-message.functions";
import { Check, CircleDashed, Clock3, MailCheck, Plus, RefreshCw, Send } from "lucide-react";
import { ItemGrid } from "@/components/admin/ItemGrid";
import { EditWorkModal } from "@/components/admin/EditWorkModal";

// --- Definiciones ---
export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Admin — Bona Nox" }, { name: "robots", content: "noindex" }] }),
  component: AdminPage,
});

const WORK_CATS = ["posters", "album_covers", "editorial"];
type MessageStatus = "new" | "in_progress" | "done" | "sent";

const MESSAGE_STATUSES: { value: MessageStatus; label: string; icon: typeof Check }[] = [
  { value: "new", label: "Nuevo", icon: CircleDashed },
  { value: "in_progress", label: "En proceso", icon: Clock3 },
  { value: "done", label: "Hecho", icon: Check },
  { value: "sent", label: "Enviado", icon: Send },
];


// --- Lógica de Admin ---
function usePendingMessagesCount() {
  const qc = useQueryClient();
  const query = useQuery({
    queryKey: ["contact_messages", "pending_count"],
    queryFn: async () => {
      const { count, error } = await supabase.from("contact_messages").select("*", { count: "exact", head: true }).eq("status", "new");
      if (error) throw error;
      return count ?? 0;
    },
    refetchInterval: 30_000,
  });
  return query.data ?? 0;
}

function AdminPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<"works" | "messages">("works");
  const pending = usePendingMessagesCount();

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <section className="mx-auto max-w-7xl px-5 py-12 md:px-10">
      <div className="flex justify-between items-center">
        <h1 className="font-display text-4xl">Admin</h1>
        <button onClick={signOut} className="bg-foreground text-background px-4 py-2 rounded-full text-sm">Salir</button>
      </div>
      <div className="mt-8 flex gap-4 border-b">
        <button onClick={() => setTab("works")} className={tab === "works" ? "border-b-2 border-accent pb-2" : "pb-2"}>
          WORKS
        </button>
        <button onClick={() => setTab("messages")} className={tab === "messages" ? "border-b-2 border-accent pb-2" : "pb-2"}>
          MESSAGES{pending > 0 && <span className="ml-2 rounded-full bg-accent px-2 py-0.5 text-xs text-accent-foreground">{pending}</span>}
        </button>
      </div>
      <div className="mt-8">
        {tab === "works" ? <WorksAdmin /> : <MessagesAdmin />}
      </div>
    </section>
  );
}

function WorksAdmin() {
  const qc = useQueryClient();
  const { data: items = [] } = useQuery(worksQuery);
  const [editing, setEditing] = useState<Partial<WorkRow> | null>(null);

  const save = useMutation({
    mutationFn: useServerFn(upsertWork),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["works"] });
      toast.success("Trabajo guardado");
      setEditing(null);
    },
    onError: (e: any) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: useServerFn(deleteWork),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["works"] });
      toast.success("Trabajo eliminado");
    },
    onError: (e: any) => toast.error(e.message),
  });

  function newWork() {
  setEditing({
    title: "",
    caption: "",
    category: "posters",
    subcategory: "",
    image_url: "",
    gallery_urls: [],
    position: items.length + 1,
  });
}

  return (
    <>
      <button
        onClick={newWork}
        className="mb-6 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2 font-heading text-sm text-accent-foreground"
      >
        <Plus size={14} />
        Nuevo trabajo
      </button>

      <ItemGrid
        items={items}
        onEdit={setEditing}
        onDelete={(id) =>
          confirm("¿Eliminar trabajo?") &&
          remove.mutate({ data: { id } })
        }
      />

      {editing && (
         <EditWorkModal
         title="Trabajo"
         categories={WORK_CATS}
         initial={editing}
         saving={save.isPending}
         onClose={() => setEditing(null)}
         onSubmit={(v) => save.mutate({ data: v })}
        />
      )}
    </>
  );
}

function MessagesAdmin() {
  const queryClient = useQueryClient();
  const sendRetry = useServerFn(retryContactMessageEmail);
  const { data: messages = [], isPending, isError, error } = useQuery({
    queryKey: ["contact_messages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_messages")
        .select("id, type, name, email, message, created_at, status, email_status, email_error")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    refetchInterval: 30_000,
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: MessageStatus }) => {
      const { error } = await supabase
        .from("contact_messages")
        .update({ status, handled: status === "done" || status === "sent" })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["contact_messages"] }),
    onError: (cause: Error) => toast.error(cause.message),
  });

  const retryEmail = useMutation({
    mutationFn: sendRetry,
    onSuccess: async ({ emailSent }) => {
      await queryClient.invalidateQueries({ queryKey: ["contact_messages"] });
      toast[emailSent ? "success" : "error"](
        emailSent ? "Notificación enviada" : "No se pudo enviar la notificación",
      );
    },
    onError: (cause: Error) => toast.error(cause.message),
  });

  if (isPending) return <p className="text-sm text-muted-foreground">Cargando mensajes…</p>;
  if (isError) return <p className="text-sm text-destructive">No se pudieron cargar los mensajes: {error.message}</p>;
  if (messages.length === 0) {
    return <div className="border border-dashed border-border px-6 py-12 text-center text-sm text-muted-foreground">No hay mensajes todavía.</div>;
  }

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <article key={message.id} className="border border-border bg-card p-5 md:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <h2 className="font-heading text-lg text-foreground">{message.name}</h2>
                <span className="text-xs uppercase tracking-wider text-muted-foreground">
                  {message.type === "custom_order" ? "Proyecto" : "Contacto"}
                </span>
              </div>
              <a href={`mailto:${message.email}`} className="mt-1 inline-flex items-center gap-2 break-all font-body text-sm text-accent hover:underline">
                <MailCheck size={14} className="shrink-0" /> {message.email}
              </a>
              <time dateTime={message.created_at} className="mt-2 block font-body text-xs text-muted-foreground">
                {new Date(message.created_at).toLocaleString()}
              </time>
            </div>
            <EmailDeliveryStatus
              status={message.email_status}
              error={message.email_error}
              retrying={retryEmail.isPending && retryEmail.variables?.data.id === message.id}
              onRetry={() => retryEmail.mutate({ data: { id: message.id } })}
            />
          </div>

          <p className="mt-5 whitespace-pre-wrap break-words font-body text-sm leading-7 text-foreground/85">{message.message}</p>

          <div className="mt-5 flex flex-wrap gap-2 border-t border-border pt-4">
            {MESSAGE_STATUSES.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                type="button"
                aria-pressed={message.status === value}
                disabled={updateStatus.isPending || message.status === value}
                onClick={() => updateStatus.mutate({ id: message.id, status: value })}
                className={`inline-flex items-center gap-1.5 border px-3 py-2 text-xs transition disabled:cursor-default ${
                  message.status === value
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-border text-foreground/70 hover:border-accent hover:text-accent"
                }`}
              >
                <Icon size={14} /> {label}
              </button>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}

function EmailDeliveryStatus({
  status,
  error,
  retrying,
  onRetry,
}: {
  status: string;
  error: string | null;
  retrying: boolean;
  onRetry: () => void;
}) {
  if (status === "sent") {
    return <span className="inline-flex items-center gap-1.5 text-xs text-green-700"><MailCheck size={14} /> Email enviado</span>;
  }

  return (
    <div className="flex flex-col items-start gap-1 md:items-end">
      <span className="text-xs text-destructive">
        {status === "pending" ? "Email pendiente" : "Email no enviado"}
      </span>
      {error && <span className="max-w-xs text-xs text-muted-foreground">{error}</span>}
      <button
        type="button"
        onClick={onRetry}
        disabled={retrying}
        className="mt-1 inline-flex items-center gap-1.5 text-xs text-accent hover:underline disabled:opacity-60"
      >
        <RefreshCw size={13} className={retrying ? "animate-spin" : ""} />
        {retrying ? "Enviando…" : "Reintentar email"}
      </button>
    </div>
  );
}