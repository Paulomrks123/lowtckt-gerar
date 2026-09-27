import { createFileRoute } from "@tanstack/react-router";
import { publishedPages } from "@/lib/pageStore.server";

export const Route = createFileRoute("/api/pages/$slug")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const page = publishedPages.get(params.slug);
        if (!page) {
          return Response.json({ error: "Página não encontrada" }, { status: 404 });
        }
        return Response.json(page);
      },
    },
  },
});
