const { readFileSync, writeFileSync, existsSync } = require("fs");
const { join } = require("path");

const ACTIVITY_ID_RE = /activity-(\d+)/i;

function stripHtml(value = "") {
  return String(value)
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/gi, "$1")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\r/g, "")
    .trim();
}

function makeTitle(content = "", max = 96) {
  const firstLine = stripHtml(content).split("\n").map((line) => line.trim()).find(Boolean) || "LinkedIn update";
  if (firstLine.length <= max) return firstLine;
  const cut = firstLine.slice(0, max);
  const soft = cut.includes(" ") ? cut.slice(0, cut.lastIndexOf(" ")) : cut;
  return `${soft}…`;
}

function makeExcerpt(content = "", max = 180) {
  const text = stripHtml(content).replace(/\s+/g, " ").trim();
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const soft = cut.includes(" ") ? cut.slice(0, cut.lastIndexOf(" ")) : cut;
  return `${soft}…`;
}

function getActivityIdFromUrl(url = "") {
  const match = String(url).match(ACTIVITY_ID_RE);
  return match ? match[1] : null;
}

function normalizePost(raw = {}) {
  const url = raw.url || raw.link || "";
  const id = raw.id || getActivityIdFromUrl(url) || String(raw.guid || Date.now());
  const content = stripHtml(raw.content || raw.description || raw.summary || "");
  const publishedAt = raw.publishedAt || raw.isoDate || raw.pubDate || new Date().toISOString();

  return {
    id: String(id),
    slug: raw.slug || `linkedin-${id}`,
    title: raw.title && raw.title !== "LinkedIn Post" ? stripHtml(raw.title) : makeTitle(content),
    excerpt: raw.excerpt || makeExcerpt(content),
    content,
    url,
    publishedAt: new Date(publishedAt).toISOString(),
    image: raw.image || raw.enclosureUrl || null,
    reactions: typeof raw.reactions === "number" ? raw.reactions : null,
    source: raw.source || "linkedin",
    author: raw.author || "Hitesh Dodiya",
  };
}

function mergePosts(...collections) {
  const byId = new Map();
  collections.flat().forEach((item) => {
    if (!item) return;
    const post = normalizePost(item);
    if (!post.url && !post.content) return;
    const existing = byId.get(post.id);
    if (!existing) {
      byId.set(post.id, post);
      return;
    }
    byId.set(post.id, {
      ...existing,
      ...post,
      image: post.image || existing.image,
      reactions: post.reactions ?? existing.reactions,
      content: post.content?.length > existing.content?.length ? post.content : existing.content,
      excerpt: post.excerpt || existing.excerpt,
      title: post.title || existing.title,
    });
  });
  return Array.from(byId.values()).sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

function extractTag(block, tag) {
  const cdata = block.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`, "i"));
  if (cdata) return cdata[1].trim();
  const plain = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return plain ? plain[1].trim() : "";
}

function parseRss(xml = "") {
  const items = [];
  const matches = xml.match(/<item[\s\S]*?<\/item>/gi) || [];
  matches.forEach((block) => {
    const link = extractTag(block, "link") || extractTag(block, "guid");
    const title = extractTag(block, "title");
    const description = extractTag(block, "content:encoded") || extractTag(block, "description");
    const pubDate = extractTag(block, "pubDate") || extractTag(block, "dc:date");
    const enclosure = block.match(/<enclosure[^>]*url=["']([^"']+)["']/i);
    const media = block.match(/<media:content[^>]*url=["']([^"']+)["']/i);
    items.push({
      title,
      url: link,
      content: description,
      pubDate,
      image: (enclosure && enclosure[1]) || (media && media[1]) || null,
      source: "linkedin-rss",
    });
  });
  return items;
}

async function fetchRssPosts(feedUrl) {
  if (!feedUrl) return [];
  const response = await fetch(feedUrl, {
    headers: {
      Accept: "application/rss+xml, application/xml, text/xml, */*",
      "User-Agent": "HiteshPortfolioBlogBot/1.0",
    },
  });
  if (!response.ok) {
    throw new Error(`RSS fetch failed (${response.status})`);
  }
  const xml = await response.text();
  return parseRss(xml);
}

function loadSeed(seedPath) {
  if (!existsSync(seedPath)) {
    return { profileUrl: "https://www.linkedin.com/in/hitesh-dodiya1/", posts: [] };
  }
  return JSON.parse(readFileSync(seedPath, "utf8"));
}

async function syncLinkedInPosts({
  seedPath = join(process.cwd(), "src/content/linkedin_posts.json"),
  feedUrl = process.env.LINKEDIN_RSS_FEED_URL,
  write = true,
} = {}) {
  const seed = loadSeed(seedPath);
  let remotePosts = [];
  let remoteError = null;

  if (feedUrl) {
    try {
      remotePosts = await fetchRssPosts(feedUrl);
    } catch (error) {
      remoteError = error.message;
    }
  }

  const posts = mergePosts(seed.posts || [], remotePosts);
  const previous = JSON.stringify(seed.posts || []);
  const next = JSON.stringify(posts);
  const unchanged = previous === next;

  const payload = {
    profileUrl: seed.profileUrl || "https://www.linkedin.com/in/hitesh-dodiya1/",
    syncedAt: unchanged && seed.syncedAt ? seed.syncedAt : new Date().toISOString(),
    source: feedUrl ? "seed+rss" : "seed",
    remoteError,
    posts,
  };

  if (write && !unchanged) {
    writeFileSync(seedPath, `${JSON.stringify(payload, null, 2)}\n`);
  }

  return { ...payload, unchanged };
}

module.exports = {
  syncLinkedInPosts,
  mergePosts,
  normalizePost,
  parseRss,
  fetchRssPosts,
  stripHtml,
};
