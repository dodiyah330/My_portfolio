const { readFileSync, existsSync } = require("fs");
const { join } = require("path");
const {
  syncLinkedInPosts,
  mergePosts,
} = require("../../scripts/linkedin-posts-lib");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json",
  "Cache-Control": "public, s-maxage=900, stale-while-revalidate=3600",
};

function loadLocalSeed() {
  const candidates = [
    join(__dirname, "../../src/content/linkedin_posts.json"),
    join(process.cwd(), "src/content/linkedin_posts.json"),
    join(process.cwd(), "linkedin_posts.json"),
  ];

  for (const path of candidates) {
    if (existsSync(path)) {
      return JSON.parse(readFileSync(path, "utf8"));
    }
  }

  return {
    profileUrl: "https://www.linkedin.com/in/hitesh-dodiya1/",
    posts: [],
  };
}

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders, body: "" };
  }

  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const seed = loadLocalSeed();
    const live = await syncLinkedInPosts({
      write: false,
      feedUrl: process.env.LINKEDIN_RSS_FEED_URL,
    });

    const posts = mergePosts(seed.posts || [], live.posts || []);

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        profileUrl: live.profileUrl || seed.profileUrl,
        syncedAt: new Date().toISOString(),
        source: process.env.LINKEDIN_RSS_FEED_URL ? "seed+rss" : "seed",
        count: posts.length,
        posts,
      }),
    };
  } catch (error) {
    const seed = loadLocalSeed();
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        profileUrl: seed.profileUrl,
        syncedAt: seed.syncedAt || new Date().toISOString(),
        source: "seed-fallback",
        count: (seed.posts || []).length,
        posts: seed.posts || [],
        warning: error.message,
      }),
    };
  }
};
