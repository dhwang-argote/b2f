import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import CircularProgress from "@/components/ui/circular-progress";
import bgImage from "../../assets/b2f/1.jpg";

const HowItWorksSection = () => {
  return (
    <section
      id="how-it-works"
      className="relative py-16 md:py-24 overflow-hidden"
    >
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#121212]/95 to-[#0039B3]/10"></div>
        {/* A subtle sports analytics background */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: `url(${bgImage})` }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How It <span className="text-primary">Works</span>
          </h2>
          <p className="text-white/80 text-lg">
            Our unique sports funding program is designed to identify and reward
            successful sports strategists
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <ol className="relative border-l border-primary/50">
              {/* Step 1 */}
              <motion.li
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mb-10 ml-6"
              >
                <span className="absolute flex items-center justify-center w-8 h-8 bg-primary rounded-full -left-4 ring-4 ring-[#121212]">
                  <span className="text-white font-bold">1</span>
                </span>
                <h3 className="flex items-center text-xl font-bold mb-2">
                  Choose Your Challenge
                </h3>
                <p className="text-white/70 mb-3">
                  Seelct the account size you want to place picks with, from
                  $2,000 up to $50,000.
                </p>
              </motion.li>

              {/* Step 2 */}
              <motion.li
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mb-10 ml-6"
              >
                <span className="absolute flex items-center justify-center w-8 h-8 bg-primary rounded-full -left-4 ring-4 ring-[#121212]">
                  <span className="text-white font-bold">2</span>
                </span>
                <h3 className="flex items-center text-xl font-bold mb-2">
                  Pass the Challenge
                </h3>
                <p className="text-white/70 mb-3">
                  Demonstrate your sports picking skills by reaching the profit
                  target while following the rules.
                </p>
                <p className="text-sm text-white/60">
                  Make 33% profit of your account size within a 30-day period,
                  using controlled risk management.
                </p>
              </motion.li>

              {/* Step 3 */}
              <motion.li
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mb-10 ml-6"
              >
                <span className="absolute flex items-center justify-center w-8 h-8 bg-primary rounded-full -left-4 ring-4 ring-[#121212]">
                  <span className="text-white font-bold">3</span>
                </span>
                <h3 className="flex items-center text-xl font-bold mb-2">
                  Get Funded
                </h3>
                <p className="text-white/70 mb-3">
                  Place picks with our money and keep 80% of your profits.
                </p>
              </motion.li>

              {/* Step 4 */}
              <motion.li
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="ml-6"
              >
                <span className="absolute flex items-center justify-center w-8 h-8 bg-primary rounded-full -left-4 ring-4 ring-[#121212]">
                  <span className="text-white font-bold">4</span>
                </span>
                <h3 className="flex items-center text-xl font-bold mb-2">
                  Scale & Grow
                </h3>
                <p className="text-white/70 mb-3">
                  Combine up to 5 accounts to potentially gain more capital.
                </p>
              </motion.li>
            </ol>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative">
              <div className="absolute -inset-1 rounded-2xl bg-primary/30 blur-xl"></div>
              <div className="relative bg-[#121212]/80 backdrop-blur-sm rounded-xl p-6 border border-primary/30 shadow-[0_0_15px_rgba(0,178,255,0.7)]">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-primary font-bold text-xl">
                    Sports Challenge Metrics
                  </h3>
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">
                    Live Demo
                  </span>
                </div>

                {/* Trading challenge visualization */}
                <div className="space-y-6">
                  {/* Progress bars */}
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Profit Target</span>
                      <span className="text-green-400 font-medium">
                        11% / 33%
                      </span>
                    </div>
                    <div className="w-full bg-[#121212]/80 rounded-full h-2.5">
                      <div
                        className="bg-green-500 h-2.5 rounded-full"
                        style={{ width: "33%" }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Active Days</span>
                      <span className="text-primary font-medium">18 / 30</span>
                    </div>
                    <div className="w-full bg-[#121212]/80 rounded-full h-2.5">
                      <div
                        className="bg-primary h-2.5 rounded-full"
                        style={{ width: "60%" }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Max Drawdown Limit</span>
                      <span className="text-red-400 font-medium">4% / 20%</span>
                    </div>
                    <div className="w-full bg-[#121212]/80 rounded-full h-2.5">
                      <div
                        className="bg-red-500 h-2.5 rounded-full"
                        style={{ width: "20%" }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Max Daily Loss</span>
                      <span className="text-yellow-400 font-medium">
                        2% / 15%
                      </span>
                    </div>
                    <div className="w-full bg-[#121212]/80 rounded-full h-2.5">
                      <div
                        className="bg-yellow-500 h-2.5 rounded-full"
                        style={{ width: "13%" }}
                      ></div>
                    </div>
                  </div>

                  {/* Central Circular Progress Chart */}
                  <div className="flex justify-center py-6">
                    <div className="relative">
                      <CircularProgress
                        percentage={33}
                        color="#00FFD1"
                        backgroundColor="#374151"
                        size={140}
                        strokeWidth={12}
                        label="Complete"
                        value="$10K"
                        subLabel="Demo Account"
                      />
                    </div>
                  </div>

                  {/* Stats Grid - matching screenshot layout */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-2xl font-bold text-primary mb-1">
                        2.05
                      </div>
                      <div className="text-sm text-white/60">
                        Avg. Challenge Odds
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-primary mb-1">
                        11%
                      </div>
                      <div className="text-sm text-white/60">ROI</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-primary mb-1">
                        68.5%
                      </div>
                      <div className="text-sm text-white/60">Win Rate</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-primary mb-1">
                        24.3%
                      </div>
                      <div className="text-sm text-white/60">ROI</div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <Link href="#plans">
                      <Button className="w-full bg-primary hover:bg-primary/90 text-white py-3 text-base font-medium rounded-lg shadow-[0_0_15px_rgba(0,178,255,0.3)]">
                        Start Your Challenge
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
