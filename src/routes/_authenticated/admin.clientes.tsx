import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { formatDate } from "@/lib/aremdia";

export const Route = createFileRoute("/_authenticated/admin/clientes")({
  component: ClientesPage,
});

function ClientesPage() {
  const queryClient = useQueryClient();

  const { data: clientes } = useQuery({
    queryKey: ["clientes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clientes")
        .select("*, aparelhos(id, apelido, btus, ultima_limpeza)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const alternarStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: "ativa" | "cancelada" }) => {
      const { error } = await supabase.from("clientes").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries(),
    onError: () => toast.error("Não foi possível atualizar a assinatura."),
  });

  return (
    <div>
      <h1 className="text-2xl font-extrabold">Clientes</h1>
      <p className="mt-1 text-sm text-muted-foreground">Assinantes e seus aparelhos.</p>

      <div className="mt-6 space-y-3">
        {(clientes ?? []).map((cliente) => (
          <div key={cliente.id} className="rounded-2xl border bg-card p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-semibold">{cliente.nome}</p>
                <p className="text-sm text-muted-foreground">
                  {cliente.whatsapp} · {cliente.bairro}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Início em {formatDate(cliente.data_inicio)}
                </p>
              </div>
              <Badge variant={cliente.status === "ativa" ? "default" : "secondary"}>
                {cliente.status === "ativa" ? "Assinatura ativa" : "Cancelada"}
              </Badge>
            </div>

            <ul className="mt-4 space-y-1.5 text-sm">
              {cliente.aparelhos.map((aparelho) => (
                <li key={aparelho.id} className="flex flex-wrap gap-x-2 text-muted-foreground">
                  <span className="font-medium text-foreground">{aparelho.apelido}</span>
                  <span>{aparelho.btus.toLocaleString("pt-BR")} BTUs</span>
                  <span>· última limpeza {formatDate(aparelho.ultima_limpeza)}</span>
                </li>
              ))}
              {cliente.aparelhos.length === 0 && (
                <li className="text-muted-foreground">Nenhum aparelho cadastrado.</li>
              )}
            </ul>

            <Button
              variant="outline"
              size="sm"
              className="mt-4 rounded-full"
              onClick={() =>
                alternarStatus.mutate({
                  id: cliente.id,
                  status: cliente.status === "ativa" ? "cancelada" : "ativa",
                })
              }
            >
              {cliente.status === "ativa" ? "Cancelar assinatura" : "Reativar assinatura"}
            </Button>
          </div>
        ))}

        {clientes?.length === 0 && (
          <p className="rounded-2xl border bg-card p-6 text-sm text-muted-foreground">
            Nenhum cliente ainda. Transforme um lead em cliente para começar.
          </p>
        )}
      </div>
    </div>
  );
}
