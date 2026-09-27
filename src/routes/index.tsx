import { createFileRoute } from "@tanstack/react-router";
import PromptApp from "@/components/PromptApp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Gerador de Prompt Low Ticket | Landing Page em 11 Blocos" },
      {
        name: "description",
        content:
          "Cole a URL de uma oferta e receba um prompt pronto, altamente persuasivo, com a estrutura completa de 11 blocos de uma landing page low ticket.",
      },
      { property: "og:title", content: "Gerador de Prompt de Landing Page Low Ticket" },
      {
        property: "og:description",
        content:
          "Prompts prontos e páginas publicáveis com a estrutura completa de 11 blocos para ofertas low ticket.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PromptApp,
});
