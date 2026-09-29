import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/obrigado")({
  head: () => ({
    meta: [
      { title: "Pedido recebido — ArEmDia" },
      {
        name: "description",
        content: "Recebemos seu pedido de assinatura de manutenção de ar-condicionado.",
      },
      { property: "og:title", content: "Pedido recebido — ArEmDia" },
      {
        property: "og:description",
        content: "Recebemos seu pedido. Vamos te chamar no WhatsApp.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Obrigado,
});

function Obrigado() {
  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-16">
      <div className="w-full max-w-md rounded-3xl border bg-card p-8 text-center shadow-[var(--shadow-soft)]">
        <CheckCircle2 className="mx-auto h-14 w-14 text-primary" strokeWidth={1.5} />
        <h1 className="mt-5 text-2xl font-bold">Recebemos seu pedido</h1>
        <p className="mt-3 text-muted-foreground">
          Vamos te chamar no WhatsApp para confirmar os detalhes e agendar a primeira limpeza.
        </p>
        <Button asChild className="mt-7 w-full rounded-full" size="lg">
          <Link to="/">Voltar para o início</Link>
        </Button>
      </div>
    </main>
  );
}
