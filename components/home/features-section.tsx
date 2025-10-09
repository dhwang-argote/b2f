import { motion } from "framer-motion";
import {
  IconNoRisk,
  IconProfitScaling,
  IconTransparent,
  IconPlatform,
  IconCommunity,
} from "@/components/icons";

const FeaturesSection = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section className="bg-[#121212] py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Choose <span className="text-primary">Bet2Fund</span>?
          </h2>
          <p className="text-white/80 text-lg">
            We offer a unique opportunity for skilled sports strategists to
            access significant capital without financial risk.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8"
        >
          {/* Feature 1 */}
          <motion.div
            variants={item}
            className="bg-[#121212]/50 backdrop-blur-sm p-6 rounded-xl border border-primary/20 shadow-lg hover:transform hover:-translate-y-1 hover:shadow-[0_10px_25px_rgba(0,178,255,0.3)] transition-all duration-300"
          >
            <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center mb-5">
              <IconNoRisk className="text-primary text-2xl" />
            </div>
            <h3 className="text-xl font-bold mb-3">Bet2Fund AI Picks</h3>
            <p className="text-white/70">
              Bet2Fund’s AI is a smart sports picking engine trained on 20+
              years of data. It simulates games in real time, analyzes key
              factors, and delivers clear, probability-based picks to spot
              market edges and improve decision-making.
            </p>
          </motion.div>

          {/* Feature 2 */}
          <motion.div
            variants={item}
            className="bg-[#121212]/50 backdrop-blur-sm p-6 rounded-xl border border-primary/20 shadow-lg hover:transform hover:-translate-y-1 hover:shadow-[0_10px_25px_rgba(0,178,255,0.3)] transition-all duration-300"
          >
            <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center mb-5">
              <IconProfitScaling className="text-primary text-2xl" />
            </div>
            <h3 className="text-xl font-bold mb-3">Profit Scaling</h3>
            <p className="text-white/70">
              Start with $2K and scale up to $250K with up to 5 accounts as you
              prove your trading skills and consistency.
            </p>
          </motion.div>

          {/* Feature 3 */}
          <motion.div
            variants={item}
            className="bg-[#121212]/50 backdrop-blur-sm p-6 rounded-xl border border-primary/20 shadow-lg hover:transform hover:-translate-y-1 hover:shadow-[0_10px_25px_rgba(0,178,255,0.3)] transition-all duration-300"
          >
            <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center mb-5">
              <IconTransparent className="text-primary text-2xl" />
            </div>
            <h3 className="text-xl font-bold mb-3">Transparent Rules</h3>
            <p className="text-white/70">
              Clear objectives and guidelines. No hidden fees or complicated
              profit calculations.
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-12 flex justify-center"
        >
          {/* Feature 4 */}
          <motion.div
            variants={item}
            className="bg-[#121212]/50 backdrop-blur-sm p-6 rounded-xl border border-primary/20 shadow-lg hover:transform hover:-translate-y-1 hover:shadow-[0_10px_25px_rgba(0,178,255,0.3)] transition-all duration-300 max-w-md"
          >
            <div className="flex items-center mb-5">
              <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center mr-4">
                <IconPlatform className="text-primary text-2xl" />
              </div>
              <h3 className="text-xl font-bold">Advanced Sports Platform</h3>
            </div>
            <p className="text-white/70">
              Access our proprietary sports platform with real-time analytics,
              odds comparison, and performance tracking tools.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
