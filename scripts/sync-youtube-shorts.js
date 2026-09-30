#!/usr/bin/env node
/**
 * Sync YouTube Shorts into src/content/youtube_shorts.json
 * by scraping the public channel Shorts tab (no API key required).
 *
 * Usage:
 *   node scripts/sync-youtube-shorts.js
 */
const { writeFileSync, readFileSync, existsSync } = require("fs");
const { join } = require("path");
const https = require("https");

const CHANNEL_ID = "UCOWBpCOviTpkxXTq97OwTlA";
const CHANNEL_URL = "https://www.youtube.com/@hiteshdodiyaa";
const SHORTS_URL = "https://www.youtube.com/@hiteshdodiyaa/shorts";
const OUTPUT_PATH = join(__dirname, "..", "src", "content", "youtube_shorts.json");

function decodeHtmlEntities(value = "") {
  return String(value)
    .replace(/\\u0026/g, "&")
    .replace(/\\u003c/g, "<")
    .replace(/\\u003e/g, ">")
    .replace(/\\"/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

function parseViewsLabel(label = "") {
  const cleaned = String(label).toLowerCase().replace(/,/g, "").trim();
  if (!cleaned || cleaned.includes("no views")) return 0;
  const match = cleaned.match(/([\d.]+)\s*([kmb])?\s*views?/);
  if (!match) {
    const digits = cleaned.match(/(\d+)/);
    return digits ? Number(digits[1]) : 0;
  }
  const amount = Number(match[1]);
  const unit = match[2];
  if (unit === "k") return Math.round(amount * 1000);
  if (unit === "m") return Math.round(amount * 1000000);
  if (unit === "b") return Math.round(amount * 1000000000);
  return Math.round(amount);
}

function parseShortsPage(html) {
  const pairs = [
    ...html.matchAll(
      /"accessibilityText":"((?:\\.|[^"\\])*)"[^]{0,800}?"videoId":"([a-zA-Z0-9_-]{11})"/g
    ),
    ...html.matchAll(
      /"videoId":"([a-zA-Z0-9_-]{11})"[^]{0,800}?"accessibilityText":"((?:\\.|[^"\\])*)"/g
    ),
  ];

  const byId = new Map();

  pairs.forEach((match) => {
    let accessibilityText;
    let id;
    if (match[0].includes('"accessibilityText"') && match[0].indexOf('"accessibilityText"') < match[0].indexOf('"videoId"')) {
      accessibilityText = match[1];
      id = match[2];
    } else if (match[2] && match[2].length !== 11) {
      id = match[1];
      accessibilityText = match[2];
    } else {
      // First pattern: text then id; second pattern: id then text
      if (/^[a-zA-Z0-9_-]{11}$/.test(match[1]) && match[2]) {
        id = match[1];
        accessibilityText = match[2];
      } else {
        accessibilityText = match[1];
        id = match[2];
      }
    }

    if (!id || byId.has(id)) return;

    const decoded = decodeHtmlEntities(accessibilityText);
    if (!/play Short/i.test(decoded)) return;

    const title = decoded.replace(/,\s*[\d.,]+[KMB]?\s*views?\s*-\s*play Short$/i, "")
      .replace(/,\s*No views\s*-\s*play Short$/i, "")
      .replace(/\s*-\s*play Short$/i, "")
      .trim();

    const viewsMatch = decoded.match(/,\s*((?:No views)|(?:[\d.,]+[KMB]?\s*views?))\s*-\s*play Short/i);
    const views = parseViewsLabel(viewsMatch ? viewsMatch[1] : "");

    byId.set(id, {
      id,
      title: title || id,
      description: "",
      url: `https://www.youtube.com/shorts/${id}`,
      embedUrl: `https://www.youtube.com/embed/${id}`,
      thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
      publishedAt: null,
      views,
      isShort: true,
    });
  });

  return [...byId.values()];
}

function fetchText(url) {
  return new Promise((resolve, reject) => {
    https
      .get(
        url,
        {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept-Language": "en-US,en;q=0.9",
          },
        },
        (res) => {
          if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
            fetchText(res.headers.location).then(resolve).catch(reject);
            return;
          }
          if (res.statusCode !== 200) {
            reject(new Error(`YouTube Shorts page request failed (${res.statusCode})`));
            res.resume();
            return;
          }
          let data = "";
          res.setEncoding("utf8");
          res.on("data", (chunk) => {
            data += chunk;
          });
          res.on("end", () => resolve(data));
        }
      )
      .on("error", reject);
  });
}

async function syncYouTubeShorts() {
  let remoteError = null;
  let shorts = [];

  try {
    const html = await fetchText(SHORTS_URL);
    shorts = parseShortsPage(html);
  } catch (error) {
    remoteError = error.message;
  }

  let existing = { shorts: [] };
  if (existsSync(OUTPUT_PATH)) {
    try {
      existing = JSON.parse(readFileSync(OUTPUT_PATH, "utf8"));
    } catch {
      existing = { shorts: [] };
    }
  }

  if (!shorts.length && existing.shorts?.length) {
    shorts = existing.shorts;
  }

  const payload = {
    channelUrl: CHANNEL_URL,
    shortsUrl: SHORTS_URL,
    channelId: CHANNEL_ID,
    channelTitle: existing.channelTitle || "Hitesh Dodiya",
    syncedAt: new Date().toISOString(),
    shorts,
  };

  const next = JSON.stringify(payload, null, 2) + "\n";
  const prev = existsSync(OUTPUT_PATH) ? readFileSync(OUTPUT_PATH, "utf8") : "";
  const unchanged = next === prev;

  if (!unchanged) {
    writeFileSync(OUTPUT_PATH, next);
  }

  return {
    ...payload,
    unchanged,
    source: remoteError ? "seed" : "youtube-shorts-page",
    remoteError,
  };
}

if (require.main === module) {
  syncYouTubeShorts()
    .then((payload) => {
      console.log(
        `${payload.unchanged ? "No changes:" : "Synced"} ${payload.shorts.length} YouTube Shorts (${payload.source})${
          payload.remoteError ? ` [page warning: ${payload.remoteError}]` : ""
        }`
      );
    })
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = { syncYouTubeShorts };
