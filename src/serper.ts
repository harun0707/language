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

// Fallback topics used when Serper API is unavailable
const FALLBACK_TOPICS: NewsArticle[] = [
  {
    title: "The Power of Spaced Repetition in Language Learning",
    snippet: "Spaced repetition is one of the most scientifically-backed methods for memorizing vocabulary, helping learners retain words 3x faster.",
    link: "",
    source: "LingLingui Blog",
  },
  {
    title: "How AI is Revolutionizing the Way We Learn Languages",
    snippet: "Artificial intelligence now enables personalized pronunciation feedback, instant translations, and adaptive learning paths for language learners.",
    link: "",
    source: "LingLingui Blog",
  },
  {
    title: "Why Learning Multiple Languages Simultaneously Works",
    snippet: "Research shows that learning two or more languages at the same time can actually reinforce vocabulary retention through cross-linguistic connections.",
    link: "",
    source: "LingLingui Blog",
  },
  {
    title: "The Memory Palace Technique for Vocabulary Retention",
    snippet: "The ancient Method of Loci, or Memory Palace, is being rediscovered by modern language learners as a powerful tool for long-term vocabulary retention.",
    link: "",
    source: "LingLingui Blog",
  },
  {
    title: "From Zero to Conversational: A 90-Day Language Learning Framework",
    snippet: "Breaking language learning into focused 30-day sprints — pronunciation, core vocabulary, then grammar — dramatically accelerates conversational fluency.",
    link: "",
    source: "LingLingui Blog",
  },
  {
    title: "Immersive Learning: How Context Beats Translation",
    snippet: "Studies show that learning words in context rather than memorizing translations leads to 40% better long-term retention and faster recall.",
    link: "",
    source: "LingLingui Blog",
  },
  {
    title: "The Feynman Technique Applied to Language Learning",
    snippet: "Explaining grammar rules and new words in simple terms — as if teaching a child — is one of the fastest ways to solidify language knowledge.",
    link: "",
    source: "LingLingui Blog",
  },
];

async function fetchFromSerper(): Promise<NewsArticle[]> {
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

export async function fetchTrendingNews(): Promise<NewsArticle[]> {
  try {
    const articles = await fetchFromSerper();
    console.log("   Source: Serper (live news)");
    return articles;
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.warn(`   ⚠️  Serper unavailable (${msg}), using built-in topics.`);
    const topic = FALLBACK_TOPICS[Math.floor(Math.random() * FALLBACK_TOPICS.length)];
    return [topic];
  }
}
