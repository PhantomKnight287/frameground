#!/usr/bin/env node
/**
 * Pulls a logo from svgl (https://svgl.app) into the repo and points a track at it.
 *
 *   node scripts/add-track-logo.mjs <track-slug> [svgl-title]
 *   node scripts/add-track-logo.mjs react
 *   node scripts/add-track-logo.mjs vue "Vue.js"
 *
 * Logos are vendored instead of hot-linked: the web app sends
 * `Cross-Origin-Embedder-Policy: require-corp`, which blocks cross-origin images
 * that don't opt in with CORP/CORS headers (this is what broke the utfs.io logos).
 * Serving them from our own origin sidesteps that entirely.
 *
 * Two files are always written per track, so the light/dark convention holds even
 * when svgl only ships one variant:
 *   public/tracks/<slug>.svg        used in light mode
 *   public/tracks/<slug>-dark.svg   used in dark mode
 */
import { mkdirSync, writeFileSync, readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

// Every app that renders a track logo needs its own copy: `logo` is a
// same-origin path and each Next app serves its own `public/`.
const PUBLIC_DIRS = [
  join(root, "apps/web/public/tracks"),
  join(root, "apps/admin/public/tracks"),
];

const [slug, title] = process.argv.slice(2);

if (!slug) {
  console.error("Usage: node scripts/add-track-logo.mjs <track-slug> [svgl-title]");
  process.exit(1);
}

const search = title || slug;

const res = await fetch(`https://api.svgl.app?search=${encodeURIComponent(search)}`);
if (!res.ok) {
  console.error(`svgl search failed: ${res.status} ${res.statusText}`);
  process.exit(1);
}

const results = await res.json();
if (!results.length) {
  console.error(`No svgl logo found for "${search}".`);
  process.exit(1);
}

const match =
  results.find((item) => item.title.toLowerCase() === search.toLowerCase()) ??
  results[0];

if (match.title.toLowerCase() !== search.toLowerCase()) {
  console.log(`No exact match for "${search}", using "${match.title}".`);
}

// `route` is either a single URL or a { light, dark } pair.
const light = typeof match.route === "string" ? match.route : match.route.light;
const dark = typeof match.route === "string" ? match.route : match.route.dark;

const download = async (url) => {
  const svg = await fetch(url);
  if (!svg.ok) throw new Error(`Failed to download ${url}: ${svg.status}`);
  return await svg.text();
};

const files = {
  [`${slug}.svg`]: await download(light),
  [`${slug}-dark.svg`]: await download(dark),
};

for (const dir of PUBLIC_DIRS) {
  mkdirSync(dir, { recursive: true });
  for (const [name, content] of Object.entries(files)) {
    writeFileSync(join(dir, name), content);
    console.log(`Wrote ${join(dir, name).replace(`${root}/`, "")}`);
  }
}

const trackJsonPath = join(root, "challenges", slug, "track.json");
const logo = `/tracks/${slug}.svg`;

if (existsSync(trackJsonPath)) {
  const track = JSON.parse(readFileSync(trackJsonPath, "utf-8"));
  track.logo = logo;
  writeFileSync(trackJsonPath, `${JSON.stringify(track, null, 2)}\n`);
  console.log(`Set logo to "${logo}" in challenges/${slug}/track.json`);
} else {
  console.log(
    `No challenges/${slug}/track.json yet - use "logo": "${logo}" when you create it.`
  );
}

console.log(`\nSource: ${match.title} (${match.url}) via svgl.app`);
console.log("Run the db seed script to push the change to the database.");
