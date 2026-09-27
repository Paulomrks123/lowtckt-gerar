import { createFileRoute } from "@tanstack/react-router";
import PromptApp from "@/components/PromptApp";

export const Route = createFileRoute("/p/$slug")({
  head: () => ({
    meta: [
      { title: "Página Low Ticket | Oferta em 11 Blocos" },
      {
        name: "description",
        content:
          "Página de vendas low ticket publicada com a estrutura completa de 11 blocos de alta conversão.",
      },
      { property: "og:title", content: "Página Low Ticket | Oferta em 11 Blocos" },
      {
        property: "og:description",
        content: "Oferta low ticket com prova social, entregáveis, bônus, planos e garantia.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PromptApp,
});
