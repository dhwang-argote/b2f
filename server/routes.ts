import type { Express, Request, Response } from "express";
import cors from "cors";
import { createServer, type Server } from "http";
import axios from "axios";

export async function registerRoutes(app: Express): Promise<Server> {
  try {
    // Enable CORS for all routes
    app.use(cors());

    // API routes
    app.get("/api/health", (req, res) => {
      res.json({ status: "ok" });
    });

    // Proxy endpoint with Shark Picks AI logic
    app.get("/api/odds/:sport", async (req, res) => {
      try {
        const { sport } = req.params;
        const apiKey = process.env.ODDS_API_KEY;
        // Fail fast with a clear error when the API key is not configured
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

        // Return the raw games array so frontend components can render full details
        const games = response.data;
        res.json(games);
      } catch (error: any) {
        // Detailed logging for debugging external API failures
        console.error("Error fetching odds - message:", error?.message);
        if (error.response) {
          console.error("Error fetching odds - response status:", error.response.status);
          console.error("Error fetching odds - response data:", JSON.stringify(error.response.data));
        } else {
          console.error("Error fetching odds - no response object, possible network error or DNS issue");
        }

        // If the upstream API returned a JSON body, forward it for easier debugging in development
        const upstream = error.response?.data;

        // If the upstream error indicates an unknown sport, fetch the list of available sports
        // from the Odds API to help debugging and return that to the client.
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
            // Only consider outcomes with valid price and name
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

    const httpServer = createServer(app);
    return httpServer;
  } catch (err) {
    console.error("Error in registerRoutes:", err);
    // Return a dummy server to satisfy the return type, or throw to propagate error
    throw err;
  }
}
