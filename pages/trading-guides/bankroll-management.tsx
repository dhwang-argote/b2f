import React from "react";
import Layout from "@/components/layout/layout";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const BankrollManagementGuide = () => {
  return (
    <Layout>
      <div className="container mx-auto py-16 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="mb-4 flex items-center">
            <Link href="/educational-center">
              <Button
                variant="ghost"
                className="text-primary hover:text-primary/80"
              >
                &larr; Back to Educational Center
              </Button>
            </Link>
            <span className="mx-2 text-white/40">|</span>
            <span className="text-white/60">Risk Management</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 text-white">
            Bankroll Management Fundamentals
          </h1>
          <div className="flex items-center text-white/60 text-sm mb-8">
            <span>May 10, 2025</span>
            <span className="mx-2">•</span>
            <span>10 min read</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
          <motion.div
            className="md:col-span-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="bg-[#121212]/70 backdrop-blur-sm border border-primary/20 p-8">
              <CardContent className="space-y-8 p-0 text-white/80">
                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold text-white">
                    Why Bankroll Management Matters
                  </h2>
                  <p>
                    Proper bankroll management is arguably the most important
                    aspect of successful sports picking. No matter how skilled
                    you are at finding value or predicting outcomes, poor money
                    management will eventually lead to bankruptcy.
                  </p>
                  <p>
                    The primary goal of bankroll management isn't just to
                    prevent bankruptcy—it's to optimize growth while protecting
                    your capital from inevitable downswings. Even the best
                    sports bettors in the world experience losing streaks, and
                    sound bankroll management is what allows them to survive
                    these periods.
                  </p>
                </div>

                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold text-white">
                    The Kelly Criterion
                  </h2>
                  <p>
                    The Kelly Criterion is a formula used to determine the
                    optimal size of a series of bets to maximize the logarithm
                    of wealth. In simple terms, it tells you what percentage of
                    your bankroll you should wager based on the expected value
                    of a bet.
                  </p>
                  <p>The formula is:</p>
                  <div className="bg-[#0D0D0D] p-4 rounded-md">
                    <code>Kelly % = (bp - q) / b</code>
                    <p className="mt-2 text-sm">Where:</p>
                    <ul className="list-disc pl-6 text-sm space-y-1">
                      <li>
                        b = the decimal odds - 1 (e.g., for odds of 2.50, b =
                        1.50)
                      </li>
                      <li>p = the probability of winning</li>
                      <li>q = the probability of losing (1 - p)</li>
                    </ul>
                  </div>
                  <p>
                    For example, if you estimate a team has a 45% chance to win
                    and they're offered at odds of 2.50:
                  </p>
                  <div className="bg-[#0D0D0D] p-4 rounded-md">
                    <code>
                      Kelly % = (1.50 × 0.45 - 0.55) / 1.50 = 0.1167 or 11.67%
                    </code>
                  </div>
                  <p>
                    This means you should bet 11.67% of your bankroll on this
                    opportunity.
                  </p>
                </div>

                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold text-white">
                    Fractional Kelly
                  </h2>
                  <p>
                    Many professional bettors use a fractional Kelly
                    approach—betting a fraction of what the Kelly formula
                    suggests. This provides additional protection against
                    estimation errors.
                  </p>
                  <p>Common fractions include:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <strong>Half Kelly (0.5x):</strong> Bet half of what the
                      Kelly formula suggests
                    </li>
                    <li>
                      <strong>Quarter Kelly (0.25x):</strong> Bet a quarter of
                      what the Kelly formula suggests
                    </li>
                  </ul>
                  <p>
                    Using a fractional approach sacrifices some potential growth
                    rate for increased safety and reduced volatility.
                  </p>
                </div>

                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold text-white">
                    Fixed Percentage Method
                  </h2>
                  <p>
                    If the Kelly Criterion seems too complex, a simpler approach
                    is the fixed percentage method, where you bet a consistent
                    percentage of your current bankroll on each wager.
                  </p>
                  <p>
                    Most successful bettors recommend risking between 1-5% of
                    your bankroll per bet, depending on your risk tolerance:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <strong>Conservative (1-2%):</strong> Slow growth with
                      minimal risk of ruin
                    </li>
                    <li>
                      <strong>Moderate (3%):</strong> Balanced approach suitable
                      for most bettors
                    </li>
                    <li>
                      <strong>Aggressive (4-5%):</strong> Faster growth but
                      higher volatility
                    </li>
                  </ul>
                  <p>
                    This method is dynamic—as your bankroll grows or shrinks, so
                    does your bet size, ensuring you never risk too much after a
                    losing streak or too little after a winning streak.
                  </p>
                </div>

                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold text-white">
                    The Dangers of Flat Betting
                  </h2>
                  <p>
                    Some bettors use a flat betting approach, wagering the same
                    amount regardless of bankroll size. While simple, this
                    approach has significant drawbacks:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      After a losing streak, bets become a larger percentage of
                      your remaining bankroll, increasing risk of ruin
                    </li>
                    <li>
                      After a winning streak, bets become a smaller percentage
                      of your bankroll, limiting growth potential
                    </li>
                    <li>
                      It doesn't adapt to changes in your financial situation
                    </li>
                  </ul>
                  <p>
                    If you do use flat betting, consider reassessing your
                    standard bet size periodically based on your current
                    bankroll.
                  </p>
                </div>

                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold text-white">
                    Bankroll Allocation for Multiple Sports
                  </h2>
                  <p>
                    If you bet on multiple sports, consider allocating your
                    bankroll based on your edge in each sport:
                  </p>
                  <ol className="list-decimal pl-6 space-y-2">
                    <li>
                      Create separate bankrolls for each sport or category
                    </li>
                    <li>
                      Allocate more funds to sports where you have greater
                      expertise
                    </li>
                    <li>
                      Apply appropriate staking methods within each category
                    </li>
                    <li>
                      Periodically rebalance your sub-bankrolls based on
                      performance
                    </li>
                  </ol>
                  <p>
                    This structured approach helps prevent losses in one sport
                    from affecting your ability to bet on sports where you have
                    a clear edge.
                  </p>
                </div>

                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold text-white">
                    Risk of Ruin
                  </h2>
                  <p>
                    Risk of ruin is the probability that you'll lose your entire
                    bankroll. Understanding this concept is crucial for
                    long-term sustainability.
                  </p>
                  <p>The risk of ruin depends on:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Your edge (expected value per bet)</li>
                    <li>Your bet sizing (percentage of bankroll)</li>
                    <li>The variance of your bets</li>
                  </ul>
                  <p>
                    As a rule of thumb, the more aggressive your betting
                    strategy, the larger your bankroll should be relative to
                    your standard bet size. For professional bettors, a bankroll
                    of at least 100 times your average bet is recommended.
                  </p>
                </div>

                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold text-white">
                    Practical Bankroll Management Tips
                  </h2>
                  <ol className="list-decimal pl-6 space-y-2">
                    <li>
                      <strong>Keep your betting bankroll separate</strong> from
                      your living expenses
                    </li>
                    <li>
                      <strong>Track all bets meticulously</strong>, including
                      stake size, outcome, and bankroll changes
                    </li>
                    <li>
                      <strong>Set loss limits</strong> — maximum amounts you'll
                      lose per day, week, and month
                    </li>
                    <li>
                      <strong>Avoid chasing losses</strong> by increasing your
                      bet size after losing
                    </li>
                    <li>
                      <strong>Take profits periodically</strong> when your
                      bankroll grows significantly
                    </li>
                    <li>
                      <strong>Reassess your strategy</strong> if you experience
                      an extended losing streak
                    </li>
                  </ol>
                </div>

                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold text-white">
                    Conclusion
                  </h2>
                  <p>
                    Effective bankroll management is what separates professional
                    sports bettors from amateurs. By implementing a proper
                    staking plan and sticking to it with discipline, you
                    significantly increase your chances of long-term
                    profitability.
                  </p>
                  <p>
                    Remember that even the best betting strategy will experience
                    downswings. Proper bankroll management ensures you can
                    weather these inevitable periods and continue betting when
                    opportunities arise.
                  </p>
                  <p>
                    Ready to put these principles into practice? Explore
                    Bet2Fund's funded trading challenges and start applying
                    sound bankroll management with our capital.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            className="md:col-span-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-[#121212]/70 backdrop-blur-sm border border-primary/20 rounded-lg p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-6 text-white">
                Related Guides
              </h2>
              <ul className="space-y-4">
                <li>
                  <Link href="/trading-guides/value-betting">
                    <span className="text-white/80 hover:text-primary cursor-pointer transition-colors block">
                      Understanding Value Betting
                    </span>
                  </Link>
                </li>
                <li>
                  <Link href="/trading-guides/line-movements">
                    <span className="text-white/80 hover:text-primary cursor-pointer transition-colors block">
                      Exploiting Line Movements
                    </span>
                  </Link>
                </li>
                <li>
                  <Link href="/trading-guides/trading-psychology">
                    <span className="text-white/80 hover:text-primary cursor-pointer transition-colors block">
                      The Psychology of Sports Trading
                    </span>
                  </Link>
                </li>
                <li>
                  <Link href="/trading-guides/betting-model">
                    <span className="text-white/80 hover:text-primary cursor-pointer transition-colors block">
                      Building a Sports Picking Model
                    </span>
                  </Link>
                </li>
              </ul>

              <div className="mt-8 p-4 bg-primary/10 rounded-lg">
                <h3 className="font-medium mb-2 text-white">
                  Ready to start trading?
                </h3>
                <p className="text-sm text-white/70 mb-3">
                  Put these strategies into practice with a funded account.
                </p>
                <Link href="/#plans">
                  <Button className="w-full bg-primary hover:bg-primary/90 text-white">
                    View Funding Plans
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default BankrollManagementGuide;
