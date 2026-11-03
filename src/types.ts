export type LanguageKey = 'pt' | 'en' | 'es' | 'fr' | 'ar' | 'zh';

export interface LanguageInfo {
  label: string;
  name: string;
  currency: string;
}

export type ToneKey =
  | 'persuasivo'
  | 'formal'
  | 'amigavel'
  | 'urgente'
  | 'storytelling'
  | 'provocativo'
  | 'premium'
  | 'custom';

export interface ToneInfo {
  label: string;
  instruction: string;
}

export interface Variant {
  id: string;
  label: string;
  prompt: string;
}

export interface Model {
  id: 'direto' | 'cenario';
  label: string;
  variants: Variant[];
}

export interface LandingPageImageSet {
  logo?: string;
  heroMockup: string;
  testimonials: string[];
  painCard: string;
  stepCard: string;
  deliverables: string[];
  bonuses: string[];
  authorImage?: string;
  guaranteeBadge?: string;
}

export interface LandingPageContent {
  productName: string;
  headline: string;
  subheadline: string;
  cta: string;
  urgency?: string;
  badges?: string[];
  // Block 1
  heroObjections?: string;
  // Block 2
  testimonialsTitle?: string;
  testimonialsSubtitle?: string;
  testimonials: { name: string; city?: string; text: string; image?: string }[];
  // Block 3
  painTitle: string;
  painSubtitle?: string;
  painPoints: string[];
  painThoughts?: { title: string; text: string; image?: string }[];
  painClosing?: string;
  // Block 4
  stepsTitle: string;
  stepsSubtitle?: string;
  steps: { title: string; text: string; image?: string }[];
  // Block 5
  deliverablesTitle: string;
  deliverables: { title: string; text: string; image?: string }[];
  // Block 6
  extrasTitle: string;
  extras: { title: string; text: string; value?: string; image?: string }[];
  // Block 7
  forWhomTitle: string;
  forWhom: string[];
  notForWhom?: string[];
  // Block 8
  stackTitle?: string;
  stackItems?: { title: string; value: string }[];
  stackTotalVal?: string;
  // Block 9 (2 Planos)
  basicPlan: {
    name: string;
    badge?: string;
    price: string;
    oldPrice?: string;
    items: string[];
    cta: string;
  };
  completePlan: {
    name: string;
    badge?: string;
    price: string;
    oldPrice?: string;
    items: string[];
    cta: string;
  };
  savings?: string;
  // Block 10
  authorName?: string;
  authorRole?: string;
  authorBio?: string;
  authorImage?: string;
  // Block 11
  guaranteeTitle: string;
  guaranteeText: string;
  guaranteeBadge?: string;
  faq: { q: string; a: string }[];
  footer: string;
  formTitle: string;
  formSubtitle: string;
  formButton: string;
  labels?: {
    name: string;
    email: string;
    phone: string;
    mostPopular: string;
  };
  thankYou: string;
  images: LandingPageImageSet;
  headlineOptions?: string[];
  mechanism?: { name: string; explanation: string; pillars: string[] };
  offer?: { promise: string; reasonToBuyNow: string; objections: string[] };
  imagePrompts?: {
    hero: string;
    depoimentos: string;
    agitacao: string;
    passos: string;
    mockups: string;
    bonus: string;
    autoridade: string;
  };
}

export interface GenerateRequest {
  url?: string;
  language: LanguageKey;
  variants: number;
  productName?: string;
  basicPrice?: string;
  completePrice?: string;
  audience?: string;
  tone: string;
}

export interface GenerateResponse {
  scraped: boolean;
  language: LanguageKey;
  prompt?: string;
  models: Model[];
  pageContentDireto?: LandingPageContent;
  pageContentCenario?: LandingPageContent;
}

export interface PublishRequest {
  prompt: string;
  template: 'direto' | 'cenario';
  language: LanguageKey;
  content?: LandingPageContent;
  label?: string;
}

export interface PublishedPage {
  id: string;
  slug: string;
  label: string;
  template: 'direto' | 'cenario';
  language: LanguageKey;
  content: LandingPageContent;
  createdAt: number;
}

export interface LeadSubmission {
  pageId: string;
  plan: 'basic' | 'complete';
  name: string;
  email: string;
  phone?: string;
}
