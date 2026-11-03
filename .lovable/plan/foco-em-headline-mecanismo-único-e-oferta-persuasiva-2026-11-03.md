# Foco em Headline, Mecanismo Único e Oferta Persuasiva

## O que muda para você
1. **Headline**: a IA cria 3 opções de headline. Você escolhe uma com um clique, e ela vai para o prompt e para a página.
2. **Mecanismo único**: a IA cria sozinha um nome forte para o método (ex.: "Método 3P"), explica por que ele funciona e por que é diferente do que o público já tentou.
3. **Oferta persuasiva**: a IA monta a oferta com promessa clara, lista de valor (de/por), motivo para comprar agora, garantia e quebra de objeções.

## No prompt gerado
- Uma nova seção no topo, "Prioridades da copy", com as 3 headlines, o mecanismo único e a estrutura da oferta, antes dos 11 blocos.
- Os blocos passam a citar o mecanismo pelo nome.

## Na página real
- Topo da página: a headline escolhida e um selo com o nome do mecanismo.
- Novo bloco "O Mecanismo Único", logo depois das dores: nome, explicação e 3 pilares.
- Bloco de oferta reforçado: promessa principal, valores de/por, motivo de urgência e garantia em destaque perto do botão.

## Sem IA
- Se a IA não responder, o app cria versões padrão das 3 headlines, do mecanismo e da oferta a partir do nome do produto, para tudo continuar funcionando.

## Detalhes técnicos
- `types.ts`: adicionar `headlineOptions: string[]`, `mechanism { name, explanation, pillars[] }` e `offer { promise, reasonToBuyNow, objections[] }` em `LandingPageContent`.
- `api/generate.ts`: ampliar o JSON pedido à IA (Lovable Gateway, com reserva na OpenAI) com esses campos e copiá-los para os dois modelos.
- `promptEngine.ts`: valores padrão determinísticos e a nova seção no texto do prompt.
- `PromptApp.tsx`: seletor das 3 headlines, que atualiza `headline`.
- `LandingPageView.tsx`: selo do mecanismo, bloco do mecanismo e oferta reforçada nos temas direto e cenário.
