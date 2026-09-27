import { createFileRoute } from "@tanstack/react-router";
import { generateFullCopyData, LANGUAGES } from "@/lib/promptEngine";
import { scrapeUrl } from "@/lib/scrape.server";
import type { GenerateRequest } from "@/types";

async function enrichWithAI(params: {
  productName?: string;
  audience?: string;
  tone: string;
  language: string;
  description?: string;
}) {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) return null;

  const prompt = `Você é um copywriter de elite em ofertas low ticket e páginas de alta conversão.
Melhore e adapte os seguintes dados para a landing page em 11 blocos:
- Produto: ${params.productName || "Produto Digital"}
- Público: ${params.audience || "Interessados"}
- Tom de voz: ${params.tone}
- Idioma: ${params.language}
${params.description ? `- Conteúdo extraído da URL: ${params.description}` : ""}

Responda APENAS com um JSON válido:
{
  "headline": "headline irresistível",
  "subheadline": "subheadline forte quebrando objeção",
  "painPoints": ["dor 1", "dor 2", "dor 3", "dor 4"],
  "deliverables": [
    {"title": "item 1", "text": "descrição 1"},
    {"title": "item 2", "text": "descrição 2"},
    {"title": "item 3", "text": "descrição 3"}
  ]
}`;

  try {
    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [{ role: "user", content: prompt }],
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const text: string | undefined = data?.choices?.[0]?.message?.content;
    if (!text) return null;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;
    return JSON.parse(jsonMatch[0]);
  } catch {
    return null;
  }
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

        const enriched = await enrichWithAI({
          productName: productName || scrapedInfo?.title,
          audience,
          tone,
          language: LANGUAGES[language]?.name || "Português",
          description: scrapedInfo?.description,
        });

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
        }

        return Response.json({
          scraped,
          language,
          models: baseData.models,
          pageContentDireto: baseData.contentDireto,
          pageContentCenario: baseData.contentCenario,
        });
      },
    },
  },
});
