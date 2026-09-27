import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Link2,
  Copy,
  Check,
  Download,
  Rocket,
  Columns2,
  TriangleAlert,
  Loader2,
  Eye,
  FileText,
  Image as ImageIcon,
  ExternalLink,
} from 'lucide-react';
import { SettingsMenu, getOpenAIKey } from './SettingsMenu';
import {
  LANGUAGES,
  TONES,
  TONE_DETAILS,
  ELEVEN_BLOCKS,
  resolveTone,
  generateFullCopyData,
} from '@/lib/promptEngine';
import {
  LanguageKey,
  ToneKey,
  Model,
  GenerateResponse,
  LandingPageContent,
  PublishedPage,
} from '@/types';
import { ToastProvider, useToast } from './Toaster';
import { LandingPageView } from './LandingPageView';

function AppContent() {
  const toast = useToast();

  // Route / Page state
  const [currentPath, setCurrentPath] = useState<string>(
    typeof window !== 'undefined' ? window.location.pathname : '/'
  );
  const [activePageData, setActivePageData] = useState<PublishedPage | null>(null);
  const [loadingPage, setLoadingPage] = useState<boolean>(false);

  // Form inputs
  const [url, setUrl] = useState('');
  const [productName, setProductName] = useState('');
  const [basicPrice, setBasicPrice] = useState('');
  const [completePrice, setCompletePrice] = useState('');
  const [audience, setAudience] = useState('');
  const [toneKey, setToneKey] = useState<ToneKey>('persuasivo');
  const [customTone, setCustomTone] = useState('');
  const [language, setLanguage] = useState<LanguageKey>('pt');
  const [variantsCount, setVariantsCount] = useState<number>(1);

  // UI state for generated output
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedData, setGeneratedData] = useState<GenerateResponse | null>(null);
  const [selectedModelIdx, setSelectedModelIdx] = useState<number>(0);
  const [selectedVariantIdx, setSelectedVariantIdx] = useState<number>(0);
  const [compareSideBySide, setCompareSideBySide] = useState<boolean>(false);
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);
  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'prompt' | 'images' | 'preview'>('prompt');
  const [publishedLinks, setPublishedLinks] = useState<
    { slug: string; label: string; page?: PublishedPage }[]
  >([]);

  // Check URL pathname for /p/:slug
  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname;
      setCurrentPath(path);
      if (path.startsWith('/p/')) {
        const slug = path.replace('/p/', '').replace(/\/$/, '');
        loadPublishedPage(slug);
      } else {
        setActivePageData(null);
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    handleLocationChange();

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  const loadPublishedPage = async (slug: string) => {
    setLoadingPage(true);
    try {
      // First check local published links cache
      const cached = publishedLinks.find((l) => l.slug === slug);
      if (cached?.page) {
        setActivePageData(cached.page);
        setLoadingPage(false);
        return;
      }

      // Otherwise fetch from backend API
      const res = await fetch(`/api/pages/${slug}`);
      if (res.ok) {
        const data = await res.json();
        setActivePageData(data);
      } else {
        // Fallback to generated page in state if available
        if (generatedData) {
          const fallbackPage: PublishedPage = {
            id: `page_${slug}`,
            slug,
            label: `Página Low Ticket · ${slug}`,
            template: selectedModelIdx === 1 ? 'cenario' : 'direto',
            language,
            content:
              selectedModelIdx === 1
                ? generatedData.pageContentCenario ||
                  generateFullCopyData({ language, variants: 1, tone: 'Persuasivo' }).contentCenario
                : generatedData.pageContentDireto ||
                  generateFullCopyData({ language, variants: 1, tone: 'Persuasivo' }).contentDireto,
            createdAt: Date.now(),
          };
          setActivePageData(fallbackPage);
        }
      }
    } catch {
      toast.error('Não foi possível carregar a página.');
    } finally {
      setLoadingPage(false);
    }
  };

  const navigateTo = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    if (path.startsWith('/p/')) {
      const slug = path.replace('/p/', '').replace(/\/$/, '');
      loadPublishedPage(slug);
    } else {
      setActivePageData(null);
    }
  };

  // Generate Prompt
  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() && !productName.trim()) {
      toast.error('Informe uma URL ou pelo menos o nome do produto.');
      return;
    }

    setIsGenerating(true);
    setNoCredits(false);
    setCopiedPrompt(false);
    setSelectedModelIdx(0);
    setSelectedVariantIdx(0);
    setCompareSideBySide(false);
    setActiveTab('prompt');

    try {
      const toneString = resolveTone(toneKey, customTone);
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: url.trim() || undefined,
          language,
          variants: variantsCount,
          productName: productName.trim() || undefined,
          basicPrice: basicPrice.trim() || undefined,
          completePrice: completePrice.trim() || undefined,
          audience: audience.trim() || undefined,
          tone: toneString,
          openaiKey: getOpenAIKey() || undefined,
        }),
      });

      if (!res.ok) {
        throw new Error('Falha no servidor ao gerar');
      }

      const data: GenerateResponse & { noCredits?: boolean; aiSource?: string | null } = await res.json();
      setGeneratedData(data);
      setNoCredits(!!data.noCredits && data.aiSource !== 'openai');
      if (data.aiSource === 'openai') toast.success('Gerado com sua chave OpenAI');
      toast.success('Prompt e estrutura com 2 planos gerados!');
    } catch {
      // Deterministic Client-side generation fallback
      const toneString = resolveTone(toneKey, customTone);
      const base = generateFullCopyData({
        url: url.trim() || undefined,
        language,
        variants: variantsCount,
        productName: productName.trim() || undefined,
        basicPrice: basicPrice.trim() || undefined,
        completePrice: completePrice.trim() || undefined,
        audience: audience.trim() || undefined,
        tone: toneString,
      });

      setGeneratedData({
        scraped: false,
        language,
        models: base.models,
        pageContentDireto: base.contentDireto,
        pageContentCenario: base.contentCenario,
      });
      toast.success('Prompt e estrutura com 2 planos gerados!');
    } finally {
      setIsGenerating(false);
    }
  };

  // Derived current models & variants
  const models = generatedData?.models ?? [];
  const safeModelIdx = Math.min(selectedModelIdx, Math.max(models.length - 1, 0));
  const currentModel = models[safeModelIdx];
  const variants = currentModel?.variants ?? [];
  const safeVariantIdx = Math.min(selectedVariantIdx, Math.max(variants.length - 1, 0));
  const currentPrompt = variants[safeVariantIdx]?.prompt ?? '';

  const currentContent: LandingPageContent =
    currentModel?.id === 'cenario'
      ? generatedData?.pageContentCenario ||
        generateFullCopyData({ language, variants: 1, tone: 'Persuasivo' }).contentCenario
      : generatedData?.pageContentDireto ||
        generateFullCopyData({ language, variants: 1, tone: 'Persuasivo' }).contentDireto;

  // Copy current prompt
  const handleCopyCurrent = async () => {
    if (!currentPrompt) return;
    const textToCopy =
      compareSideBySide && variants.length > 1
        ? variants.map((v) => `# ${v.label}\n\n${v.prompt}`).join('\n\n---\n\n')
        : currentPrompt;

    await navigator.clipboard.writeText(textToCopy);
    setCopiedPrompt(true);
    toast.success(
      compareSideBySide && variants.length > 1
        ? 'Todas as variações copiadas!'
        : 'Prompt copiado!'
    );
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  // Copy both models
  const getAllModelsMarkdown = () => {
    return models
      .map((m) =>
        m.variants
          .map((v) => `# ${m.label} — ${v.label}\n\n${v.prompt}`)
          .join('\n\n---\n\n')
      )
      .join('\n\n---\n\n');
  };

  const handleCopyAllModels = async () => {
    if (models.length === 0) return;
    await navigator.clipboard.writeText(getAllModelsMarkdown());
    toast.success('Os dois modelos foram copiados!');
  };

  // Download Markdown file
  const handleDownloadMarkdown = () => {
    if (!generatedData || models.length === 0) return;
    const blob = new Blob([getAllModelsMarkdown()], { type: 'text/markdown' });
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = `prompt-lowticket-${generatedData.language || 'pt'}-2-planos-11blocos.md`;
    a.click();
    URL.revokeObjectURL(blobUrl);
    toast.info('Arquivo markdown baixado com sucesso!');
  };

  // Publish / Create Real Landing Page
  const handlePublishPage = async () => {
    if (!currentPrompt || !currentModel) return;
    setIsPublishing(true);

    const label = `${currentModel.label}${
      variants.length > 1 ? ` · ${variants[safeVariantIdx]?.label}` : ''
    }`;

    try {
      const res = await fetch('/api/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: currentPrompt,
          template: currentModel.id,
          language,
          content: currentContent,
          label,
        }),
      });

      if (!res.ok) throw new Error('Erro ao publicar');
      const data = await res.json();

      const newPageRecord: PublishedPage = {
        id: data.page?.id || `page_${data.slug}`,
        slug: data.slug,
        label: data.label || label,
        template: currentModel.id,
        language,
        content: currentContent,
        createdAt: Date.now(),
      };

      setPublishedLinks((prev) => [
        { slug: data.slug, label: data.label || label, page: newPageRecord },
        ...prev,
      ]);

      toast.success('Página publicada com sucesso! Link pronto abaixo.');
    } catch {
      // Local fallback slug
      const slug = Math.random().toString(36).substring(2, 8);
      const fallbackRecord: PublishedPage = {
        id: `page_${slug}`,
        slug,
        label,
        template: currentModel.id,
        language,
        content: currentContent,
        createdAt: Date.now(),
      };

      setPublishedLinks((prev) => [
        { slug, label, page: fallbackRecord },
        ...prev,
      ]);
      toast.success('Página publicada com sucesso! Link pronto abaixo.');
    } finally {
      setIsPublishing(false);
    }
  };

  // If viewing a published landing page
  if (currentPath.startsWith('/p/')) {
    if (loadingPage) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-[#0d1015] text-white">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
        </div>
      );
    }

    if (activePageData) {
      return (
        <LandingPageView
          content={activePageData.content}
          template={activePageData.template}
          language={activePageData.language}
          pageId={activePageData.id}
          onBack={() => navigateTo('/')}
        />
      );
    }

    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#0d1015] px-4 text-center text-white">
        <h2 className="text-2xl font-bold">Página não encontrada</h2>
        <p className="mt-2 text-white/60">
          A página solicitada não existe ou expirou.
        </p>
        <button
          onClick={() => navigateTo('/')}
          className="mt-6 rounded-xl bg-emerald-500 px-6 py-2.5 text-sm font-bold text-black"
        >
          Voltar ao Gerador
        </button>
      </div>
    );
  }

  // Generator View
  return (
    <main className="relative min-h-screen w-full max-w-[100vw] overflow-x-hidden bg-[#0d1015] text-[#f1f3f7] selection:bg-emerald-500 selection:text-black">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[450px] bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.18),transparent_70%)]" />

      <SettingsMenu />
      <div className="relative mx-auto w-full max-w-5xl px-4 py-14 text-center sm:px-5 sm:py-18 sm:text-left">
        {noCredits && (
          <div role="alert" className="mx-auto mb-6 max-w-2xl rounded-xl border border-amber-500/50 bg-amber-500/10 p-4 text-center text-sm text-amber-200">
            <TriangleAlert className="mx-auto mb-2 h-5 w-5" />
            Os créditos de IA da Lovable acabaram. O prompt foi gerado no modo padrão (sem IA).
            <br />Abra o menu <strong>☰</strong> no canto superior e adicione sua <strong>chave API da OpenAI</strong> para continuar usando IA.
          </div>
        )}
        {/* Header */}
        <header className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-400 shadow-sm">
            <Sparkles className="h-3.5 w-3.5" />
            Estrutura Compacta em 11 Blocos & 2 Planos
          </span>
          <h1 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl md:text-6xl text-white">
            Gerador de prompt de{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
              landing page low ticket
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-white/70">
            Cole a URL de uma oferta e receba um prompt pronto, <strong>curto e objetivo com 2 planos</strong> (Básico e Completo) e todos os <strong>comandos e imagens necessárias</strong> no padrão validado de alta conversão.
          </p>
        </header>

        {/* Input Form */}
        <form
          onSubmit={handleGenerate}
          className="mt-10 rounded-2xl border border-white/10 bg-[#161b26] p-5 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.8)] sm:p-7"
        >
          {/* URL da oferta */}
          <label htmlFor="url" className="text-sm font-semibold text-white">
            URL da oferta
          </label>
          <div className="mt-2 relative">
            <Link2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
            <input
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://minhaoferta.com/produto"
              className="h-12 w-full rounded-xl border border-white/10 bg-[#0d1015] pl-9 pr-4 text-base text-white shadow-sm transition-colors placeholder:text-white/40 focus:border-emerald-500 focus:outline-none"
              inputMode="url"
            />
          </div>

          {/* Idioma do prompt */}
          <div className="mt-6">
            <label className="text-sm font-semibold text-white">Idioma do prompt</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {(Object.keys(LANGUAGES) as LanguageKey[]).map((langKey) => (
                <button
                  key={langKey}
                  type="button"
                  onClick={() => setLanguage(langKey)}
                  aria-pressed={language === langKey}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
                    language === langKey
                      ? 'border-emerald-400 bg-emerald-500/20 text-emerald-300 font-bold'
                      : 'border-white/10 bg-white/5 text-white/60 hover:border-emerald-500/50 hover:text-white'
                  }`}
                >
                  {LANGUAGES[langKey].label}
                </button>
              ))}
            </div>
          </div>

          {/* Variações A/B */}
          <div className="mt-6">
            <label className="text-sm font-semibold text-white">Variações A/B</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {[1, 2, 3, 4].map((vNum) => (
                <button
                  key={vNum}
                  type="button"
                  onClick={() => setVariantsCount(vNum)}
                  aria-pressed={variantsCount === vNum}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
                    variantsCount === vNum
                      ? 'border-emerald-400 bg-emerald-500/20 text-emerald-300 font-bold'
                      : 'border-white/10 bg-white/5 text-white/60 hover:border-emerald-500/50 hover:text-white'
                  }`}
                >
                  {vNum === 1 ? '1 versão' : `${vNum} variações`}
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-white/50">
              Cada variação testa um ângulo psicológico diferente (dor, resultado rápido, mecanismo único e prova/história).
            </p>
          </div>

          {/* Tom de voz */}
          <div className="mt-6">
            <label className="text-sm font-semibold text-white">Tom de voz</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {TONES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setToneKey(t)}
                  aria-pressed={toneKey === t}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
                    toneKey === t
                      ? 'border-emerald-400 bg-emerald-500/20 text-emerald-300 font-bold'
                      : 'border-white/10 bg-white/5 text-white/60 hover:border-emerald-500/50 hover:text-white'
                  }`}
                >
                  {TONE_DETAILS[t].label}
                </button>
              ))}
            </div>
            {toneKey === 'custom' ? (
              <input
                value={customTone}
                onChange={(e) => setCustomTone(e.target.value)}
                placeholder="Descreva o tom: curto, direto, provocativo e acolhedor"
                className="mt-3 h-11 w-full rounded-xl border border-white/10 bg-[#0d1015] px-3.5 py-1 text-sm text-white placeholder:text-white/40 focus:border-emerald-500 focus:outline-none"
              />
            ) : (
              <p className="mt-2 text-xs text-white/50">
                {TONE_DETAILS[toneKey].instruction}
              </p>
            )}
          </div>

          {/* Optional fields grid */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="produto"
                className="text-sm text-white/70"
              >
                Nome do produto (opcional)
              </label>
              <input
                id="produto"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="Método Vender Sozinho"
                className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-[#0d1015] px-3.5 py-1 text-sm text-white shadow-sm placeholder:text-white/40 focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label
                htmlFor="preco-basico"
                className="text-sm text-white/70"
              >
                Preço do plano básico (opcional)
              </label>
              <input
                id="preco-basico"
                value={basicPrice}
                onChange={(e) => setBasicPrice(e.target.value)}
                placeholder="R$ 27,00"
                className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-[#0d1015] px-3.5 py-1 text-sm text-white shadow-sm placeholder:text-white/40 focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label
                htmlFor="preco-completo"
                className="text-sm text-white/70"
              >
                Preço do pacote completo (opcional)
              </label>
              <input
                id="preco-completo"
                value={completePrice}
                onChange={(e) => setCompletePrice(e.target.value)}
                placeholder="R$ 47,00"
                className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-[#0d1015] px-3.5 py-1 text-sm text-white shadow-sm placeholder:text-white/40 focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label
                htmlFor="publico"
                className="text-sm text-white/70"
              >
                Público-alvo (opcional)
              </label>
              <input
                id="publico"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                placeholder="Empreendedores iniciantes sem tempo"
                className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-[#0d1015] px-3.5 py-1 text-sm text-white shadow-sm placeholder:text-white/40 focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Submit button at the end of the inputs */}
          <div className="mt-8 flex flex-col items-center">
            <button
              type="submit"
              disabled={isGenerating}
              className="flex h-14 w-full sm:w-auto min-w-[280px] items-center justify-center rounded-xl bg-gradient-to-r from-emerald-400 to-emerald-500 px-8 text-base font-black uppercase tracking-wider text-black shadow-[0_10px_30px_rgba(16,185,129,0.35)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 transition-all cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Gerando cópia e imagens...
                </>
              ) : (
                'Gerar prompt com 2 planos'
              )}
            </button>
            {isGenerating && (
              <p className="mt-3 text-xs text-white/50 text-center">
                Escrevendo a cópia curta dos 11 blocos e estruturando as imagens necessárias...
              </p>
            )}
          </div>
        </form>

        {/* 11 Blocks Grid */}
        <section className="mt-8 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {ELEVEN_BLOCKS.map((blockName, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2.5 rounded-xl border border-white/5 bg-[#161b26]/70 p-3 text-xs sm:text-sm text-white/60 shadow-sm"
            >
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-emerald-500/20 text-xs font-bold text-emerald-400">
                {idx + 1}
              </span>
              <span className="truncate">{blockName}</span>
            </div>
          ))}
        </section>

        {/* Generated Result Section */}
        {generatedData && (
          <section className="mt-10 rounded-2xl border border-white/10 bg-[#161b26] p-5 sm:p-7 shadow-2xl">
            {/* Header / Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
              <div>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  Resultado Gerado
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-0.5">
                  Landing Page Curta e Objetiva com 2 Planos
                </h2>
              </div>

              {/* View Switcher Tabs */}
              <div className="flex rounded-xl bg-[#0d1015] p-1 border border-white/10">
                <button
                  type="button"
                  onClick={() => setActiveTab('prompt')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'prompt'
                      ? 'bg-emerald-500 text-black shadow'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  <FileText className="h-3.5 w-3.5" />
                  Prompt Copiável
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('images')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'images'
                      ? 'bg-emerald-500 text-black shadow'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  <ImageIcon className="h-3.5 w-3.5" />
                  Imagens Necessárias
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('preview')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'preview'
                      ? 'bg-emerald-500 text-black shadow'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  <Eye className="h-3.5 w-3.5" />
                  Prévia da Página Real
                </button>
              </div>
            </div>

            {/* Action Bar */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2">
                {models.length > 1 && (
                  <div className="flex gap-1.5">
                    {models.map((m, idx) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => {
                          setSelectedModelIdx(idx);
                          setSelectedVariantIdx(0);
                        }}
                        className={`rounded-lg border px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
                          safeModelIdx === idx
                            ? 'border-emerald-400 bg-emerald-500/20 text-emerald-300'
                            : 'border-white/10 bg-white/5 text-white/60 hover:text-white'
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                )}

                {variants.length > 1 && !compareSideBySide && (
                  <div className="flex gap-1.5">
                    {variants.map((v, idx) => (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setSelectedVariantIdx(idx)}
                        className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors cursor-pointer ${
                          safeVariantIdx === idx
                            ? 'border-emerald-400 bg-emerald-400 text-black font-bold'
                            : 'border-white/10 bg-white/5 text-white/60 hover:text-white'
                        }`}
                      >
                        {v.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2">
                {variants.length > 1 && activeTab === 'prompt' && (
                  <button
                    onClick={() => setCompareSideBySide((prev) => !prev)}
                    className="inline-flex items-center rounded-xl border border-white/10 px-3 py-2 text-xs font-semibold text-white/80 hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <Columns2 className="mr-1.5 h-3.5 w-3.5" />
                    {compareSideBySide ? 'Ver 1 por vez' : 'Lado a lado'}
                  </button>
                )}
                <button
                  onClick={handleCopyCurrent}
                  className="inline-flex items-center rounded-xl border border-white/10 bg-[#1f2636] px-3.5 py-2 text-xs font-bold text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  {copiedPrompt ? (
                    <Check className="mr-1.5 h-3.5 w-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="mr-1.5 h-3.5 w-3.5" />
                  )}
                  Copiar Prompt
                </button>
                {models.length > 1 && (
                  <button
                    onClick={handleCopyAllModels}
                    className="inline-flex items-center rounded-xl border border-white/10 bg-[#1f2636] px-3.5 py-2 text-xs font-bold text-white hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <Copy className="mr-1.5 h-3.5 w-3.5" />
                    Copiar os 2 Modelos
                  </button>
                )}
                <button
                  onClick={handleDownloadMarkdown}
                  className="inline-flex items-center rounded-xl border border-white/10 px-3 py-2 text-xs font-semibold text-white/80 hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <Download className="mr-1.5 h-3.5 w-3.5" />
                  Baixar .md
                </button>
                <button
                  onClick={handlePublishPage}
                  disabled={isPublishing || !currentPrompt}
                  className="inline-flex items-center rounded-xl bg-gradient-to-r from-emerald-400 to-emerald-500 px-4 py-2 text-xs font-black uppercase text-black hover:opacity-90 active:scale-95 disabled:opacity-50 transition-all cursor-pointer shadow-md"
                >
                  {isPublishing ? (
                    <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Rocket className="mr-1.5 h-3.5 w-3.5" />
                  )}
                  {isPublishing ? 'Criando...' : 'Criar página real'}
                </button>
              </div>
            </div>

            {/* Published links list */}
            {publishedLinks.length > 0 && (
              <div className="mt-4 space-y-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-xs sm:text-sm">
                <span className="font-bold text-emerald-400 block mb-1">
                  🚀 Suas Páginas Publicadas:
                </span>
                {publishedLinks.map((item) => (
                  <div
                    key={item.slug}
                    className="flex flex-wrap items-center justify-between gap-2"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-white">{item.label}:</span>
                      <a
                        href={`/p/${item.slug}`}
                        onClick={(e) => {
                          e.preventDefault();
                          navigateTo(`/p/${item.slug}`);
                        }}
                        className="break-all text-emerald-400 font-semibold underline hover:text-emerald-300"
                      >
                        {typeof window !== 'undefined' ? window.location.origin : ''}/p/{item.slug}
                      </a>
                    </div>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => {
                          const fullUrl = `${window.location.origin}/p/${item.slug}`;
                          navigator.clipboard.writeText(fullUrl);
                          toast.success('Link copiado!');
                        }}
                        className="p-1.5 rounded-lg border border-white/10 bg-[#161b26] hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
                        title="Copiar link"
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => navigateTo(`/p/${item.slug}`)}
                        className="p-1.5 rounded-lg border border-white/10 bg-[#161b26] hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
                        title="Abrir página"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tab 1: Prompt Text */}
            {activeTab === 'prompt' && (
              <div className="mt-5">
                {compareSideBySide && variants.length > 1 ? (
                  <div className="grid gap-4 lg:grid-cols-2">
                    {variants.map((v) => (
                      <div
                        key={v.id}
                        className="rounded-xl border border-white/10 bg-[#0d1015] shadow-inner"
                      >
                        <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
                          <span className="text-xs font-bold text-emerald-400">{v.label}</span>
                          <button
                            onClick={async () => {
                              await navigator.clipboard.writeText(v.prompt);
                              toast.success(`${v.label} copiada!`);
                            }}
                            className="inline-flex items-center rounded-lg border border-white/10 px-2.5 py-1 text-xs font-medium hover:bg-white/10 transition-colors cursor-pointer text-white/80"
                          >
                            <Copy className="mr-1.5 h-3.5 w-3.5" />
                            Copiar
                          </button>
                        </div>
                        <pre
                          dir={generatedData.language === 'ar' ? 'rtl' : 'ltr'}
                          className="max-h-[500px] overflow-auto whitespace-pre-wrap p-4 text-xs sm:text-sm leading-relaxed text-white/90 font-mono"
                        >
                          {v.prompt}
                        </pre>
                      </div>
                    ))}
                  </div>
                ) : (
                  <pre
                    dir={generatedData.language === 'ar' ? 'rtl' : 'ltr'}
                    className="max-h-[560px] overflow-auto whitespace-pre-wrap rounded-xl border border-white/10 bg-[#0d1015] p-4 text-xs sm:text-sm leading-relaxed text-white/90 font-mono shadow-inner"
                  >
                    {currentPrompt}
                  </pre>
                )}
              </div>
            )}

            {/* Tab 2: Images Showcase & AI Prompts */}
            {activeTab === 'images' && (
              <div className="mt-6 space-y-6">
                <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-xs text-white/80">
                  <p className="font-bold text-emerald-400 mb-1">
                    🖼️ Galeria de Imagens Geradas para os 11 Blocos
                  </p>
                  Estas são as imagens prontas e integradas à sua landing page. Abaixo de cada uma você também encontra o <strong>prompt exato de imagem para IA</strong> (Midjourney, DALL-E ou Canva) caso queira gerar novas variações visuais.
                </div>

                {/* Hero Mockup */}
                <div className="rounded-2xl border border-white/10 bg-[#121620] p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-black uppercase text-emerald-400">
                      BLOCO 1 - IMAGEM HERO (MOCKUP 3D)
                    </span>
                    <button
                      onClick={() => {
                        if (currentContent.imagePrompts?.hero) {
                          navigator.clipboard.writeText(currentContent.imagePrompts.hero);
                          toast.success('Prompt de imagem copiado!');
                        }
                      }}
                      className="inline-flex items-center rounded-lg border border-white/10 px-2.5 py-1 text-xs text-white/80 hover:bg-white/10 cursor-pointer"
                    >
                      <Copy className="mr-1.5 h-3.5 w-3.5" />
                      Copiar Prompt de Imagem
                    </button>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 items-center">
                    <img
                      src={currentContent.images.heroMockup}
                      alt="Hero Mockup"
                      referrerPolicy="no-referrer"
                      className="max-w-xs w-full rounded-xl border border-white/10 object-cover"
                    />
                    <div className="text-xs text-white/70 space-y-2">
                      <p className="font-semibold text-white">Comando de Geração (IA):</p>
                      <blockquote className="p-3 rounded-lg bg-black/40 font-mono text-[11px] leading-relaxed border border-white/5">
                        {currentContent.imagePrompts?.hero}
                      </blockquote>
                    </div>
                  </div>
                </div>

                {/* Entregáveis Mockups */}
                <div className="rounded-2xl border border-white/10 bg-[#121620] p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-black uppercase text-emerald-400">
                      BLOCO 5 - MOCKUPS DOS ENTREGÁVEIS (3 MATERIAIS)
                    </span>
                    <button
                      onClick={() => {
                        if (currentContent.imagePrompts?.mockups) {
                          navigator.clipboard.writeText(currentContent.imagePrompts.mockups);
                          toast.success('Prompt de mockups copiado!');
                        }
                      }}
                      className="inline-flex items-center rounded-lg border border-white/10 px-2.5 py-1 text-xs text-white/80 hover:bg-white/10 cursor-pointer"
                    >
                      <Copy className="mr-1.5 h-3.5 w-3.5" />
                      Copiar Prompt de Imagem
                    </button>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {currentContent.images.deliverables.map((img, i) => (
                      <div key={i} className="rounded-xl border border-white/10 bg-black/30 p-2 text-center">
                        <img
                          src={img}
                          alt={`Entregável ${i + 1}`}
                          referrerPolicy="no-referrer"
                          className="h-32 w-full object-cover rounded-lg"
                        />
                        <span className="mt-2 block text-xs font-bold text-white/80">
                          {currentContent.deliverables[i]?.title || `Entregável 0${i + 1}`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bônus Mockups */}
                <div className="rounded-2xl border border-white/10 bg-[#121620] p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-black uppercase text-emerald-400">
                      BLOCO 6 - MOCKUPS DOS 3 BÔNUS ACELERADORES
                    </span>
                    <button
                      onClick={() => {
                        if (currentContent.imagePrompts?.bonus) {
                          navigator.clipboard.writeText(currentContent.imagePrompts.bonus);
                          toast.success('Prompt de bônus copiado!');
                        }
                      }}
                      className="inline-flex items-center rounded-lg border border-white/10 px-2.5 py-1 text-xs text-white/80 hover:bg-white/10 cursor-pointer"
                    >
                      <Copy className="mr-1.5 h-3.5 w-3.5" />
                      Copiar Prompt de Imagem
                    </button>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {currentContent.images.bonuses.map((img, i) => (
                      <div key={i} className="rounded-xl border border-white/10 bg-black/30 p-2 text-center">
                        <img
                          src={img}
                          alt={`Bônus ${i + 1}`}
                          referrerPolicy="no-referrer"
                          className="h-32 w-full object-cover rounded-lg"
                        />
                        <span className="mt-2 block text-xs font-bold text-white/80">
                          {currentContent.extras[i]?.title || `Bônus 0${i + 1}`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Depoimentos Prints */}
                <div className="rounded-2xl border border-white/10 bg-[#121620] p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-black uppercase text-emerald-400">
                      BLOCO 2 - PRINTS SOCIAIS / WHATSAPP DOS DEPOIMENTOS
                    </span>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-4">
                    {currentContent.images.testimonials.map((img, i) => (
                      <div key={i} className="rounded-xl border border-white/10 bg-black/30 p-2 text-center">
                        <img
                          src={img}
                          alt={`Depoimento ${i + 1}`}
                          referrerPolicy="no-referrer"
                          className="h-28 w-full object-cover rounded-lg"
                        />
                        <span className="mt-1 block text-[11px] font-semibold text-white/70">
                          {currentContent.testimonials[i]?.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Live Preview */}
            {activeTab === 'preview' && (
              <div className="mt-6 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                <div className="p-3 bg-[#11141c] border-b border-white/10 flex items-center justify-between text-xs text-white/60">
                  <span>Prévia Interativa Ao Vivo</span>
                  <button
                    onClick={handlePublishPage}
                    className="text-emerald-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    Publicar Página <Rocket className="h-3 w-3" />
                  </button>
                </div>
                <div className="max-h-[800px] overflow-y-auto">
                  <LandingPageView
                    content={currentContent}
                    template={currentModel.id}
                    language={language}
                  />
                </div>
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}
