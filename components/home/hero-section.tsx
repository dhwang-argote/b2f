
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import bgImage1 from "../../assets/b2f/bg_image1.jpg";
import bgImage2 from "../../assets/b2f/bg_image2.jpg";
import bgImage3 from "../../assets/b2f/bg_image3.jpg";

const HeroSection = () => {
  const images = [bgImage1, bgImage2, bgImage3];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative overflow-hidden pt-28 pb-16 md:pt-36 md:pb-24 bg-grid">
      {/* Background with gradient + cycling images */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/20 to-transparent"></div>

        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${images[current]})` }}
        ></motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading mb-6 leading-tight">
              <span className="block text-glow-white">
                The #1 sports prop firm + AI picks
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8">
              Master our challenges and unlock funded accounts up to $250K. Keep
              80% of profits with zero personal risk - your expertise, our
              capital.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#plans">
                <Button
                  size="lg"
                  className="px-8 py-6 btn-neon text-white rounded-md font-medium text-lg transition-all"
                                </a>
              <a href="#how-it-works">
                <Button
                  variant="outline"
                  size="lg"
                  className="px-8 py-6 bg-transparent text-primary border border-primary hover:bg-primary/10 rounded-md font-medium text-lg transition-all"
                >
                  Learn More
                </Button>
                              </a>            </div>
          </motion.div>

          {/* ... ostatak tvog desnog boxa ostaje isti */}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
