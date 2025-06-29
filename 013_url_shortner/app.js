import { createServer } from "http";
import { readFile, writeFile } from "fs/promises";
import path from "path";
import crypto from "crypto";

const PORT = 3002;
const data_file = path.join("data", "links.json");
const links = await loadLinks(); // Load once in memory

async function loadLinks() {
  try {
    const data = await readFile(data_file, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    if (error.code === "ENOENT") {
      await writeFile(data_file, JSON.stringify({}));
      return {};
    }
    throw error;
  }
}

async function saveLinks() {
  await writeFile(data_file, JSON.stringify(links));
}

function sendJSON(res, data, status = 200) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}

function sendText(res, text, status = 200) {
  res.writeHead(status, { "Content-Type": "text/plain" });
  res.end(text);
}

async function serveFile(res, filePath, contentType) {
  try {
    const data = await readFile(filePath);
    res.writeHead(200, { "Content-Type": contentType });
    res.end(data);
  } catch (error) {
    sendText(res, "404 page not found", 404);
  }
}

const server = createServer(async (req, res) => {
  if (req.method === "GET") {
    if (req.url === "/") {
      return serveFile(res, path.join("public", "index.html"), "text/html");
    } else if (req.url === "/style.css") {
      return serveFile(res, path.join("public", "style.css"), "text/css");
    } else if (req.url === "/links") {
      return sendJSON(res, links);
    } else {
      const shortCode = req.url.slice(1);
      if (links[shortCode]) {
        res.writeHead(302, { location: links[shortCode] });
        return res.end();
      }
      return sendText(res, "URL not found", 404);
    }
  }

  if (req.method === "POST" && req.url === "/shorten") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", async () => {
      try {
        const { url, shortCode } = JSON.parse(body);
        if (!url) return sendText(res, "URL is required", 400);

        const finalShortCode =
          shortCode || crypto.randomBytes(4).toString("hex");
        if (links[finalShortCode])
          return sendText(res, "Short code exists", 400);

        links[finalShortCode] = url;
        await saveLinks();

        return sendJSON(res, { success: true, shortCode: finalShortCode });
      } catch (err) {
        return sendText(res, "Invalid request", 400);
      }
    });
  }
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
