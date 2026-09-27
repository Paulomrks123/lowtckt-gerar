import type { LeadSubmission, PublishedPage } from "@/types";

// In-memory store (no database configured). Pages live as long as the server instance.
const globalStore = globalThis as unknown as {
  __publishedPages?: Map<string, PublishedPage>;
  __leads?: (LeadSubmission & { timestamp: number })[];
};

export const publishedPages: Map<string, PublishedPage> =
  globalStore.__publishedPages ?? (globalStore.__publishedPages = new Map());

export const leads: (LeadSubmission & { timestamp: number })[] =
  globalStore.__leads ?? (globalStore.__leads = []);
