import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { AirVent, LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminLayout,
});

const links = [
  { to: "/admin", label: "Início", exact: true },
  { to: "/admin/leads", label: "Leads" },
  { to: "/admin/clientes", label: "Clientes" },
  { to: "/admin/visitas", label: "Visitas" },
  { to: "/admin/lembretes", label: "Lembretes" },
] as const;

function AdminLayout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: isAdmin, isPending } = useQuery({
    queryKey: ["is-admin"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("claim_admin");
      if (error) throw error;
      return data === true;
    },
  });

  async function sair() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b bg-card/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/admin" className="flex items-center gap-2 font-extrabold">
            <AirVent className="h-5 w-5 text-primary" />
            ArEmDia
          </Link>
          <Button variant="ghost" size="sm" className="rounded-full" onClick={sair}>
            <LogOut className="h-4 w-4" /> Sair
          </Button>
        </div>
        <nav className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-3 pb-2">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              activeOptions={{ exact: "exact" in link }}
              activeProps={{ className: "bg-primary text-primary-foreground" }}
              className="whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-medium text-muted-foreground hover:bg-accent"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        {isPending ? (
          <p className="text-sm text-muted-foreground">Carregando…</p>
        ) : isAdmin ? (
          <Outlet />
        ) : (
          <div className="rounded-2xl border bg-card p-6">
            <h1 className="text-lg font-bold">Acesso restrito</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Sua conta não tem permissão de administrador. Peça para o administrador liberar seu
              acesso.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
