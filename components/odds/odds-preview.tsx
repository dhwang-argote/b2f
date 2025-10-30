import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getNbaOdds, Game, findBestOddsForTeam, formatGameDate, getLineForTeam, getTotalsForGame } from '@/lib/oddsApi';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { useBetDialogScrollLock } from '@/hooks/use-bet-dialog-scroll-lock';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const OddsPreview: React.FC = () => {
  const [activeTab, setActiveTab] = useState('nba');

  const [betDialogOpen, setBetDialogOpen] = useState(false);
  const [selectedMarket, setSelectedMarket] = useState('moneyline');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [selectedOdds, setSelectedOdds] = useState(0);
  const [stakeAmount, setStakeAmount] = useState('10');
  const [submitting, setSubmitting] = useState(false);

  const handlePlaceBet = () => {
    console.log("Placing bet...");
    // Placeholder for actual bet placement logic
  };

  // Helper: transform 'shark picks' response into a minimal Game-like shape
  const transformPicksToGames = (picks: any[], sportTitle = ''): Game[] => {
    if (!Array.isArray(picks)) return [];
    return picks.map((p: any, idx: number) => {
      // matchup expected as 'Home Team vs Away Team'
      const matchup = typeof p.matchup === 'string' ? p.matchup : '';
      const parts: string[] = typeof matchup === 'string' ? matchup.split(' vs ').map((s: string) => s.trim()) : [];
      const home: string = parts[0] || `Team ${idx + 1}`;
      const away: string = parts[1] || `Team ${idx + 2}`;

      const commence_time = p.start_time || p.startTime || p.start || null;

      // Create bookmaker with the recommended pick having the best odds
      const recommendedTeam = p.recommended_pick || home;
      const bestOdds = typeof p.best_odds === 'number' ? p.best_odds : 1.5;

      const bookmaker = {
        key: 'pick',
        title: p.bookmaker || 'BetRivers',
        last_update: commence_time,
        markets: [
          {
            key: 'h2h',
            last_update: commence_time,
            outcomes: [
              { name: home, price: recommendedTeam === home ? bestOdds : 1.45, point: undefined },
              { name: away, price: recommendedTeam === away ? bestOdds : 1.45, point: undefined }
            ]
          }
        ]
      };

      return {
        id: `pick-${idx}-${home}-${away}`,
        sport_key: '',
        sport_title: sportTitle || '',
        commence_time,
        home_team: home,
        away_team: away,
        bookmakers: [bookmaker]
      } as Game;
    });
  };

  // NBA Basketball odds
  const { data: nbaOdds, isLoading: nbaLoading, isError: nbaError, error: nbaErrorMessage } = useQuery({
    queryKey: ['nba-odds'],
    queryFn: async () => {
      console.log('Fetching NBA odds data...');
      try {
        const data = await getNbaOdds();
        console.log('NBA odds data:', data);
        return data;
      } catch (err) {
        console.error('Error fetching NBA odds:', err);
        throw err;
      }
    },
    refetchInterval: 300000, // refetch every 5 minutes
    staleTime: 60000, // consider data stale after 1 minute
  });

  // MLB Baseball odds
  const { data: mlbOdds, isLoading: mlbLoading, isError: mlbError, error: mlbErrorMessage } = useQuery({
    queryKey: ['mlb-odds'],
    queryFn: async () => {
      console.log('Fetching MLB odds data...');
      try {
        // Use the proxy endpoint instead of direct API access
        const res = await fetch(`/api/odds/baseball_mlb?regions=us&markets=h2h&oddsFormat=decimal&ts=${Date.now()}`, { cache: 'no-store' });
        if (!res.ok) {
          throw new Error(`Failed to fetch MLB odds: ${res.statusText}`);
        }
        const data = await res.json();
        console.log('MLB odds data:', data);
        // If upstream returned shark-picks shape, transform to Game-like objects
        if (Array.isArray(data) && data[0] && data[0].matchup) {
          return transformPicksToGames(data, 'MLB');
        }
        return data;
      } catch (err) {
        console.error('Error fetching MLB odds:', err);
        throw err;
      }
    },
    refetchInterval: 300000, // refetch every 5 minutes
    staleTime: 60000, // consider data stale after 1 minute
  });

  // NFL Football odds
  const { data: nflOdds, isLoading: nflLoading, isError: nflError, error: nflErrorMessage } = useQuery({
    queryKey: ['nfl-odds'],
    queryFn: async () => {
      try {
        // Use the proxy endpoint for NFL data
        const res = await fetch(`/api/odds/americanfootball_nfl?regions=us&markets=h2h&oddsFormat=decimal&ts=${Date.now()}`, { cache: 'no-store' });
        if (!res.ok) {
          throw new Error(`Failed to fetch NFL odds: ${res.statusText}`);
        }
        const data = await res.json();
        if (Array.isArray(data) && data[0] && data[0].matchup) {
          return transformPicksToGames(data, 'NFL');
        }
        return data;
      } catch (err) {
        console.error('Error fetching NFL odds:', err);
        throw err;
      }
    },
    refetchInterval: 300000,
    staleTime: 60000,
  });

  // Soccer odds (Premier League)
  const { data: soccerOdds, isLoading: soccerLoading, isError: soccerError, error: soccerErrorMessage } = useQuery({
    queryKey: ['soccer-odds'],
    queryFn: async () => {
      try {
        // Use the proxy endpoint for soccer data
        const res = await fetch(`/api/odds/soccer_epl?regions=us&markets=h2h&oddsFormat=decimal&ts=${Date.now()}`, { cache: 'no-store' });
        if (!res.ok) {
          throw new Error(`Failed to fetch soccer odds: ${res.statusText}`);
        }
        const data = await res.json();
        if (Array.isArray(data) && data[0] && data[0].matchup) {
          return transformPicksToGames(data, 'Soccer');
        }
        return data;
      } catch (err) {
        console.error('Error fetching soccer odds:', err);
        throw err;
      }
    },
    refetchInterval: 300000,
    staleTime: 60000,
  });

  // MMA/UFC odds
  const { data: mmaOdds, isLoading: mmaLoading, isError: mmaError, error: mmaErrorMessage } = useQuery({
    queryKey: ['mma-odds'],
    queryFn: async () => {
      try {
        // Use the proxy endpoint for MMA data
        const res = await fetch(`/api/odds/mma_mixed_martial_arts?regions=us&markets=h2h&oddsFormat=decimal&ts=${Date.now()}`, { cache: 'no-store' });
        if (!res.ok) {
          throw new Error(`Failed to fetch MMA odds: ${res.statusText}`);
        }
        const data = await res.json();
        if (Array.isArray(data) && data[0] && data[0].matchup) {
          return transformPicksToGames(data, 'MMA');
        }
        return data;
      } catch (err) {
        console.error('Error fetching MMA odds:', err);
        throw err;
      }
    },
    refetchInterval: 300000,
    staleTime: 60000,
  });

  // Boxing odds
  const { data: boxingOdds, isLoading: boxingLoading, isError: boxingError, error: boxingErrorMessage } = useQuery({
    queryKey: ['boxing-odds'],
    queryFn: async () => {
      try {
        // Use the proxy endpoint for boxing data
        const res = await fetch(`/api/odds/boxing_boxing?regions=us&markets=h2h&oddsFormat=decimal&ts=${Date.now()}`, { cache: 'no-store' });
        if (!res.ok) {
          throw new Error(`Failed to fetch boxing odds: ${res.statusText}`);
        }
        const data = await res.json();
        if (Array.isArray(data) && data[0] && data[0].matchup) {
          return transformPicksToGames(data, 'Boxing');
        }
        return data;
      } catch (err) {
        console.error('Error fetching boxing odds:', err);
        throw err;
      }
    },
    refetchInterval: 300000,
    staleTime: 60000,
  });

  // Golf odds (PGA Tour) removed temporarily due to upstream UNKNOWN_SPORT errors
  // const { data: golfOdds, isLoading: golfLoading, isError: golfError, error: golfErrorMessage } = useQuery({ ... });

  const isLoading = nbaLoading || mlbLoading || nflLoading || soccerLoading || mmaLoading || boxingLoading;
  const isError = nbaError || mlbError || nflError || soccerError || mmaError || boxingError;
  const error = nbaErrorMessage || mlbErrorMessage || nflErrorMessage || soccerErrorMessage || mmaErrorMessage || boxingErrorMessage;

  // Accept multiple possible shapes from upstream: prefer home_team/away_team, but allow teams array
  const isRenderableGame = (g: any) => {
    if (!g || !g.id) return false;
    if (g.home_team && g.away_team) return true;
    if (Array.isArray(g.teams) && g.teams.length >= 2) return true;
    return false;
  };

  if (isLoading) {
    return <OddsLoadingSkeleton />;
  }

  if (isError) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertTitle>Error loading odds</AlertTitle>
        <AlertDescription>
          {error instanceof Error ? error.message : 'Failed to load betting odds. Please try again later.'}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="container mx-auto py-4 px-3 sm:py-8 sm:px-4">
      <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center text-white">Upcoming Games</h2>

      <Tabs defaultValue="nba" value={activeTab} onValueChange={setActiveTab} className="mb-4 sm:mb-6">
        <ScrollArea className="w-full">
          <TabsList className="inline-flex min-w-full sm:max-w-4xl mx-auto px-1">
            <TabsTrigger value="nba" className="flex-1 text-xs sm:text-sm px-2 sm:px-4">NBA</TabsTrigger>
            <TabsTrigger value="mlb" className="flex-1 text-xs sm:text-sm px-2 sm:px-4">MLB</TabsTrigger>
            <TabsTrigger value="nfl" className="flex-1 text-xs sm:text-sm px-2 sm:px-4">NFL</TabsTrigger>
            <TabsTrigger value="soccer" className="flex-1 text-xs sm:text-sm px-2 sm:px-4">Soccer</TabsTrigger>
            <TabsTrigger value="mma" className="flex-1 text-xs sm:text-sm px-2 sm:px-4">MMA/UFC</TabsTrigger>
            <TabsTrigger value="boxing" className="flex-1 text-xs sm:text-sm px-2 sm:px-4">Boxing</TabsTrigger>
          </TabsList>
        </ScrollArea>

        {/* NBA Basketball Content */}
        <TabsContent value="nba" className="mt-4 sm:mt-6">
          {nbaOdds && Array.isArray(nbaOdds) && nbaOdds.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
              {nbaOdds.filter(isRenderableGame).map((game: Game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-white/60">
              <div className="bg-[#121212]/70 backdrop-blur-sm border border-primary/20 rounded-lg p-8 max-w-xl mx-auto">
                <h3 className="text-xl font-bold mb-3 text-white">No NBA Games Available</h3>
                <p className="mb-3">There are no upcoming NBA basketball games currently scheduled or the season may be on break.</p>
                <p>Check back later for updated NBA odds and betting opportunities.</p>
              </div>
            </div>
          )}
        </TabsContent>

        {/* MLB Baseball Content */}
        <TabsContent value="mlb" className="mt-4 sm:mt-6">
          {mlbOdds && Array.isArray(mlbOdds) && mlbOdds.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
              {mlbOdds.filter(isRenderableGame).map((game: Game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-white/60">
              <div className="bg-[#121212]/70 backdrop-blur-sm border border-primary/20 rounded-lg p-8 max-w-xl mx-auto">
                <h3 className="text-xl font-bold mb-3 text-white">No MLB Games Available</h3>
                <p className="mb-3">There are no upcoming MLB baseball games currently scheduled or the season may be on break.</p>
                <p>Check back later for updated MLB odds and betting opportunities.</p>
              </div>
            </div>
          )}
        </TabsContent>

        {/* NFL Football Content */}
        <TabsContent value="nfl" className="mt-4 sm:mt-6">
          {nflOdds && Array.isArray(nflOdds) && nflOdds.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
              {nflOdds.filter(isRenderableGame).map((game: Game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-white/60">
              <div className="bg-[#121212]/70 backdrop-blur-sm border border-primary/20 rounded-lg p-8 max-w-xl mx-auto">
                <h3 className="text-xl font-bold mb-3 text-white">NFL Season Currently Off</h3>
                <p className="mb-3">The NFL regular season is currently not in progress. Pre-season typically starts in August, with the regular season running from September to January.</p>
                <p>Check back during the season for NFL game odds and betting opportunities.</p>
              </div>
            </div>
          )}
        </TabsContent>

        {/* Soccer Content */}
        <TabsContent value="soccer" className="mt-4 sm:mt-6">
          {soccerOdds && Array.isArray(soccerOdds) && soccerOdds.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
              {soccerOdds.filter(isRenderableGame).map((game: Game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-white/60">
              <div className="bg-[#121212]/70 backdrop-blur-sm border border-primary/20 rounded-lg p-8 max-w-xl mx-auto">
                <h3 className="text-xl font-bold mb-3 text-white">No Soccer Matches Available</h3>
                <p className="mb-3">There are no upcoming soccer matches currently scheduled in our system or the leagues may be on break.</p>
                <p>We cover major leagues including Premier League, La Liga, Bundesliga, Serie A, and more.</p>
              </div>
            </div>
          )}
        </TabsContent>

        {/* MMA/UFC Content */}
        <TabsContent value="mma" className="mt-4 sm:mt-6">
          {mmaOdds && Array.isArray(mmaOdds) && mmaOdds.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
              {mmaOdds.filter(isRenderableGame).map((game: Game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-white/60">
              <div className="bg-[#121212]/70 backdrop-blur-sm border border-primary/20 rounded-lg p-8 max-w-xl mx-auto">
                <h3 className="text-xl font-bold mb-3 text-white">No MMA/UFC Events Available</h3>
                <p className="mb-3">There are no upcoming MMA or UFC events currently scheduled in our system.</p>
                <p>UFC events typically occur on weekends with 1-2 major pay-per-view events per month. Check back closer to event dates.</p>
              </div>
            </div>
          )}
        </TabsContent>

        {/* Boxing Content */}
        <TabsContent value="boxing" className="mt-4 sm:mt-6">
          {boxingOdds && Array.isArray(boxingOdds) && boxingOdds.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
              {boxingOdds.filter(isRenderableGame).map((game: Game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-white/60">
              <div className="bg-[#121212]/70 backdrop-blur-sm border border-primary/20 rounded-lg p-8 max-w-xl mx-auto">
                <h3 className="text-xl font-bold mb-3 text-white">No Boxing Matches Available</h3>
                <p className="mb-3">There are no upcoming boxing matches currently scheduled in our system.</p>
                <p>Major boxing events are typically scheduled several weeks in advance. Check back as events approach for betting odds.</p>
              </div>
            </div>
          )}
        </TabsContent>

        {/* Golf removed due to upstream UNKNOWN_SPORT errors - will be re-enabled when supported */}
      </Tabs>
    </div>
  );
};

const GameCard: React.FC<{ game: Game }> = ({ game }) => {
  const homeOdds = findBestOddsForTeam(game, game.home_team);
  const awayOdds = findBestOddsForTeam(game, game.away_team);
  const gameTime = formatGameDate(game.commence_time);
  // const [, navigate] = useLocation(); // Removed wouter's useLocation
  const { toast } = useToast();

  // Determine which team has better odds (likely the recommended pick)
  const homeRecommended = homeOdds && awayOdds && homeOdds > awayOdds;
  const awayRecommended = homeOdds && awayOdds && awayOdds > homeOdds;

  // Get spread data
  const homeSpreadOdds = findBestOddsForTeam(game, game.home_team, 'spreads');
  const awaySpreadOdds = findBestOddsForTeam(game, game.away_team, 'spreads');
  const homeSpread = getLineForTeam(game, game.home_team, 'spreads');
  const awaySpread = getLineForTeam(game, game.away_team, 'spreads');

  // Get totals data
  const totals = getTotalsForGame(game);



  const queryClient = useQueryClient();

  useBetDialogScrollLock(betDialogOpen);

  return (
    <Card className="overflow-hidden border border-primary/30 transition-all hover:shadow-md bg-[#121212]/70 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-blue-900 to-primary p-2 sm:p-4 text-white">
        <CardTitle className="text-center text-sm sm:text-lg font-bold">{game.sport_title}</CardTitle>
        <CardDescription className="text-center text-xs sm:text-sm text-white/90">{gameTime}</CardDescription>
      </CardHeader>

      <CardContent className="p-2 sm:p-4 text-white">
        {/* Team Names */}
        <div className="grid grid-cols-3 gap-1 sm:gap-2 items-center mb-2 sm:mb-4">
          <div className="text-right">
            <div className="font-bold text-xs sm:text-base text-white truncate max-w-24 sm:max-w-none ml-auto">{game.away_team}</div>
          </div>

          <div className="text-center font-bold text-white">@</div>

          <div className="text-left">
            <div className="font-bold text-xs sm:text-base text-white truncate max-w-24 sm:max-w-none">{game.home_team}</div>
          </div>
        </div>

        {/* Moneyline */}
        <div className="mb-3">
          <div className="text-center text-xs sm:text-sm text-gray-400 mb-1">MONEYLINE</div>
          <div className="grid grid-cols-3 gap-1 sm:gap-2 items-center">
            <div className="text-right">
              <div className="flex items-center justify-end gap-1">
                <div className="text-sm sm:text-lg font-bold text-primary">{awayOdds ? awayOdds.toFixed(2) : 'N/A'}</div>
                {awayRecommended && (
                  <Badge variant="outline" className="bg-green-100/10 text-green-400 text-[8px] sm:text-[10px] px-1 py-0.5">
                    ★ Pick
                  </Badge>
                )}
              </div>
            </div>
            <div className="text-center text-[9px] sm:text-xs font-bold text-gray-400">vs</div>
            <div className="text-left">
              <div className="flex items-center gap-1">
                {homeRecommended && (
                  <Badge variant="outline" className="bg-green-100/10 text-green-400 text-[8px] sm:text-[10px] px-1 py-0.5">
                    ★ Pick
                  </Badge>
                )}
                <div className="text-sm sm:text-lg font-bold text-primary">{homeOdds ? homeOdds.toFixed(2) : 'N/A'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Point Spread */}
        {(homeSpreadOdds || awaySpreadOdds) && (
          <div className="mb-3">
            <div className="text-center text-xs sm:text-sm text-gray-400 mb-1">SPREAD</div>
            <div className="grid grid-cols-3 gap-1 sm:gap-2 items-center">
              <div className="text-right">
                <div className="text-xs sm:text-sm">
                  {awaySpread !== null ? (awaySpread > 0 ? `+${awaySpread}` : awaySpread.toString()) : 'N/A'}
                </div>
                <div className="text-sm sm:text-lg font-bold text-primary">{awaySpreadOdds ? awaySpreadOdds.toFixed(2) : 'N/A'}</div>
              </div>
              <div className="text-center text-[9px] sm:text-xs font-bold text-gray-400">vs</div>
              <div className="text-left">
                <div className="text-xs sm:text-sm">
                  {homeSpread !== null ? (homeSpread > 0 ? `+${homeSpread}` : homeSpread.toString()) : 'N/A'}
                </div>
                <div className="text-sm sm:text-lg font-bold text-primary">{homeSpreadOdds ? homeSpreadOdds.toFixed(2) : 'N/A'}</div>
              </div>
            </div>
          </div>
        )}

        {/* Totals */}
        {(totals.over || totals.under) && (
          <div className="mb-3">
            <div className="text-center text-xs sm:text-sm text-gray-400 mb-1">TOTAL {totals.line ? totals.line : ''}</div>
            <div className="grid grid-cols-3 gap-1 sm:gap-2 items-center">
              <div className="text-right">
                <div className="text-xs sm:text-sm">OVER</div>
                <div className="text-sm sm:text-lg font-bold text-primary">{totals.over ? totals.over.toFixed(2) : 'N/A'}</div>
              </div>
              <div className="text-center text-[9px] sm:text-xs font-bold text-gray-400">vs</div>
              <div className="text-left">
                <div className="text-xs sm:text-sm">UNDER</div>
                <div className="text-sm sm:text-lg font-bold text-primary">{totals.under ? totals.under.toFixed(2) : 'N/A'}</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="border-t border-primary/20 p-2 sm:p-4 bg-[#121212]/50">
        <Button
          variant="outline"
          size="sm"
          className="w-full text-xs sm:text-sm border-primary/30 text-white bg-primary/20 hover:bg-primary/40"
          onClick={() => setBetDialogOpen(true)}
        >
          Place Demo Bet
        </Button>
      </CardFooter>

      {/* Simpler betting UI to avoid Dialog component issues */}
      {betDialogOpen && (
        <div className="fixed pt-52 overflow-auto inset-0 z-50 flex items-center justify-center bg-black/80 scrollbar-hide">
          <div className="bg-[#121212] border border-primary/30 text-white rounded-lg max-w-md w-full p-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Place Demo Bet</h3>
              <Button
                variant="ghost"
                size="sm"
                className="text-white"
                onClick={() => setBetDialogOpen(false)}
              >
                ✕
              </Button>
            </div>

            <p className="text-white/70 mb-4">
              {game.away_team} @ {game.home_team} - {gameTime}
            </p>

            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="market" className="text-white">Select Market</Label>
                <select
                  id="market"
                  value={selectedMarket}
                  onChange={(e) => {
                    setSelectedMarket(e.target.value);
                    setSelectedTeam("");
                    setSelectedOdds(0);
                  }}
                  className="w-full bg-[#1a1a1a] border border-primary/30 text-white rounded-md px-3 py-2"
                >
                  <option value="moneyline">Moneyline</option>
                  {(homeSpreadOdds || awaySpreadOdds) && <option value="spread">Point Spread</option>}
                  {(totals.over || totals.under) && <option value="total">Over/Under</option>}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="selection" className="text-white">Select {selectedMarket === 'total' ? 'Total' : 'Team'}</Label>
                <select
                  id="selection"
                  value={selectedTeam}
                  onChange={(e) => {
                    setSelectedTeam(e.target.value);
                    // Set odds based on selection
                    if (selectedMarket === 'moneyline') {
                      setSelectedOdds(e.target.value === game.home_team ? homeOdds || 0 : awayOdds || 0);
                    } else if (selectedMarket === 'spread') {
                      setSelectedOdds(e.target.value === game.home_team ? homeSpreadOdds || 0 : awaySpreadOdds || 0);
                    } else if (selectedMarket === 'total') {
                      setSelectedOdds(e.target.value === 'over' ? totals.over || 0 : totals.under || 0);
                    }
                  }}
                  className="w-full bg-[#1a1a1a] border border-primary/30 text-white rounded-md px-3 py-2"
                >
                  <option value="" disabled>Select option</option>
                  {selectedMarket === 'moneyline' && (
                    <>
                      <option value={game.away_team}>
                        {game.away_team} ({awayOdds?.toFixed(2)})
                      </option>
                      <option value={game.home_team}>
                        {game.home_team} ({homeOdds?.toFixed(2)})
                      </option>
                    </>
                  )}
                  {selectedMarket === 'spread' && (
                    <>
                      <option value={game.away_team}>
                        {game.away_team} {awaySpread !== null ? (awaySpread > 0 ? `+${awaySpread}` : awaySpread) : ''} ({awaySpreadOdds?.toFixed(2)})
                      </option>
                      <option value={game.home_team}>
                        {game.home_team} {homeSpread !== null ? (homeSpread > 0 ? `+${homeSpread}` : homeSpread) : ''} ({homeSpreadOdds?.toFixed(2)})
                      </option>
                    </>
                  )}
                  {selectedMarket === 'total' && (
                    <>
                      <option value="over">
                        Over {totals.line} ({totals.over?.toFixed(2)})
                      </option>
                      <option value="under">
                        Under {totals.line} ({totals.under?.toFixed(2)})
                      </option>
                    </>
                  )}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="stake" className="text-white">Stake Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/80">$</span>
                  <Input
                    id="stake"
                    type="number"
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                    min="10"
                    max="10000"
                    className="bg-[#1a1a1a] border-primary/30 text-white pl-8"
                  />
                </div>
                <p className="text-xs text-white/60">Min: $10, Max: $10,000</p>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setBetDialogOpen(false)}
                className="border-primary/30 text-white hover:bg-primary/10"
              >
                Cancel
              </Button>
              <Button
                onClick={handlePlaceBet}
                className="bg-primary hover:bg-primary/90 text-white"
                disabled={!selectedTeam || !stakeAmount || submitting}
              >
                {submitting ? "Processing..." : "Place Bet"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

const OddsLoadingSkeleton: React.FC = () => {
  return (
    <div className="container mx-auto py-4 px-3 sm:py-8 sm:px-4">
      <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center text-white">Upcoming Games</h2>

      <Tabs defaultValue="nba" className="mb-4 sm:mb-6">
        <TabsList className="grid w-full sm:max-w-4xl mx-auto grid-cols-2 md:grid-cols-7">
          <TabsTrigger value="nba" className="text-xs sm:text-sm">NBA</TabsTrigger>
          <TabsTrigger value="mlb" className="text-xs sm:text-sm">MLB</TabsTrigger>
          <TabsTrigger value="nfl" className="text-xs sm:text-sm">NFL</TabsTrigger>
          <TabsTrigger value="soccer" className="text-xs sm:text-sm">Soccer</TabsTrigger>
          <TabsTrigger value="mma" className="text-xs sm:text-sm">MMA/UFC</TabsTrigger>
          <TabsTrigger value="boxing" className="text-xs sm:text-sm">Boxing</TabsTrigger>
          <TabsTrigger value="golf" className="text-xs sm:text-sm">Golf</TabsTrigger>
        </TabsList>

        <TabsContent value="nba" className="mt-4 sm:mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[1, 2, 3, 4, 5, 6].map((index) => (
              <Card key={index} className="overflow-hidden border border-primary/30 bg-[#121212]/70 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-blue-900 to-primary p-3 sm:p-4">
                  <Skeleton className="h-5 sm:h-6 w-3/4 mx-auto mb-2" />
                  <Skeleton className="h-3 sm:h-4 w-1/2 mx-auto" />
                </CardHeader>

                <CardContent className="p-3 sm:p-4 text-white">
                  <div className="grid grid-cols-3 gap-1 sm:gap-2 items-center mb-3 sm:mb-4">
                    <Skeleton className="h-4 sm:h-5 w-full" />
                    <Skeleton className="h-4 sm:h-5 w-6 mx-auto" />
                    <Skeleton className="h-4 sm:h-5 w-full" />
                  </div>

                  <div className="grid grid-cols-3 gap-1 sm:gap-2 items-center">
                    <Skeleton className="h-6 sm:h-8 w-16 ml-auto" />
                    <Skeleton className="h-3 sm:h-4 w-8 mx-auto" />
                    <Skeleton className="h-6 sm:h-8 w-16" />
                  </div>
                </CardContent>

                <CardFooter className="border-t border-primary/20 p-3 sm:p-4 bg-[#121212]/50">
                  <Skeleton className="h-8 sm:h-10 w-full" />
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OddsPreview;
