import { motion } from "framer-motion";
import Layout from "@/components/layout/layout";

const Disclaimer = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-[#121212] pt-28 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">
              <span className="text-primary">Disclaimer</span>
            </h1>

            <div className="bg-[#121212]/70 backdrop-blur-sm rounded-xl p-8 border border-primary/30 shadow-[0_0_15px_rgba(0,178,255,0.3)]">
              <div className="prose prose-invert max-w-none">
                <p className="text-white/90 text-lg leading-relaxed mb-8">
                  Bet 2 Fund is not a casino, sportsbook, or gambling operator,
                  and does not accept or place wagers of any kind, in any
                  capacity. Bet 2 Fund does not endorse or encourage illegal
                  gambling in any form. All information and services provided by
                  Bet 2 Fund are intended solely for educational and
                  entertainment purposes. No real money wagering takes place on
                  our platform. All challenge accounts use virtual "profit
                  points" to simulate theoretical outcomes based on real, live
                  sports odds from established operators.
                </p>

                <p className="text-white/90 text-lg leading-relaxed mb-8">
                  © 2025 Bet 2 Fund. All Rights Reserved.
                </p>

                <div className="mt-12">
                  <h2 className="text-2xl font-bold text-primary mb-6">
                    General Disclaimer
                  </h2>

                  <p className="text-white/90 text-lg leading-relaxed mb-6">
                    Sports picking and related activities, including those
                    referenced by or undertaken through Bet 2 Fund, involve a
                    substantial risk of financial loss and are not suitable for
                    every participant. Betting market valuations are highly
                    volatile and can vary significantly between sportsbooks. Due
                    to the leveraged nature of betting, even minor changes in
                    odds can result in significant fluctuations in simulated
                    account results, including both large gains and substantial
                    losses.
                  </p>

                  <p className="text-white/90 text-lg leading-relaxed mb-6">
                    Bet 2 Fund does not provide any betting advice, suggestions,
                    or recommendations. Any decisions related to betting or
                    picking are made solely by you and are your personal
                    responsibility. Past performance, particularly that
                    presented in a simulated environment, is not necessarily
                    indicative of future outcomes. There is no guarantee that
                    current or future performance will match past results, or
                    that losses will not occur.
                  </p>

                  <p className="text-white/90 text-lg leading-relaxed mb-8">
                    If you believe you may have a gambling problem, please seek
                    help by calling 1-800-GAMBLER.
                  </p>
                </div>

                <div className="mt-12">
                  <h2 className="text-2xl font-bold text-primary mb-6">
                    Simulated and Funded Account Disclaimer
                  </h2>

                  <p className="text-white/90 text-lg leading-relaxed mb-6">
                    All funded accounts offered by Bet 2 Fund are simulated
                    accounts and do not represent real-money trading or live
                    wagering accounts. These simulations utilize actual market
                    data and real-time quotes from established liquidity
                    providers but do not involve actual financial transactions.
                  </p>

                  <p className="text-white/90 text-lg leading-relaxed mb-6">
                    Simulated performance results have inherent limitations.
                    Unlike an actual performance record, simulated results do
                    not reflect real-world trading conditions. Because these
                    results do not represent actual trades, they may not
                    accurately reflect the impact of various market factors such
                    as liquidity constraints or execution timing. Additionally,
                    simulations are often designed with the benefit of
                    hindsight, which may lead to over- or underestimation of
                    potential outcomes.
                  </p>

                  <p className="text-white/90 text-lg leading-relaxed mb-6">
                    No guarantee is made that any simulated account will or is
                    likely to achieve profits or losses similar to those
                    presented. Picker performance showcased on Bet 2 Fund
                    represents past results in a simulated environment and
                    includes only those individuals who have agreed to have
                    their identities disclosed. These results are not indicative
                    of future performance and do not guarantee success.
                    Participation in sports picking, even in a simulated format,
                    carries significant financial risk and may not be
                    appropriate for all individuals.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default Disclaimer;
