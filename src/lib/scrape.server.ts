export interface ScrapedInfo {
  title?: string;
  description?: string;
  bodyText?: string;
}

export async function scrapeUrl(url: string): Promise<ScrapedInfo | null> {
  if (!url || !url.startsWith("http")) return null;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });
    clearTimeout(timeout);
    if (!response.ok) return null;
    const html = await response.text();

    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const metaDescMatch =
      html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i) ||
      html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']description["']/i) ||
      html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i);

    const cleanText = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 1500);

    return {
      title: titleMatch ? titleMatch[1].trim() : undefined,
      description: metaDescMatch ? metaDescMatch[1].trim() : undefined,
      bodyText: cleanText,
    };
  } catch {
    return null;
  }
}
