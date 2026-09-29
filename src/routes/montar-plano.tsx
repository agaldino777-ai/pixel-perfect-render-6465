import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { supabase } from "@/integrations/supabase/client";
import { EMPRESA_WHATSAPP, formatDate, whatsappLink } from "@/lib/aremdia";

export const Route = createFileRoute("/montar-plano")({
  head: () => ({
    meta: [
      { title: "Montar meu plano — ArEmDia" },
      {
        name: "description",
        content:
          "Preencha seus dados e monte a assinatura de limpeza do seu ar-condicionado em 1 minuto.",
      },
      { property: "og:title", content: "Montar meu plano — ArEmDia" },
      {
        property: "og:description",
        content: "Monte sua assinatura de limpeza de ar-condicionado em 1 minuto.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MontarPlano,
});

function MontarPlano() {
  const navigate = useNavigate();
  const [nome, setNome] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [bairro, setBairro] = useState("");
  const [qtd, setQtd] = useState("1");
  const [btu1, setBtu1] = useState("");
  const [btu2, setBtu2] = useState("");
  const [ultima, setUltima] = useState("");
  const [naoSei, setNaoSei] = useState(false);
  const [enviando, setEnviando] = useState(false);

  const qtdAparelhos = Number(qtd);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!nome.trim() || !whatsapp.trim() || !bairro.trim()) {
      toast.error("Preencha nome, WhatsApp e bairro.");
      return;
    }
    const btus = [btu1, qtdAparelhos === 2 ? btu2 : ""].filter(Boolean).join(", ");
    setEnviando(true);

    const { error } = await supabase.from("leads").insert({
      nome: nome.trim(),
      whatsapp: whatsapp.trim(),
      bairro: bairro.trim(),
      qtd_aparelhos: qtdAparelhos,
      btus,
      ultima_limpeza: naoSei || !ultima ? null : ultima,
      ultima_limpeza_desconhecida: naoSei || !ultima,
    });

    setEnviando(false);

    if (error) {
      toast.error("Não conseguimos enviar seu pedido. Tente novamente.");
      return;
    }

    const mensagem = [
      "Olá! Quero assinar o plano ArEmDia.",
      `Nome: ${nome.trim()}`,
      `WhatsApp: ${whatsapp.trim()}`,
      `Bairro: ${bairro.trim()}`,
      `Aparelhos: ${qtdAparelhos}`,
      `BTUs: ${btus || "não informado"}`,
      `Última limpeza: ${naoSei || !ultima ? "não sei" : formatDate(ultima)}`,
    ].join("\n");

    window.open(whatsappLink(EMPRESA_WHATSAPP, mensagem), "_blank", "noopener");
    navigate({ to: "/obrigado" });
  }

  return (
    <main className="min-h-screen bg-background px-5 py-8">
      <div className="mx-auto max-w-lg">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Link>

        <h1 className="mt-5 text-2xl font-extrabold">Montar meu plano</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Leva menos de 1 minuto. Depois continuamos a conversa no WhatsApp.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-7 space-y-5 rounded-3xl border bg-card p-6 shadow-[var(--shadow-soft)]"
        >
          <div className="space-y-2">
            <Label htmlFor="nome">Nome</Label>
            <Input id="nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="whatsapp">WhatsApp</Label>
            <Input
              id="whatsapp"
              inputMode="tel"
              placeholder="(11) 99999-9999"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bairro">Bairro</Label>
            <Input id="bairro" value={bairro} onChange={(e) => setBairro(e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label>Quantos aparelhos?</Label>
            <RadioGroup value={qtd} onValueChange={setQtd} className="flex gap-6">
              <div className="flex items-center gap-2">
                <RadioGroupItem value="1" id="q1" />
                <Label htmlFor="q1" className="font-normal">
                  1 aparelho
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="2" id="q2" />
                <Label htmlFor="q2" className="font-normal">
                  2 aparelhos
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="btu1">BTUs do 1º aparelho</Label>
              <Input
                id="btu1"
                inputMode="numeric"
                placeholder="9000"
                value={btu1}
                onChange={(e) => setBtu1(e.target.value)}
              />
            </div>
            {qtdAparelhos === 2 && (
              <div className="space-y-2">
                <Label htmlFor="btu2">BTUs do 2º aparelho</Label>
                <Input
                  id="btu2"
                  inputMode="numeric"
                  placeholder="12000"
                  value={btu2}
                  onChange={(e) => setBtu2(e.target.value)}
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="ultima">Data da última limpeza</Label>
            <Input
              id="ultima"
              type="date"
              value={ultima}
              disabled={naoSei}
              onChange={(e) => setUltima(e.target.value)}
            />
            <div className="flex items-center gap-2 pt-1">
              <Checkbox
                id="naosei"
                checked={naoSei}
                onCheckedChange={(v) => setNaoSei(v === true)}
              />
              <Label htmlFor="naosei" className="font-normal">
                Não sei
              </Label>
            </div>
          </div>

          <Button type="submit" size="lg" className="w-full rounded-full" disabled={enviando}>
            {enviando ? "Enviando..." : "Enviar e falar no WhatsApp"}
          </Button>
        </form>
      </div>
    </main>
  );
}
