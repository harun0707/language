import { GEMINI_API_KEY } from "./config";
import type { NewsArticle } from "./serper";

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{ text: string }>;
    };
  }>;
}

export async function generateLinkedInPost(article: NewsArticle): Promise<string> {
  const prompt = `You are a social media expert for a language learning app called LingLingui.
Generate an engaging LinkedIn post based on this news article.

Article Title: ${article.title}
Article Snippet: ${article.snippet}
Source: ${article.source}

Requirements:
- Write in a professional yet conversational tone
- Start with a hook (question or bold statement)
- Include 3-5 relevant insights or tips about language learning
- Mention how technology (like LingLingui app) helps with language learning
- End with a call-to-action question to encourage engagement
- Use 3-5 relevant hashtags at the end
- Keep it between 150-250 words
- Do NOT include the article link
- Format with line breaks for readability

Write only the post content, nothing else.`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 500,
        },
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
  }

  const data = (await response.json()) as GeminiResponse;

  if (!data.candidates || data.candidates.length === 0) {
    throw new Error("Gemini returned no candidates");
  }

  const text = data.candidates[0].content.parts[0].text;
  return text.trim();
}
