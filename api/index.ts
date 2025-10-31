import 'dotenv/config';
import express, { type Request, Response, NextFunction } from "express";
import cors from "cors";
import axios from "axios";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL('.', import.meta.url));

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      console.log(logLine);
    }
  });

  next();
});

// API routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Proxy endpoint with Shark Picks AI logic
app.get("/api/odds/:sport", async (req, res) => {
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
        params: { apiKey, regions: "us", markets: "h2h", oddsFormat: "decimal", dateFormat: "iso" },
      }
    );

    const games = response.data;
    res.json(games);
  } catch (error: any) {
    console.error("Error fetching odds - message:", error?.message);
    if (error.response) {
      console.error("Error fetching odds - response status:", error.response.status);
      console.error("Error fetching odds - response data:", JSON.stringify(error.response.data));
    } else {
      console.error("Error fetching odds - no response object, possible network error or DNS issue");
    }

    const upstream = error.response?.data;

    if (upstream && upstream.error_code === 'UNKNOWN_SPORT') {
      try {
        const apiKey = process.env.ODDS_API_KEY;
        const sportsResp = await axios.get('https://api.the-odds-api.com/v4/sports', { params: { apiKey } });
        const available = sportsResp.data;
        return res.status(400).json({
          error: 'Unknown sport slug',
          upstream,
          available_sports: available
        });
      } catch (innerErr: any) {
        console.error('Failed to fetch available sports from Odds API:', innerErr?.message || innerErr);
        return res.status(500).json({ error: upstream || 'Failed to fetch odds' });
      }
    }

    return res.status(500).json({ error: upstream || "Failed to fetch odds" });
  }
});

app.get("/api/shark-picks/:sport", async (req, res) => {
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
          dateFormat: "iso",
        },
      }
    );

    const games = response.data;

    if (!Array.isArray(games) || games.length === 0) {
      return res.json({ message: `No games available for ${sport}` });
    }

    const picks = games.map((game: any) => {
      if (!game.bookmakers || game.bookmakers.length === 0) return null;
      let bestPick: { price: number; name: string } | null = null;
      let bestBookmaker: string | null = null;
      game.bookmakers.forEach((bookmaker: any) => {
        const outcomes = Array.isArray(bookmaker.markets?.[0]?.outcomes) ? bookmaker.markets[0].outcomes : [];
        const validOutcomes = outcomes.filter((o: any) => typeof o.price === "number" && typeof o.name === "string");
        if (validOutcomes.length === 0) return;
        const favorite = validOutcomes.reduce((a: any, b: any) => (a.price < b.price ? a : b), validOutcomes[0]);
        if (!bestPick || favorite.price < bestPick.price) {
          bestPick = favorite;
          bestBookmaker = bookmaker.title;
        }
      });
      if (!bestPick || !bestBookmaker) return null;
      const pick = bestPick as { price: number; name: string };
      const pickObj = {
        matchup: `${game.home_team} vs ${game.away_team}`,
        recommended_pick: pick.name,
        best_odds: pick.price,
        bookmaker: bestBookmaker,
        start_time: game.commence_time,
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
  } catch (err: any) {
    console.error("Shark Picks error:", err.response?.data || err.message || err);
    res.status(500).json({ error: "Failed to fetch Shark Picks" });
  }
});

// Helper: list available sports from the Odds API
app.get('/api/odds/sports', async (req, res) => {
  try {
    const apiKey = process.env.ODDS_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'Missing Odds API key (ODDS_API_KEY)' });
    const response = await axios.get('https://api.the-odds-api.com/v4/sports', { params: { apiKey } });
    return res.json(response.data);
  } catch (err: any) {
    console.error('Error fetching sports list from Odds API:', err.response?.data || err.message || err);
    return res.status(500).json({ error: err.response?.data || err.message || 'Failed to fetch sports list' });
  }
});

// Serve static files in production
// In Vercel, static files are served from the outputDirectory, so we need to resolve
// relative to the project root which is available as process.cwd() or __dirname
const distPath = path.resolve(__dirname, "../dist/public");

// Only serve static files if directory exists (production builds)
if (process.env.NODE_ENV === "production" || process.env.VERCEL) {
  try {
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      
      // Catch-all: send index.html for any non-API route
      app.get("*", (req, res) => {
        if (!req.path.startsWith("/api")) {
          const indexPath = path.resolve(distPath, "index.html");
          res.sendFile(indexPath);
        } else {
          res.status(404).json({ error: "Not found" });
        }
      });
    } else {
      console.warn("Static files directory not found:", distPath);
      // In Vercel, static files might be served separately, so just handle API routes
      app.get("*", (req, res) => {
        if (req.path.startsWith("/api")) {
          res.status(404).json({ error: "API endpoint not found" });
        } else {
          // Return 404 for non-API routes when static files aren't available
          res.status(404).json({ error: "Page not found" });
        }
      });
    }
  } catch (error) {
    console.warn("Error setting up static file serving:", error);
  }
} else {
  // Development: handle non-API routes
  app.get("*", (req, res) => {
    if (!req.path.startsWith("/api")) {
      res.status(404).json({ error: "In development, use the dev server" });
    } else {
      res.status(404).json({ error: "API endpoint not found" });
    }
  });
}

// Error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  console.error('Error handler:', err);

  if (!res.headersSent) {
    res.status(status).json({ message });
  }
});

// Vercel serverless function handler
export default app;

