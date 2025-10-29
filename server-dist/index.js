// server/index.ts
import "dotenv/config";
import express2 from "express";

// server/routes.ts
import cors from "cors";
import { createServer } from "http";
import axios from "axios";
async function registerRoutes(app2) {
  try {
    app2.use(cors());
    app2.get("/api/health", (req, res) => {
      res.json({ status: "ok" });
    });
    app2.get("/api/plans", async (req, res) => {
      res.json([]);
    });
    app2.get("/api/plans/:id", async (req, res) => {
      res.status(404).json({ message: "Plan not found" });
    });
    app2.get("/api/faqs", async (req, res) => {
      res.json([]);
    });
    app2.get("/api/testimonials", async (req, res) => {
      res.json([]);
    });
    app2.get("/api/odds/:sport", async (req, res) => {
      try {
        const { sport } = req.params;
        const apiKey = process.env.ODDS_API_KEY;
        if (!apiKey) {
          console.error("Missing ODDS_API_KEY environment variable");
          return res.status(500).json({ error: "Missing Odds API key (ODDS_API_KEY). Set this environment variable and restart the server." });
        }
        const response = await axios.get(
          `https://api.the-odds-api.com/v4/sports/${sport}/odds`,
          {
            params: { apiKey, regions: "us", markets: "h2h", oddsFormat: "decimal", dateFormat: "iso" }
          }
        );
        const games = response.data;
        res.json(games);
      } catch (error) {
        console.error("Error fetching odds - message:", error?.message);
        if (error.response) {
          console.error("Error fetching odds - response status:", error.response.status);
          console.error("Error fetching odds - response data:", JSON.stringify(error.response.data));
        } else {
          console.error("Error fetching odds - no response object, possible network error or DNS issue");
        }
        const upstream = error.response?.data;
        if (upstream && upstream.error_code === "UNKNOWN_SPORT") {
          try {
            const apiKey = process.env.ODDS_API_KEY;
            const sportsResp = await axios.get("https://api.the-odds-api.com/v4/sports", {
              params: { apiKey }
            });
            const available = sportsResp.data;
            return res.status(400).json({
              error: "Unknown sport slug",
              upstream,
              available_sports: available
            });
          } catch (innerErr) {
            console.error("Failed to fetch available sports from Odds API:", innerErr?.message || innerErr);
            return res.status(500).json({ error: upstream || "Failed to fetch odds" });
          }
        }
        return res.status(500).json({ error: upstream || "Failed to fetch odds" });
      }
    });
    app2.get("/api/shark-picks/:sport", async (req, res) => {
      try {
        const { sport } = req.params;
        const apiKey = process.env.ODDS_API_KEY;
        if (!apiKey) return res.status(500).json({ error: "Missing Odds API key" });
        const response = await axios.get(
          `https://api.the-odds-api.com/v4/sports/${sport}/odds`,
          {
            params: {
              apiKey,
              regions: "us",
              markets: "h2h",
              oddsFormat: "decimal",
              dateFormat: "iso"
            }
          }
        );
        const games = response.data;
        if (!Array.isArray(games) || games.length === 0) {
          return res.json({ message: `No games available for ${sport}` });
        }
        const picks = games.map((game) => {
          if (!game.bookmakers || game.bookmakers.length === 0) return null;
          let bestPick = null;
          let bestBookmaker = null;
          game.bookmakers.forEach((bookmaker) => {
            const outcomes = Array.isArray(bookmaker.markets?.[0]?.outcomes) ? bookmaker.markets[0].outcomes : [];
            const validOutcomes = outcomes.filter((o) => typeof o.price === "number" && typeof o.name === "string");
            if (validOutcomes.length === 0) return;
            const favorite = validOutcomes.reduce((a, b) => a.price < b.price ? a : b, validOutcomes[0]);
            if (!bestPick || favorite.price < bestPick.price) {
              bestPick = favorite;
              bestBookmaker = bookmaker.title;
            }
          });
          if (!bestPick || !bestBookmaker) return null;
          const pick = bestPick;
          const pickObj = {
            matchup: `${game.home_team} vs ${game.away_team}`,
            recommended_pick: pick.name,
            best_odds: pick.price,
            bookmaker: bestBookmaker,
            start_time: game.commence_time
          };
          console.log("[Shark Picks] Pick:", pickObj);
          return pickObj;
        });
        const validPicks = picks.filter(Boolean);
        if (validPicks.length === 0) {
          console.warn("[Shark Picks] No valid picks found for sport:", sport);
          return res.json({ message: `No valid picks available for ${sport}` });
        }
        res.json(validPicks);
      } catch (err) {
        console.error("Shark Picks error:", err.response?.data || err.message || err);
        res.status(500).json({ error: "Failed to fetch Shark Picks" });
      }
    });
    app2.get("/api/odds/sports", async (req, res) => {
      try {
        const apiKey = process.env.ODDS_API_KEY;
        if (!apiKey) return res.status(500).json({ error: "Missing Odds API key (ODDS_API_KEY)" });
        const response = await axios.get("https://api.the-odds-api.com/v4/sports", { params: { apiKey } });
        return res.json(response.data);
      } catch (err) {
        console.error("Error fetching sports list from Odds API:", err.response?.data || err.message || err);
        return res.status(500).json({ error: err.response?.data || err.message || "Failed to fetch sports list" });
      }
    });
    const httpServer = createServer(app2);
    return httpServer;
  } catch (err) {
    console.error("Error in registerRoutes:", err);
    throw err;
  }
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "."),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "assets")
    }
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/main.tsx"`,
        `src="/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "../dist/public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to run "vite build" first.`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    console.error("Error handler:", err);
    if (!res.headersSent) {
      res.status(status).json({ message });
    }
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = Number(process.env.PORT) || 5e3;
  const host = process.env.PORT ? "0.0.0.0" : "127.0.0.1";
  server.listen(port, host, () => {
    if (process.env.PORT) {
      log(`\u{1F680} Server running on 0.0.0.0:${port} (Railway will map this to your domain)`);
    } else {
      log(`\u{1F680} Server running on http://localhost:${port}`);
    }
  });
})();
