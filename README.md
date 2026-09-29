# ArEmDia — assinatura de manutenção de ar-condicionado

MVP criado com ChatGPT como co-founder e Lovable para construir, no desafio "Construa seu primeiro App com IA" (DIO + Santander).

**Aplicação publicada:** https://pixel-perfect-render-6465.lovable.app

## 1. A dor escolhida

As pessoas sabem que deveriam limpar o ar-condicionado, mas esquecem ou procrastinam. O resultado é mau cheiro, alergia, queda de desempenho e conta de luz mais alta. O problema não é "não sei limpar", é "não lembro e não quero procurar técnico".

Por que vale um negócio: é um serviço recorrente (a limpeza precisa se repetir todo ano) e o cliente paga pela comodidade de não precisar lembrar.

## 2. Mercado e Business Model Canvas

**Oferta:** R$ 59/mês por residência, até 2 aparelhos, 2 limpezas por ano por aparelho, com lembrete e agendamento. Receita anual por cliente: R$ 59 x 12 = R$ 708.

**Cidade hipotética:** 500 mil habitantes.

| Etapa | Conta | Resultado |
|---|---|---|
| Domicílios | 500.000 ÷ 2,5 moradores | 200.000 |
| Com ar-condicionado* | 200.000 x 20% | 40.000 |
| Atendíveis* | 40.000 x 60% | 24.000 |
| Meta inicial* | 1.000 assinantes | 1.000 |

| Métrica | Residências | Receita anual |
|---|---:|---:|
| **TAM** | 40.000 | R$ 28,32 milhões |
| **SAM** | 24.000 | R$ 16,99 milhões |
| **SOM inicial** | 1.000 | R$ 708 mil |

\* Os 20%, os 60% e a meta de 1.000 assinantes são **premissas a validar**, não dados observados de uma cidade real. O SOM é uma meta operacional, não uma previsão.

### Business Model Canvas

| Bloco | Hipótese inicial |
|---|---|
| Segmentos de clientes | Residências com 1 a 2 aparelhos que buscam praticidade e manutenção preventiva |
| Proposta de valor | O cliente não precisa lembrar nem procurar técnico; a empresa acompanha e agenda |
| Canais | WhatsApp, Instagram, indicação, Google local, parceiros |
| Relacionamento | Assinatura recorrente, lembretes, agendamento e histórico |
| Receitas | R$ 59/mês por residência |
| Recursos-chave | Técnicos parceiros, agenda, base de clientes, sistema de lembretes, marca |
| Atividades-chave | Captar clientes, cadastrar aparelhos, controlar vencimentos, agendar visitas, cobrar |
| Parceiros-chave | Técnicos e empresas de climatização, lojas e instaladores |
| Estrutura de custos | Limpezas, deslocamento, aquisição de clientes, meios de pagamento, software |

## 3. A tese e o que ficou manual de propósito

**Tese testada:** as pessoas pagam uma assinatura para não precisar lembrar de limpar o ar-condicionado.

**Principais hipóteses do MVP**
1. As pessoas realmente esquecem a manutenção.
2. O cliente valoriza ter alguém cuidando disso e aceita pagar antes da primeira limpeza.
3. R$ 59/mês é um preço aceitável.
4. O custo de atender uma residência por ano é menor que R$ 708.
5. O cliente continua pagando depois da primeira limpeza.

**O número mais importante a descobrir:** o custo real anual para atender uma residência, já que o compromisso máximo é de 4 atendimentos por ano.

**Manual de propósito (fica para depois da tese confirmada)**
- Venda e negociação: fechadas pelo WhatsApp.
- Cobrança: PIX ou link de pagamento enviado à mão (sem pagamento integrado).
- Agendamento e contato com o técnico: pelo WhatsApp.
- Lembrete: o painel mostra quem vence, e a mensagem sai pelo WhatsApp com um clique.

**O que o app cobre:** landing page, formulário de plano, contato pelo WhatsApp e painel de administração com leads, clientes, visitas e lembretes.

## 4. Mega prompt (Lovable)

```markdown
# ArEmDia — assinatura de manutenção de ar-condicionado

Construa um MVP em português do Brasil, usando o back-end do
Lovable Cloud (autenticação e banco). Sem integração de pagamento.

## Tese
Pessoas pagam uma assinatura para não precisar lembrar de
limpar o ar-condicionado.

## Oferta
R$ 59/mês por residência, até 2 aparelhos, 2 limpezas por
ano por aparelho, com lembrete e agendamento.

## Fluxo do cliente (público, sem login)
1. Landing page com: título ("Seu ar-condicionado limpo, sem
   você precisar lembrar"), explicação do problema (mau
   cheiro, alergia, desempenho), como funciona em 3 passos,
   o plano com preço, 3 perguntas frequentes e botão
   "Montar meu plano".
2. Formulário: nome, WhatsApp, bairro, nº de aparelhos (1 ou 2),
   BTUs de cada aparelho, data da última limpeza (ou "não sei").
3. Ao enviar: salvar como lead e abrir o WhatsApp da empresa
   (número placeholder 5500000000000) com os dados do formulário
   já na mensagem.
4. Página de confirmação: "Recebemos seu pedido, vamos te
   chamar no WhatsApp".

## Painel de administração (com login)
Acesso só para usuário admin, com e-mail e senha.
- Leads: tabela com dados do formulário, status (novo,
  contatado, fechado, perdido) e botão "Transformar em cliente"
  que copia os dados sem redigitar.
- Clientes: nome, contato, bairro, aparelhos, status da
  assinatura (ativa ou cancelada), data de início.
- Visitas: agendar limpeza por cliente e aparelho, com data,
  técnico (texto livre), status (agendada, feita, cancelada) e
  observações. Ao marcar como feita, registrar a data da última
  limpeza.
- Lembretes: lista de clientes cuja próxima limpeza vence
  nos próximos 30 dias (6 meses após a última limpeza), com
  botão que abre o WhatsApp com a mensagem de lembrete pronta.
- Início com contadores: leads novos, clientes ativos, visitas
  da semana, lembretes pendentes.

## Visual
Limpo e mobile first. Azul-petróleo (#0F5C6E) como cor
principal, ciano claro (#7FD8E6) de apoio, fundo branco e
cinza claro, botões arredondados, tipografia sem serifa.
Sem imagens geradas (usar ícones), para poupar créditos.

## Regras
- Dados de exemplo fictícios no painel.
- Nenhuma chave ou senha no código.
- Ativar RLS: só o admin lê e edita clientes, visitas e leads;
  o público só insere leads.
```

## 5. Correções pedidas depois dos testes

Nenhuma correção foi necessária.

## 6. Telas

![Landing page](prints/landing-page.png)

![Formulário](prints/formulario.png)

![Painel de administração](prints/painel-admin.png)

## 7. Como foi feito

1. Escolha da dor e validação de mercado com o ChatGPT (TAM, SAM, SOM, Canvas e hipóteses).
2. Mega prompt escrito e revisado antes de ir para o Lovable, usando o modo Plan.
3. Teste como cliente e como administrador, com correções em um prompt único.
4. Revisão de segurança do Lovable e publicação.
5. Código levado para este repositório no GitHub.
