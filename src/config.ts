import * as dotenv from "dotenv";
dotenv.config();

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required environment variable: ${key}`);
  return value;
}

export const GEMINI_API_KEY = requireEnv("GEMINI_API_KEY");
export const SERPER_API_KEY = requireEnv("SERPER_API_KEY");
export const LINKEDIN_ACCESS_TOKEN = requireEnv("LINKEDIN_ACCESS_TOKEN");

// Fix duplicate URN prefix if present
const rawUrn = requireEnv("LINKEDIN_PERSON_URN");
export const LINKEDIN_PERSON_URN = rawUrn.replace(
  /^urn:li:person:urn:li:person:/,
  "urn:li:person:"
);

// Cron schedule: default 09:00 every weekday (Mon-Fri)
export const CRON_SCHEDULE = process.env.CRON_SCHEDULE ?? "0 9 * * 1-5";
