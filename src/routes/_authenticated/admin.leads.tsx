import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { UserCheck } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { formatDate } from "@/lib/aremdia";

export const Route = createFileRoute("/_authenticated/admin/leads")({
  component: LeadsPage,
});

type LeadStatus = "novo" | "contatado" | "fechado" | "perdido";

const statusLabel: Record<LeadStatus, string> = {
  novo: "Novo",
  contatado: "Contatado",
  fechado: "Fechado",
  perdido: "Perdido",
};

function LeadsPage() {
  const queryClient = useQueryClient();

  const { data: leads } = useQuery({
    queryKey: ["leads"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const atualizarStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: LeadStatus }) => {
      const { error } = await supabase.from("leads").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["leads"] }),
    onError: () => toast.error("Não foi possível atualizar o status."),
  });

  const transformar = useMutation({
    mutationFn: async (lead: NonNullable<typeof leads>[number]) => {
      const { data: cliente, error } = await supabase
        .from("clientes")
        .insert({ nome: lead.nome, whatsapp: lead.whatsapp, bairro: lead.bairro })
        .select("id")
        .single();
      if (error) throw error;

      const btus = lead.btus
        .split(",")
        .map((item) => Number(item.replace(/\D/g, "")))
        .filter((item) => item > 0);
      const total = Math.max(lead.qtd_aparelhos, btus.length, 1);

      const aparelhos = Array.from({ length: total }, (_, index) => ({
        cliente_id: cliente.id,
        apelido: `Aparelho ${index + 1}`,
        btus: btus[index] ?? 9000,
        ultima_limpeza: lead.ultima_limpeza,
      }));

      const insercao = await supabase.from("aparelhos").insert(aparelhos);
      if (insercao.error) throw insercao.error;

      const fechado = await supabase.from("leads").update({ status: "fechado" }).eq("id", lead.id);
      if (fechado.error) throw fechado.error;
    },
    onSuccess: () => {
      toast.success("Lead transformado em cliente.");
      queryClient.invalidateQueries();
    },
    onError: () => toast.error("Não foi possível criar o cliente."),
  });

  return (
    <div>
      <h1 className="text-2xl font-extrabold">Leads</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Pedidos recebidos pelo formulário do site.
      </p>

      <div className="mt-6 space-y-3">
        {(leads ?? []).map((lead) => (
          <div key={lead.id} className="rounded-2xl border bg-card p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-semibold">{lead.nome}</p>
                <p className="text-sm text-muted-foreground">
                  {lead.whatsapp} · {lead.bairro}
                </p>
              </div>
              <Badge variant="secondary">{statusLabel[lead.status as LeadStatus]}</Badge>
            </div>

            <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-3">
              <div>
                <dt className="text-muted-foreground">Aparelhos</dt>
                <dd>{lead.qtd_aparelhos}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">BTUs</dt>
                <dd>{lead.btus || "—"}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Última limpeza</dt>
                <dd>
                  {lead.ultima_limpeza_desconhecida ? "Não sabe" : formatDate(lead.ultima_limpeza)}
                </dd>
              </div>
            </dl>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Select
                value={lead.status}
                onValueChange={(status) =>
                  atualizarStatus.mutate({ id: lead.id, status: status as LeadStatus })
                }
              >
                <SelectTrigger className="w-40 rounded-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(statusLabel) as LeadStatus[]).map((status) => (
                    <SelectItem key={status} value={status}>
                      {statusLabel[status]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                size="sm"
                className="rounded-full"
                disabled={transformar.isPending}
                onClick={() => transformar.mutate(lead)}
              >
                <UserCheck className="h-4 w-4" /> Transformar em cliente
              </Button>
            </div>
          </div>
        ))}

        {leads?.length === 0 && (
          <p className="rounded-2xl border bg-card p-6 text-sm text-muted-foreground">
            Nenhum lead por enquanto.
          </p>
        )}
      </div>
    </div>
  );
}
