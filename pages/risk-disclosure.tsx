import Layout from "@/components/layout/layout";
import { useEffect } from "react";

const RiskDisclosure = () => {
  // Scroll to top when component mounts (as requested in revisions)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <Layout>
      <div className="min-h-screen bg-[#121212] pt-32 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#121212]/70 backdrop-blur-sm border border-primary/30 rounded-xl p-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">
              <span className="text-primary">Risk Disclosure</span>
            </h1>

            <div className="space-y-6 text-white/90 leading-relaxed">
              <div className="bg-red-500/10 border border-red-500/30 p-6 rounded-lg">
                <h2 className="text-xl font-bold mb-4 text-red-400">
                  Important Risk Warning
                </h2>
                <p className="text-red-200">
                  Picking simulated sports markets carries significant risks and
                  may not be suitable for all participants. You should carefully
                  consider whether such activity is appropriate for your
                  financial situation and risk tolerance.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold mb-4 text-primary">
                  Market Volatility
                </h2>
                <p className="mb-4">
                  Sports picking markets are inherently volatile and
                  unpredictable. Odds can change rapidly based on various
                  factors including team news, weather conditions, betting
                  volumes, and market sentiment. These fluctuations can result
                  in significant changes to potential outcomes in a very short
                  time frame.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold mb-4 text-primary">
                  Performance Risk
                </h2>
                <p className="mb-4">
                  Past performance is not indicative of future results. Even
                  successful pickers can experience periods of losses, and there
                  is no guarantee that profitable strategies will continue to be
                  profitable in the future. Market conditions, rule changes, and
                  other factors can significantly impact picking performance.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold mb-4 text-primary">
                  Simulation Limitations
                </h2>
                <p className="mb-4">
                  Our platform uses simulated picking environments that, while
                  based on real market data, may not fully replicate the
                  conditions of actual sports picking. Factors such as
                  liquidity, execution delays, and market impact may differ from
                  real-world scenarios. Success in a simulated environment does
                  not guarantee success in real markets.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold mb-4 text-primary">
                  Psychological Factors
                </h2>
                <p className="mb-4">
                  Picking can be emotionally challenging and may lead to stress,
                  anxiety, and poor decision-making. The pressure to perform,
                  especially when real funding is involved, can significantly
                  impact judgment and lead to deviations from proven strategies.
                  Participants should be prepared for the psychological demands
                  of picking.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold mb-4 text-primary">
                  Regulatory Considerations
                </h2>
                <p className="mb-4">
                  Sports picking regulations vary by jurisdiction and are
                  subject to change. Participants are responsible for
                  understanding and complying with all applicable laws and
                  regulations in their jurisdiction. Bet 2 Fund does not provide
                  legal advice and participants should consult with qualified
                  legal professionals if needed.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold mb-4 text-primary">
                  Technology Risks
                </h2>
                <p className="mb-4">
                  Our platform relies on technology systems that may experience
                  outages, delays, or malfunctions. While we strive to maintain
                  high system availability, technical issues can impact trading
                  activities and potentially result in missed opportunities or
                  unexpected outcomes.
                </p>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/30 p-6 rounded-lg">
                <h2 className="text-xl font-bold mb-4 text-yellow-400">
                  Important Notice
                </h2>
                <p className="text-yellow-200 mb-4">
                  By participating in our programs, you acknowledge that you
                  have read, understood, and accepted these risks. You should
                  only participate with funds you can afford to lose and should
                  never risk more than you can financially handle.
                </p>
                <p className="text-yellow-200">
                  If you have concerns about gambling addiction, please seek
                  help immediately by contacting
                  <strong> 1-800-GAMBLER</strong> or visiting your local
                  gambling addiction support services.
                </p>
              </div>

              <div className="text-center text-white/60 text-sm pt-8 border-t border-primary/20">
                <p>&copy; 2025 Bet 2 Fund. All Rights Reserved.</p>
                <p className="mt-2">Last updated: June 2025</p>
                <p className="mt-2">1309 Coffeen Avenue STE 1200, Sheridan, Wyoming 82801</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RiskDisclosure;
