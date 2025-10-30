import React from "react";
import Layout from "@/components/layout/layout";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const ValueBettingGuide = () => {
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
            <span className="text-white/60">Strategy</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 text-white">
            Understanding Value Betting
          </h1>
          <div className="flex items-center text-white/60 text-sm mb-8">
            <span>May 15, 2025</span>
            <span className="mx-2">•</span>
            <span>12 min read</span>
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
                    What is Value Betting?
                  </h2>
                  <p>
                    Value betting is a betting strategy where you place bets on
                    outcomes that have a higher probability of occurring than
                    what the odds suggest. In essence, it's about finding
                    opportunities where the bookmaker has underestimated the
                    chances of a particular outcome.
                  </p>
                  <p>
                    The concept is simple but powerful: if you can consistently
                    identify situations where the actual probability of an event
                    is greater than what the odds imply, you'll make a profit in
                    the long run, even if you don't win every bet.
                  </p>
                </div>

                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold text-white">
                    The Mathematics Behind Value Betting
                  </h2>
                  <p>
                    To understand value betting, you need to grasp the
                    relationship between odds and probability. Bookmakers
                    express odds in various formats (decimal, American,
                    fractional), but they all represent the same thing: the
                    implied probability of an outcome.
                  </p>
                  <p>
                    For decimal odds, the implied probability is calculated as:
                  </p>
                  <div className="bg-[#0D0D0D] p-4 rounded-md">
                    <code>Implied Probability = 1 / Decimal Odds</code>
                  </div>
                  <p>
                    For example, if a team has odds of 2.50 to win, the
                    bookmaker is suggesting there's a 1/2.50 = 0.40 or 40%
                    chance they'll win.
                  </p>
                  <p>
                    A value bet occurs when your estimated probability is higher
                    than the implied probability. If you think the team actually
                    has a 50% chance of winning (rather than the 40% implied by
                    the odds), you've found value.
                  </p>
                </div>

                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold text-white">
                    How to Identify Value Bets
                  </h2>
                  <p>
                    Finding value bets requires a systematic approach to
                    assessing probabilities. Here are several methods to help
                    you identify value:
                  </p>
                  <h3 className="text-xl font-medium text-white">
                    1. Develop Your Own Statistical Models
                  </h3>
                  <p>
                    Creating a statistical model that can predict outcomes more
                    accurately than bookmakers is the holy grail of sports
                    betting. This might involve:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Collecting and analyzing historical data</li>
                    <li>
                      Identifying key performance indicators that influence
                      outcomes
                    </li>
                    <li>
                      Using statistical methods to calculate objective
                      probabilities
                    </li>
                    <li>
                      Regularly refining your model based on new information
                    </li>
                  </ul>

                  <h3 className="text-xl font-medium text-white">
                    2. Specialize in Niche Markets
                  </h3>
                  <p>
                    Bookmakers tend to focus most of their resources on popular
                    markets like major league sports. By specializing in less
                    mainstream leagues or sports, you might develop expertise
                    that exceeds the bookmaker's.
                  </p>

                  <h3 className="text-xl font-medium text-white">
                    3. Track Line Movements
                  </h3>
                  <p>
                    Sharp bettors (professionals) often move lines with their
                    early wagers. By tracking how lines move after opening, you
                    can sometimes identify where smart money is going.
                  </p>

                  <h3 className="text-xl font-medium text-white">
                    4. Utilize Multiple Bookmakers
                  </h3>
                  <p>
                    Different bookmakers offer different odds. By comparing odds
                    across multiple platforms, you can often find discrepancies
                    that create value opportunities.
                  </p>
                </div>

                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold text-white">
                    Common Mistakes in Value Betting
                  </h2>
                  <p>Even experienced bettors can fall into these traps:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <strong>Overestimating Your Edge:</strong> Be realistic
                      about your ability to assess probabilities better than
                      bookmakers.
                    </li>
                    <li>
                      <strong>Ignoring the Vig:</strong> Bookmakers build a
                      margin into their odds. Make sure you account for this
                      when calculating value.
                    </li>
                    <li>
                      <strong>Chasing Losses:</strong> Stick to your strategy
                      even during losing streaks. Value betting is about
                      long-term profit.
                    </li>
                    <li>
                      <strong>Poor Bankroll Management:</strong> Even with a
                      solid edge, improper bet sizing can lead to bankruptcy
                      before your edge plays out.
                    </li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold text-white">
                    Practical Value Betting Strategy
                  </h2>
                  <p>To implement value betting effectively:</p>
                  <ol className="list-decimal pl-6 space-y-2">
                    <li>
                      Set aside a dedicated bankroll for your value betting
                      strategy.
                    </li>
                    <li>
                      Use flat betting or a proportional staking method to
                      manage your bankroll.
                    </li>
                    <li>
                      Only bet when you can identify a clear edge (typically
                      when your estimated probability exceeds the implied
                      probability by at least 5%).
                    </li>
                    <li>
                      Keep detailed records of all your bets to track
                      performance and refine your approach.
                    </li>
                    <li>
                      Be patient – value betting is a marathon, not a sprint.
                    </li>
                  </ol>
                </div>

                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold text-white">
                    Conclusion
                  </h2>
                  <p>
                    Value betting is the foundation of profitable sports
                    trading. By focusing on finding mathematically advantageous
                    situations rather than just picking winners, you position
                    yourself for long-term success.
                  </p>
                  <p>
                    Remember that even with a solid value betting strategy,
                    you'll still lose individual bets. The key is maintaining
                    discipline and focusing on the process rather than
                    short-term results.
                  </p>
                  <p>
                    Ready to put your value betting knowledge into practice?
                    Explore our funded trading challenges and start building
                    your track record with Bet2Fund.
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
                  <Link href="/trading-guides/bankroll-management">
                    <span className="text-white/80 hover:text-primary cursor-pointer transition-colors block">
                      Bankroll Management Fundamentals
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
                  <Link href="/trading-guides/betting-model">
                    <span className="text-white/80 hover:text-primary cursor-pointer transition-colors block">
                      Building a Sports Picking Model
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

export default ValueBettingGuide;
