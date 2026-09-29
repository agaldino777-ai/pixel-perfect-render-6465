import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Bell, CalendarDays, UserPlus, Users } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { addMonths, daysUntil, toIsoDate } from "@/lib/aremdia";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: AdminHome,
});

function AdminHome() {
  const { data } = useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const hoje = new Date();
      const inicioSemana = new Date(hoje);
      inicioSemana.setDate(hoje.getDate() - hoje.getDay());
      const fimSemana = new Date(inicioSemana);
      fimSemana.setDate(inicioSemana.getDate() + 6);

      const [leads, clientes, visitas, aparelhos] = await Promise.all([
        supabase.from("leads").select("id", { count: "exact", head: true }).eq("status", "novo"),
        supabase
          .from("clientes")
          .select("id", { count: "exact", head: true })
          .eq("status", "ativa"),
        supabase
          .from("visitas")
          .select("id", { count: "exact", head: true })
          .gte("data", toIsoDate(inicioSemana))
          .lte("data", toIsoDate(fimSemana)),
        supabase
          .from("aparelhos")
          .select("id, ultima_limpeza, clientes!inner(status)")
          .eq("clientes.status", "ativa"),
      ]);

      const lembretes = (aparelhos.data ?? []).filter((item) => {
        if (!item.ultima_limpeza) return true;
        const dias = daysUntil(addMonths(item.ultima_limpeza, 6));
        return dias <= 30;
      }).length;

      return {
        leadsNovos: leads.count ?? 0,
        clientesAtivos: clientes.count ?? 0,
        visitasSemana: visitas.count ?? 0,
        lembretes,
      };
    },
  });

  const cards = [
    { label: "Leads novos", value: data?.leadsNovos, icon: UserPlus },
    { label: "Clientes ativos", value: data?.clientesAtivos, icon: Users },
    { label: "Visitas da semana", value: data?.visitasSemana, icon: CalendarDays },
    { label: "Lembretes pendentes", value: data?.lembretes, icon: Bell },
  ];

  return (
    <div>
      <h1 className="text-2xl font-extrabold">Início</h1>
      <p className="mt-1 text-sm text-muted-foreground">Visão geral da operação.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="rounded-2xl border bg-card p-5">
            <card.icon className="h-6 w-6 text-primary" strokeWidth={1.6} />
            <p className="mt-3 text-3xl font-extrabold">{card.value ?? "—"}</p>
            <p className="text-sm text-muted-foreground">{card.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
