import { SERPER_API_KEY } from "./config";

export interface NewsArticle {
  title: string;
  snippet: string;
  link: string;
  source: string;
  date?: string;
}

const SEARCH_QUERIES = [
  "language learning tips 2025",
  "multilingual app trending",
  "language education technology",
  "polyglot learning methods",
  "AI language learning",
];

export async function fetchTrendingNews(): Promise<NewsArticle[]> {
  const query = SEARCH_QUERIES[Math.floor(Math.random() * SEARCH_QUERIES.length)];

  const response = await fetch("https://google.serper.dev/news", {
    method: "POST",
    headers: {
      "X-API-KEY": SERPER_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      q: query,
      num: 5,
      gl: "us",
      hl: "en",
    }),
  });

  if (!response.ok) {
    throw new Error(`Serper API error: ${response.status} ${response.statusText}`);
  }

  const data = (await response.json()) as {
    news?: Array<{
      title: string;
      snippet: string;
      link: string;
      source: string;
      date?: string;
    }>;
  };

  if (!data.news || data.news.length === 0) {
    throw new Error("No news articles found from Serper");
  }

  return data.news.map((item) => ({
    title: item.title,
    snippet: item.snippet,
    link: item.link,
    source: item.source,
    date: item.date,
  }));
}
