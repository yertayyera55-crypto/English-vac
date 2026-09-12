const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const lookup = require("./api/reading-lookup");

// Existing environment variables take precedence. The key stays server-side.
const envFile = path.join(__dirname, ".env.local");
if (fs.existsSync(envFile)) process.loadEnvFile(envFile);

const assets = new Set(["index.html", "styles.css", "app.js", "reading-lab.js", "flashcards.js", "importer.js", "supabase-config.js"]);
const types = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8" };

function createServer() {
  return http.createServer(async (req, res) => {
    res.status = (code) => { res.statusCode = code; return res; };
    res.send = (body) => res.end(body);
    let pathname;
    try { pathname = decodeURIComponent(new URL(req.url, "http://localhost").pathname); }
    catch { res.writeHead(400).end("Bad request"); return; }
    if (pathname === "/api/reading-lookup") {
      let body = "";
      try {
        for await (const chunk of req) {
          body += chunk;
          if (Buffer.byteLength(body) > 16_384) { res.writeHead(413).end(); return; }
        }
        req.body = body;
        req.headers["x-forwarded-for"] = req.socket.remoteAddress;
        await lookup(req, res);
      } catch { if (!res.writableEnded) res.writeHead(500).end(); }
      return;
    }
    if (req.method !== "GET" && req.method !== "HEAD") { res.writeHead(405).end(); return; }
    const asset = pathname === "/" ? "index.html" : pathname.slice(1);
    // Never serve .env.local, .git, or server code.
    if (!assets.has(asset) && !/^vendor\/[\w-]+\.js$/.test(asset)) { res.writeHead(404).end("Not found"); return; }
    try {
      const contents = await fs.promises.readFile(path.join(__dirname, asset));
      res.writeHead(200, { "Content-Type": types[path.extname(asset)] || "application/octet-stream", "Cache-Control": "no-cache" });
      res.end(req.method === "HEAD" ? undefined : contents);
    } catch { res.writeHead(404).end("Not found"); }
  });
}

if (require.main === module) {
  const port = Number(process.env.PORT || 4173);
  createServer().listen(port, "127.0.0.1", () => console.log(`Lexora: http://localhost:${port}`));
}
module.exports = { createServer };
