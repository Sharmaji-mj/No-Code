// utils/genflow-parser.ts
export type GenFile = { path: string; language: string; content: string };

const LANG_FROM_EXT: Record<string,string> = {
  html:"html", css:"css", js:"javascript", mjs:"javascript", cjs:"javascript",
  ts:"typescript", tsx:"tsx", jsx:"jsx", json:"json", md:"markdown",
  py:"python", sh:"text", yml:"yaml", yaml:"yaml", dockerfile:"dockerfile"
};

const filenameCommentREs = [
  /^<!--\s*filename:\s*([^\s>]+)\s*-->/i,   // HTML
  /^\/\/\s*filename:\s*([^\s]+)\s*$/i,      // JS/TS/TSX/JSON/CSS line
  /^\/\*\s*filename:\s*([^\s]+)\s*\*\//i,   // block comments
  /^#\s*filename:\s*([^\s]+)\s*$/i          // Python/Shell
];

function langFromFence(fenceLang?: string, fallbackExt?: string) {
  if (fenceLang) return fenceLang.toLowerCase();
  if (!fallbackExt) return "text";
  return LANG_FROM_EXT[fallbackExt.toLowerCase()] || "text";
}

function extFromPath(p: string) {
  const m = p.match(/\.([^.]+)$/);
  return m ? m[1].toLowerCase() : (p.toLowerCase()==="dockerfile" ? "dockerfile" : "");
}

export function tryClarificationJSON(text: string):
  | { need_clarification: true; questions: string[] }
  | null {
  const m = text.match(/```json[\s\S]*?({[\s\S]*?})[\s\S]*?```/i);
  if (!m) return null;
  try {
    const obj = JSON.parse(m[1]);
    if (obj?.need_clarification && Array.isArray(obj.questions)) return obj;
  } catch {}
  return null;
}

export function parseFilesFromMultiBlocks(text: string): GenFile[] {
  const files: GenFile[] = [];
  const fence = /```([a-zA-Z0-9+-]*)\n([\s\S]*?)```/g;
  let m: RegExpExecArray | null;
  while ((m = fence.exec(text)) !== null) {
    const fenceLang = (m[1] || "").trim();
    let body = m[2] || "";
    // filename detection
    let path = "";
    const firstLine = body.split("\n")[0] || "";
    for (const re of filenameCommentREs) {
      const fm = firstLine.match(re);
      if (fm) { path = fm[1].replace(/^\.\//,""); break; }
    }
    if (path) {
      body = body.split("\n").slice(1).join("\n");
    } else {
      // heuristic names
      const guess = fenceLang ? `file.${fenceLang}` : "file.txt";
      path = guess.toLowerCase();
    }
    const language = langFromFence(fenceLang, extFromPath(path));
    files.push({ path, language, content: body });
  }
  return files;
}

// Older JSON schema fallback: { files: [{path, language, content}, ...] }
export function parseFilesFromLegacyJSON(text: string): GenFile[] {
  const m = text.match(/```json[\s\S]*?({[\s\S]*?})[\s\S]*?```/i);
  if (!m) return [];
  try {
    const obj = JSON.parse(m[1]);
    if (Array.isArray(obj?.files)) {
      return obj.files.map((f: any) => ({
        path: (f.path || "").replace(/^\.\//, ""),
        language: f.language || "text",
        content: f.content || ""
      }));
    }
  } catch {}
  return [];
}

export function parseAnyFiles(text: string): { files: GenFile[]; clarification?: string[] } {
  const clar = tryClarificationJSON(text);
  if (clar) return { files: [], clarification: clar.questions };

  const multi = parseFilesFromMultiBlocks(text);
  if (multi.length) return { files: multi };

  const legacy = parseFilesFromLegacyJSON(text);
  if (legacy.length) return { files: legacy };

  return { files: [] };
}
