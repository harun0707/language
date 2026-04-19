import { GEMINI_API_KEY } from "./config";
import type { NewsArticle } from "./serper";

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{ text: string }>;
    };
  }>;
}

// Ordered by preference; first available quota wins
const GEMINI_MODELS = [
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite",
  "gemini-2.5-flash-lite",
];

// Template-based fallback posts keyed to article topics
const POST_TEMPLATES: Record<string, string> = {
  "memory palace": `🏛️ Did you know ancient Romans memorized entire speeches using a technique called the Memory Palace?

The idea is simple: imagine walking through a familiar place and "placing" each word or concept at a specific location. When you need to recall it, you mentally walk back through that space.

Here's why it works so well for language learning:
→ Our brains are wired for spatial memory
→ Visual associations are stronger than rote repetition
→ It makes abstract vocabulary concrete and memorable

We've built this technique directly into LingLingui, alongside other proven memory methods like Active Recall and Spaced Repetition — so you can pick whatever works best for your brain.

What memory technique has worked best for you when learning a new language? Drop it in the comments! 👇

#LanguageLearning #MemoryTechniques #Polyglot #LingLingui #LanguageApp`,

  "spaced repetition": `🔁 The #1 reason people forget vocabulary? They review it too soon — or not often enough.

Spaced Repetition fixes this by scheduling reviews at the exact moment your brain is about to forget. The result: you spend less time studying and remember more.

3 things to know about Spaced Repetition:
→ Reviewing a word 5 times over 30 days beats 50 times in one week
→ Slightly difficult recall strengthens memory far more than easy recall
→ It works for ANY language, any skill level

LingLingui uses Spaced Repetition as one of its core study modes — right alongside the Feynman Technique and Memory Palace — so your vocabulary actually sticks.

Are you currently using Spaced Repetition in your language studies? Let me know below! 👇

#LanguageLearning #SpacedRepetition #Vocabulary #LingLingui #Polyglot`,

  default: `🌍 What if you could learn 3 languages at the same time — and actually remember them?

Most people think language learning requires years of grinding grammar books. But the science says otherwise.

The most effective learners focus on:
→ Context over translation (your brain learns meaning, not rules)
→ Pronunciation from day one (accent is far easier to fix early)
→ Consistent exposure over long marathon sessions
→ AI-powered feedback to catch mistakes faster

That's exactly what we built LingLingui for — a mobile app that lets you translate words, hear pronunciations, see AI-generated illustrations, and review with proven memory techniques, all in one place.

Language learning doesn't have to be boring or slow. The right tools make all the difference.

What's the hardest part of learning a new language for you? 👇

#LanguageLearning #Multilingual #Polyglot #LingLingui #EdTech`,
};

function buildFallbackPost(article: NewsArticle): string {
  const titleLower = article.title.toLowerCase();

  if (titleLower.includes("memory palace")) return POST_TEMPLATES["memory palace"];
  if (titleLower.includes("spaced repetition")) return POST_TEMPLATES["spaced repetition"];
  if (titleLower.includes("feynman")) {
    return `🧠 Richard Feynman had a rule: if you can't explain it simply, you don't understand it yet.

This principle applies perfectly to language learning.

Instead of memorizing grammar tables, try explaining a new rule out loud — as if teaching a friend who speaks no ${article.title.split(" ")[0]} at all. You'll instantly see the gaps in your understanding.

The Feynman Technique for vocabulary:
→ Learn a new word
→ Use it in 3 original sentences
→ Explain what it means without looking it up
→ If you stumble, review and repeat

LingLingui includes the Feynman Technique as one of its 5 built-in memory methods, alongside Spaced Repetition, Active Recall, Memory Palace, and Story Generation.

Which of these techniques have you tried? Which worked best? 👇

#LanguageLearning #FeynmanTechnique #Vocabulary #LingLingui #LearningTips`;
  }

  return POST_TEMPLATES["default"];
}

async function tryGeminiModel(model: string, prompt: string): Promise<string> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.8, maxOutputTokens: 500 },
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`${response.status} - ${errorText}`);
  }

  const data = (await response.json()) as GeminiResponse;
  if (!data.candidates || data.candidates.length === 0) {
    throw new Error("No candidates returned");
  }

  return data.candidates[0].content.parts[0].text.trim();
}

export async function generateLinkedInPost(article: NewsArticle): Promise<string> {
  const prompt = `You are a social media expert for a language learning app called LingLingui.
Generate an engaging LinkedIn post based on this topic.

Topic: ${article.title}
Context: ${article.snippet}

Requirements:
- Write in a professional yet conversational tone
- Start with a hook (question or bold statement)
- Include 3-5 relevant insights or tips about language learning
- Mention how technology (like LingLingui app) helps with language learning
- End with a call-to-action question to encourage engagement
- Use 3-5 relevant hashtags at the end
- Keep it between 150-250 words
- Format with line breaks for readability

Write only the post content, nothing else.`;

  for (const model of GEMINI_MODELS) {
    try {
      const text = await tryGeminiModel(model, prompt);
      console.log(`   Source: Gemini AI (${model})`);
      return text;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn(`   ⚠️  Model ${model} unavailable: ${msg.slice(0, 80)}`);
    }
  }

  console.warn("   ⚠️  All Gemini models unavailable, using built-in template.");
  return buildFallbackPost(article);
}
