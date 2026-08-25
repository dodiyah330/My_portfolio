const ACTIVITY_ID_RE = /activity-(\d+)/i;

export function getActivityIdFromUrl(url = "") {
  const match = String(url).match(ACTIVITY_ID_RE);
  return match ? match[1] : null;
}

export function stripHtml(value = "") {
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

export function makeTitle(content = "", max = 96) {
  const firstLine = stripHtml(content).split("\n").map((line) => line.trim()).find(Boolean) || "LinkedIn update";
  if (firstLine.length <= max) return firstLine;
  const cut = firstLine.slice(0, max);
  const soft = cut.includes(" ") ? cut.slice(0, cut.lastIndexOf(" ")) : cut;
  return `${soft}…`;
}

export function makeExcerpt(content = "", max = 180) {
  const text = stripHtml(content).replace(/\s+/g, " ").trim();
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const soft = cut.includes(" ") ? cut.slice(0, cut.lastIndexOf(" ")) : cut;
  return `${soft}…`;
}

export function normalizePost(raw = {}) {
  const url = raw.url || raw.link || "";
  const id = raw.id || getActivityIdFromUrl(url) || String(raw.guid || raw.slug || Date.now());
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

export function mergePosts(...collections) {
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

export function formatPostDate(iso) {
  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return "";
  }
}
