import { GenerateRequest, Model, Variant, LandingPageContent, LanguageKey } from '@/types';

export const LANGUAGES: Record<LanguageKey, { label: string; name: string; currency: string }> = {
  pt: { label: 'Português', name: 'português do Brasil', currency: 'R$' },
  en: { label: 'English', name: 'English (US)', currency: '$' },
  es: { label: 'Español', name: 'español neutro (LatAm)', currency: '$' },
  fr: { label: 'Français', name: 'français', currency: '€' },
  ar: { label: 'العربية', name: 'Modern Standard Arabic', currency: '$' },
  zh: { label: '中文', name: 'Simplified Chinese (简体中文)', currency: '¥' },
};

export const TONES = [
  'persuasivo',
  'formal',
  'amigavel',
  'urgente',
  'storytelling',
  'provocativo',
  'premium',
  'custom',
] as const;

export const TONE_DETAILS: Record<
  string,
  { label: string; instruction: string }
> = {
  persuasivo: {
    label: 'Persuasivo',
    instruction:
      'Direct-response persuasive tone: bold promises, emotional triggers, benefit-driven headlines, strong CTAs, short punchy sentences.',
  },
  formal: {
    label: 'Formal',
    instruction:
      'Formal, professional and authoritative tone: precise vocabulary, no slang, credibility-driven arguments, corporate polish.',
  },
  amigavel: {
    label: 'Amigável',
    instruction:
      'Warm, friendly and conversational tone: speak like a helpful friend, simple words, empathy, light humor, zero pressure.',
  },
  urgente: {
    label: 'Urgente',
    instruction:
      'High-urgency tone: scarcity, deadlines, fear of missing out, imperative verbs, fast rhythm — while staying honest and non-deceptive.',
  },
  storytelling: {
    label: 'Storytelling',
    instruction:
      'Narrative tone: open with a relatable personal story, build tension and transformation, weave the offer into the story arc.',
  },
  provocativo: {
    label: 'Provocativo',
    instruction:
      'Provocative and contrarian tone: challenge common beliefs, call out excuses, bold statements that shake the reader awake.',
  },
  premium: {
    label: 'Premium',
    instruction:
      'Elegant, premium and minimal tone: refined vocabulary, calm confidence, exclusivity and craft over hype.',
  },
  custom: {
    label: 'Personalizado',
    instruction: '',
  },
};

export const ELEVEN_BLOCKS = [
  'BLOCO 1 - VENDER SOZINHO (Hero + Objeções + Mockup)',
  'BLOCO 2 - DEPOIMENTOS (Prints / Prova Social)',
  'BLOCO 3 - AGITAÇÃO (4 Pensamentos + Imagens)',
  'BLOCO 4 - PASSO A PASSO (4 Passos com Imagens)',
  'BLOCO 5 - MOCKUPS (Checklist + Templates + Guia)',
  'BLOCO 6 - BÔNUS (3 Aceleradores com Mockups)',
  'BLOCO 7 - PARA QUEM É? (Não é pra você x É pra você)',
  'BLOCO 8 - RECAPTULANDO (Stack de Valor + Ancoragem)',
  'BLOCO 9 - OFERTA (2 Planos: Básico x Completo)',
  'BLOCO 10 - AUTORIDADE (Especialista + Foto)',
  'BLOCO 11 - FAQ + GARANTIA (Dúvidas + 7 Dias)',
];

export const VARIANT_ANGLES = [
  {
    id: 'dor',
    name: 'Dor & Alívio',
    label: 'Variação 1: Dor',
    desc: 'Foco na dor mais aguda, na frustração cotidiana e no alívio imediato.',
  },
  {
    id: 'resultado',
    name: 'Resultado Rápido',
    label: 'Variação 2: Resultado',
    desc: 'Foco no tempo recorde, na rapidez de implementação e nos ganhos práticos.',
  },
  {
    id: 'mecanismo',
    name: 'Mecanismo Único',
    label: 'Variação 3: Mecanismo Único',
    desc: 'Foco no checklist e templates proprietários como o atalho definitivo.',
  },
  {
    id: 'prova',
    name: 'Prova & Autoridade',
    label: 'Variação 4: Prova / História',
    desc: 'Foco em cases de alunos, prints de resultados e validação social imediata.',
  },
];

export function resolveTone(toneKey: string, customTone?: string): string {
  if (toneKey === 'custom') {
    return customTone?.trim() || 'Direto, curto, altamente persuasivo e objetivo';
  }
  const tone = TONE_DETAILS[toneKey];
  return tone ? `${tone.label} — ${tone.instruction}` : toneKey;
}

export function generateFullCopyData(req: GenerateRequest, scrapedInfo?: { title?: string; description?: string }): {
  models: Model[];
  contentDireto: LandingPageContent;
  contentCenario: LandingPageContent;
} {
  const lang = req.language || 'pt';
  const curr = LANGUAGES[lang]?.currency || 'R$';
  
  const productName =
    req.productName?.trim() ||
    scrapedInfo?.title?.replace(/[-|].*$/, '').trim() ||
    (lang === 'pt' ? 'Método Vender Sozinho' : 'Sell Alone System');
  
  const audience =
    req.audience?.trim() ||
    (lang === 'pt' ? 'Empreendedores e criadores digitais iniciantes' : 'Entrepreneurs & digital creators');
  
  const basicPrice = req.basicPrice?.trim() || `${curr}27,00`;
  const completePrice = req.completePrice?.trim() || `${curr}47,00`;
  const oldPriceBasic = `${curr}97,00`;
  const oldPriceComplete = `${curr}197,00`;
  const savingsText = lang === 'pt' 
    ? `Economia de mais de 75% garantindo o Pacote Completo hoje!` 
    : `Save over 75% when you secure the Complete Bundle today!`;

  // Default images matching appstudio-pro.site/pv
  const imageAssets = {
    logo: '/assets/pv/logo.png',
    heroMockup: '/assets/pv/hero_mockup.png',
    testimonials: [
      '/assets/pv/testimonial_1.png',
      '/assets/pv/testimonial_2.png',
      '/assets/pv/testimonial_3.png',
      '/assets/pv/testimonial_4.png',
    ],
    painCard: '/assets/pv/pain_card.png',
    stepCard: '/assets/pv/step_card.png',
    deliverables: [
      '/assets/pv/deliverable_1.png',
      '/assets/pv/deliverable_2.png',
      '/assets/pv/deliverable_3.png',
    ],
    bonuses: [
      '/assets/pv/bonus_1.png',
      '/assets/pv/bonus_2.png',
      '/assets/pv/bonus_3.png',
    ],
    authorImage: '/assets/pv/hero_mockup.png',
    guaranteeBadge: '/assets/pv/logo.png',
  };

  const imagePrompts = {
    hero: `3D digital product box mockup floating in a dark studio with subtle glow, featuring a tablet displaying the dashboard of "${productName}", a smartphone with checklist and a modern printed guide, clean minimal aesthetic, hyper-realistic 4K render.`,
    depoimentos: `Grid of 4 clean mobile chat notification screenshots showing excited customer feedback, green checkmarks, WhatsApp style bubbles praising fast results with "${productName}".`,
    agitacao: `Moody conceptual illustration representing frustration, overthinking, and digital overload, dark background with subtle crimson/orange warning ambient glow.`,
    passos: `Sleek modern 3D isometric blueprint card illustrating a 4-step progressive milestone roadmap with neon green milestone checkmarks on dark slate backdrop.`,
    mockups: `Set of 3 individual 3D mockup cards: 1. Action Checklist on a dark tablet; 2. Practical Exercise Template folder; 3. Action Execution Playbook workbook.`,
    bonus: `Set of 3 premium digital pass cards with golden badges and glowing edges labeled Bonus 1, Bonus 2, Bonus 3 on dark background.`,
    autoridade: `High-end professional portrait of digital strategy creator against a clean dark gradient background, warm rim lighting, confident and approachable expression.`,
  };

  // Structured landing page content matching appstudio-pro.site/pv/ exactly
  const contentDireto: LandingPageContent = {
    productName,
    headline: lang === 'pt' 
      ? `Descubra como dominar as vendas de ${productName} em poucos dias`
      : `Discover how to master sales for ${productName} in just a few days`,
    subheadline: lang === 'pt'
      ? `Mesmo que você nunca tenha vendido nada pela internet, tenha pouco tempo livre e comece com orçamento zero.`
      : `Even if you've never sold anything online, have zero spare time, and start with zero budget.`,
    heroObjections: lang === 'pt'
      ? `Mesmo que você não entenda de tecnologia, não tenha audiência e tenha tentado outros métodos sem sucesso.`
      : `Even if you have no tech skills, zero audience, and struggled with complex courses before.`,
    cta: lang === 'pt' ? 'APROVEITAR AGORA' : 'CLAIM ACCESS NOW',
    
    // Block 2: Depoimentos
    testimonialsTitle: lang === 'pt' 
      ? `Veja casos de pessoas que conseguiram alcançar resultados reais`
      : `See real people achieving positive transformations`,
    testimonialsSubtitle: lang === 'pt'
      ? `Usando o ${productName}`
      : `Using the ${productName}`,
    testimonials: lang === 'pt' ? [
      {
        name: 'Mariana Costa',
        city: 'São Paulo, SP',
        text: 'Em menos de 48 horas após baixar o checklist, apliquei o passo 2 e fiz minhas primeiras 3 vendas no automático!',
        image: imageAssets.testimonials[0],
      },
      {
        name: 'Lucas Ferreira',
        city: 'Belo Horizonte, MG',
        text: 'O que mais me impressionou foi a clareza. Não tem enrolação, é abrir os templates, preencher e colocar para rodar.',
        image: imageAssets.testimonials[1],
      },
      {
        name: 'Beatriz Almeida',
        city: 'Curitiba, PR',
        text: 'Eu gastava horas tentando inventar tudo do zero. Com esse pacote pronto, montei minha oferta em uma única tarde.',
        image: imageAssets.testimonials[2],
      },
      {
        name: 'Gabriel Ribeiro',
        city: 'Rio de Janeiro, RJ',
        text: 'Pelo valor que paguei, o retorno foi imediato. O bônus de scripts fechou vendas já no primeiro disparo!',
        image: imageAssets.testimonials[3],
      },
    ] : [
      {
        name: 'Sarah J.',
        city: 'Austin, TX',
        text: 'Followed Step 2 and made my first 3 sales within 48 hours. Straight to the point!',
        image: imageAssets.testimonials[0],
      },
      {
        name: 'David M.',
        city: 'Chicago, IL',
        text: 'Zero fluff, actionable templates. Deployed my offer in a single afternoon.',
        image: imageAssets.testimonials[1],
      },
      {
        name: 'Jessica W.',
        city: 'London, UK',
        text: 'Paid for itself ten times over on day one. Highly recommend the complete bundle.',
        image: imageAssets.testimonials[2],
      },
      {
        name: 'Alex T.',
        city: 'Toronto, CA',
        text: 'The scripts bonus alone closed deals immediately. Best low-ticket investment ever.',
        image: imageAssets.testimonials[3],
      },
    ],

    // Block 3: Agitação da Dor
    painTitle: lang === 'pt' 
      ? `Você não aguenta mais tentar vender todos os dias`
      : `You are exhausted trying to sell day after day`,
    painSubtitle: lang === 'pt'
      ? `E ver sempre os mesmos resultados frustrantes… Por isso você pensa:`
      : `And constantly seeing the same disappointing outcomes... That's why you think:`,
    painPoints: lang === 'pt' ? [
      '“Não levo jeito para vendas e parece que todo mundo consegue menos eu.”',
      '“Já comprei cursos de R$ 997 cheios de teorias intermináveis que só me deixaram mais confuso.”',
      '“Fico horas na frente do computador sem saber exatamente qual é o próximo passo prático.”',
      '“Tenho medo de gastar meu pouco dinheiro em ferramentas caras e anúncios sem retorno.”',
    ] : [
      '“I am not good at sales and it seems everyone else is succeeding except me.”',
      '“I bought $500 courses filled with 40 hours of theory that only left me more overwhelmed.”',
      '“I spend hours staring at my screen not knowing the exact next actionable step.”',
      '“I am terrified of wasting my limited budget on expensive tools with no return.”',
    ],
    painThoughts: lang === 'pt' ? [
      {
        title: 'Pensamento negativo 1',
        text: '“Será que preciso de milhares de seguidores para ter clientes comprando?”',
        image: imageAssets.painCard,
      },
      {
        title: 'Pensamento negativo 2',
        text: '“Já tentei de tudo e sinto que estou jogando tempo e dinheiro fora.”',
        image: imageAssets.painCard,
      },
      {
        title: 'Pensamento negativo 3',
        text: '“Não tenho paciência nem tempo para assistir aulas de 2 horas sobre marketing.”',
        image: imageAssets.painCard,
      },
      {
        title: 'Pensamento negativo 4',
        text: '“E se as pessoas acharem meu produto caro ou não se interessarem?”',
        image: imageAssets.painCard,
      },
    ] : [
      {
        title: 'Negative belief 1',
        text: '“Do I need tens of thousands of followers to make consistent sales?”',
        image: imageAssets.painCard,
      },
      {
        title: 'Negative belief 2',
        text: '“I tried multiple tactics and feel like I am wasting precious time.”',
        image: imageAssets.painCard,
      },
      {
        title: 'Negative belief 3',
        text: '“I don’t have the time to sit through 40 hours of theoretical lectures.”',
        image: imageAssets.painCard,
      },
      {
        title: 'Negative belief 4',
        text: '“What if people think my offer is too expensive or ignore it?”',
        image: imageAssets.painCard,
      },
    ],
    painClosing: lang === 'pt'
      ? `Eu sei... Você não aguenta mais essa sensação de esforço sem recompensa. Estou certo?`
      : `We know... You are sick of effort with zero tangible payoff. Am I right?`,

    // Block 4: Passo a Passo
    stepsTitle: lang === 'pt' 
      ? `Esses são os 4 passos simples`
      : `These are the 4 simple steps`,
    stepsSubtitle: lang === 'pt'
      ? `Para colocar seu produto no ar e colher os primeiros frutos`
      : `To launch your offer and get immediate momentum`,
    steps: lang === 'pt' ? [
      {
        title: 'Passo 1: Baixe o Checklist Prático',
        text: 'Acesso imediato à estrutura validada com instruções diretas de preenchimento.',
        image: imageAssets.stepCard,
      },
      {
        title: 'Passo 2: Preencha com sua Oferta',
        text: 'Basta seguir os templates prontos ponto a ponto. Zero curva de aprendizado técnica.',
        image: imageAssets.stepCard,
      },
      {
        title: 'Passo 3: Ative os Gatilhos de Conversão',
        text: 'Aplique as frases e ancoragens persuasivas desenhadas para eliminar as dúvidas do cliente.',
        image: imageAssets.stepCard,
      },
      {
        title: 'Passo 4: Receba Pedidos no Piloto Automático',
        text: 'Coloque para rodar e veja as notificações de compra caindo diretamente no seu bolso.',
        image: imageAssets.stepCard,
      },
    ] : [
      {
        title: 'Step 1: Download the Action Checklist',
        text: 'Instant access to battle-tested frameworks with direct fill-in-the-blank prompts.',
        image: imageAssets.stepCard,
      },
      {
        title: 'Step 2: Plug In Your Offer Details',
        text: 'Follow the templates step-by-step. Zero complicated technical configuration.',
        image: imageAssets.stepCard,
      },
      {
        title: 'Step 3: Trigger Conversion Levers',
        text: 'Activate persuasive copy triggers designed to eliminate customer hesitations.',
        image: imageAssets.stepCard,
      },
      {
        title: 'Step 4: Collect Automated Orders',
        text: 'Launch with full confidence and start collecting sales on demand.',
        image: imageAssets.stepCard,
      },
    ],

    // Block 5: Mockups dos Entregáveis
    deliverablesTitle: lang === 'pt'
      ? `Veja tudo o que você vai receber com o ${productName}`
      : `Everything you receive inside the ${productName}`,
    deliverables: lang === 'pt' ? [
      {
        title: `CHECKLIST = Promessa Principal de Vendas`,
        text: 'Você terá em mãos um checklist de ações rápidas, simples e práticas que tornará impossível você não destravar suas conversões ainda hoje.',
        image: imageAssets.deliverables[0],
      },
      {
        title: `Template de Exercícios Práticos para Execução`,
        text: 'Um passo a passo direto para você modelar e aplicar em menos de 45 minutos. Você saberá exatamente como estruturar cada elemento da sua oferta.',
        image: imageAssets.deliverables[1],
      },
      {
        title: `GUIA DE AÇÕES PARA Escala & Conversão`,
        text: 'Guia completo com exercícios simples, rápidos e poderosos, para você aplicar em apenas alguns minutos sem que precise se expor ou investir em anúncios caros.',
        image: imageAssets.deliverables[2],
      },
    ] : [
      {
        title: `Core Action Checklist`,
        text: 'Actionable, fast-track checklist ensuring you never miss a critical conversion component.',
        image: imageAssets.deliverables[0],
      },
      {
        title: `Practical Implementation Templates`,
        text: 'Step-by-step swipe files you can customize and execute in under 45 minutes.',
        image: imageAssets.deliverables[1],
      },
      {
        title: `Action Playbook for Rapid Results`,
        text: 'Complete operational guide built for immediate execution without guesswork.',
        image: imageAssets.deliverables[2],
      },
    ],

    // Block 6: Bônus Exclusivos
    extrasTitle: lang === 'pt'
      ? `Mas ainda não acabou... Veja os Bônus Exclusivos:`
      : `Exclusive High-Value Accelerators Included:`,
    extras: lang === 'pt' ? [
      {
        title: 'Bônus 1: Masterclass de Escala Rápida',
        text: 'Como duplicar o retorno das suas campanhas sem ter que trabalhar mais horas ou gastar com ferramentas complexas.',
        value: `${curr}147,00`,
        image: imageAssets.bonuses[0],
      },
      {
        title: 'Bônus 2: Arsenal de Scripts de WhatsApp & Direct',
        text: 'Scripts prontos no estilo copia e cola para responder dúvidas e quebrar objeções em segundos.',
        value: `${curr}97,00`,
        image: imageAssets.bonuses[1],
      },
      {
        title: 'Bônus 3: Acesso Vitalício + Todas as Atualizações',
        text: 'Nunca mais pague por atualizações ou novos modelos adicionados à plataforma.',
        value: `${curr}97,00`,
        image: imageAssets.bonuses[2],
      },
    ] : [
      {
        title: 'Bonus 1: Rapid Scaling Masterclass',
        text: 'How to 2x your results without working extra hours or paying for complex software.',
        value: `${curr}147.00`,
        image: imageAssets.bonuses[0],
      },
      {
        title: 'Bonus 2: Direct Messaging Script Library',
        text: 'Plug-and-play objection-handling scripts to close customers in seconds.',
        value: `${curr}97.00`,
        image: imageAssets.bonuses[1],
      },
      {
        title: 'Bonus 3: Lifetime Access & Future Updates',
        text: 'Never pay monthly renewals or upgrade fees for future iterations.',
        value: `${curr}97.00`,
        image: imageAssets.bonuses[2],
      },
    ],

    // Block 7: Para quem é?
    forWhomTitle: lang === 'pt'
      ? `O ${productName} é para você que:`
      : `Who this is for (and who it is NOT for)`,
    forWhom: lang === 'pt' ? [
      'Quer um método validado para vender todos os dias sem enrolação.',
      'Está cansado de teorias complicadas e busca algo 100% prático.',
      'Possui pouco tempo livre e precisa de algo que funcione em menos de 1 hora por dia.',
      'Quer evitar o erro de gastar milhares de reais em mentorias sem necessidade.',
      'Precisa de templates prontos para copiar, colar e colher os frutos.',
      'Busca um retorno rápido e seguro sobre um investimento simbólico.',
    ] : [
      'Wants a validated system to generate sales without fluff.',
      'Tired of theoretical courses and wants 100% actionable templates.',
      'Has limited time and needs a workflow taking under 1 hour a day.',
      'Wants to avoid spending thousands on overpriced masterminds.',
      'Values swipe files ready to adapt and launch immediately.',
      'Seeks immediate ROI on a minimal low-ticket investment.',
    ],
    notForWhom: lang === 'pt' ? [
      'Quem procura uma pílula mágica sem vontade de colocar em prática.',
      'Quem prefere gastar horas em tutoriais no YouTube sem foco nenhum.',
      'Pessoas que não valorizam seu próprio tempo e preferem errar sozinhas.',
      'Curiosos que compram materiais e nunca sequer abrem os arquivos.',
    ] : [
      'Anyone looking for a magic button without taking basic action.',
      'Those who prefer wasting months watching random unorganized tutorials.',
      'People who refuse to follow a structured roadmap.',
      'Resource hoarders who never execute what they acquire.',
    ],

    // Block 8: Recapitulação / Stack de Valor
    stackTitle: lang === 'pt'
      ? `Veja tudo o que você vai receber:`
      : `Review everything waiting inside:`,
    stackItems: lang === 'pt' ? [
      { title: `Checklist & Templates de ${productName}`, value: `${curr}97,00` },
      { title: 'Guia de Execução & Ações Rápidas', value: `${curr}97,00` },
      { title: 'Bônus 1: Masterclass de Escala', value: `${curr}147,00` },
      { title: 'Bônus 2: Arsenal de Scripts Prontos', value: `${curr}97,00` },
      { title: 'Bônus 3: Atualizações Vitalícias', value: `${curr}97,00` },
    ] : [
      { title: `Core Blueprint & Checklist`, value: `${curr}97.00` },
      { title: `Action Execution Playbook`, value: `${curr}97.00` },
      { title: `Bonus 1: Scaling Masterclass`, value: `${curr}147.00` },
      { title: `Bonus 2: Script Vault`, value: `${curr}97.00` },
      { title: `Bonus 3: Lifetime Updates`, value: `${curr}97.00` },
    ],
    stackTotalVal: lang === 'pt' ? `${curr}535,00` : `${curr}535.00`,

    // Block 9: Oferta com 2 Planos
    basicPlan: {
      name: lang === 'pt' ? 'PLANO BÁSICO' : 'BASIC PLAN',
      badge: lang === 'pt' ? 'ECONÔMICO' : 'ESSENTIAL',
      oldPrice: oldPriceBasic,
      price: basicPrice,
      items: lang === 'pt' ? [
        'Acesso ao Checklist Mestre de Execução',
        'Templates de Exercícios Práticos',
        'Guia de Ações Rápidas em PDF',
        'Acesso por 1 Ano',
        'Garantia Incondicional de 7 Dias',
      ] : [
        'Full Core Checklist Access',
        'Practical Exercise Templates',
        'Action Implementation Guide',
        '1-Year Platform Access',
        '7-Day Money-Back Guarantee',
      ],
      cta: lang === 'pt' ? 'APROVEITAR AGORA' : 'CLAIM ACCESS NOW',
    },
    completePlan: {
      name: lang === 'pt' ? 'PACOTE COMPLETO' : 'COMPLETE VIP PACK',
      badge: lang === 'pt' ? 'MAIS VENDIDO' : 'MOST POPULAR',
      oldPrice: oldPriceComplete,
      price: completePrice,
      items: lang === 'pt' ? [
        'TUDO do Plano Básico',
        'BÔNUS 1: Masterclass de Escala Rápida',
        'BÔNUS 2: Arsenal de Scripts de WhatsApp & Direct',
        'BÔNUS 3: Acesso Vitalício + Todas as Atualizações',
        'Suporte Prioritário no WhatsApp',
        'Garantia Incondicional de 7 Dias',
      ] : [
        'EVERYTHING in the Basic Plan',
        'BONUS 1: Rapid Scaling Masterclass',
        'BONUS 2: WhatsApp & Direct Script Vault',
        'BONUS 3: Lifetime Access & Future Updates',
        'Priority Direct WhatsApp Support',
        '7-Day Money-Back Guarantee',
      ],
      cta: lang === 'pt' ? 'APROVEITAR AGORA' : 'CLAIM ACCESS NOW',
    },
    savings: savingsText,

    // Block 10: Autoridade
    authorName: lang === 'pt' ? 'Especialista em Low Ticket' : 'Digital Strategy Lead',
    authorRole: lang === 'pt' ? `Criador do ${productName}` : `Creator of ${productName}`,
    authorBio: lang === 'pt'
      ? `Mais de 5 anos de experiência prática e centenas de milhares de reais faturados com produtos digitais de alta conversão. Desenvolvi esta estrutura prática para economizar seu tempo e garantir que qualquer pessoa consiga colocar uma oferta de pé sem depender de agências ou cursos caros.`
      : `Years of hands-on digital direct response experience. Built this exact framework to save you months of trial-and-error, giving you proven assets that convert on day one.`,
    authorImage: imageAssets.authorImage,

    // Block 11: FAQ + Garantia + Rodapé
    guaranteeTitle: lang === 'pt' ? 'Garantia Blindada de 7 Dias' : '7-Day Ironclad Guarantee',
    guaranteeText: lang === 'pt'
      ? 'Você tem 7 dias inteiros para testar e aplicar todo o material. Se por qualquer motivo você achar que não valeu a pena, basta nos enviar um e-mail e devolveremos 100% do seu dinheiro, sem letras miúdas.'
      : 'Take 7 full days to test everything risk-free. If you are not completely satisfied, simply message us for an immediate 100% refund. No questions asked.',
    guaranteeBadge: imageAssets.guaranteeBadge,

    faq: lang === 'pt' ? [
      {
        q: 'Como e quando receberei o acesso?',
        a: 'O envio é imediato. Assim que o pagamento for confirmado, você receberá seus dados de acesso diretamente no seu e-mail e WhatsApp.',
      },
      {
        q: 'Funciona para quem nunca vendeu na internet?',
        a: 'Sim! Toda a estrutura foi desenhada passo a passo, em linguagem simples e com exemplos reais para copiar e colar.',
      },
      {
        q: 'Qual a diferença entre o Plano Básico e o Pacote Completo?',
        a: 'O Plano Básico entrega os arquivos centrais. O Pacote Completo inclui todos os 3 bônus exclusivos, scripts prontos de fechamento e acesso vitalício.',
      },
      {
        q: 'E se eu tiver dúvidas durante a aplicação?',
        a: 'Você terá acesso direto ao nosso canal de suporte para tirar dúvidas e garantir que sua oferta vá para o ar com sucesso.',
      },
    ] : [
      {
        q: 'How and when will I get access?',
        a: 'Immediately upon checkout. Your credentials are automatically dispatched to your email.',
      },
      {
        q: 'Does this work for absolute beginners?',
        a: 'Yes, 100%. Everything is structured in clear, fill-in-the-blank steps without any confusing jargon.',
      },
      {
        q: 'What is the difference between the 2 plans?',
        a: 'The Basic Plan delivers core materials. The Complete Bundle adds all bonuses, swipe scripts, and lifetime updates.',
      },
      {
        q: 'What if I am not happy?',
        a: 'You are protected by our 7-day unconditional refund policy. Just contact us for an immediate refund.',
      },
    ],
    footer: lang === 'pt'
      ? `Copyright © ${new Date().getFullYear()} ${productName}. Todos os direitos reservados.\nEste site não é afiliado ao Facebook, Google ou a qualquer entidade externa. A compra deste material não garante resultados sem aplicação prática.`
      : `Copyright © ${new Date().getFullYear()} ${productName}. All rights reserved. Results vary according to individual application and dedication.`,

    formTitle: lang === 'pt' ? 'Preencha seus dados para receber o acesso' : 'Complete your details for instant access',
    formSubtitle: lang === 'pt' ? 'O acesso será liberado imediatamente após a confirmação.' : 'Access will be dispatched immediately.',
    formButton: lang === 'pt' ? 'LIBERAR ACESSO IMEDIATO' : 'UNLOCK INSTANT ACCESS',
    labels: {
      name: lang === 'pt' ? 'Seu nome completo' : 'Your full name',
      email: lang === 'pt' ? 'Seu melhor e-mail' : 'Your best email',
      phone: lang === 'pt' ? 'WhatsApp (com DDD)' : 'Phone / WhatsApp',
      mostPopular: lang === 'pt' ? 'MAIS VENDIDO' : 'MOST POPULAR',
    },
    thankYou: lang === 'pt'
      ? '🎉 Parabéns! Seus dados foram recebidos. Verifique seu e-mail e WhatsApp para acessar seu material agora mesmo!'
      : '🎉 Congratulations! Your details are confirmed. Check your inbox for instant access!',
    images: imageAssets,
    imagePrompts,
    ...defaultFocus(lang, productName, audience),
  };

  // Cenario variant (with urgency bar and badges)
  const contentCenario: LandingPageContent = {
    ...contentDireto,
    urgency: lang === 'pt' 
      ? `⚡ ATENÇÃO: Preço promocional válido apenas para os próximos 50 pedidos!`
      : `⚡ LIMITED TIME: Special launch pricing available for the next 50 orders only!`,
    badges: lang === 'pt'
      ? ['Acesso Imediato', 'Garantia de 7 Dias', 'Suporte no WhatsApp', 'Sem Mensalidades']
      : ['Instant Access', '7-Day Guarantee', 'Direct Support', 'Zero Subscriptions'],
  };

  // Build the complete prompt text matching appstudio-pro.site/pv/ structure exactly
  function buildPromptText(
    modelName: string,
    modelId: 'direto' | 'cenario',
    variant: typeof VARIANT_ANGLES[0]
  ): string {
    const toneText = req.tone || 'Persuasivo, curto e direto';
    return `# PROMPT DE LANDING PAGE LOW TICKET (ESTRUTURA COMPACTA EM 11 BLOCOS)
# ${modelName} — ${variant.label}
# Referência Estrutural: appstudio-pro.site/pv
# Idioma: ${LANGUAGES[lang]?.name || 'Português'}
# Tom de Voz: ${toneText}

Você é um copywriter sênior especialista em direct-response e infoprodutos low ticket.
Sua missão é gerar a cópia completa da landing page abaixo, seguindo a estrutura exata, curta e objetiva em 11 blocos, com 2 planos de oferta e os comandos de imagens necessários para cada seção.

---
### DADOS DA OFERTA:
- **Produto:** ${productName}
- **Público-Alvo:** ${audience}
- **Preço Plano Básico:** ${basicPrice} (Valor de ancoragem: ${oldPriceBasic})
- **Preço Pacote Completo (VIP):** ${completePrice} (Valor de ancoragem: ${oldPriceComplete})
- **Ângulo da Variação:** ${variant.name} (${variant.desc})

${buildPrioritiesSection(contentDireto)}
---
### ESTRUTURA DOS 11 BLOCOS:

#### BLOCO 1 - VENDER SOZINHO (Hero)
- **Tag:** [BLOCO 1 - VENDER SOZINHO]
- **Headline Principal:** ${contentDireto.headline}
- **Selo do Mecanismo:** ${contentDireto.mechanism?.name ?? ''}
- **Subheadline (Quebra de 3 Objeções):** ${contentDireto.subheadline}
- **Botão CTA:** APROVEITAR AGORA
- **🖼️ IMAGEM NECESSÁRIA (Hero):**
  > Prompt para IA/Designer: "${imagePrompts.hero}"

#### BLOCO 2 - DEPOIMENTOS (Prova Social)
- **Título:** Veja casos de pessoas que conseguiram alcançar resultados reais
- **Subtítulo:** Usando o ${productName}
- **4 Provas Sociais:**
  1. Mariana Costa (São Paulo, SP): "Em menos de 48h apliquei o passo 2 e fiz minhas primeiras 3 vendas no automático!"
  2. Lucas Ferreira (Belo Horizonte, MG): "Sem enrolação, é abrir os templates, preencher e rodar."
  3. Beatriz Almeida (Curitiba, PR): "Montei minha oferta completa em uma única tarde."
  4. Gabriel Ribeiro (Rio de Janeiro, RJ): "O bônus de scripts fechou vendas já no primeiro disparo!"
- **🖼️ IMAGEM NECESSÁRIA (Depoimentos):**
  > Prompt para IA/Designer: "${imagePrompts.depoimentos}"

#### BLOCO 3 - AGITAÇÃO (4 Pensamentos Negativos)
- **Título:** Você não aguenta mais tentar vender todos os dias
- **Subtítulo:** E ver sempre os mesmos resultados frustrantes… Por isso você pensa:
- **4 Cards de Pensamento:**
  - Pensamento 1: "Será que preciso de milhares de seguidores para ter clientes comprando?"
  - Pensamento 2: "Já tentei de tudo e sinto que estou jogando tempo e dinheiro fora."
  - Pensamento 3: "Não tenho paciência nem tempo para assistir aulas de 2 horas sobre marketing."
  - Pensamento 4: "E se as pessoas acharem meu produto caro ou não se interessarem?"
- **Fechamento:** "Eu sei... Você não aguenta mais essa sensação de esforço sem recompensa. Estou certo?"
- **🖼️ IMAGEM NECESSÁRIA (Agitação):**
  > Prompt para IA/Designer: "${imagePrompts.agitacao}"

#### BLOCO 4 - PASSO A PASSO (4 Passos Rápidos)
- **Título:** Esses são os 4 passos simples para destravar suas vendas
- **Passos:**
  - Passo 1: Baixe o Checklist Prático (Acesso imediato à estrutura validada).
  - Passo 2: Preencha com sua Oferta (Siga os modelos prontos ponto a ponto).
  - Passo 3: Ative os Gatilhos de Conversão (Aplique as frases e ancoragens persuasivas).
  - Passo 4: Receba Pedidos no Piloto Automático (Coloque para rodar e veja as vendas caindo).
- **🖼️ IMAGEM NECESSÁRIA (Passo a Passo):**
  > Prompt para IA/Designer: "${imagePrompts.passos}"

#### BLOCO 5 - MOCKUPS (Entregáveis Básicos)
- **Título:** Veja tudo o que você vai receber com o ${productName}
- **Entregáveis:**
  1. CHECKLIST = Promessa Principal de Vendas (Ações rápidas e objetivas).
  2. Template de Exercícios Práticos para Execução (Aplicação em menos de 45 minutos).
  3. GUIA DE AÇÕES PARA Escala & Conversão (Manual enxuto sem enrolação).
- **🖼️ IMAGEM NECESSÁRIA (Mockups dos Entregáveis):**
  > Prompt para IA/Designer: "${imagePrompts.mockups}"

#### BLOCO 6 - BÔNUS (3 Aceleradores)
- **Título:** Mas ainda não acabou... Veja tudo o que você vai receber:
- **Bônus:**
  - Bônus 1: Masterclass de Escala Rápida (VALOR: ${curr}147,00)
  - Bônus 2: Arsenal de Scripts de WhatsApp & Direct (VALOR: ${curr}97,00)
  - Bônus 3: Acesso Vitalício + Todas as Atualizações (VALOR: ${curr}97,00)
- **🖼️ IMAGEM NECESSÁRIA (Bônus):**
  > Prompt para IA/Designer: "${imagePrompts.bonus}"

#### BLOCO 7 - PARA QUEM É?
- **Não é pra você que:**
  - Procura pílula mágica sem vontade de agir.
  - Prefere perder semanas em tutoriais soltos.
  - Não valoriza o tempo e quer inventar a roda do zero.
- **É pra você que:**
  - Quer um método validado para vender com segurança.
  - Precisa de templates prontos para copiar e colar.
  - Tem pouco tempo e busca clareza imediata.
  - Quer multiplicar o retorno sobre um valor simbólico.

#### BLOCO 8 - RECAPTULANDO (Stack de Valor)
- **Título:** Veja tudo o que você vai receber:
  - Checklist & Templates: ${curr}97,00
  - Guia de Execução: ${curr}97,00
  - Bônus 1 (Masterclass): ${curr}147,00
  - Bônus 2 (Scripts de Fechamento): ${curr}97,00
  - Bônus 3 (Acesso Vitalício): ${curr}97,00
- **TUDO ISSO DEVERIA CUSTAR:** ${curr}535,00
- **Mas hoje você vai investir apenas uma fração disso...**

#### BLOCO 9 - OFERTA (2 PLANOS)
- **PLANO BÁSICO:**
  - De ${oldPriceBasic} por apenas **${basicPrice}**
  - Inclui: Checklist Mestre + Templates + Guia em PDF + 1 Ano de Acesso
  - Botão: **APROVEITAR AGORA**
- **PACOTE COMPLETO (Mais Vendido / Destaque-se):**
  - De ${oldPriceComplete} por apenas **${completePrice}**
  - Inclui: TUDO do Plano Básico + BÔNUS 1 + BÔNUS 2 + BÔNUS 3 + Suporte Prioritário no WhatsApp + Acesso Vitalício
  - Botão: **APROVEITAR AGORA**

#### BLOCO 10 - AUTORIDADE
- **Criador:** ${contentDireto.authorName} (${contentDireto.authorRole})
- **Descrição:** Mais de 5 anos de experiência e milhares de vendas validadas com produtos low ticket.
- **🖼️ IMAGEM NECESSÁRIA (Autoridade):**
  > Prompt para IA/Designer: "${imagePrompts.autoridade}"

#### BLOCO 11 - FAQ + GARANTIA + RODAPÉ LEGAL
- **FAQ:** 4 perguntas e respostas diretas sobre entrega, iniciantes, planos e suporte.
- **Garantia de 7 Dias:** 100% do dinheiro de volta sem burocracia.
- **Rodapé:** Direitos reservados e aviso de isenção de responsabilidade.
`;
  }

  const requestedVariantsCount = Math.max(1, Math.min(req.variants || 1, 4));
  const modelDiretoVariants: Variant[] = [];
  const modelCenarioVariants: Variant[] = [];

  for (let i = 0; i < requestedVariantsCount; i++) {
    const angle = VARIANT_ANGLES[i % VARIANT_ANGLES.length];
    modelDiretoVariants.push({
      id: angle.id,
      label: angle.label,
      prompt: buildPromptText('Modelo 1: Direto ao ponto (Curta & Objetiva)', 'direto', angle),
    });
    modelCenarioVariants.push({
      id: angle.id,
      label: angle.label,
      prompt: buildPromptText('Modelo 2: Cenário (Curta & Objetiva)', 'cenario', angle),
    });
  }

  const models: Model[] = [
    {
      id: 'direto',
      label: 'Modelo 1: Direto ao ponto (Estilo appstudio-pro)',
      variants: modelDiretoVariants,
    },
    {
      id: 'cenario',
      label: 'Modelo 2: Cenário com Urgência',
      variants: modelCenarioVariants,
    },
  ];

  return {
    models,
    contentDireto,
    contentCenario,
  };
}

export function defaultFocus(lang: string, productName: string, audience: string) {
  const pt = lang === 'pt';
  const mechName = pt ? `Método ${productName.split(' ')[0]} 3P` : `${productName.split(' ')[0]} 3P Method`;
  return {
    headlineOptions: pt
      ? [
          `Descubra como dominar as vendas de ${productName} em poucos dias`,
          `O atalho de ${productName} que faz ${audience.toLowerCase()} vender sem aparecer`,
          `Pare de tentar do jeito difícil: o ${mechName} faz a venda acontecer em 3 passos`,
        ]
      : [
          `Discover how to master sales for ${productName} in just a few days`,
          `The ${productName} shortcut that lets you sell without showing up`,
          `Stop doing it the hard way: the ${mechName} closes sales in 3 steps`,
        ],
    mechanism: {
      name: mechName,
      explanation: pt
        ? `Em vez de depender de audiência, sorte ou horas de aula, o ${mechName} usa uma sequência pronta de Preparar, Publicar e Persuadir. É por isso que funciona mesmo para quem já tentou outros métodos e não teve resultado.`
        : `Instead of relying on audience, luck or hours of classes, the ${mechName} uses a ready sequence: Prepare, Publish and Persuade. That's why it works even if other methods failed you.`,
      pillars: pt
        ? ['Preparar: oferta pronta em minutos', 'Publicar: página e mensagens prontas', 'Persuadir: gatilhos que fazem comprar']
        : ['Prepare: ready offer in minutes', 'Publish: ready page and messages', 'Persuade: triggers that make people buy'],
    },
    offer: {
      promise: pt
        ? `Tenha sua primeira venda com o ${mechName} ou receba 100% do seu dinheiro de volta.`
        : `Get your first sale with the ${mechName} or get 100% of your money back.`,
      reasonToBuyNow: pt
        ? 'Preço de lançamento válido só hoje — depois volta para o valor cheio.'
        : 'Launch price valid today only — then it goes back to full price.',
      objections: pt
        ? ['Não tenho tempo: leva menos de 45 minutos', 'Não tenho seguidores: não precisa', 'E se não funcionar? Garantia de 7 dias']
        : ['No time: takes under 45 minutes', 'No followers: not needed', "What if it doesn't work? 7-day guarantee"],
    },
  };
}

export function buildPrioritiesSection(c: LandingPageContent): string {
  const h = (c.headlineOptions ?? [c.headline]).map((x, i) => `  ${i + 1}. ${x}`).join('\n');
  const m = c.mechanism;
  const o = c.offer;
  return `<!--PRIORIDADES-->
### PRIORIDADES DA COPY (FOCO MÁXIMO)
**1. HEADLINE (escolhida):** ${c.headline}
- Opções de headline:
${h}

**2. MECANISMO ÚNICO:** ${m?.name ?? ''}
- Por que funciona e por que é diferente: ${m?.explanation ?? ''}
- Pilares:
${(m?.pillars ?? []).map((p) => `  - ${p}`).join('\n')}
- Cite o mecanismo pelo nome em todos os blocos.

**3. OFERTA PERSUASIVA:**
- Promessa: ${o?.promise ?? ''}
- Valor: de ${c.completePlan.oldPrice ?? ''} por ${c.completePlan.price}
- Motivo para comprar agora: ${o?.reasonToBuyNow ?? ''}
- Garantia: ${c.guaranteeTitle}
- Quebra de objeções:
${(o?.objections ?? []).map((p) => `  - ${p}`).join('\n')}
<!--/PRIORIDADES-->
`;
}

export function applyFocusToPrompt(prompt: string, c: LandingPageContent): string {
  return prompt
    .replace(/<!--PRIORIDADES-->[\s\S]*?<!--\/PRIORIDADES-->\n/, buildPrioritiesSection(c))
    .replace(/- \*\*Headline Principal:\*\* .*\n- \*\*Selo do Mecanismo:\*\* .*/, `- **Headline Principal:** ${c.headline}\n- **Selo do Mecanismo:** ${c.mechanism?.name ?? ''}`);
}
