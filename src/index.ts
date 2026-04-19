import cron from "node-cron";
import { fetchTrendingNews } from "./serper";
import { generateLinkedInPost } from "./gemini";
import { postToLinkedIn } from "./linkedin";
import { CRON_SCHEDULE } from "./config";

async function runShareCycle(): Promise<void> {
  const timestamp = new Date().toISOString();
  console.log(`\n[${timestamp}] Starting LinkedIn auto-share cycle...`);

  try {
    // 1. Fetch trending news
    console.log("📰 Fetching trending news via Serper...");
    const articles = await fetchTrendingNews();
    const article = articles[0];
    console.log(`   Found: "${article.title}" (${article.source})`);

    // 2. Generate post content with Gemini
    console.log("🤖 Generating LinkedIn post with Gemini AI...");
    const postContent = await generateLinkedInPost(article);
    console.log("   Generated post preview:");
    console.log("   " + postContent.split("\n")[0].slice(0, 80) + "...");

    // 3. Post to LinkedIn
    console.log("📤 Posting to LinkedIn...");
    const postId = await postToLinkedIn(postContent);
    console.log(`✅ Successfully posted! Post ID: ${postId}`);
    console.log("   View at: https://www.linkedin.com/feed/");

    return;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`❌ Error during share cycle: ${message}`);
    throw error;
  }
}

async function main(): Promise<void> {
  const runOnce = process.argv.includes("--once");

  if (runOnce) {
    console.log("🚀 Running single share cycle (--once mode)...");
    await runShareCycle();
    process.exit(0);
  }

  console.log("🔄 LinkedIn Auto-Share Scheduler started");
  console.log(`   Schedule: "${CRON_SCHEDULE}" (weekdays at 09:00 by default)`);
  console.log("   Run 'npm run share:now' to trigger a post immediately.\n");

  if (!cron.validate(CRON_SCHEDULE)) {
    throw new Error(`Invalid cron expression: "${CRON_SCHEDULE}"`);
  }

  cron.schedule(CRON_SCHEDULE, async () => {
    try {
      await runShareCycle();
    } catch {
      // Errors already logged inside runShareCycle
    }
  });

  // Optionally run once on startup so you see it working immediately
  if (process.env.RUN_ON_START === "true") {
    await runShareCycle().catch(() => {});
  }
}

main().catch((err) => {
  console.error("Fatal error:", err instanceof Error ? err.message : err);
  process.exit(1);
});
