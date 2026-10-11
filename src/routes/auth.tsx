import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Acceso — Bona Nox" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function cleanEmail(value: string) {
  return value.trim().replace(/[\u200B-\u200D\uFEFF]/g, "");
}

function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isRecovery, setIsRecovery] = useState(false);
  const [loading, setLoading] = useState(false);
  const submittedEmail = useMemo(() => cleanEmail(email), [email]);

  useEffect(() => {
    let mounted = true;

    async function restoreSessionFromUrl() {
      const url = new URL(window.location.href);
      const hashParams = new URLSearchParams(url.hash.replace(/^#/, ""));
      const searchParams = url.searchParams;
      const recoveryRequested = searchParams.get("mode") === "recovery" || hashParams.get("type") === "recovery";
      const code = searchParams.get("code");
      const accessToken = hashParams.get("access_token");
      const refreshToken = hashParams.get("refresh_token");

      try {
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;
          window.history.replaceState({}, document.title, "/auth?mode=recovery");
        } else if (accessToken && refreshToken) {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          if (error) throw error;
          window.history.replaceState({}, document.title, "/auth?mode=recovery");
        }

        const { data } = await supabase.auth.getSession();
        if (!mounted) return;
        if (recoveryRequested) {
          setIsRecovery(true);
          return;
        }
        if (data.session) {
          navigate({ to: "/admin", replace: true });
        }
      } catch (err: any) {
        if (!mounted) return;
        toast.error(err?.message ?? "No se pudo validar el enlace de recuperación");
      }
    }

    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setIsRecovery(true);
    });

    restoreSessionFromUrl();
    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, [navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: submittedEmail,
        password,
      });
      if (error) throw error;
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) throw userError ?? new Error("No se pudo validar la sesión");
      toast.success("Bienvenida");
      navigate({ to: "/admin", replace: true });
    } catch (err: any) {
      toast.error(err.message ?? "Error");
    } finally {
      setLoading(false);
    }
  }

  async function onUpdatePassword(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword.length < 8) return toast.error("La nueva contraseña debe tener al menos 8 caracteres");
    setLoading(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) throw new Error("Abre de nuevo el enlace de recuperación para crear una sesión segura");
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      toast.success("Contraseña actualizada. Ya puedes entrar al panel.");
      setIsRecovery(false);
      setNewPassword("");
      window.history.replaceState({}, document.title, "/auth");
      navigate({ to: "/admin", replace: true });
    } catch (err: any) {
      toast.error(err.message ?? "Error al actualizar contraseña");
    } finally {
      setLoading(false);
    }
  }

  async function onReset() {
    if (!submittedEmail) return toast.error("Escribe tu email primero");
    const { error } = await supabase.auth.resetPasswordForEmail(submittedEmail, {
      redirectTo: window.location.origin + "/auth?mode=recovery",
    });
    if (error) return toast.error(error.message);
    toast.success("Si el email existe, recibirás un enlace de recuperación.");
  }

  return (
    <section className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-5 py-20">
      <h1 className="font-display text-4xl text-foreground">Acceso</h1>
      <p className="mt-2 font-body text-sm text-muted-foreground">
        {isRecovery ? "Crea una nueva contraseña para tu panel privado." : "Panel privado. El registro público está desactivado."}
      </p>
      {isRecovery ? (
        <form onSubmit={onUpdatePassword} className="mt-8 space-y-4">
          <div>
            <label className="font-heading text-xs uppercase tracking-wider text-foreground/70">Nueva contraseña</label>
            <input
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 font-body text-sm"
            />
          </div>
          <button
            disabled={loading}
            type="submit"
            className="w-full rounded-full bg-foreground px-5 py-3 font-heading text-background disabled:opacity-60"
          >
            {loading ? "..." : "Actualizar contraseña"}
          </button>
          <button
            type="button"
            onClick={() => setIsRecovery(false)}
            className="w-full font-heading text-xs uppercase tracking-wider text-accent"
          >
            Volver al inicio de sesión
          </button>
        </form>
      ) : (
      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <div>
          <label className="font-heading text-xs uppercase tracking-wider text-foreground/70">Email</label>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 font-body text-sm"
          />
        </div>
        <div>
          <label className="font-heading text-xs uppercase tracking-wider text-foreground/70">Contraseña</label>
          <input
            type="password"
            required
            minLength={6}
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 font-body text-sm"
          />
        </div>
        <button
          disabled={loading}
          type="submit"
          className="w-full rounded-full bg-foreground px-5 py-3 font-heading text-background disabled:opacity-60"
        >
          {loading ? "..." : "Entrar"}
        </button>
      </form>
      )}
      {!isRecovery && (
      <button
        type="button"
        onClick={onReset}
        className="mt-6 font-heading text-xs uppercase tracking-wider text-accent"
      >
        Olvidé mi contraseña
      </button>
      )}
      <Link to="/" className="mt-2 font-body text-xs text-muted-foreground">← Volver al inicio</Link>
    </section>
  );
}
