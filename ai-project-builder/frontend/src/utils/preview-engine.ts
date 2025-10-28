// utils/preview-engine.ts
import type { GenFile } from "./genflow-parser";

const norm = (p: string) => p.replace(/^\/+/, "").replace(/^\.\//, "");

export function buildPreviewURL(projectName: string, files: GenFile[]): string | null {
  const byPath = new Map(files.map(f => [norm(f.path), f]));
  const htmlCandidate =
    files.find(f => f.path.toLowerCase().endsWith("preview.html")) ||
    files.find(f => f.path.toLowerCase().endsWith("index.html")) ||
    null;

  let html = htmlCandidate?.content || "";
  if (!html) return null;

  // Inline CSS <link>
  html = html.replace(/<link[^>]+href=["']([^"']+\.css)["'][^>]*>/g, (_m, href) => {
    const f = byPath.get(norm(href));
    return f ? `<style>\n${f.content}\n</style>` : _m;
  });

  // Inline JS <script src="...">
  html = html.replace(/<script[^>]+src=["']([^"']+\.(?:m?js|jsx|tsx))["'][^>]*>\s*<\/script>/g, (_m, src) => {
    const f = byPath.get(norm(src));
    return f ? `<script>\n${f.content}\n</script>` : _m;
  });

  // Ensure a full HTML doc
  if (!/<!doctype/i.test(html)) {
    html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${projectName}</title></head><body>${html}</body></html>`;
  }

  const blob = new Blob([html], { type: "text/html" });
  return URL.createObjectURL(blob);
}
