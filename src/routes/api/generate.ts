import { createFileRoute } from "@tanstack/react-router";
import { generateFullCopyData, LANGUAGES, applyFocusToPrompt } from "@/lib/promptEngine";
import { scrapeUrl } from "@/lib/scrape.server";
import type { GenerateRequest } from "@/types";

async function enrichWithAI(params: {
  productName?: string;
  audience?: string;
  tone: string;
  language: string;
  description?: string;
  openaiKey?: string;
}): Promise<{ data: any; source: "lovable" | "openai" | null; noCredits: boolean }> {
  const apiKey = process.env["LOVABLE_API_KEY"];

  const prompt = `Você é um copywriter de elite em ofertas low ticket e páginas de alta conversão.
Foque em 3 coisas: (1) headline magnética, (2) um MECANISMO ÚNICO com nome próprio, (3) uma oferta irresistível. Melhore e adapte os seguintes dados para a landing page em 11 blocos:
- Produto: ${params.productName || "Produto Digital"}
- Público: ${params.audience || "Interessados"}
- Tom de voz: ${params.tone}
- Idioma: ${params.language}
${params.description ? `- Conteúdo extraído da URL: ${params.description}` : ""}

Responda APENAS com um JSON válido:
{
  "headlineOptions": ["headline irresistível 1", "headline 2 com ângulo diferente", "headline 3 citando o mecanismo"],
  "headline": "a melhor das 3 headlines",
  "mechanism": {"name": "nome curto e marcante do mecanismo único", "explanation": "por que funciona e por que é diferente do que o público já tentou (2-3 frases)", "pillars": ["pilar 1", "pilar 2", "pilar 3"]},
  "offer": {"promise": "promessa principal clara e específica", "reasonToBuyNow": "motivo de urgência para comprar agora", "objections": ["objeção: resposta", "objeção: resposta", "objeção: resposta"]},
  "subheadline": "subheadline forte quebrando objeção",
  "painPoints": ["dor 1", "dor 2", "dor 3", "dor 4"],
  "deliverables": [
    {"title": "item 1", "text": "descrição 1"},
    {"title": "item 2", "text": "descrição 2"},
    {"title": "item 3", "text": "descrição 3"}
  ]
}`;

  const call = async (url: string, key: string, model: string) => {
    const res = await fetch(url, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model, messages: [{ role: "user", content: prompt }] }),
    });
    if (!res.ok) return { status: res.status, data: null };
    const json = await res.json();
    const text: string | undefined = json?.choices?.[0]?.message?.content;
    const m = text?.match(/\{[\s\S]*\}/);
    return { status: res.status, data: m ? JSON.parse(m[0]) : null };
  };

  let noCredits = false;
  if (apiKey) {
    try {
      const r = await call("https://ai.gateway.lovable.dev/v1/chat/completions", apiKey, "google/gemini-3-flash-preview");
      if (r.data) return { data: r.data, source: "lovable", noCredits: false };
      if (r.status === 402 || r.status === 403 || r.status === 429) noCredits = true;
    } catch {}
  } else {
    noCredits = true;
  }

  if (params.openaiKey) {
    try {
      const r = await call("https://api.openai.com/v1/chat/completions", params.openaiKey, "gpt-4o-mini");
      if (r.data) return { data: r.data, source: "openai", noCredits };
    } catch {}
  }
  return { data: null, source: null, noCredits };
}

export const Route = createFileRoute("/api/generate")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json()) as GenerateRequest;
        const {
          url,
          language = "pt",
          variants = 1,
          productName,
          basicPrice,
          completePrice,
          audience,
          tone,
        } = body;
        const openaiKey = (body as any).openaiKey as string | undefined;

        let scraped = false;
        let scrapedInfo = null as Awaited<ReturnType<typeof scrapeUrl>>;

        if (url && url.trim().length > 0) {
          scrapedInfo = await scrapeUrl(url.trim());
          if (scrapedInfo && (scrapedInfo.title || scrapedInfo.description)) {
            scraped = true;
          }
        }

        const baseData = generateFullCopyData(
          {
            url,
            language,
            variants,
            productName,
            basicPrice,
            completePrice,
            audience,
            tone,
          },
          scrapedInfo ?? undefined,
        );

        const ai = await enrichWithAI({
          openaiKey,
          productName: productName || scrapedInfo?.title,
          audience,
          tone,
          language: LANGUAGES[language]?.name || "Português",
          description: scrapedInfo?.description,
        });

        const enriched = ai.data;
        if (enriched) {
          if (enriched.headline) baseData.contentDireto.headline = enriched.headline;
          if (enriched.subheadline) baseData.contentDireto.subheadline = enriched.subheadline;
          if (Array.isArray(enriched.painPoints) && enriched.painPoints.length > 0) {
            baseData.contentDireto.painPoints = enriched.painPoints;
            baseData.contentCenario.painPoints = enriched.painPoints;
          }
          if (Array.isArray(enriched.deliverables) && enriched.deliverables.length > 0) {
            baseData.contentDireto.deliverables = enriched.deliverables;
            baseData.contentCenario.deliverables = enriched.deliverables;
          }
          for (const c of [baseData.contentDireto, baseData.contentCenario]) {
            if (enriched.headline) c.headline = enriched.headline;
            if (Array.isArray(enriched.headlineOptions) && enriched.headlineOptions.length >= 3) {
              c.headlineOptions = enriched.headlineOptions.slice(0, 3);
              if (!enriched.headline) c.headline = c.headlineOptions[0];
            }
            if (enriched.mechanism?.name) c.mechanism = { ...c.mechanism!, ...enriched.mechanism };
            if (enriched.offer?.promise) c.offer = { ...c.offer!, ...enriched.offer };
          }
          if (baseData.contentDireto.headlineOptions && !baseData.contentDireto.headlineOptions.includes(baseData.contentDireto.headline)) {
            for (const c of [baseData.contentDireto, baseData.contentCenario]) c.headlineOptions = [c.headline, ...(c.headlineOptions ?? []).slice(0, 2)];
          }
          for (const m of baseData.models) for (const v of m.variants) v.prompt = applyFocusToPrompt(v.prompt, baseData.contentDireto);
        }

        return Response.json({
          scraped,
          language,
          aiSource: ai.source,
          noCredits: ai.noCredits,
          models: baseData.models,
          pageContentDireto: baseData.contentDireto,
          pageContentCenario: baseData.contentCenario,
        });
      },
    },
  },
});
