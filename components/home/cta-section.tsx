import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import bgImage from "../../assets/b2f/3.jpg";

const CTASection = () => {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      <div className="absolute inset-0 z-0">
        {/* Dynamic background with gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0039B3] to-[#121212]/95"></div>
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
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Ready to Place picks with{" "}
            <span className="text-primary">Real Capital?</span>
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join hundreds of profitable active users who have turned their
            sports betting skills into a legitimate income stream.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="#plans">
              <Button className="px-8 py-4 bg-primary hover:bg-primary/90 text-white rounded-md font-medium text-lg shadow-[0_0_15px_rgba(0,178,255,0.7)] transition-all">
                Start Your Challenge
              </Button>
                          </a>            {/* <Link href="#">
              <Button
                variant="outline"
                className="px-8 py-4 bg-transparent text-primary border border-primary hover:bg-primary/10 rounded-md font-medium text-lg transition-all"
              >
                Schedule a Demo
              </Button>
            </Link> */}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">$10M+</div>
              <p className="text-sm text-white/70">Trading Capital</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">2,000+</div>
              <p className="text-sm text-white/70">Active users</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">$300K+</div>
              <p className="text-sm text-white/70">Profits Paid</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">24/7</div>
              <p className="text-sm text-white/70">Support</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
