import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AirVent,
  CalendarCheck,
  CheckCircle2,
  ClipboardList,
  HeartPulse,
  Sparkles,
  Wind,
} from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { PRECO_MENSAL } from "@/lib/aremdia";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ArEmDia — seu ar-condicionado limpo, sem você precisar lembrar" },
      {
        name: "description",
        content:
          "Assinatura de manutenção de ar-condicionado por R$ 59/mês: até 2 aparelhos, 2 limpezas por ano, lembrete e agendamento pelo WhatsApp.",
      },
      {
        property: "og:title",
        content: "ArEmDia — seu ar-condicionado limpo, sem você precisar lembrar",
      },
      {
        property: "og:description",
        content: "R$ 59/mês por residência, até 2 aparelhos, 2 limpezas por ano.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const problemas = [
  {
    icon: Wind,
    titulo: "Mau cheiro ao ligar",
    texto: "Aquele cheiro de mofo é sujeira acumulada na serpentina e no filtro.",
  },
  {
    icon: HeartPulse,
    titulo: "Alergia e tosse",
    texto: "Poeira e fungos circulam pelo ambiente e pioram crises respiratórias.",
  },
  {
    icon: AirVent,
    titulo: "Gela menos, gasta mais",
    texto: "Aparelho sujo perde desempenho e pesa na conta de luz.",
  },
];

const passos = [
  {
    icon: ClipboardList,
    titulo: "1. Monte seu plano",
    texto: "Conte quantos aparelhos você tem e quando foi a última limpeza.",
  },
  {
    icon: CalendarCheck,
    titulo: "2. A gente agenda",
    texto: "Combinamos a data no WhatsApp e o técnico vai até sua casa.",
  },
  {
    icon: Sparkles,
    titulo: "3. Nunca mais esqueça",
    texto: "Avisamos você a cada 6 meses e marcamos a próxima limpeza.",
  },
];

const faq = [
  {
    q: "O que está incluso na assinatura?",
    a: "Duas limpezas completas por ano para cada aparelho (até 2 aparelhos por residência), com lembrete e agendamento feitos por nós.",
  },
  {
    q: "E se eu tiver mais de 2 aparelhos?",
    a: "Fale com a gente pelo WhatsApp: montamos um plano sob medida para a sua casa.",
  },
  {
    q: "Posso cancelar quando quiser?",
    a: "Sim. A assinatura é mensal e sem multa: é só avisar que encerramos no mês seguinte.",
  },
];

function Landing() {
  return (
    <main className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-5 py-5">
        <span className="flex items-center gap-2 text-lg font-extrabold tracking-tight">
          <AirVent className="h-6 w-6 text-primary" />
          ArEmDia
        </span>
        <Button asChild variant="ghost" size="sm" className="rounded-full">
          <Link to="/auth">Entrar</Link>
        </Button>
      </header>

      <section className="mx-auto max-w-5xl px-5 pb-14 pt-6">
        <div className="rounded-3xl bg-accent p-7 shadow-[var(--shadow-soft)] sm:p-12">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Assinatura de manutenção
          </p>
          <h1 className="mt-3 text-3xl font-extrabold leading-tight sm:text-5xl">
            Seu ar-condicionado limpo, sem você precisar lembrar
          </h1>
          <p className="mt-4 max-w-xl text-base text-accent-foreground sm:text-lg">
            Cuidamos das limpezas no prazo certo, avisamos você e agendamos tudo pelo WhatsApp.
          </p>
          <Button asChild size="lg" className="mt-7 w-full rounded-full sm:w-auto">
            <Link to="/montar-plano">Montar meu plano</Link>
          </Button>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 pb-14">
        <h2 className="text-2xl font-bold">Ar sujo é problema silencioso</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {problemas.map((item) => (
            <div key={item.titulo} className="rounded-2xl border bg-card p-5">
              <item.icon className="h-7 w-7 text-primary" strokeWidth={1.6} />
              <h3 className="mt-3 font-semibold">{item.titulo}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{item.texto}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="surface-muted py-14">
        <div className="mx-auto max-w-5xl px-5">
          <h2 className="text-2xl font-bold">Como funciona</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {passos.map((item) => (
              <div key={item.titulo} className="rounded-2xl bg-card p-5 shadow-sm">
                <item.icon className="h-7 w-7 text-primary" strokeWidth={1.6} />
                <h3 className="mt-3 font-semibold">{item.titulo}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{item.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-14">
        <h2 className="text-2xl font-bold">O plano</h2>
        <div className="mt-6 rounded-3xl border bg-card p-7 shadow-[var(--shadow-soft)] sm:p-9">
          <div className="flex items-end gap-1">
            <span className="text-4xl font-extrabold text-primary">R$ {PRECO_MENSAL}</span>
            <span className="pb-1 text-muted-foreground">/mês por residência</span>
          </div>
          <ul className="mt-5 space-y-2.5">
            {[
              "Até 2 aparelhos na mesma casa",
              "2 limpezas por ano para cada aparelho",
              "Lembrete automático quando a limpeza vence",
              "Agendamento pelo WhatsApp, sem burocracia",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" strokeWidth={1.8} />
                {item}
              </li>
            ))}
          </ul>
          <Button asChild size="lg" className="mt-7 w-full rounded-full sm:w-auto">
            <Link to="/montar-plano">Montar meu plano</Link>
          </Button>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 pb-16">
        <h2 className="text-2xl font-bold">Perguntas frequentes</h2>
        <Accordion type="single" collapsible className="mt-4">
          {faq.map((item) => (
            <AccordionItem key={item.q} value={item.q}>
              <AccordionTrigger className="text-left">{item.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        ArEmDia — manutenção de ar-condicionado por assinatura
      </footer>
    </main>
  );
}
