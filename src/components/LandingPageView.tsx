import React, { useState } from 'react';
import {
  LandingPageContent,
  LanguageKey,
} from '@/types';
import {
  ShieldCheck,
  Star,
  X,
  Check,
  ArrowLeft,
  Loader2,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { useToast } from './Toaster';

interface LandingPageViewProps {
  content: LandingPageContent;
  template: 'direto' | 'cenario';
  language?: LanguageKey;
  pageId?: string;
  onBack?: () => void;
}

export function LandingPageView({
  content: c,
  template,
  language = 'pt',
  pageId = 'preview',
  onBack,
}: LandingPageViewProps) {
  const isArabic = language === 'ar';
  const isCenario = template === 'cenario';

  return (
    <div
      dir={isArabic ? 'rtl' : 'ltr'}
      className="lp-experience min-h-screen bg-[#4A0A0A] text-[#f1f3f7] selection:bg-emerald-500 selection:text-black font-sans antialiased"
    >
      {/* Top Preview Banner (if back handler is present) */}
      {onBack && (
        <div className="sticky top-0 z-50 flex items-center justify-between border-b border-white/10 bg-[#571010]/95 px-4 py-2.5 backdrop-blur">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar ao Gerador de Prompt
          </button>
          <span className="text-xs text-white/70 font-medium">
            Visualização: Estrutura Curta & Objetiva com 2 Planos (Estilo appstudio-pro)
          </span>
        </div>
      )}

      {isCenario && c.urgency && (
        <div className="bg-gradient-to-r from-emerald-600 to-teal-500 px-4 py-2 text-center text-sm font-black uppercase tracking-wider text-black shadow-md">
          {c.urgency}
        </div>
      )}

      {/* Render the 11 Blocks */}
      <LandingPageBlocks c={c} pageId={pageId} isCenario={isCenario} />
    </div>
  );
}

const scrollToBuy = () => {
  document.getElementById('comprar')?.scrollIntoView({ behavior: 'smooth' });
};

function BlockBadge({ label }: { label: string }) {
  return (
    <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-emerald-400 shadow-sm">
      <Sparkles className="h-3 w-3" />
      {label}
    </div>
  );
}

function CTAButton({ label }: { label: string }) {
  return (
    <button
      onClick={scrollToBuy}
      className="inline-flex h-14 items-center justify-center rounded-xl bg-gradient-to-r from-emerald-400 to-emerald-500 px-8 text-base font-black uppercase tracking-wide text-black shadow-[0_10px_30px_rgba(16,185,129,0.35)] transition-all hover:scale-[1.03] hover:shadow-[0_15px_40px_rgba(16,185,129,0.5)] active:scale-[0.98] cursor-pointer"
    >
      {label}
    </button>
  );
}

function Section({
  id,
  children,
  muted,
}: {
  id?: string;
  children: React.ReactNode;
  muted?: boolean;
}) {
  return (
    <section
      id={id}
      className={`px-5 py-16 sm:py-20 border-b border-white/5 ${
        muted ? 'bg-[#551010]' : 'bg-[#4A0A0A]'
      }`}
    >
      <div className="mx-auto max-w-5xl">{children}</div>
    </section>
  );
}

function LandingPageBlocks({
  c,
  pageId,
  isCenario,
}: {
  c: LandingPageContent;
  pageId: string;
  isCenario: boolean;
}) {
  return (
    <>
      {/* BLOCO 1 - VENDER SOZINHO (Hero) */}
      <header className="relative px-5 pt-12 pb-16 sm:pb-24 text-center overflow-hidden border-b border-white/5">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-[radial-gradient(ellipse_at_top,rgba(255,132,80,0.20),transparent_70%)]" />

        <div className="relative mx-auto max-w-4xl">
          <BlockBadge label="BLOCO 1 - VENDER SOZINHO" />

          {c.mechanism?.name && (
            <div className="mt-2 mb-3 inline-flex rounded-full border border-amber-400/40 bg-amber-400/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-amber-300">
              ⚙️ {c.mechanism.name}
            </div>
          )}

          <h1 className="mt-2 text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl md:text-6xl text-white">
            {c.headline}
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-white/70 leading-relaxed">
            {c.subheadline}
          </p>

          <div className="mt-8">
            <CTAButton label={c.cta} />
          </div>

          {isCenario && c.badges && (
            <div className="mt-6 flex flex-wrap justify-center gap-2 sm:gap-3 text-xs sm:text-sm font-semibold">
              {c.badges.map((b, idx) => (
                <span
                  key={idx}
                  className="rounded-full border border-white/10 bg-white/10 px-4 py-1.5 text-white/80"
                >
                  {b}
                </span>
              ))}
            </div>
          )}

          {/* Hero 3D Mockup Image */}
          {c.images.heroMockup && (
            <div className="mt-12 flex justify-center">
              <div className="relative rounded-2xl p-2 bg-gradient-to-b from-white/10 to-transparent border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.8)] max-w-2xl w-full">
                <img
                  src={c.images.heroMockup}
                  alt={`${c.productName} Mockup`}
                  referrerPolicy="no-referrer"
                  className="w-full h-auto rounded-xl object-cover"
                />
              </div>
            </div>
          )}
        </div>
      </header>

      {/* BLOCO 2 - DEPOIMENTOS */}
      <Section muted>
        <div className="text-center">
          <BlockBadge label="BLOCO 2 - DEPOIMENTOS" />
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
            {c.testimonialsTitle || 'Veja casos de pessoas que alcançaram resultados reais'}
          </h2>
          <p className="mt-3 text-base text-emerald-400 font-semibold">
            {c.testimonialsSubtitle || `Usando o ${c.productName}`}
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {c.testimonials.map((t, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-white/10 bg-[#5E1212] p-5 shadow-lg flex flex-col justify-between"
            >
              {t.image && (
                <div className="mb-4 overflow-hidden rounded-xl border border-white/10 bg-black/40">
                  <img
                    src={t.image}
                    alt={`Depoimento ${idx + 1}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-auto object-cover hover:scale-105 transition-transform"
                  />
                </div>
              )}
              <div>
                <div className="flex text-amber-400 gap-1 mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-white/80 leading-relaxed italic">
                  "{t.text}"
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/10 text-xs font-bold text-white/70">
                {t.name} {t.city ? `· ${t.city}` : ''}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* BLOCO 3 - AGITAÇÃO */}
      <Section>
        <div className="text-center">
          <BlockBadge label="BLOCO 3 - AGITAÇÃO" />
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white max-w-3xl mx-auto">
            {c.painTitle}
          </h2>
          <p className="mt-3 text-base text-white/70">
            {c.painSubtitle || 'E ver sempre os mesmos resultados frustrantes… Por isso você pensa:'}
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {(c.painThoughts || []).map((pt, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-rose-500/20 bg-[#5A1010] p-5 shadow-md flex items-start gap-4"
            >
              {pt.image && (
                <img
                  src={pt.image}
                  alt={pt.title}
                  referrerPolicy="no-referrer"
                  className="h-16 w-16 sm:h-20 sm:w-20 rounded-xl object-cover shrink-0 border border-white/10"
                />
              )}
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
                  {pt.title}
                </span>
                <p className="mt-1.5 text-sm sm:text-base text-white/90 font-medium leading-relaxed">
                  {pt.text}
                </p>
              </div>
            </div>
          ))}
        </div>

        {c.painClosing && (
          <div className="mt-10 mx-auto max-w-2xl rounded-2xl border border-white/10 bg-[#5E1212] p-6 text-center shadow-lg">
            <h3 className="text-lg sm:text-xl font-bold text-white">Eu sei...</h3>
            <p className="mt-2 text-sm sm:text-base text-emerald-400 font-semibold">
              {c.painClosing}
            </p>
          </div>
        )}
      </Section>

      {c.mechanism && (
        <Section>
          <div className="mx-auto max-w-3xl text-center">
            <BlockBadge label="O MECANISMO ÚNICO" />
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">{c.mechanism.name}</h2>
            <p className="mt-4 text-base sm:text-lg text-white/70 leading-relaxed">{c.mechanism.explanation}</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {c.mechanism.pillars.map((p, i) => (
                <div key={i} className="rounded-2xl border border-emerald-500/30 bg-[#5E1212] p-5">
                  <div className="text-2xl font-extrabold text-emerald-400">{i + 1}</div>
                  <p className="mt-2 text-sm font-semibold text-white">{p}</p>
                </div>
              ))}
            </div>
          </div>
        </Section>
      )}

      {/* BLOCO 4 - PASSO A PASSO */}
      <Section muted>
        <div className="text-center">
          <BlockBadge label="BLOCO 4 - PASSO A PASSO" />
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
            {c.stepsTitle}
          </h2>
          <p className="mt-3 text-base text-white/70">
            {c.stepsSubtitle || 'Passos objetivos para colocar no ar sem travar'}
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {c.steps.map((st, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-white/10 bg-[#5E1212] p-5 shadow-lg flex flex-col justify-between"
            >
              {st.image && (
                <div className="mb-4 overflow-hidden rounded-xl border border-white/10 bg-black/40">
                  <img
                    src={st.image}
                    alt={st.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-32 object-cover hover:scale-105 transition-transform"
                  />
                </div>
              )}
              <div>
                <span className="inline-block rounded-md bg-emerald-500/20 px-2.5 py-1 text-xs font-extrabold text-emerald-400 mb-2">
                  Passo {idx + 1}
                </span>
                <h3 className="text-base font-bold text-white">{st.title}</h3>
                <p className="mt-2 text-xs sm:text-sm text-white/70 leading-relaxed">
                  {st.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* BLOCO 5 - MOCKUPS */}
      <Section>
        <div className="text-center">
          <BlockBadge label="BLOCO 5 - MOCKUPS" />
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
            {c.deliverablesTitle}
          </h2>
          <p className="mt-3 text-base text-emerald-400 font-semibold">
            Materiais práticos prontos para download imediato
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {c.deliverables.map((del, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-white/10 bg-[#5E1212] p-6 shadow-xl flex flex-col justify-between hover:border-emerald-500/50 transition-colors"
            >
              {del.image && (
                <div className="mb-5 overflow-hidden rounded-xl border border-white/10 bg-black/40">
                  <img
                    src={del.image}
                    alt={del.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-44 object-cover hover:scale-105 transition-transform"
                  />
                </div>
              )}
              <div>
                <span className="text-xs font-black uppercase text-emerald-400">
                  ENTREGÁVEL 0{idx + 1}
                </span>
                <h3 className="mt-1 text-lg font-bold text-white">{del.title}</h3>
                <p className="mt-2 text-sm text-white/70 leading-relaxed">
                  {del.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* BLOCO 6 - BÔNUS */}
      <Section muted>
        <div className="text-center">
          <BlockBadge label="BLOCO 6 - BÔNUS" />
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
            {c.extrasTitle}
          </h2>
          <p className="mt-3 text-base text-white/70">
            Aceleradores inclusos gratuitamente no Pacote Completo
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {c.extras.map((ex, idx) => (
            <div
              key={idx}
              className="relative rounded-2xl border-2 border-emerald-500/30 bg-[#5E1212] p-6 shadow-xl flex flex-col justify-between"
            >
              {ex.value && (
                <span className="absolute -top-3 right-4 rounded-full bg-emerald-500 px-3 py-0.5 text-xs font-black uppercase text-black shadow">
                  VALOR: {ex.value}
                </span>
              )}
              {ex.image && (
                <div className="mb-5 overflow-hidden rounded-xl border border-white/10 bg-black/40">
                  <img
                    src={ex.image}
                    alt={ex.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-44 object-cover hover:scale-105 transition-transform"
                  />
                </div>
              )}
              <div>
                <span className="text-xs font-black uppercase text-emerald-400">
                  BÔNUS 0{idx + 1}
                </span>
                <h3 className="mt-1 text-lg font-bold text-white">{ex.title}</h3>
                <p className="mt-2 text-sm text-white/70 leading-relaxed">
                  {ex.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* BLOCO 7 - PARA QUEM É? */}
      <Section>
        <div className="text-center">
          <BlockBadge label="BLOCO 7 - PARA QUEM É?" />
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
            {c.forWhomTitle}
          </h2>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {/* Não é pra você que */}
          <div className="rounded-2xl border border-rose-500/30 bg-[#5A1010] p-6 shadow-lg">
            <h3 className="text-lg font-bold text-rose-400 flex items-center gap-2 mb-4">
              <X className="h-5 w-5" />
              Não é pra você que:
            </h3>
            <ul className="space-y-3">
              {(c.notForWhom ?? []).map((item, idx) => (
                <li key={idx} className="flex gap-2.5 text-sm text-white/80">
                  <X className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* É pra você que */}
          <div className="rounded-2xl border border-emerald-500/30 bg-[#111c18] p-6 shadow-lg">
            <h3 className="text-lg font-bold text-emerald-400 flex items-center gap-2 mb-4">
              <Check className="h-5 w-5" />
              É pra você que:
            </h3>
            <ul className="space-y-3">
              {c.forWhom.map((item, idx) => (
                <li key={idx} className="flex gap-2.5 text-sm text-white/90">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* BLOCO 8 - RECAPTULANDO */}
      <Section muted>
        <div className="text-center">
          <BlockBadge label="BLOCO 8 - RECAPTULANDO" />
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
            {c.stackTitle || 'Veja tudo o que você vai receber:'}
          </h2>
        </div>

        <div className="mx-auto mt-8 max-w-xl rounded-2xl border border-white/10 bg-[#5E1212] p-6 shadow-xl">
          <div className="divide-y divide-white/10">
            {(c.stackItems || []).map((item, idx) => (
              <div key={idx} className="py-3 flex justify-between items-center text-sm">
                <span className="text-white/80 font-medium">{item.title}</span>
                <span className="text-white/70 line-through font-semibold">{item.value}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-emerald-500/30 flex justify-between items-center text-base sm:text-lg font-bold">
            <span className="text-white">TUDO ISSO DEVERIA CUSTAR:</span>
            <span className="text-rose-400 line-through">{c.stackTotalVal || 'R$ 535,00'}</span>
          </div>

          <p className="mt-4 text-center text-sm font-semibold text-emerald-400">
            Mas hoje você vai investir apenas uma fração simbólica...
          </p>
        </div>
      </Section>

      {/* BLOCO 9 - OFERTA (2 PLANOS) */}
      <Section id="comprar">
        <div className="text-center">
          <BlockBadge label="BLOCO 9 - OFERTA" />
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
            INVESTIMENTO
          </h2>
          <p className="mt-2 text-base text-white/70">
            Escolha o plano ideal para você e comece imediatamente:
          </p>
        </div>

        {/* 2 Planos Lado a Lado */}
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {/* Plano Básico */}
          <PricingCard
            plan={c.basicPlan}
            isPopular={false}
            onSelect={() => {
              document.getElementById('form-lead')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }}
          />

          {/* Plano Completo */}
          <PricingCard
            plan={c.completePlan}
            isPopular={true}
            onSelect={() => {
              document.getElementById('form-lead')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }}
          />
        </div>

        {c.offer && (
          <div className="mx-auto mt-8 max-w-2xl rounded-2xl border border-emerald-500/30 bg-[#5E1212] p-6 text-center">
            <p className="text-lg sm:text-xl font-extrabold text-white">{c.offer.promise}</p>
            <p className="mt-2 text-sm text-white/70">
              De <span className="line-through">{c.completePlan.oldPrice}</span> por{' '}
              <span className="font-bold text-emerald-400">{c.completePlan.price}</span>
            </p>
            <p className="mt-3 text-sm font-bold text-amber-300">⏰ {c.offer.reasonToBuyNow}</p>
            <ul className="mt-4 space-y-1 text-left text-sm text-white/70">
              {c.offer.objections.map((o, i) => (
                <li key={i}>✅ {o}</li>
              ))}
            </ul>
            <p className="mt-4 text-sm font-bold text-white">🛡️ {c.guaranteeTitle}</p>
          </div>
        )}

        {c.savings && (
          <p className="mt-6 text-center text-sm sm:text-base font-bold text-emerald-400">
            {c.savings}
          </p>
        )}

        {/* Lead Capture / Order Form */}
        <LeadOrderForm c={c} pageId={pageId} />
      </Section>

      {/* BLOCO 10 - AUTORIDADE */}
      <Section muted>
        <div className="text-center">
          <BlockBadge label="BLOCO 10 - AUTORIDADE" />
        </div>

        <div className="mx-auto max-w-3xl rounded-2xl border border-white/10 bg-[#5E1212] p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-center gap-6">
          <div className="h-28 w-28 sm:h-32 sm:w-32 rounded-2xl overflow-hidden border-2 border-emerald-500/40 bg-black/40 shrink-0">
            <img
              src={c.images.authorImage || c.images.heroMockup}
              alt={c.authorName || 'Autoridade'}
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="text-center sm:text-left">
            <h3 className="text-xl sm:text-2xl font-extrabold text-white">
              {c.authorName || 'Especialista em Low Ticket'}
            </h3>
            <p className="text-sm font-semibold text-emerald-400">
              {c.authorRole || `Criador do ${c.productName}`}
            </p>
            <p className="mt-3 text-sm text-white/70 leading-relaxed">
              {c.authorBio}
            </p>
          </div>
        </div>
      </Section>

      {/* BLOCO 11 - FAQ + GARANTIA + RODAPÉ */}
      <Section>
        <div className="text-center">
          <BlockBadge label="BLOCO 11 - FAQ" />
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
            Dúvidas Frequentes
          </h2>
        </div>

        {/* FAQ Accordion */}
        <div className="mx-auto mt-8 max-w-3xl space-y-3">
          {c.faq.map((item, idx) => (
            <details
              key={idx}
              className="group rounded-xl border border-white/10 bg-[#5E1212] p-4.5 shadow-sm"
            >
              <summary className="cursor-pointer font-bold list-none flex items-center justify-between text-white text-base">
                <span>{item.q}</span>
                <ChevronDown className="h-5 w-5 text-emerald-400 group-open:rotate-180 transition-transform" />
              </summary>
              <p className="mt-3 text-sm text-white/70 leading-relaxed">
                {item.a}
              </p>
            </details>
          ))}
        </div>

        {/* Garantia */}
        <div className="mx-auto mt-16 max-w-2xl rounded-2xl border border-emerald-500/30 bg-[#111d17] p-8 text-center shadow-xl">
          <ShieldCheck className="mx-auto h-16 w-16 text-emerald-400" />
          <h3 className="mt-4 text-2xl font-extrabold text-white">
            {c.guaranteeTitle}
          </h3>
          <p className="mt-3 text-sm sm:text-base text-white/80 leading-relaxed">
            {c.guaranteeText}
          </p>
          <div className="mt-6">
            <CTAButton label={c.cta} />
          </div>
        </div>
      </Section>

      {/* Rodapé Legal */}
      <footer className="border-t border-white/5 bg-[#380707] px-5 py-10 text-center text-xs text-white/55 leading-relaxed">
        <div className="mx-auto max-w-3xl whitespace-pre-line">
          {c.footer}
        </div>
      </footer>
    </>
  );
}

function PricingCard({
  plan,
  isPopular,
  onSelect,
}: {
  plan: LandingPageContent['basicPlan'] | LandingPageContent['completePlan'];
  isPopular: boolean;
  onSelect: () => void;
}) {
  return (
    <div
      className={`relative rounded-2xl p-7 sm:p-8 flex flex-col justify-between transition-all ${
        isPopular
          ? 'border-2 border-emerald-400 bg-gradient-to-b from-[#18231f] to-[#141b18] shadow-[0_15px_40px_rgba(16,185,129,0.2)] scale-[1.02]'
          : 'border border-white/10 bg-[#5E1212] shadow-lg'
      }`}
    >
      {isPopular && (
        <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-emerald-400 px-4 py-1 text-xs font-black uppercase text-black tracking-wider shadow">
          {plan.badge || 'MAIS VENDIDO'}
        </span>
      )}

      <div>
        <h3 className="text-xl sm:text-2xl font-black text-white">{plan.name}</h3>

        <div className="mt-4">
          {plan.oldPrice && (
            <p className="text-xs sm:text-sm text-white/55 line-through">
              De {plan.oldPrice}
            </p>
          )}
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xs sm:text-sm font-bold text-white/70">Por apenas</span>
            <span className="text-3xl sm:text-5xl font-black text-emerald-400">
              {plan.price}
            </span>
          </div>
        </div>

        <ul className="mt-6 space-y-3 text-sm">
          {plan.items.map((item, idx) => (
            <li key={idx} className="flex gap-2.5 text-white/80">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={onSelect}
        className={`mt-8 w-full rounded-xl py-3.5 text-sm font-black uppercase tracking-wider transition-all cursor-pointer ${
          isPopular
            ? 'bg-emerald-400 text-black shadow-lg hover:bg-emerald-300'
            : 'border border-white/20 bg-white/10 text-white hover:bg-white/10'
        }`}
      >
        {plan.cta}
      </button>
    </div>
  );
}

function LeadOrderForm({
  c,
  pageId,
}: {
  c: LandingPageContent;
  pageId: string;
}) {
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'complete'>('complete');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const form = new FormData(e.currentTarget);
    const name = String(form.get('name') ?? '').trim();
    const email = String(form.get('email') ?? '').trim();
    const phone = String(form.get('phone') ?? '').trim();

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pageId, plan: selectedPlan, name, email, phone }),
      });

      if (!res.ok) throw new Error('Falha ao processar formulário');
      setSubmitted(true);
      toast.success('Pedido registrado com sucesso!');
    } catch {
      setErrorMsg('Verifique os dados e tente novamente.');
      toast.error('Erro ao enviar dados. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="form-lead"
      className="mx-auto mt-12 max-w-lg rounded-2xl border border-white/10 bg-[#5E1212] p-6 sm:p-8 shadow-2xl"
    >
      {submitted ? (
        <div className="py-8 text-center">
          <p className="text-lg font-bold leading-relaxed text-emerald-400">
            {c.thankYou}
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <h3 className="text-center text-xl font-extrabold text-white">
            {c.formTitle}
          </h3>
          <p className="text-center text-xs sm:text-sm text-white/70">
            {c.formSubtitle}
          </p>

          <input
            name="name"
            required
            maxLength={120}
            placeholder={c.labels?.name || 'Seu nome completo'}
            className="flex h-12 w-full rounded-xl border border-white/25 bg-[#6B1414] px-4 py-2 text-sm text-white placeholder:text-white/60 focus:border-emerald-500 focus:outline-none"
          />

          <input
            name="email"
            type="email"
            required
            maxLength={200}
            placeholder={c.labels?.email || 'Seu melhor e-mail'}
            className="flex h-12 w-full rounded-xl border border-white/25 bg-[#6B1414] px-4 py-2 text-sm text-white placeholder:text-white/60 focus:border-emerald-500 focus:outline-none"
          />

          <input
            name="phone"
            maxLength={40}
            placeholder={c.labels?.phone || 'WhatsApp com DDD'}
            className="flex h-12 w-full rounded-xl border border-white/25 bg-[#6B1414] px-4 py-2 text-sm text-white placeholder:text-white/60 focus:border-emerald-500 focus:outline-none"
          />

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={() => setSelectedPlan('basic')}
              className={`rounded-xl border p-3 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                selectedPlan === 'basic'
                  ? 'border-emerald-400 bg-emerald-500/20 text-emerald-300'
                  : 'border-white/10 bg-white/10 text-white/70'
              }`}
            >
              {c.basicPlan.name} ({c.basicPlan.price})
            </button>
            <button
              type="button"
              onClick={() => setSelectedPlan('complete')}
              className={`rounded-xl border p-3 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                selectedPlan === 'complete'
                  ? 'border-emerald-400 bg-emerald-500/20 text-emerald-300'
                  : 'border-white/10 bg-white/10 text-white/70'
              }`}
            >
              {c.completePlan.name} ({c.completePlan.price})
            </button>
          </div>

          {errorMsg && (
            <p className="text-xs font-semibold text-rose-400">{errorMsg}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex h-14 w-full items-center justify-center rounded-xl bg-gradient-to-r from-emerald-400 to-emerald-500 px-4 text-base font-black uppercase text-black shadow-lg hover:from-emerald-300 hover:to-emerald-400 transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
            {c.formButton}
          </button>
        </form>
      )}
    </div>
  );
}
