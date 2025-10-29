import axios from 'axios';

// Interface for sports
export interface Sport {
  key: string;
  group: string;
  title: string;
  description: string;
  active: boolean;
  has_outrights: boolean;
}

// Interface for bookmaker
export interface Bookmaker {
  key: string;
  title: string;
  last_update: string;
  markets: Market[];
}

// Interface for market
export interface Market {
  key: string;
  last_update: string;
  outcomes: Outcome[];
}

// Interface for outcome
export interface Outcome {
  name: string;
  price: number;
  point?: number;
  description?: string;
}

// Interface for game/event
export interface Game {
  id: string;
  sport_key: string;
  sport_title: string;
  commence_time: string;
  home_team: string;
  away_team: string;
  bookmakers: Bookmaker[];
}

// API parameters interface
export interface OddsApiParams {
  apiKey?: string;
  sport?: string;
  regions?: string;
  markets?: string;
  oddsFormat?: 'decimal' | 'american' | 'fractional';
  dateFormat?: string;
  bookmakers?: string;
}

// Default parameters
const defaultParams: OddsApiParams = {
  regions: 'us',
  markets: 'h2h,spreads,totals',
  oddsFormat: 'decimal',
  dateFormat: 'iso'
};

// Base URL for the API
const BASE_URL = 'https://api.the-odds-api.com/v4';

/**
 * Get all available sports
 */
export async function getSports(params: OddsApiParams = {}): Promise<Sport[]> {
  const apiKey = params.apiKey || import.meta.env.VITE_ODDS_API_KEY;
  
  if (!apiKey) {
    throw new Error('API key is required to access odds data');
  }

  try {
    const response = await axios.get(`${BASE_URL}/sports`, {
      params: { apiKey }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching sports:', error);
    throw error;
  }
}

/**
 * Get odds for a specific sport
 * @param sport - Sport key (e.g., 'basketball_nba')
 * @param params - Optional parameters
 */
export async function getOdds(sport: string, params: OddsApiParams = {}): Promise<Game[]> {
  const apiKey = params.apiKey || import.meta.env.VITE_ODDS_API_KEY;
  
  if (!apiKey) {
    throw new Error('API key is required to access odds data');
  }

  try {
    const response = await axios.get(`${BASE_URL}/sports/${sport}/odds`, {
      params: {
        apiKey,
        regions: params.regions || defaultParams.regions,
        markets: params.markets || defaultParams.markets,
        oddsFormat: params.oddsFormat || defaultParams.oddsFormat,
        dateFormat: params.dateFormat || defaultParams.dateFormat,
        bookmakers: params.bookmakers
      }
    });
    
    return response.data;
  } catch (error) {
    console.error(`Error fetching odds for ${sport}:`, error);
    throw error;
  }
}

/**
 * Get NBA basketball odds
 * @param params - Optional parameters
 */
export async function getNbaOdds(params: OddsApiParams = {}): Promise<Game[]> {
  try {
    // Use the proxy endpoint from our backend but fetch with cache disabled
    // to avoid stale 304 responses during development.
    const regions = String(params.regions || defaultParams.regions);
    const markets = String(params.markets || defaultParams.markets);
    const oddsFormat = String(params.oddsFormat || defaultParams.oddsFormat);

    const url = `/api/odds/basketball_nba?regions=${encodeURIComponent(regions)}&markets=${encodeURIComponent(
      markets
    )}&oddsFormat=${encodeURIComponent(oddsFormat)}&ts=${Date.now()}`;

    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`Failed to fetch NBA odds: ${res.status} ${res.statusText} ${text}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching NBA odds:', error);
    throw error;
  }
}

/**
 * Helper function to find the best odds for a team
 * @param game - Game object
 * @param teamName - Team name to find odds for
 * @param marketType - Market type ('h2h', 'spreads', 'totals')
 */
export function findBestOddsForTeam(game: Game, teamName: string, marketType: string = 'h2h'): number | null {
  let bestOdds = null;
  // Defensive: ensure bookmakers is an array
  if (!Array.isArray(game.bookmakers)) return null;

  // Look through all bookmakers
  for (const bookmaker of game.bookmakers) {
    const markets = Array.isArray((bookmaker as any).markets) ? (bookmaker as any).markets : [];
    // Find the specified market
    const market = markets.find((m: any) => m && m.key === marketType);

    if (market && Array.isArray(market.outcomes)) {
      // Find outcome for this team
      const outcome = market.outcomes.find((o: any) => o && o.name === teamName);

      if (outcome && typeof outcome.price === 'number') {
        // If first odds found or better than current best, update bestOdds
        if (bestOdds === null || outcome.price > bestOdds) {
          bestOdds = outcome.price;
        }
      }
    }
  }
  
  return bestOdds;
}

/**
 * Helper function to get spread/total line for a team
 * @param game - Game object
 * @param teamName - Team name
 * @param marketType - Market type ('spreads', 'totals')
 */
export function getLineForTeam(game: Game, teamName: string, marketType: string): number | null {
  // Defensive: ensure bookmakers is an array
  if (!Array.isArray(game.bookmakers)) return null;

  // Look through all bookmakers
  for (const bookmaker of game.bookmakers) {
    const markets = Array.isArray((bookmaker as any).markets) ? (bookmaker as any).markets : [];
    const market = markets.find((m: any) => m && m.key === marketType);

    if (market && Array.isArray(market.outcomes)) {
      const outcome = market.outcomes.find((o: any) => o && o.name === teamName);
      if (outcome && outcome.point !== undefined) {
        return outcome.point;
      }
    }
  }
  
  return null;
}

/**
 * Helper function to get totals (over/under) for a game
 * @param game - Game object
 */
export function getTotalsForGame(game: Game): { over: number | null, under: number | null, line: number | null } {
  // Defensive: ensure bookmakers is an array
  if (!Array.isArray(game.bookmakers)) return { over: null, under: null, line: null };

  for (const bookmaker of game.bookmakers) {
    const markets = Array.isArray((bookmaker as any).markets) ? (bookmaker as any).markets : [];
    const totalsMarket = markets.find((m: any) => m && m.key === 'totals');

    if (totalsMarket && Array.isArray(totalsMarket.outcomes) && totalsMarket.outcomes.length >= 2) {
      const overOutcome = totalsMarket.outcomes.find((o: any) => o && o.name === 'Over');
      const underOutcome = totalsMarket.outcomes.find((o: any) => o && o.name === 'Under');

      if (overOutcome && underOutcome) {
        return {
          over: typeof overOutcome.price === 'number' ? overOutcome.price : null,
          under: typeof underOutcome.price === 'number' ? underOutcome.price : null,
          line: overOutcome.point || null
        };
      }
    }
  }
  
  return { over: null, under: null, line: null };
}

/**
 * Format date from ISO string to a more readable format
 * @param isoString - ISO date string
 */
export function formatGameDate(isoString: string): string {
  if (!isoString) return 'TBD';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return 'TBD';

  return date.toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}
