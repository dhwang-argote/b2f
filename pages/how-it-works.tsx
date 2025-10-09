import React from "react";
import Layout from "@/components/layout/layout";
import { motion } from "framer-motion";

const HowItWorks = () => {
  return (
    <Layout>
      <div className="container mx-auto py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            How It Works
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-[#121212]/70 backdrop-blur-sm border border-primary/30 rounded-lg p-6">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h2 className="text-xl font-bold mb-3 text-white">
                Select a Challenge
              </h2>
              <p className="text-white/80">
                Choose the account size that matches your sports picking goals
                and/or experience level. We offer various challenge options to
                accommodate all skill levels.
              </p>
            </div>

            <div className="bg-[#121212]/70 backdrop-blur-sm border border-primary/30 rounded-lg p-6">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h2 className="text-xl font-bold mb-3 text-white">
                Pass the Evaluation
              </h2>
              <p className="text-white/80">
                Place picks on our platform and demonstrate your skills by
                meeting profit targets while adhering to risk management rules.
                Consistent profitability is the key.
              </p>
            </div>

            <div className="bg-[#121212]/70 backdrop-blur-sm border border-primary/30 rounded-lg p-6">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h2 className="text-xl font-bold mb-3 text-white">Get Funded</h2>
              <p className="text-white/80">
                After successfully completing the challenge, receive funding
                from us to place your own picks with real capital and earn
                substantial profit splits without risking your own money.
              </p>
            </div>
          </div>

          <div className="bg-[#121212]/70 backdrop-blur-sm border border-primary/30 rounded-lg p-8 mb-12">
            <h2 className="text-2xl font-bold mb-4 text-white">
              Our Evaluation Process
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2 text-white">
                  Challenge Phase
                </h3>
                <p className="text-white/80 mb-4">
                  The Challenge Phase is your opportunity to demonstrate your
                  sports picking skills and discipline. During this phase,
                  you'll need to:
                </p>
                <ul className="list-disc pl-6 text-white/80 space-y-2">
                  <li>Reach the specified profit target of 33%</li>
                  <li>Place picks for a minimum of 5 days</li>
                  <li>
                    Maintain drawdown limits of 15% maximum daily and 20%
                    overall
                  </li>
                  <li>Follow proper risk management protocols</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2 text-white">
                  Verification Phase
                </h3>
                <p className="text-white/80 mb-4">
                  Some account challenges include a Verification Phase which is
                  similar to the Challenge Phase but with slightly different
                  targets:
                </p>
                <ul className="list-disc pl-6 text-white/80 space-y-2">
                  <li>Lower profit target (typically 5-8%)</li>
                  <li>Same drawdown and risk management rules</li>
                  <li>
                    Designed to verify consistency in your trading approach
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2 text-white">
                  Funded Account
                </h3>
                <p className="text-white/80 mb-4">
                  Once you've passed the evaluation, you'll receive a Funded
                  Account:
                </p>
                <ul className="list-disc pl-6 text-white/80 space-y-2">
                  <li>Trade with our capital at your chosen account size</li>
                  <li>Keep 80% of the profits you generate</li>
                  <li>Regular payouts (bi-weekly)</li>
                  <li>
                    Opportunity to scale to larger account sizes over time
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* <div className="bg-[#121212]/70 backdrop-blur-sm border border-primary/30 rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-6 text-white">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2 text-white">
                  What sports can I trade?
                </h3>
                <p className="text-white/80">
                  You can trade on any major sports including NBA, NFL, MLB,
                  NHL, soccer (Premier League, La Liga, etc.), tennis, UFC/MMA,
                  golf, and more. We provide real-time odds access to all these
                  markets.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2 text-white">
                  How soon can I get funded?
                </h3>
                <p className="text-white/80">
                  The timeline depends on your trading performance. Some traders
                  pass the challenge in as little as 10 days (the minimum
                  trading day requirement), while others may take a few weeks.
                  There's no time pressure - we value consistency and proper
                  risk management over speed.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2 text-white">
                  What happens if I don't pass the challenge?
                </h3>
                <p className="text-white/80">
                  If you don't meet the profit target or breach any rules like
                  exceeding the maximum drawdown, you'll need to purchase a new
                  challenge. However, we offer discounted reset options and
                  frequent promotions to give traders multiple opportunities to
                  succeed.
                </p>
              </div>
            </div>
          </div> */}
        </motion.div>
      </div>
    </Layout>
  );
};

export default HowItWorks;
