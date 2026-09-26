#!/usr/bin/env node
/**
 * Sync YouTube channel videos into src/content/youtube_videos.json
 * using the public Atom feed (no API key required).
 *
 * Usage:
 *   node scripts/sync-youtube-videos.js
 */
const { writeFileSync, readFileSync, existsSync } = require("fs");
const { join } = require("path");
const https = require("https");

const CHANNEL_ID = "UCOWBpCOviTpkxXTq97OwTlA";
const CHANNEL_URL = "https://www.youtube.com/@hiteshdodiyaa";
const FEED_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;
const OUTPUT_PATH = join(__dirname, "..", "src", "content", "youtube_videos.json");

function decodeXml(value = "") {
  return String(value)
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .trim();
}

function getMatch(block, re) {
  const match = block.match(re);
  return match ? decodeXml(match[1]) : "";
}

function parseFeed(xml) {
  const channelTitle = getMatch(xml, /<feed[\s\S]*?<title>([^<]+)<\/title>/) || "Hitesh Dodiya";
  return [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map((entry) => {
    const block = entry[1];
    const id = getMatch(block, /<yt:videoId>([^<]+)<\/yt:videoId>/);
    const title = getMatch(block, /<title>([^<]+)<\/title>/);
    const publishedAt = getMatch(block, /<published>([^<]+)<\/published>/);
    const thumbnail = getMatch(block, /<media:thumbnail url="([^"]+)"/);
    const description = getMatch(block, /<media:description>([\s\S]*?)<\/media:description>/);
    const views = Number(getMatch(block, /<media:statistics views="(\d+)"/) || 0);

    return {
      id,
      title,
      description: description.slice(0, 280),
      url: `https://www.youtube.com/watch?v=${id}`,
      embedUrl: `https://www.youtube.com/embed/${id}`,
      thumbnail: thumbnail || `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
      publishedAt,
      views,
    };
  }).filter((video) => video.id);
}

function fetchText(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { "User-Agent": "hitesh-portfolio-youtube-sync/1.0" } }, (res) => {
        if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          fetchText(res.headers.location).then(resolve).catch(reject);
          return;
        }
        if (res.statusCode !== 200) {
          reject(new Error(`YouTube feed request failed (${res.statusCode})`));
          res.resume();
          return;
        }
        let data = "";
        res.setEncoding("utf8");
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => resolve(data));
      })
      .on("error", reject);
  });
}

async function syncYouTubeVideos() {
  let remoteError = null;
  let videos = [];
  let channelTitle = "Hitesh Dodiya";

  try {
    const xml = await fetchText(FEED_URL);
    videos = parseFeed(xml);
    channelTitle = getMatch(xml, /<feed[\s\S]*?<title>([^<]+)<\/title>/) || channelTitle;
  } catch (error) {
    remoteError = error.message;
  }

  let existing = { videos: [] };
  if (existsSync(OUTPUT_PATH)) {
    try {
      existing = JSON.parse(readFileSync(OUTPUT_PATH, "utf8"));
    } catch {
      existing = { videos: [] };
    }
  }

  if (!videos.length && existing.videos?.length) {
    videos = existing.videos;
  }

  const payload = {
    channelUrl: CHANNEL_URL,
    channelId: CHANNEL_ID,
    channelTitle,
    syncedAt: new Date().toISOString(),
    videos,
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
    source: remoteError ? "seed" : "youtube-rss",
    remoteError,
  };
}

if (require.main === module) {
  syncYouTubeVideos()
    .then((payload) => {
      console.log(
        `${payload.unchanged ? "No changes:" : "Synced"} ${payload.videos.length} YouTube videos (${payload.source})${
          payload.remoteError ? ` [feed warning: ${payload.remoteError}]` : ""
        }`
      );
    })
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = { syncYouTubeVideos };
