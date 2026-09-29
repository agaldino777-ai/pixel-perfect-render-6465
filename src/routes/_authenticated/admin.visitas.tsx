import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { formatDate } from "@/lib/aremdia";

export const Route = createFileRoute("/_authenticated/admin/visitas")({
  component: VisitasPage,
});

type VisitaStatus = "agendada" | "feita" | "cancelada";

const statusLabel: Record<VisitaStatus, string> = {
  agendada: "Agendada",
  feita: "Feita",
  cancelada: "Cancelada",
};

function VisitasPage() {
  const queryClient = useQueryClient();
  const [clienteId, setClienteId] = useState("");
  const [aparelhoId, setAparelhoId] = useState("");
  const [data, setData] = useState("");
  const [tecnico, setTecnico] = useState("");
  const [observacoes, setObservacoes] = useState("");

  const { data: clientes } = useQuery({
    queryKey: ["clientes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clientes")
        .select("*, aparelhos(id, apelido, btus, ultima_limpeza)")
        .order("nome");
      if (error) throw error;
      return data;
    },
  });

  const { data: visitas } = useQuery({
    queryKey: ["visitas"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("visitas")
        .select("*, clientes(nome), aparelhos(apelido)")
        .order("data", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const aparelhosDoCliente = clientes?.find((c) => c.id === clienteId)?.aparelhos ?? [];

  const agendar = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("visitas").insert({
        cliente_id: clienteId,
        aparelho_id: aparelhoId || null,
        data,
        tecnico,
        observacoes,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Visita agendada.");
      setAparelhoId("");
      setData("");
      setTecnico("");
      setObservacoes("");
      queryClient.invalidateQueries();
    },
    onError: () => toast.error("Não foi possível agendar a visita."),
  });

  const mudarStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: VisitaStatus }) => {
      const { error } = await supabase.from("visitas").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries(),
    onError: () => toast.error("Não foi possível atualizar a visita."),
  });

  return (
    <div>
      <h1 className="text-2xl font-extrabold">Visitas</h1>
      <p className="mt-1 text-sm text-muted-foreground">Agende e acompanhe as limpezas.</p>

      <form
        className="mt-6 grid gap-4 rounded-2xl border bg-card p-5 sm:grid-cols-2"
        onSubmit={(event) => {
          event.preventDefault();
          if (!clienteId || !data) {
            toast.error("Escolha o cliente e a data.");
            return;
          }
          agendar.mutate();
        }}
      >
        <div className="space-y-2">
          <Label>Cliente</Label>
          <Select
            value={clienteId}
            onValueChange={(value) => {
              setClienteId(value);
              setAparelhoId("");
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Escolher cliente" />
            </SelectTrigger>
            <SelectContent>
              {(clientes ?? []).map((cliente) => (
                <SelectItem key={cliente.id} value={cliente.id}>
                  {cliente.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Aparelho</Label>
          <Select value={aparelhoId} onValueChange={setAparelhoId} disabled={!clienteId}>
            <SelectTrigger>
              <SelectValue placeholder="Escolher aparelho" />
            </SelectTrigger>
            <SelectContent>
              {aparelhosDoCliente.map((aparelho) => (
                <SelectItem key={aparelho.id} value={aparelho.id}>
                  {aparelho.apelido} · {aparelho.btus.toLocaleString("pt-BR")} BTUs
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="data">Data</Label>
          <Input id="data" type="date" value={data} onChange={(e) => setData(e.target.value)} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tecnico">Técnico</Label>
          <Input
            id="tecnico"
            value={tecnico}
            onChange={(e) => setTecnico(e.target.value)}
            placeholder="Nome do técnico"
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="obs">Observações</Label>
          <Textarea
            id="obs"
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
            rows={2}
          />
        </div>

        <Button
          type="submit"
          className="rounded-full sm:w-fit"
          disabled={agendar.isPending}
        >
          Agendar visita
        </Button>
      </form>

      <div className="mt-6 space-y-3">
        {(visitas ?? []).map((visita) => (
          <div key={visita.id} className="rounded-2xl border bg-card p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-semibold">{visita.clientes?.nome}</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(visita.data)} · {visita.aparelhos?.apelido ?? "Aparelho não indicado"}
                  {visita.tecnico ? ` · ${visita.tecnico}` : ""}
                </p>
                {visita.observacoes && (
                  <p className="mt-1 text-sm text-muted-foreground">{visita.observacoes}</p>
                )}
              </div>
              <Badge variant="secondary">{statusLabel[visita.status as VisitaStatus]}</Badge>
            </div>

            <Select
              value={visita.status}
              onValueChange={(status) =>
                mudarStatus.mutate({ id: visita.id, status: status as VisitaStatus })
              }
            >
              <SelectTrigger className="mt-4 w-40 rounded-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(statusLabel) as VisitaStatus[]).map((status) => (
                  <SelectItem key={status} value={status}>
                    {statusLabel[status]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}

        {visitas?.length === 0 && (
          <p className="rounded-2xl border bg-card p-6 text-sm text-muted-foreground">
            Nenhuma visita registrada.
          </p>
        )}
      </div>
    </div>
  );
}
