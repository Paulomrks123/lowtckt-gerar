import { createFileRoute } from "@tanstack/react-router";
import { leads } from "@/lib/pageStore.server";

export const Route = createFileRoute("/api/leads")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { pageId, plan, name, email, phone } = await request.json();
        if (!name || !email) {
          return Response.json({ error: "Nome e e-mail são obrigatórios" }, { status: 400 });
        }
        leads.push({ pageId, plan, name, email, phone, timestamp: Date.now() });
        return Response.json({ success: true, message: "Dados gravados com sucesso" });
      },
    },
  },
});
