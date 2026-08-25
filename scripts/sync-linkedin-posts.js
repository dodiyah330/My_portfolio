#!/usr/bin/env node
/**
 * Sync LinkedIn posts into src/content/linkedin_posts.json
 *
 * Existing posts are kept forever.
 * New posts are merged automatically when LINKEDIN_RSS_FEED_URL is set
 * (RSS.app / FetchRSS LinkedIn activity feed).
 *
 * Usage:
 *   LINKEDIN_RSS_FEED_URL="https://..." node scripts/sync-linkedin-posts.js
 */
const { syncLinkedInPosts } = require("./linkedin-posts-lib");

syncLinkedInPosts()
  .then((payload) => {
    console.log(
      `${payload.unchanged ? "No changes:" : "Synced"} ${payload.posts.length} LinkedIn posts (${payload.source})${
        payload.remoteError ? ` [rss warning: ${payload.remoteError}]` : ""
      }`
    );
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
