import { useState } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/layout/layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import CircularProgress from "@/components/ui/circular-progress";
import { useAuth } from "@/hooks/useAuth";

const FundedAccountPage = () => {
  const { user } = useAuth();

  // Demo funded account data
  const fundedAccount = {
    id: 1,
    accountSize: 100000,
    currentBalance: 107500,
    totalProfits: 7500,
    totalPayouts: 0,
    profitSplit: 80,
    status: "active",
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    monthlyTarget: 3000,
    currentMonthProfit: 2100,
  };

  // Demo recent payouts
  const recentPayouts = [
    {
      id: 1,
      amount: 2400,
      profitAmount: 3000,
      traderShare: 80,
      status: "processed",
      requestedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      processedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    },
    {
      id: 2,
      amount: 1600,
      profitAmount: 2000,
      traderShare: 80,
      status: "processed",
      requestedAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
      processedAt: new Date(Date.now() - 19 * 24 * 60 * 60 * 1000),
    },
  ];

  const handleRequestPayout = () => {
    alert("Payout request feature will be implemented in the next update.");
  };

  return (
    <Layout>
      <div className="min-h-screen pt-28 pb-16 px-4 sm:px-6 lg:px-8">
        {/* Stadium background (local asset) */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0b1220]/90 to-[#001f44]/10"></div>
          <div className="absolute inset-0 bg-[url('/assets/b2f/4.jpg')]  bg-cover bg-center opacity-12"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold mb-2">
              Funded Account Dashboard
            </h1>
            <p className="text-white">
              Congratulations! You’ve passed your challenge and now have a
              funded account!
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Account Balance Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-2"
            >
              <Card className="bg-[#121212]/70 backdrop-blur-sm border-primary/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    <span>Account Balance</span>
                    <Badge className="bg-green-500/20 text-green-400">
                      Active
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    Your current funded account status and performance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-[#121212]/60 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-primary">
                        ${fundedAccount.currentBalance.toLocaleString()}
                      </div>
                      <div className="text-sm text-white/60">
                        Current Balance
                      </div>
                    </div>
                    <div className="bg-[#121212]/60 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-green-400">
                        ${fundedAccount.totalProfits.toLocaleString()}
                      </div>
                      <div className="text-sm text-white/60">Total Profits</div>
                    </div>
                    <div className="bg-[#121212]/60 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-400">
                        {fundedAccount.profitSplit}%
                      </div>
                      <div className="text-sm text-white/60">Your Share</div>
                    </div>
                    <div className="bg-[#121212]/60 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-blue-400">
                        $
                        {(
                          fundedAccount.totalProfits *
                          (fundedAccount.profitSplit / 100)
                        ).toFixed(0)}
                      </div>
                      <div className="text-sm text-white/60">
                        Available Payout
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col items-center">
                      <CircularProgress
                        percentage={Math.min(
                          100,
                          (fundedAccount.currentMonthProfit /
                            fundedAccount.monthlyTarget) *
                          100
                        )}
                        color="#10B981"
                        value={`$${fundedAccount.currentMonthProfit.toLocaleString()}`}
                        label="Monthly Profit"
                        size={120}
                        strokeWidth={8}
                      />
                      <div className="mt-2 text-center">
                        <div className="text-xs text-white/60">
                          Target: $
                          {fundedAccount.monthlyTarget.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-white/70">Account Size</span>
                        <span className="text-white font-semibold">
                          ${fundedAccount.accountSize.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/70">Profit Share</span>
                        <span className="text-primary font-semibold">
                          {fundedAccount.profitSplit}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/70">Account Status</span>
                        <Badge className="bg-green-500/20 text-green-400">
                          Active
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/70">Next Payout</span>
                        <span className="text-white font-semibold">
                          In 3 days
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={handleRequestPayout}
                    className="w-full bg-primary hover:bg-primary/90"
                    disabled={fundedAccount.totalProfits < 100}
                  >
                    Request Payout ($
                    {(
                      fundedAccount.totalProfits *
                      (fundedAccount.profitSplit / 100) || 0
                    ).toFixed(0)}{" "}
                    available)
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="bg-[#121212]/70 backdrop-blur-sm border-primary/30">
                <CardHeader>
                  <CardTitle className="text-white">Quick Stats</CardTitle>
                  <CardDescription>Your performance metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-white/70">Days Active</span>
                    <span className="text-white font-semibold">30</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Win Rate</span>
                    <span className="text-green-400 font-semibold">68.5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Total Picks</span>
                    <span className="text-white font-semibold">47</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Avg Pick Size</span>
                    <span className="text-white font-semibold">$250</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Best Day</span>
                    <span className="text-green-400 font-semibold">+$890</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Max Drawdown</span>
                    <span className="text-yellow-400 font-semibold">-2.1%</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Payout History */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="bg-[#121212]/70 backdrop-blur-sm border-primary/30">
              <CardHeader>
                <CardTitle className="text-white">Payout History</CardTitle>
                <CardDescription>
                  Your recent payouts and withdrawal history
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-primary/20">
                        <th className="text-left py-3 text-white/70">Date</th>
                        <th className="text-left py-3 text-white/70">Profit</th>
                        <th className="text-left py-3 text-white/70">
                          Your Share
                        </th>
                        <th className="text-left py-3 text-white/70">Amount</th>
                        <th className="text-left py-3 text-white/70">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentPayouts.map((payout) => (
                        <tr
                          key={payout.id}
                          className="border-b border-primary/10"
                        >
                          <td className="py-3 text-white">
                            {payout.processedAt?.toLocaleDateString() ||
                              payout.requestedAt.toLocaleDateString()}
                          </td>
                          <td className="py-3 text-green-400">
                            ${payout.profitAmount.toLocaleString()}
                          </td>
                          <td className="py-3 text-white">
                            {payout.traderShare}%
                          </td>
                          <td className="py-3 text-primary font-semibold">
                            ${payout.amount.toLocaleString()}
                          </td>
                          <td className="py-3">
                            <Badge
                              className={
                                payout.status === "processed"
                                  ? "bg-green-500/20 text-green-400"
                                  : payout.status === "pending"
                                    ? "bg-yellow-500/20 text-yellow-400"
                                    : "bg-red-500/20 text-red-400"
                              }
                            >
                              {payout.status.charAt(0).toUpperCase() +
                                payout.status.slice(1)}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default FundedAccountPage;
