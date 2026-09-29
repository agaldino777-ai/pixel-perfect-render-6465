import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { MessageCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { addMonths, daysUntil, formatDate, toIsoDate, whatsappLink } from "@/lib/aremdia";

export const Route = createFileRoute("/_authenticated/admin/lembretes")({
  component: LembretesPage,
});

function LembretesPage() {
  const { data: itens } = useQuery({
    queryKey: ["lembretes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("aparelhos")
        .select("id, apelido, btus, ultima_limpeza, clientes!inner(id, nome, whatsapp, status)")
        .eq("clientes.status", "ativa");
      if (error) throw error;

      return data
        .map((aparelho) => {
          const proxima = aparelho.ultima_limpeza
            ? addMonths(aparelho.ultima_limpeza, 6)
            : new Date();
          return { ...aparelho, proxima, dias: daysUntil(proxima) };
        })
        .filter((item) => item.dias <= 30)
        .sort((a, b) => a.dias - b.dias);
    },
  });

  return (
    <div>
      <h1 className="text-2xl font-extrabold">Lembretes</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Limpezas que vencem nos próximos 30 dias (6 meses após a última).
      </p>

      <div className="mt-6 space-y-3">
        {(itens ?? []).map((item) => {
          const mensagem = `Olá, ${item.clientes.nome}! Aqui é da ArEmDia. A limpeza do seu ${item.apelido.toLowerCase()} vence em ${formatDate(toIsoDate(item.proxima))}. Qual dia fica melhor para agendarmos?`;
          return (
            <div key={item.id} className="rounded-2xl border bg-card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">{item.clientes.nome}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.apelido} · última limpeza {formatDate(item.ultima_limpeza)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Próxima limpeza: {formatDate(toIsoDate(item.proxima))}
                  </p>
                </div>
                <Badge variant={item.dias < 0 ? "destructive" : "secondary"}>
                  {item.dias < 0 ? `Atrasada ${Math.abs(item.dias)} dias` : `Em ${item.dias} dias`}
                </Badge>
              </div>

              <Button asChild size="sm" className="mt-4 rounded-full">
                <a
                  href={whatsappLink(item.clientes.whatsapp, mensagem)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="h-4 w-4" /> Enviar lembrete
                </a>
              </Button>
            </div>
          );
        })}

        {itens?.length === 0 && (
          <p className="rounded-2xl border bg-card p-6 text-sm text-muted-foreground">
            Nenhum lembrete pendente nos próximos 30 dias.
          </p>
        )}
      </div>
    </div>
  );
}
