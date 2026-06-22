import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const distDir = resolve(import.meta.dirname, "../dist/server");
const indexPath = resolve(distDir, "index.js");

let content = readFileSync(indexPath, "utf8");

if (content.includes("REDIRECT_INJECTED")) {
  console.log("Post-build: Redirect logic already present, skipping");
  process.exit(0);
}

const exportMatch = content.match(/export\s*\{([^}]+)\}\s*;/);
if (!exportMatch) {
  console.error("Post-build: Could not find export block");
  process.exit(1);
}

const exportContent = exportMatch[1];
const defaultMatch = exportContent.match(/(\w+)\s+as\s+default/);
if (!defaultMatch) {
  console.error("Post-build: Could not find default export");
  process.exit(1);
}

const defaultExportName = defaultMatch[1];

// The default export is a ServerEntry object with a .fetch() method
// (created by createServerEntry which wraps the RequestHandler)
content = `// REDIRECT_INJECTED
import { drizzle } from "drizzle-orm/d1";
import { count } from "drizzle-orm";
import { users } from "@ekajaya/database";

async function _checkUserCount(env) {
  if (!env?.DB) return;
  try {
    const db = drizzle(env.DB, { schema: { users } });
    const [row] = await db.select({ n: count() }).from(users);
    if (Number(row?.n ?? 0) === 0) {
      return new Response(null, { status: 307, headers: { Location: "/register" } });
    }
  } catch {
    // fall through
  }
}

async function _wrappedDefault(request, env) {
  const redirect = await _checkUserCount(env);
  if (redirect) return redirect;
  return ${defaultExportName}.fetch(request, env);
}

${content}`;

// Replace the original export to use wrapped default
const originalExport = exportMatch[0];
const newExport = originalExport.replace(
  `${defaultExportName} as default`,
  `_wrappedDefault as default`
);
content = content.replace(originalExport, newExport);

writeFileSync(indexPath, content);
console.log("Post-build: Injected redirect logic into dist/server/index.js");
