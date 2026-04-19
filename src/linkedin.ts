import { LINKEDIN_ACCESS_TOKEN, LINKEDIN_PERSON_URN } from "./config";

interface LinkedInPostResponse {
  id: string;
}

export async function postToLinkedIn(content: string): Promise<string> {
  const body = {
    author: LINKEDIN_PERSON_URN,
    lifecycleState: "PUBLISHED",
    specificContent: {
      "com.linkedin.ugc.ShareContent": {
        shareCommentary: {
          text: content,
        },
        shareMediaCategory: "NONE",
      },
    },
    visibility: {
      "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
    },
  };

  const response = await fetch("https://api.linkedin.com/v2/ugcPosts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LINKEDIN_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
      "X-Restli-Protocol-Version": "2.0.0",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`LinkedIn API error: ${response.status} - ${errorText}`);
  }

  const data = (await response.json()) as LinkedInPostResponse;
  return data.id;
}

export async function getLinkedInProfile(): Promise<{ id: string; name: string }> {
  const response = await fetch("https://api.linkedin.com/v2/userinfo", {
    headers: {
      Authorization: `Bearer ${LINKEDIN_ACCESS_TOKEN}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`LinkedIn profile fetch error: ${response.status} - ${errorText}`);
  }

  const data = (await response.json()) as { sub: string; name: string };
  return { id: data.sub, name: data.name };
}
