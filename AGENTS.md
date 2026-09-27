<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Project rules

- Páginas publicadas e leads ficam em memória no servidor (`src/lib/pageStore.server.ts`), pois não há banco de dados configurado; somem ao reiniciar o servidor.
- A geração de copy usa o Lovable AI Gateway (`google/gemini-3-flash-preview`) com fallback determinístico em `src/lib/promptEngine.ts`, para o app funcionar mesmo sem IA.
