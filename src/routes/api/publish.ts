import { createFileRoute } from "@tanstack/react-router";
import { generateFullCopyData } from "@/lib/promptEngine";
import { publishedPages } from "@/lib/pageStore.server";
import type { PublishedPage } from "@/types";

export const Route = createFileRoute("/api/publish")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { template = "direto", language = "pt", content, label } = await request.json();

        const slug = Math.random().toString(36).substring(2, 8);
        const id = `page_${Date.now()}_${slug}`;

        let finalContent = content;
        if (!finalContent) {
          const generated = generateFullCopyData({
            language,
            variants: 1,
            tone: "Persuasivo",
          });
          finalContent = template === "cenario" ? generated.contentCenario : generated.contentDireto;
        }

        const pageRecord: PublishedPage = {
          id,
          slug,
          label: label || `Página Low Ticket · ${slug}`,
          template,
          language,
          content: finalContent,
          createdAt: Date.now(),
        };

        publishedPages.set(slug, pageRecord);

        return Response.json({ slug, label: pageRecord.label, page: pageRecord });
      },
    },
  },
});
