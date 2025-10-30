import { useState } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/layout/layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const LeaderboardPage = () => {
  // Demo leaderboard data
  const leaderboardData = {
    daily: [
      {
        id: 1,
        rank: 1,
        username: "TraderPro88",
        totalProfit: 1250.5,
        winRate: 85,
        totalTrades: 12,
        accountSize: 100000,
      },
      {
        id: 2,
        rank: 2,
        username: "BetMaster",
        totalProfit: 890.25,
        winRate: 72,
        totalTrades: 18,
        accountSize: 50000,
      },
      {
        id: 3,
        rank: 3,
        username: "SportsAnalyst",
        totalProfit: 675.8,
        winRate: 68,
        totalTrades: 15,
        accountSize: 25000,
      },
      {
        id: 4,
        rank: 4,
        username: "AlphaBetter",
        totalProfit: 445.3,
        winRate: 62,
        totalTrades: 21,
        accountSize: 10000,
      },
      {
        id: 5,
        rank: 5,
        username: "WinStreaker",
        totalProfit: 334.75,
        winRate: 58,
        totalTrades: 19,
        accountSize: 50000,
      },
    ],
    weekly: [
      {
        id: 1,
        rank: 1,
        username: "TraderPro88",
        totalProfit: 8750.2,
        winRate: 78,
        totalTrades: 85,
        accountSize: 100000,
      },
      {
        id: 2,
        rank: 2,
        username: "ValueHunter",
        totalProfit: 6420.15,
        winRate: 74,
        totalTrades: 92,
        accountSize: 100000,
      },
      {
        id: 3,
        rank: 3,
        username: "BetMaster",
        totalProfit: 5890.4,
        winRate: 69,
        totalTrades: 78,
        accountSize: 50000,
      },
      {
        id: 4,
        rank: 4,
        username: "EdgeFinder",
        totalProfit: 4250.8,
        winRate: 66,
        totalTrades: 65,
        accountSize: 25000,
      },
      {
        id: 5,
        rank: 5,
        username: "SportsAnalyst",
        totalProfit: 3875.9,
        winRate: 63,
        totalTrades: 71,
        accountSize: 25000,
      },
    ],
    monthly: [
      {
        id: 1,
        rank: 1,
        username: "ValueHunter",
        totalProfit: 24750.85,
        winRate: 72,
        totalTrades: 385,
        accountSize: 100000,
      },
      {
        id: 2,
        rank: 2,
        username: "TraderPro88",
        totalProfit: 22340.5,
        winRate: 76,
        totalTrades: 342,
        accountSize: 100000,
      },
      {
        id: 3,
        rank: 3,
        username: "EdgeFinder",
        totalProfit: 18900.25,
        winRate: 68,
        totalTrades: 298,
        accountSize: 50000,
      },
      {
        id: 4,
        rank: 4,
        username: "BetMaster",
        totalProfit: 15675.4,
        winRate: 65,
        totalTrades: 267,
        accountSize: 50000,
      },
      {
        id: 5,
        rank: 5,
        username: "AlphaBetter",
        totalProfit: 12550.75,
        winRate: 61,
        totalTrades: 315,
        accountSize: 25000,
      },
    ],
  };

  const [selectedPeriod, setSelectedPeriod] = useState<
    "daily" | "weekly" | "monthly"
  >("weekly");

  // UI state for filters and loading
  const [search, setSearch] = useState("");
  const [minAccount, setMinAccount] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<"profit" | "winRate" | "trades">(
    "profit"
  );
  const [loading, setLoading] = useState(false); // placeholder for live data fetching

  // derive current dataset
  const currentData = leaderboardData[selectedPeriod];

  const filteredData = currentData
    .filter((t) =>
      search ? t.username.toLowerCase().includes(search.toLowerCase()) : true
    )
    .filter((t) => (minAccount ? t.accountSize >= minAccount : true))
    .sort((a, b) => {
      if (sortBy === "profit") return b.totalProfit - a.totalProfit;
      if (sortBy === "winRate") return b.winRate - a.winRate;
      return b.totalTrades - a.totalTrades;
    });

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "text-yellow-400"; // Gold
      case 2:
        return "text-gray-300"; // Silver
      case 3:
        return "text-orange-400"; // Bronze
      default:
        return "text-white/70";
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return "🥇";
      case 2:
        return "🥈";
      case 3:
        return "🥉";
      default:
        return `#${rank}`;
    }
  };

  const getInitials = (username: string) => {
    return username.substring(0, 2).toUpperCase();
  };

  const getAvatarColor = (rank: number) => {
    const colors = [
      "bg-gradient-to-br from-yellow-400 to-yellow-600",
      "bg-gradient-to-br from-gray-400 to-gray-600",
      "bg-gradient-to-br from-orange-400 to-orange-600",
      "bg-gradient-to-br from-blue-400 to-blue-600",
      "bg-gradient-to-br from-green-400 to-green-600",
      "bg-gradient-to-br from-purple-400 to-purple-600",
      "bg-gradient-to-br from-pink-400 to-pink-600",
      "bg-gradient-to-br from-indigo-400 to-indigo-600",
    ];
    return colors[Math.min(rank - 1, colors.length - 1)];
  };

  return (
    <Layout>
      <div className="min-h-screen pt-28 pb-16 px-4 sm:px-6 lg:px-8">
        {/* Background */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-[#121212]/95 to-[#0039B3]/10"></div>
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1434648957308-5e6a859697e8?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover bg-bottom opacity-10"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 text-center"
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              🏆 <span className="text-primary">Leaderboard</span>
            </h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              See how you stack up against other sports strategists. Compete for
              the top spot and earn bragging rights!
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="bg-[#121212]/70 backdrop-blur-sm border-primary/30">
              <CardHeader>
                <CardTitle className="text-white">Top Performers</CardTitle>
                <CardDescription>
                  Rankings based on profit performance and consistency
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Toolbar */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Search trader..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                    <Select onValueChange={(val) => setSortBy(val as any)}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="profit">Profit</SelectItem>
                          <SelectItem value="winRate">Win Rate</SelectItem>
                          <SelectItem value="trades">Picks</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Min account (e.g. 25000)"
                      value={minAccount ?? ""}
                      onChange={(e) =>
                        setMinAccount(
                          e.target.value ? Number(e.target.value) : null
                        )
                      }
                    />
                    {loading && (
                      <div className="w-6 h-6 border-2 border-t-primary rounded-full animate-spin" />
                    )}
                  </div>
                </div>

                <Tabs
                  value={selectedPeriod}
                  onValueChange={(value) => setSelectedPeriod(value as any)}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-3 mb-6">
                    <TabsTrigger value="daily">Daily</TabsTrigger>
                    <TabsTrigger value="weekly">Weekly</TabsTrigger>
                    <TabsTrigger value="monthly">Monthly</TabsTrigger>
                  </TabsList>

                  <TabsContent value="daily">
                    <LeaderboardTable
                      data={filteredData}
                      period="Today"
                      loading={loading}
                    />
                  </TabsContent>

                  <TabsContent value="weekly">
                    <LeaderboardTable
                      data={filteredData}
                      period="This Week"
                      loading={loading}
                    />
                  </TabsContent>

                  <TabsContent value="monthly">
                    <LeaderboardTable
                      data={filteredData}
                      period="This Month"
                      loading={loading}
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>

          {/* Achievement Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8"
          >
            <Card className="bg-[#121212]/70 backdrop-blur-sm border-primary/30">
              <CardHeader>
                <CardTitle className="text-white">
                  🎖️ Achievement Badges
                </CardTitle>
                <CardDescription>
                  Special recognition for outstanding performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-[#121212]/60 p-4 rounded-lg text-center">
                    <div className="text-2xl mb-2">🔥</div>
                    <div className="text-sm font-semibold text-white">
                      Hot Streak
                    </div>
                    <div className="text-xs text-white/60">
                      5+ wins in a row
                    </div>
                  </div>
                  <div className="bg-[#121212]/60 p-4 rounded-lg text-center">
                    <div className="text-2xl mb-2">💎</div>
                    <div className="text-sm font-semibold text-white">
                      Diamond Hands
                    </div>
                    <div className="text-xs text-white/60">
                      No losses this week
                    </div>
                  </div>
                  <div className="bg-[#121212]/60 p-4 rounded-lg text-center">
                    <div className="text-2xl mb-2">🎯</div>
                    <div className="text-sm font-semibold text-white">
                      Accuracy Master
                    </div>
                    <div className="text-xs text-white/60">80%+ win rate</div>
                  </div>
                  <div className="bg-[#121212]/60 p-4 rounded-lg text-center">
                    <div className="text-2xl mb-2">⚡</div>
                    <div className="text-sm font-semibold text-white">
                      Lightning Fast
                    </div>
                    <div className="text-xs text-white/60">
                      Quick profit targets
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

interface LeaderboardTableProps {
  data: Array<{
    id: number;
    rank: number;
    username: string;
    totalProfit: number;
    winRate: number;
    totalTrades: number;
    accountSize: number;
  }>;
  period: string;
  loading?: boolean;
}

const LeaderboardTable = ({ data, period, loading }: LeaderboardTableProps) => {
  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "text-yellow-400";
      case 2:
        return "text-gray-300";
      case 3:
        return "text-orange-400";
      default:
        return "text-white/70";
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return "🥇";
      case 2:
        return "🥈";
      case 3:
        return "🥉";
      default:
        return `#${rank}`;
    }
  };

  const getInitials = (username: string) => {
    return username.substring(0, 2).toUpperCase();
  };

  const getAvatarColor = (rank: number) => {
    const colors = [
      "bg-gradient-to-br from-yellow-400 to-yellow-600",
      "bg-gradient-to-br from-gray-400 to-gray-600",
      "bg-gradient-to-br from-orange-400 to-orange-600",
      "bg-gradient-to-br from-blue-400 to-blue-600",
      "bg-gradient-to-br from-green-400 to-green-600",
    ];
    return colors[Math.min(rank - 1, colors.length - 1)];
  };

  if (loading) {
    return (
      <div className="py-12 text-center">
        <div className="w-12 h-12 border-4 border-t-primary rounded-full animate-spin mx-auto" />
        <div className="text-white/70 mt-4">Loading live leaderboard...</div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="py-12 text-center text-white/70">
        No traders available for {period}.
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white">{period} Leaders</h3>
        <p className="text-sm text-white/60">Based on profit performance</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-primary/20">
              <th className="text-left py-3 px-4 text-white/70">Rank</th>
              <th className="text-left py-3 text-white/70">Trader</th>
              <th className="text-left py-3 text-white/70">Profit</th>
              <th className="text-left py-3 text-white/70">Win Rate</th>
              <th className="text-left py-3 text-white/70">Picks</th>
              <th className="text-left py-3 text-white/70">Account</th>
            </tr>
          </thead>
          <tbody>
            {data.map((trader) => (
              <motion.tr
                key={trader.id}
                className={`border-b border-primary/10 hover:bg-primary/5 transition-colors ${trader.rank <= 3 ? "bg-primary/5" : ""
                  }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: trader.rank * 0.1 }}
              >
                <td className="py-4 px-4">
                  <div
                    className={`flex items-center space-x-2 ${getRankColor(
                      trader.rank
                    )}`}
                  >
                    <span className="text-lg font-bold">
                      {getRankIcon(trader.rank)}
                    </span>
                  </div>
                </td>
                <td className="py-4">
                  <div className="flex items-center space-x-3">
                    <Avatar
                      className={`w-10 h-10 ${getAvatarColor(trader.rank)}`}
                    >
                      <AvatarFallback className="text-white font-bold">
                        {getInitials(trader.username)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-white">
                        {trader.username}
                      </div>
                      {trader.rank <= 3 && (
                        <Badge
                          className={
                            trader.rank === 1
                              ? "bg-yellow-500/20 text-yellow-400"
                              : trader.rank === 2
                                ? "bg-gray-500/20 text-gray-400"
                                : "bg-orange-500/20 text-orange-400"
                          }
                        >
                          Top {trader.rank}
                        </Badge>
                      )}
                    </div>
                  </div>
                </td>
                <td className="py-4">
                  <span className="text-green-400 font-bold text-lg">
                    ${trader.totalProfit.toLocaleString()}
                  </span>
                </td>
                <td className="py-4">
                  <span
                    className={`font-semibold ${trader.winRate >= 70
                      ? "text-green-400"
                      : trader.winRate >= 60
                        ? "text-yellow-400"
                        : "text-white"
                      }`}
                  >
                    {trader.winRate}%
                  </span>
                </td>
                <td className="py-4">
                  <span className="text-white">{trader.totalTrades}</span>
                </td>
                <td className="py-4">
                  <span className="text-primary font-semibold">
                    ${(trader.accountSize / 1000).toFixed(0)}K
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaderboardPage;
