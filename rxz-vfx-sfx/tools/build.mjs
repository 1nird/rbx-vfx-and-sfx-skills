// Builds dist/rxz-vfx-sfx-v<version>.zip from the two skills in the main pack.
// One source of truth: the skills are never duplicated in this folder, they are
// copied here at build time so the two downloads cannot drift apart.
import { readFileSync, existsSync, readdirSync, statSync, mkdirSync, rmSync, cpSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join, extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const NAME = "rxz-vfx-sfx";
const { version } = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));

const SOURCE = resolve(root, "..", "rxz-roblox-skills", "skills");
const SKILLS = ["roblox-vfx", "roblox-sfx"];
const DOCS = ["START-HERE.txt", "README.md", "CHANGELOG.md", "LICENSE.txt"];

// A user's own notes and caches must never travel. LOCAL.template.md is left
// out too: this pack has no setup step for it to describe.
const BAN = new Set([
  "LOCAL.md", "LOCAL.template.md", "__pycache__", ".git", "node_modules",
  "dist", "tools", "work", ".DS_Store", "Thumbs.db",
]);
const BAN_EXT = new Set([".pyc", ".zip"]);
// The whole point of this pack: no setup skill, nothing to copy and fill in.
const FORBIDDEN = /roblox-skills-setup|LOCAL\.template/;

function walk(dir, out) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (BAN.has(entry.name)) continue;
    if (BAN_EXT.has(extname(entry.name))) {
      throw new Error(`refusing to ship ${join(dir, entry.name)}`);
    }
    const path = join(dir, entry.name);
    if (entry.isDirectory()) walk(path, out);
    else out.push(path);
  }
}

if (!existsSync(SOURCE)) {
  throw new Error(`main pack not found at ${SOURCE} (this build copies its two skills)`);
}

const missingDocs = DOCS.filter((name) => !existsSync(join(root, name)));
if (missingDocs.length) throw new Error(`missing from pack: ${missingDocs.join(", ")}`);

const shippable = [];
for (const skill of SKILLS) {
  const dir = join(SOURCE, skill);
  if (!existsSync(join(dir, "SKILL.md"))) throw new Error(`${skill} has no SKILL.md`);
  const found = [];
  walk(dir, found);
  shippable.push({ skill, dir, files: found });
}

// Both skills must be the standalone ones, not the pack's setup-skill versions.
for (const { dir, files } of shippable) {
  for (const file of files) {
    if (![".md", ".txt", ".py", ".lua", ".json"].includes(extname(file))) continue;
    const hit = readFileSync(file, "utf8").match(FORBIDDEN);
    if (hit) throw new Error(`${file} still references "${hit[0]}" - not standalone`);
  }
}

const stageRoot = join(root, "dist", "stage");
const stage = join(stageRoot, NAME);
rmSync(stageRoot, { recursive: true, force: true });
mkdirSync(stage, { recursive: true });

for (const doc of DOCS) cpSync(join(root, doc), join(stage, doc));
const staged = [...DOCS];
const skip = (src) => {
  const base = src.split(/[\\/]/).pop();
  return !BAN.has(base) && !BAN_EXT.has(extname(base));
};
for (const { skill, dir, files } of shippable) {
  cpSync(dir, join(stage, "skills", skill), { recursive: true, filter: skip });
  for (const file of files) {
    staged.push(`skills/${skill}/${file.slice(dir.length + 1).replace(/\\/g, "/")}`);
  }
}

for (const skill of SKILLS) {
  const skillMd = join(stage, "skills", skill, "SKILL.md");
  if (!existsSync(skillMd)) throw new Error(`staged ${skill} is missing SKILL.md`);
  const head = readFileSync(skillMd, "utf8").replace(/\r\n/g, "\n");
  if (!head.startsWith(`---\nname: ${skill}\n`)) {
    throw new Error(`staged ${skill}/SKILL.md does not declare name: ${skill}`);
  }
}

const zip = join(root, "dist", `${NAME}-v${version}.zip`);
execFileSync("py", [join(root, "tools", "zip.py"), stage, zip], { stdio: "inherit" });

console.log(`  ${NAME} v${version}`);
console.log(`  ${zip}`);
console.log(`  ${staged.length} files, ${Math.round(statSync(zip).size / 1024)} KB`);
