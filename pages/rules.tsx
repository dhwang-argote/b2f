import React from "react";
import Layout from "@/components/layout/layout";
import { motion } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Rules = () => {
  return (
    <Layout>
      <div className="container mx-auto py-16 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-5xl font-bold mb-4 text-white">
            Challenge Rules
          </h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            These rules apply to both challenge accounts and funded accounts
          </p>
        </motion.div>

        <div className="space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-[#121212]/70 backdrop-blur-sm border border-primary/20 rounded-lg p-6 md:p-8"
          >
            <h2 className="text-2xl font-bold mb-6 text-white">
              Trading Requirements
            </h2>

            <Table>
              <TableHeader className="bg-black/30">
                <TableRow>
                  <TableHead className="text-white w-1/3">
                    Requirement
                  </TableHead>
                  <TableHead className="text-white">Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="border-t border-primary/10">
                  <TableCell className="font-medium text-white">
                    Profit Target
                  </TableCell>
                  <TableCell className="text-white/80">
                    Reach the specified profit target for your account level
                    (typically 10-12% for Challenge Phase, 5-8% for Verification
                    Phase)
                  </TableCell>
                </TableRow>
                <TableRow className="border-t border-primary/10">
                  <TableCell className="font-medium text-white">
                    Minimum Trading Days
                  </TableCell>
                  <TableCell className="text-white/80">
                    Trade on at least the minimum number of calendar days
                    specified for your account (usually 10-15 days)
                  </TableCell>
                </TableRow>
                <TableRow className="border-t border-primary/10">
                  <TableCell className="font-medium text-white">
                    Maximum Daily Profit
                  </TableCell>
                  <TableCell className="text-white/80">
                    Daily profits are capped at a certain percentage of your
                    account (typically 10%). Any profits beyond this limit won't
                    count toward your challenge target.
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-[#121212]/70 backdrop-blur-sm border border-primary/20 rounded-lg p-6 md:p-8"
          >
            <h2 className="text-2xl font-bold mb-6 text-white">
              Risk Management Rules
            </h2>

            <Table>
              <TableHeader className="bg-black/30">
                <TableRow>
                  <TableHead className="text-white w-1/3">Rule</TableHead>
                  <TableHead className="text-white">Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="border-t border-primary/10">
                  <TableCell className="font-medium text-white">
                    Maximum Drawdown
                  </TableCell>
                  <TableCell className="text-white/80">
                    Your account balance must never drop below the maximum
                    drawdown threshold (typically 10% of starting balance)
                  </TableCell>
                </TableRow>
                <TableRow className="border-t border-primary/10">
                  <TableCell className="font-medium text-white">
                    Daily Drawdown Limit
                  </TableCell>
                  <TableCell className="text-white/80">
                    Daily losses are limited to a specified percentage
                    (typically 5% of starting balance). If reached, trading will
                    be restricted for the remainder of the day.
                  </TableCell>
                </TableRow>
                <TableRow className="border-t border-primary/10">
                  <TableCell className="font-medium text-white">
                    Position Sizing
                  </TableCell>
                  <TableCell className="text-white/80">
                    Maximum stake per trade is limited to 5% of account balance
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-[#121212]/70 backdrop-blur-sm border border-primary/20 rounded-lg p-6 md:p-8"
          >
            <h2 className="text-2xl font-bold mb-6 text-white">
              Prohibited Activities
            </h2>

            <div className="space-y-4 text-white/80">
              <p>
                <span className="text-white font-semibold">Arbitrage:</span>{" "}
                Placing bets on all possible outcomes of an event to guarantee a
                profit is prohibited.
              </p>
              <p>
                <span className="text-white font-semibold">
                  Correlated Bets:
                </span>{" "}
                Placing multiple bets with high correlation to circumvent
                position sizing rules is not allowed.
              </p>
              <p>
                <span className="text-white font-semibold">Bonus Abuse:</span>{" "}
                Exploiting promotional offers or bonuses from sportsbooks to
                guarantee profits.
              </p>
              <p>
                <span className="text-white font-semibold">
                  Prohibited Market Types:
                </span>{" "}
                Certain market types (such as novelty bets or extremely illiquid
                markets) may be restricted.
              </p>
              <p>
                <span className="text-white font-semibold">
                  Algorithm Trading:
                </span>{" "}
                Using automated trading systems or bots without prior approval.
              </p>
              <p>
                <span className="text-white font-semibold">
                  Account Sharing:
                </span>{" "}
                Allowing other individuals to access or trade on your account.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-[#121212]/70 backdrop-blur-sm border border-primary/20 rounded-lg p-6 md:p-8"
          >
            <h2 className="text-2xl font-bold mb-6 text-white">
              Challenge Reset Policy
            </h2>

            <div className="space-y-4 text-white/80">
              <p>
                If you violate any challenge rules or fail to meet the profit
                target, your challenge will be considered failed.
              </p>
              <p>
                You have the option to reset your challenge at a discounted
                rate. The first reset is available at 50% of the original
                challenge fee, and subsequent resets at 70% of the original fee.
              </p>
              <p>
                Challenge resets are entirely optional. You can choose to
                purchase a new challenge at full price instead.
              </p>
              <p>
                Reset discounts are applied automatically in your account when a
                challenge is marked as failed.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default Rules;
