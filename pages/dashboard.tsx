import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import Layout from '@/components/layout/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import CircularProgress from '@/components/ui/circular-progress';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import type { UserChallenge, Trade, Plan } from '@shared/schema';

const Dashboard = () => {
  const [, navigate] = useLocation();
  const [selectedChallengeId, setSelectedChallengeId] = useState<string | number | null>(null);

  // Get user session with fallback to local storage authentication
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();

  // Determine the effective user id (UUID) we'll use for DB queries.
  // Prefer Supabase user.id, then common fallbacks (uuid, user_id), then try parsing localStorage.b2f_user.
  const resolveUserId = () => {
    const u = (user as any) || null;
    if (u) {
      if (u.id) return String(u.id);
      if (u.uuid) return String(u.uuid);
      if (u.user_id) return String(u.user_id);
    }

    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem('b2f_user');
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed) {
            if (parsed.id) return String(parsed.id);
            if (parsed.uuid) return String(parsed.uuid);
            if (parsed.user_id) return String(parsed.user_id);
          }
        }
      } catch (err) {
        console.error('Error parsing local b2f_user for uid:', err);
      }
    }

    return null;
  };

  const resolvedUserId = resolveUserId();
  // Debug: log the user and resolved uid so we can see what value is used for queries
  useEffect(() => {
    console.debug('Dashboard: user from useAuth:', user);
    console.debug('Dashboard: resolvedUserId for queries:', resolvedUserId);
  }, [user, resolvedUserId]);


  // Sample challenge data for demonstration
  // Helper function to create a demo challenge
  const createDemoChallenge = (userId: string) => ({
    id: 1,
    user_id: userId,
    plan_id: 1,
    status: 'in_progress',
    start_date: new Date().toISOString(),
    end_date: null,
    current_profit: 5.2,
    current_drawdown: 1.8,
    trading_days: 3,
    transaction_id: 'tx_demo1',
    payment_status: 'completed',
    current_phase: 1,
    virtual_balance: 10500.0, // $10,500 starting balance
    max_virtual_balance: 10550.0, // High water mark for drawdown
    passed_phases: [],
    funded_account_active: false
  });

  // Get user challenges from Supabase
  const { data: challenges, isLoading: isChallengesLoading } = useQuery({
    queryKey: ['user-challenges', resolvedUserId],
    queryFn: async () => {
      const uid = resolvedUserId;
      if (!uid) return [];

      try {
        const { data: userChallenges, error } = await supabase
          .from('user_challenges')
          .select('*')
          .eq('user_id', uid);

        if (error) {
          console.error('Error fetching user challenges:', error);
          return [createDemoChallenge(uid)];
        }

        if (userChallenges && userChallenges.length > 0) {
          // Normalize DB rows to UI-friendly camelCase keys used elsewhere in this file
          return (userChallenges as any[]).map((row: any) => ({
            id: row.id,
            user_id: row.user_id,
            plan_id: row.plan_id,
            status: row.status,
            start_date: row.start_date,
            end_date: row.end_date,
            current_profit: Number(row.current_profit) || 0,
            current_drawdown: Number(row.current_drawdown) || 0,
            trading_days: row.trading_days || 0,
            payment_status: row.payment_status,
            transaction_id: row.transaction_id,
            account_size: row.account_size,
            activated_at: row.activated_at,
            challenge_type: row.challenge_type,
            fee: Number(row.fee) || 0,
            steps: row.steps || null,
            current_step: row.current_step || 0,
            progress: row.progress || 0,
            profit_earned: Number(row.profit_earned) || 0,
          }));
        } else {
          return [createDemoChallenge(uid)];
        }
      } catch (err) {
        console.error('Unexpected error fetching challenges:', err);
        return [createDemoChallenge((user as any)?.id || (user as any)?.uuid || 'unknown')];
      }
    },
    // Enable when we have a resolved user id (from Supabase or local b2f_user)
    enabled: !!resolvedUserId
  });

  // Debug challenges/trades when they load
  useEffect(() => {
    if (challenges) console.debug('Dashboard: challenges loaded:', challenges);
  }, [challenges]);

  // Set default selected challenge on load
  useEffect(() => {
    if (challenges && Array.isArray(challenges) && challenges.length > 0 && !selectedChallengeId) {
      // Some deployments use numeric IDs, others use UUIDs. Keep whatever comes from the DB.
      setSelectedChallengeId(challenges[0].id);
    }
  }, [challenges, selectedChallengeId]);

  // Helper function to create demo trades
  const createDemoTrades = (challengeId: number, userId: string) => [
    {
      id: 1,
      challenge_id: challengeId,
      user_id: userId,
      sport: 'basketball_nba',
      market: 'Moneyline',
      selection: 'Golden State Warriors',
      odds: 2.1,
      stake: 100,
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      settled_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      result: 'win',
      profit_loss: 110,
      phase: 1,
      market_type: 'moneyline',
      team_type: 'away'
    },
    {
      id: 2,
      challenge_id: challengeId,
      user_id: userId,
      sport: 'basketball_nba',
      market: 'Spread',
      selection: 'Los Angeles Lakers -4.5',
      odds: 1.9,
      stake: 100,
      created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      settled_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      result: 'loss',
      profit_loss: -100,
      phase: 1,
      market_type: 'spread',
      team_type: 'home',
      line: -4.5
    },
    {
      id: 3,
      challenge_id: challengeId,
      user_id: userId,
      sport: 'americanfootball_nfl',
      market: 'Over/Under',
      selection: 'Over 47.5',
      odds: 1.95,
      stake: 200,
      created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      settled_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      result: 'win',
      profit_loss: 190,
      phase: 1,
      market_type: 'total',
      line: 47.5
    }
  ];

  // Get trades for selected challenge
  const { data: trades, isLoading: isTradesLoading } = useQuery({
    queryKey: ['trades', selectedChallengeId, resolvedUserId],
    queryFn: async () => {
      const uid = resolvedUserId;
      if (!selectedChallengeId || !uid) return [];

      // Try to fetch trades by challenge_id first. If the DB schema expects an integer and
      // we have a UUID (string), Supabase/Postgres will return a 22P02 error (invalid input syntax).
      // Fall back to fetching all trades for the user in that case.
      try {
        const { data: tradesData, error } = await supabase
          .from('trades')
          .select('*')
          .eq('challenge_id', selectedChallengeId as any)
          .eq('user_id', uid)
          .order('created_at', { ascending: false });

        if (error) {
          console.warn('Error fetching trades by challenge_id (will fall back to user_id):', error);
          // If it's a Postgres type error due to passing a UUID into an integer column,
          // fetch by user_id instead and return those trades.
          const fallback = await supabase
            .from('trades')
            .select('*')
            .eq('user_id', uid)
            .order('created_at', { ascending: false });

          if (fallback.error) {
            console.error('Fallback error fetching trades by user_id:', fallback.error);
            return createDemoTrades(typeof selectedChallengeId === 'number' ? selectedChallengeId : 0, uid);
          }

          const fallbackData = (fallback.data || []) as any[];
          return fallbackData.map((t: any) => ({
            id: t.id,
            challengeId: t.challenge_id,
            userId: t.user_id,
            sport: t.sport,
            market: t.market,
            selection: t.selection,
            odds: Number(t.odds) || 0,
            stake: Number(t.stake) || 0,
            createdAt: t.created_at || t.createdAt,
            settledAt: t.settled_at || t.settledAt,
            result: t.result,
            profitLoss: (t.profit_loss !== undefined ? Number(t.profit_loss) : (t.profitLoss !== undefined ? Number(t.profitLoss) : 0)),
            phase: t.phase,
            market_type: t.market_type || t.marketType,
            team_type: t.team_type || t.teamType,
            line: t.line
          }));
        }

        if (tradesData && tradesData.length > 0) {
          return (tradesData as any[]).map((t: any) => ({
            id: t.id,
            challengeId: t.challenge_id,
            userId: t.user_id,
            sport: t.sport,
            market: t.market,
            selection: t.selection,
            odds: Number(t.odds) || 0,
            stake: Number(t.stake) || 0,
            createdAt: t.created_at || t.createdAt,
            settledAt: t.settled_at || t.settledAt,
            result: t.result,
            profitLoss: (t.profit_loss !== undefined ? Number(t.profit_loss) : (t.profitLoss !== undefined ? Number(t.profitLoss) : 0)),
            phase: t.phase,
            market_type: t.market_type || t.marketType,
            team_type: t.team_type || t.teamType,
            line: t.line
          }));
        } else {
          return createDemoTrades(typeof selectedChallengeId === 'number' ? selectedChallengeId : 0, uid);
        }
      } catch (err: any) {
        console.error('Unexpected error fetching trades (outer):', err);
        // Final fallback: try fetching by user id
        try {
          const fallback = await supabase
            .from('trades')
            .select('*')
            .eq('user_id', uid)
            .order('created_at', { ascending: false });
          if (fallback.error) {
            console.error('Fallback fetch by user_id also failed:', fallback.error);
            return createDemoTrades(typeof selectedChallengeId === 'number' ? selectedChallengeId : 0, uid);
          }
          return (fallback.data || []).map((t: any) => ({
            id: t.id,
            challengeId: t.challenge_id,
            userId: t.user_id,
            sport: t.sport,
            market: t.market,
            selection: t.selection,
            odds: Number(t.odds) || 0,
            stake: Number(t.stake) || 0,
            createdAt: t.created_at || t.createdAt,
            settledAt: t.settled_at || t.settledAt,
            result: t.result,
            profitLoss: (t.profit_loss !== undefined ? Number(t.profit_loss) : (t.profitLoss !== undefined ? Number(t.profitLoss) : 0)),
            phase: t.phase,
            market_type: t.market_type || t.marketType,
            team_type: t.team_type || t.teamType,
            line: t.line
          }));
        } catch (innerErr) {
          console.error('All trade fetch attempts failed:', innerErr);
          return createDemoTrades(typeof selectedChallengeId === 'number' ? selectedChallengeId : 0, uid);
        }
      }
    },
    enabled: !!resolvedUserId
  });

  // Loading state
  if (isAuthLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
        </div>
      </Layout>
    );
  }

  // Redirect if not authenticated
  // Redirect if not authenticated AND there is no local supabase token present
  // Some browsers or flows may have a short race where the auth hook hasn't hydrated
  // but a session token exists in localStorage. Check for common Supabase token keys
  // and attempt to avoid redirecting prematurely.
  const hasLocalAuth = typeof window !== 'undefined' && (
    !!localStorage.getItem('supabase.auth.token') ||
    !!localStorage.getItem('sb:token') ||
    !!localStorage.getItem('supabase.auth') ||
    !!localStorage.getItem('b2f_user')
  );

  if (!isAuthLoading && !isAuthenticated && !hasLocalAuth) {
    navigate('/login');
    return null;
  }

  return (
    <Layout>
      <div className="min-h-screen pt-28 pb-16 px-4 sm:px-6 lg:px-8 relative">
        {/* Stadium background (local asset) */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0b1220]/90 to-[#001f44]/10"></div>
          <div className="absolute inset-0 bg-[url('/assets/b2f/bg_image1.jpg')] bg-cover bg-center opacity-12"></div>
        </div>

        {/* Main content with higher z-index */}
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold mb-0">
                  Welcome back, <span className="text-primary">{user?.email?.split('@')[0]}</span>
                </h1>
                <p className="text-white/70 text-sm mt-1">
                  Compact dashboard — quick stats and challenge controls
                </p>
              </div>
            </div>
          </motion.div>

          {/* Mobile optimized layout - single column on mobile */}
          <div className="grid grid-cols-1 gap-4 md:gap-6 lg:gap-8">
            {/* Sidebar with challenges - full width on mobile */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full"
            >
              <Card className="card-glow">
                <CardHeader>
                  <CardTitle className="text-white">Your Challenges</CardTitle>
                  <CardDescription>
                    Select a challenge to view details
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isChallengesLoading ? (
                    <div className="flex justify-center py-8">
                      <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                    </div>
                  ) : challenges && Array.isArray(challenges) && challenges.length > 0 ? (
                    <div className="space-y-2">
                      {challenges.map((challenge: any) => (
                        <Button
                          key={challenge.id}
                          variant={selectedChallengeId === challenge.id ? "default" : "outline"}
                          className={`w-full justify-start ${selectedChallengeId === challenge.id
                            ? "bg-primary text-white"
                            : "border-primary/30 text-white/80 hover:bg-primary/10"
                            }`}
                          onClick={() => setSelectedChallengeId(challenge.id)}
                        >
                          ${challenge.plan_id === 1 ? "10K" : challenge.plan_id === 2 ? "50K" : "100K"} Challenge
                          <span className={`ml-2 px-2 py-0.5 text-xs rounded ${challenge.status === "passed"
                            ? "bg-green-500/20 text-green-400"
                            : challenge.status === "failed"
                              ? "bg-red-500/20 text-red-400"
                              : "bg-yellow-500/20 text-yellow-400"
                            }`}>
                            {challenge.status.charAt(0).toUpperCase() + challenge.status.slice(1).replace('_', ' ')}
                          </span>
                        </Button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-white/60 mb-4">You don't have any challenges yet.</p>
                      <Link href="/#plans">
                        <Button className="btn-neon">
                          Start Your First Challenge
                        </Button>
                      </Link>
                    </div>
                  )}

                  {challenges && challenges.length > 0 && (
                    <div className="mt-6">
                      <Link href="/#plans">
                        <Button variant="outline" className="w-full border-primary/30 text-white/80 hover:bg-primary/10">
                          Start New Challenge
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Main challenge dashboard - full width on mobile */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full"
            >
              {selectedChallengeId && challenges ? (
                <ChallengeDetails
                  challenge={challenges.find((c: any) => c.id === selectedChallengeId)!}
                  trades={trades || []}
                  isLoading={isTradesLoading}
                />
              ) : challenges?.length === 0 ? (
                <NoChallenge />
              ) : (
                <div className="h-64 flex items-center justify-center">
                  <p className="text-white/60">Select a challenge to view details</p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

interface ChallengeDetailsProps {
  challenge: any; // Using any to accommodate both UserChallenge and snake_case format
  trades: any[];
  isLoading: boolean;
}

const ChallengeDetails = ({ challenge, trades, isLoading }: ChallengeDetailsProps) => {
  const [selectedPlanDetails, setSelectedPlanDetails] = useState<any>(null);

  useEffect(() => {
    try {
      console.debug('ChallengeDetails: challenge id/type:', challenge?.id, typeof challenge?.id);
      console.debug('ChallengeDetails: challenge plan_id/type:', challenge?.plan_id, typeof challenge?.plan_id);
    } catch (err) {
      // ignore
    }
  }, [challenge]);

  // Fetch plan details
  useQuery({
    queryKey: ['/api/plans', challenge.plan_id],
    queryFn: async () => {
      const planId = challenge.plan_id;
      // If plan_id is a number, call the specific endpoint
      if (typeof planId === 'number' && Number.isFinite(planId)) {
        const res = await fetch(`/api/plans/${planId}`, {
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Failed to fetch plan details');
        const data = await res.json();
        setSelectedPlanDetails(data);
        return data;
      }

      // Otherwise fetch all plans and attempt to match by accountSize or fallback to the first active plan
      try {
        const resAll = await fetch('/api/plans', { credentials: 'include' });
        if (!resAll.ok) throw new Error('Failed to fetch plans');
        const allPlans = await resAll.json();
        // Try best-effort matching: if challenge.account_size exists, match it
        const match = allPlans.find((p: any) => p.accountSize === challenge.account_size || p.accountSize === Number(challenge.accountSize));
        const chosen = match || allPlans[0] || null;
        setSelectedPlanDetails(chosen);
        return chosen;
      } catch (err) {
        console.error('Failed to fetch plans fallback:', err);
        return null;
      }
    }
  });

  // Calculate trading stats
  const calculateStats = () => {
    if (!trades || trades.length === 0) {
      return {
        totalTrades: 0,
        winRate: 0,
        totalProfit: 0,
        averageProfit: 0,
        largestWin: 0,
        largestLoss: 0,
        winningTrades: 0,
        losingTrades: 0
      };
    }

    const winningTrades = trades.filter(trade => trade.result === 'win').length;
    const totalProfit = trades.reduce((sum, trade) => sum + (trade.profitLoss || 0), 0);
    const winRate = (winningTrades / trades.length) * 100;
    const averageProfit = totalProfit / trades.length;
    const largestWin = Math.max(...trades.map(trade => trade.result === 'win' ? (trade.profitLoss || 0) : 0));
    const largestLoss = Math.min(...trades.map(trade => trade.result === 'loss' ? (trade.profitLoss || 0) : 0));

    return {
      totalTrades: trades.length,
      winRate: winRate,
      totalProfit: totalProfit,
      averageProfit: averageProfit,
      largestWin: largestWin,
      largestLoss: largestLoss,
      winningTrades: winningTrades,
      losingTrades: trades.filter(trade => trade.result === 'loss').length
    };
  };

  const stats = calculateStats();

  // Format challenge start date
  const formatDate = (dateString: string | Date) => {
    try {
      const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }).format(date);
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Invalid date';
    }
  };

  return (
    <Card className="card-glow">
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">

          {selectedPlanDetails && challenge.status === 'in_progress' && (
            <div className="mt-2 md:mt-0 space-y-2">
              <div className="bg-primary/10 px-3 py-1.5 rounded-md border border-primary/30 text-sm">
                <span className="block text-white/80">Phase: <span className="text-primary font-medium">{challenge.current_phase || 1} of {selectedPlanDetails.phaseCount || 2}</span></span>
                <span className="block text-white/80">Target: <span className="text-primary font-medium">{selectedPlanDetails.profitTarget}%</span></span>
              </div>
              <div className="bg-green-500/10 px-3 py-1.5 rounded-md border border-green-500/30 text-sm">
                <span className="block text-white/80">Virtual Balance: <span className="text-green-400 font-medium">${challenge.virtual_balance?.toFixed(2) || '10,000.00'}</span></span>
                <span className="block text-white/80">Progress: <span className={`font-medium ${parseFloat(challenge.current_profit) >= 0 ? 'text-green-400' : 'text-red-400'}`}>{parseFloat(challenge.current_profit).toFixed(2)}%</span></span>
              </div>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-8  border-primary/20 pb-0 justify-start flex gap-1 bg-transparent">
            <TabsTrigger
              value="overview"
              className="text-sm font-medium text-white/80 transition-all px-5 py-3 rounded-t-lg
          hover:bg-primary/10 hover:text-white
          data-[state=active]:bg-gradient-to-b from-primary/30 to-transparent
          data-[state=active]:text-primary
          data-[state=active]:border-b-2 data-[state=active]:border-primary
          data-[state=active]:shadow-none
        "
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Overview
            </TabsTrigger>

            <TabsTrigger
              value="trades"
              className="text-sm font-medium text-white/80 transition-all px-5 py-3 rounded-t-lg
          hover:bg-primary/10 hover:text-white
          data-[state=active]:bg-gradient-to-b from-primary/30 to-transparent
          data-[state=active]:text-primary
          data-[state=active]:border-b-2 data-[state=active]:border-primary
          data-[state=active]:shadow-none
        "
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Picks
            </TabsTrigger>

            <TabsTrigger
              value="rules"
              className="text-sm font-medium text-white/80 transition-all px-5 py-3 rounded-t-lg
          hover:bg-primary/10 hover:text-white
          data-[state=active]:bg-gradient-to-b from-primary/30 to-transparent
          data-[state=active]:text-primary
          data-[state=active]:border-b-2 data-[state=active]:border-primary
          data-[state=active]:shadow-none
        "
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Rules
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-0">
            {selectedPlanDetails ? (
              <div className="space-y-8">
                {/* Main Metrics Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-[#121212] to-[#1a1a1a] p-6 rounded-xl border border-primary/10 shadow-lg">
                    <div className="flex flex-col items-center">
                      <CircularProgress
                        percentage={Math.min(100, (challenge.current_profit / selectedPlanDetails.profitTarget) * 100)}
                        color={challenge.current_profit >= 0 ? '#10B981' : '#EF4444'}
                        value={`${challenge.current_profit.toFixed(2)}%`}
                        label="Current Profit"
                        size={100}
                        strokeWidth={8}
                      />
                      <div className="mt-4 text-center">
                        <div className="text-sm text-white/60">Target: {selectedPlanDetails.profitTarget}%</div>
                        <div className="mt-1 text-xs text-white/40">Progress to target</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-[#121212] to-[#1a1a1a] p-6 rounded-xl border border-primary/10 shadow-lg">
                    <div className="flex flex-col items-center">
                      <CircularProgress
                        percentage={selectedPlanDetails?.maxDrawdown ?
                          Math.min(100, (parseFloat(challenge.current_drawdown) / selectedPlanDetails.maxDrawdown) * 100)
                          : 0}
                        color="#F59E0B"
                        value={`${parseFloat(challenge.current_drawdown).toFixed(2)}%`}
                        label="Max Drawdown"
                        size={100}
                        strokeWidth={8}
                      />
                      <div className="mt-4 text-center">
                        <div className="text-sm text-white/60">Limit: {selectedPlanDetails?.maxDrawdown || 0}%</div>
                        <div className="mt-1 text-xs text-white/40">Remaining buffer</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-[#121212] to-[#1a1a1a] p-6 rounded-xl border border-primary/10 shadow-lg">
                    <div className="flex flex-col items-center">
                      <CircularProgress
                        percentage={selectedPlanDetails?.minTradingDays ?
                          Math.min(100, (challenge.trading_days / selectedPlanDetails.minTradingDays) * 100)
                          : 0}
                        color="#00B2FF"
                        value={`${challenge.trading_days}/${selectedPlanDetails?.minTradingDays || 10}`}
                        label="Picking Days"
                        size={100}
                        strokeWidth={8}
                      />
                      <div className="mt-4 text-center">
                        <div className="text-sm text-white/60">Minimum Required</div>
                        <div className="mt-1 text-xs text-white/40">Days completed</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Performance Stats Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-[#121212] to-[#1a1a1a] p-6 rounded-xl border border-primary/10 shadow-lg">
                    <div className="flex flex-col items-center">
                      <CircularProgress
                        percentage={stats.totalTrades > 0 ? stats.winRate : 0}
                        color="#10B981"
                        value={`${stats.totalTrades > 0 ? stats.winRate.toFixed(1) : 0}%`}
                        label="Win Rate"
                        size={80}
                        strokeWidth={6}
                      />
                      <div className="mt-4 text-center">
                        <div className="text-sm text-white/60">Success rate</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-[#121212] to-[#1a1a1a] p-6 rounded-xl border border-primary/10 shadow-lg">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary mb-2">{stats.totalTrades}</div>
                      <div className="text-sm text-white/70 mb-4">Total Picks</div>
                      <div className="flex justify-center space-x-6">
                        <div className="text-center">
                          <div className="text-xl font-bold text-green-400">{stats.winningTrades}</div>
                          <div className="text-xs text-white/60 mt-1">Wins</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xl font-bold text-red-400">{stats.losingTrades}</div>
                          <div className="text-xs text-white/60 mt-1">Losses</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-[#121212] to-[#1a1a1a] p-6 rounded-xl border border-primary/10 shadow-lg">
                    <div className="text-center">
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center justify-center">
                        <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                        Performance
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-white/60">Best Win:</span>
                          <span className="text-sm text-green-400 font-medium">
                            ${stats.largestWin > 0 ? stats.largestWin.toFixed(0) : 0}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-white/60">Worst Loss:</span>
                          <span className="text-sm text-red-400 font-medium">
                            ${stats.largestLoss < 0 ? Math.abs(stats.largestLoss).toFixed(0) : 0}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-white/60">Avg P&L:</span>
                          <span className={`text-sm font-medium ${stats.averageProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            ${stats.averageProfit.toFixed(0)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                {challenge.status === 'in_progress' && (
                  <div className="flex justify-center mt-6">
                    <Link href="/odds">
                      <Button className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-[0_0_20px_rgba(0,178,255,0.4)] px-8 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14v6m-3-3h6M6 10h2a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6a2 2 0 012-2zm10-4a2 2 0 11-4 0 2 2 0 014 0zM4 6a2 2 0 100 4h16a2 2 0 100-4H4z" />
                        </svg>
                        Place a Bet
                      </Button>
                    </Link>
                  </div>
                )}

                {challenge.status === 'funded' && (
                  <div className="flex justify-center mt-6 space-x-4">
                    <Link href="/funded-account">
                      <Button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-[0_0_20px_rgba(34,197,94,0.4)] px-6 py-3 rounded-xl font-medium transition-all duration-300">
                        🎉 View Funded Account
                      </Button>
                    </Link>
                    <Link href="/odds">
                      <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/10 px-6 py-3 rounded-xl font-medium">
                        Continue Picking
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-xl border border-primary/20 p-6 py-16  text-center bg-gradient-to-b from-[#121212] to-[#0f0f0f] shadow-lg">
                <div className="mx-auto w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-12 h-12 text-primary/40" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <p className="text-white/60 mb-4">No overview data available for this challenge.</p>
                <p className="text-sm text-white/50">If you recently started a challenge, wait a moment for data to sync. If this persists, make sure your challenge is active.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="trades" className="mt-0">
            <div className="rounded-xl border border-primary/20 overflow-hidden bg-gradient-to-b from-[#121212] to-[#0f0f0f] shadow-lg">
              {isLoading ? (
                <div className="flex justify-center items-center py-16">
                  <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                </div>
              ) : trades && trades.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-primary/10">
                    <thead className="bg-primary/10">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium text-white/90 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-white/90 uppercase tracking-wider">Sport</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-white/90 uppercase tracking-wider">Market</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-white/90 uppercase tracking-wider">Selection</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-white/90 uppercase tracking-wider">Odds</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-white/90 uppercase tracking-wider">Stake</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-white/90 uppercase tracking-wider">Result</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-white/90 uppercase tracking-wider">Profit/Loss</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-primary/10">
                      {trades.map((trade: Trade) => (
                        <tr key={trade.id} className="hover:bg-primary/5 transition-colors duration-150">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-white/80">
                            {formatDate(trade.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-white/80">
                            {trade.sport}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-white/80">
                            {trade.market}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-white/80">
                            {trade.selection}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-white/80">
                            {trade.odds.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-white/80">
                            ${trade.stake.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${trade.result === 'win'
                              ? 'bg-green-500/20 text-green-400'
                              : trade.result === 'loss'
                                ? 'bg-red-500/20 text-red-400'
                                : trade.result === 'void'
                                  ? 'bg-yellow-500/20 text-yellow-400'
                                  : 'bg-blue-500/20 text-blue-400'
                              }`}>
                              {trade.result ? trade.result.charAt(0).toUpperCase() + trade.result.slice(1) : 'Pending'}
                            </span>
                          </td>
                          <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${trade.profitLoss && trade.profitLoss > 0
                            ? 'text-green-400'
                            : trade.profitLoss && trade.profitLoss < 0
                              ? 'text-red-400'
                              : 'text-white/80'
                            }`}>
                            {trade.profitLoss
                              ? `${trade.profitLoss > 0 ? '+' : ''}$${trade.profitLoss.toFixed(2)}`
                              : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="mx-auto w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-12 h-12 text-primary/40" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <p className="text-white/60 mb-6">No picks recorded yet.</p>
                  {challenge.status === 'in_progress' && (
                    <Link href="/odds">
                      <Button className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-[0_0_15px_rgba(0,178,255,0.3)]">
                        Place Your First Bet
                      </Button>
                    </Link>
                  )}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="rules" className="mt-0">
            {selectedPlanDetails ? (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-[#121212] to-[#1a1a1a] p-6 rounded-xl border border-primary/10 shadow-lg">
                    <h3 className="text-lg font-semibold mb-4 flex items-center text-white">
                      <svg className="w-5 h-5 text-primary mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                      Profit Target Requirements
                    </h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <svg className="w-5 h-5 text-primary mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-white/80">{selectedPlanDetails.profitTarget}% profit target within 30 days</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="w-5 h-5 text-primary mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-white/80">Minimum {selectedPlanDetails.minTradingDays} picking days required</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="w-5 h-5 text-primary mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-white/80">Maximum daily profit cap is {selectedPlanDetails.maxDailyProfit}%</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-gradient-to-br from-[#121212] to-[#1a1a1a] p-6 rounded-xl border border-primary/10 shadow-lg">
                    <h3 className="text-lg font-semibold mb-4 flex items-center text-white">
                      <svg className="w-5 h-5 text-primary mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Risk Management Rules
                    </h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <svg className="w-5 h-5 text-primary mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-white/80">Maximum {selectedPlanDetails.maxDrawdown}% account drawdown allowed</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="w-5 h-5 text-primary mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-white/80">Maximum 2% risk per individual pick</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="w-5 h-5 text-primary mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-white/80">No more than 5% of account balance at risk at any time</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-[#121212] to-[#1a1a1a] p-6 rounded-xl border border-primary/10 shadow-lg">
                  <h3 className="text-lg font-semibold mb-4 flex items-center text-white">
                    <svg className="w-5 h-5 text-primary mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Payout Structure
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-primary mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-white/80">{selectedPlanDetails.profitSplit}% profit split in your favor</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-primary mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-white/80">Payouts processed {selectedPlanDetails.payoutFrequency}</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-primary mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-white/80">Minimum payout threshold of $100</span>
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-primary/20 p-6 py-16 text-center bg-gradient-to-b from-[#121212] to-[#0f0f0f] shadow-lg">
                <div className="mx-auto w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-12 h-12 text-primary/40" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3" />
                  </svg>
                </div>
                <p className="text-white/60 mb-4">Rules are not available for this challenge.</p>
                <p className="text-sm text-white/50">Plan information is missing or still loading. Try refreshing the page or selecting a different challenge.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

const NoChallenge = () => {
  const [showPlans, setShowPlans] = useState(false);

  // Fetch available plans
  const { data: plans, isLoading: isPlansLoading } = useQuery({
    queryKey: ['/api/plans'],
    queryFn: async () => {
      const res = await fetch('/api/plans', {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to fetch plans');
      return res.json();
    }
  });

  if (showPlans && plans) {
    return (
      <Card className="card-glow">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-white">Choose a Challenge</CardTitle>
          <CardDescription className="text-white/70">
            Select a picking challenge to start your journey towards becoming a funded trader
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {plans.filter((plan: Plan) => plan.isActive).map((plan: Plan) => (
              <Card key={plan.id} className="border border-primary/30 bg-[#0f0f0f]/80 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-900 to-primary p-4">
                  <CardTitle className="text-xl font-bold text-white">${plan.accountSize.toLocaleString()}</CardTitle>
                  <CardDescription className="text-white/90">{plan.name} Challenge</CardDescription>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-white/70">Price</span>
                      <span className="font-semibold text-white">${(plan.price / 100).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-white/70">Profit Target</span>
                      <span className="font-semibold text-white">{plan.profitTarget}%</span>
                    </div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-white/70">Max Drawdown</span>
                      <span className="font-semibold text-white">{plan.maxDrawdown}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/70">Profit Split</span>
                      <span className="font-semibold text-white">{plan.profitSplit}%</span>
                    </div>
                  </div>
                  <Button
                    className="w-full bg-primary hover:bg-primary/90"
                    onClick={() => {
                      // Handle plan purchase logic here
                      window.alert('Plan purchase functionality will be implemented in the next update.');
                    }}
                  >
                    Start Challenge
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
        <CardFooter className="border-t border-primary/20 p-4 flex justify-center">
          <Button
            variant="outline"
            className="border-primary/30 text-white bg-transparent hover:bg-primary/10"
            onClick={() => setShowPlans(false)}
          >
            Back
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="card-glow">
      <CardContent className="flex flex-col items-center justify-center py-16">
        <div className="bg-primary/10 p-3 rounded-full mb-4">
          <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 12V8H6a2 2 0 01-2-2c0-1.1.9-2 2-2h12v4"></path>
            <path d="M4 6v12c0 1.1.9 2 2 2h14v-4"></path>
            <path d="M18 12c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path>
          </svg>
        </div>
        <h3 className="text-xl font-bold mb-2 text-white">No Challenges Yet</h3>
        <p className="text-white/70 text-center mb-6 max-w-md">
          You haven't started any picking challenges yet. Choose a plan and begin your journey to becoming a funded trader.
        </p>
        <Button
          className="bg-primary hover:bg-primary/90 shadow-[0_0_15px_rgba(0,178,255,0.3)]"
          onClick={() => setShowPlans(true)}
        >
          Browse Available Plans
        </Button>
      </CardContent>
    </Card>
  );
};

export default Dashboard;
