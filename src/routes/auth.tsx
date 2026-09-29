import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AirVent } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Acesso ao painel — ArEmDia" },
      { name: "description", content: "Área restrita da equipe ArEmDia." },
      { property: "og:title", content: "Acesso ao painel — ArEmDia" },
      { property: "og:description", content: "Área restrita da equipe ArEmDia." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [modo, setModo] = useState<"entrar" | "criar">("entrar");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setCarregando(true);

    if (modo === "entrar") {
      const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
      setCarregando(false);
      if (error) {
        toast.error("E-mail ou senha inválidos.");
        return;
      }
      navigate({ to: "/admin" });
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password: senha,
      options: { emailRedirectTo: window.location.origin },
    });
    setCarregando(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    if (!data.session) {
      toast.success("Conta criada. Confirme pelo link enviado ao seu e-mail.");
      setModo("entrar");
      return;
    }
    navigate({ to: "/admin" });
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-12">
      <div className="w-full max-w-sm">
        <Link to="/" className="flex items-center justify-center gap-2 text-lg font-extrabold">
          <AirVent className="h-6 w-6 text-primary" />
          ArEmDia
        </Link>

        <form
          onSubmit={handleSubmit}
          className="mt-7 space-y-5 rounded-3xl border bg-card p-6 shadow-[var(--shadow-soft)]"
        >
          <div>
            <h1 className="text-xl font-bold">
              {modo === "entrar" ? "Entrar no painel" : "Criar acesso de administrador"}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">Acesso restrito à equipe.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="senha">Senha</Label>
            <Input
              id="senha"
              type="password"
              autoComplete={modo === "entrar" ? "current-password" : "new-password"}
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <Button type="submit" className="w-full rounded-full" size="lg" disabled={carregando}>
            {carregando ? "Aguarde..." : modo === "entrar" ? "Entrar" : "Criar acesso"}
          </Button>

          <button
            type="button"
            onClick={() => setModo(modo === "entrar" ? "criar" : "entrar")}
            className="w-full text-sm text-muted-foreground underline-offset-4 hover:underline"
          >
            {modo === "entrar" ? "Ainda não tenho acesso" : "Já tenho acesso"}
          </button>
        </form>
      </div>
    </main>
  );
}
