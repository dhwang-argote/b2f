import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

// Dummy testimonials data
const dummyTestimonials = [
  {
    id: 1,
    name: "Marcus Johnson",
    title: "Professional Sports Trader",
    content:
      "Started with the 10k challenge and now managing a 50k funded account. The profit split is incredible and withdrawals are always on time. Best decision I ever made!",
    accountSize: 50000,
    profit: 18500,
    duration: "6 Month",
    initials: "MJ",
    avatarColor: "#0039B3",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: 2,
    name: "Sarah Chen",
    title: "NBA Specialist",
    content:
      "The 3-step challenge was tough but fair. Once I understood the risk management rules, I consistently hit my targets. Now earning more than my day job!",
    accountSize: 25000,
    profit: 12750,
    duration: "4 Month",
    initials: "SC",
    avatarColor: "#00B8FF",
    image:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: 3,
    name: "David Rodriguez",
    title: "NFL & Soccer Expert",
    content:
      "The live odds feature gives me a huge edge. Combined with their excellent platform and fast payouts, I've been able to scale from 5k to 25k account size.",
    accountSize: 25000,
    profit: 9800,
    duration: "3 Month",
    initials: "DR",
    avatarColor: "#FF6B35",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: 4,
    name: "Emily Watson",
    title: "Multi-Sport Trader",
    content:
      "Love the flexibility of the platform. I focus on MLB during summer and NFL in winter. The 80% profit split on my 50k account has changed my life completely.",
    accountSize: 50000,
    profit: 22400,
    duration: "8 Month",
    initials: "EW",
    avatarColor: "#9B59B6",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: 5,
    name: "Alex Thompson",
    title: "Hockey & Basketball Specialist",
    content:
      "The educational resources helped me understand proper bankroll management. Passed my 2-step challenge in 3 weeks and haven't looked back since.",
    accountSize: 10000,
    profit: 4200,
    duration: "2 Month",
    initials: "AT",
    avatarColor: "#27AE60",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: 6,
    name: "Jessica Park",
    title: "Prop Bet Specialist",
    content:
      "The Bitcoin payment system is so convenient and secure. Quick verification and I was trading within hours. Already made back my challenge fee 10x over!",
    accountSize: 25000,
    profit: 15600,
    duration: "5 Month",
    initials: "JP",
    avatarColor: "#E74C3C",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
  },
];

const TestimonialsSection = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [slides, setSlides] = useState<any[][]>([]);

  // Group testimonials into pairs for the carousel
  useEffect(() => {
    const groupedSlides = [];
    for (let i = 0; i < dummyTestimonials.length; i += 2) {
      groupedSlides.push(dummyTestimonials.slice(i, i + 2));
    }
    setSlides(groupedSlides);
  }, []);

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 10000); // Increased from 8000ms to 10000ms for even slower auto-advance

    return () => clearInterval(interval);
  }, [slides.length]);

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section
      id="testimonials"
      className="bg-[#121212] py-16 md:py-24 scroll-mt-28"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Success <span className="text-primary">Stories</span>
          </h2>
          <p className="text-white/80 text-lg">
            Hear from our sports pickers who have successfully leveraged our platform to achieve financial freedom.
          </p>
        </motion.div>

        <div className="relative">
          {slides.length > 0 ? (
            <>
              <div className="overflow-hidden ">
                <div
                  className="flex transition-transform duration-3000  ease-[cubic-bezier(0.23,1,0.32,1)]"
                  style={{ transform: `translateX(-${activeSlide * 100}%)` }}
                >
                  {slides.map((slideGroup, groupIndex) => (
                    <div
                      key={`slide-group-${groupIndex}`}
                      className="flex flex-col md:flex-row gap-6 min-w-full"
                    >
                      {slideGroup.map((testimonial) => (
                        <TestimonialCard
                          key={testimonial.id}
                          testimonial={testimonial}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* Carousel navigation */}
              <div className="flex justify-center mt-8 gap-2">
                {slides.map((_, index) => (
                  <button
                    key={`dot-${index}`}
                    className={`w-3 h-3 rounded-full ${index === activeSlide ? "bg-primary/80" : "bg-white/30"
                      }`}
                    aria-current={index === activeSlide}
                    aria-label={`Slide ${index + 1}`}
                    onClick={() => setActiveSlide(index)}
                  ></button>
                ))}
              </div>

              {/* Arrow controls */}
              {slides.length > 1 && (
                <>
                  <button
                    onClick={prevSlide}
                    className="absolute top-1/2 left-0 -translate-y-1/2 md:-left-6 w-10 h-10 bg-[#121212]/70 rounded-full flex items-center justify-center text-white hover:bg-primary/20 transition-colors"
                    aria-label="Previous slide"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute top-1/2 right-0 -translate-y-1/2 md:-right-6 w-10 h-10 bg-[#121212]/70 rounded-full flex items-center justify-center text-white hover:bg-primary/20 transition-colors"
                    aria-label="Next slide"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  </button>
                </>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-white/60">
                No testimonials available at the moment.
              </p>
            </div>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="mt-16 p-8 bg-primary/10 rounded-xl border border-primary/30 text-center"
        >
          <h3 className="text-2xl font-bold mb-4">Join Our Growing Community of Sports Pickers</h3>
          <p className="text-white/80 mb-6 max-w-2xl mx-auto">
            Take the first step towards financial freedom by picking with our capital and keeping the profits.
          </p>
          <Link href="#plans">
            <Button className="inline-block px-8  bg-primary hover:bg-primary/90 text-white rounded-md font-medium shadow-[0_0_15px_rgba(0,178,255,0.7)] transition-all">
              Start Your Challenge Today
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

interface TestimonialCardProps {
  testimonial: {
    id: number;
    name: string;
    title: string;
    content: string;
    accountSize: number;
    profit: number;
    duration: string;
    initials: string;
    avatarColor: string;
    image: string;
  };
}

const TestimonialCard = ({ testimonial }: TestimonialCardProps) => {
  // Format account size and profit with $ and comma separators
  const formattedAccountSize = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(testimonial.accountSize);

  const formattedProfit = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(testimonial.profit);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 1.5,
        ease: [0.23, 1, 0.32, 1],
        delay: 0.05,
      }}
      className="bg-[#121212]/70 backdrop-blur-sm p-6 rounded-xl border border-primary/30 min-w-full md:min-w-[calc(50%-1.5rem)]"
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center mb-6">
          <div className="w-16 h-16 rounded-full overflow-hidden mr-4 border-2 border-primary/30">
            <img
              src={testimonial.image}
              alt={testimonial.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback to colored avatar with initials if image fails to load
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
                const fallback = target.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = "flex";
              }}
            />
            <div
              className="w-full h-full hidden items-center justify-center text-white font-bold text-xl"
              style={{ backgroundColor: testimonial.avatarColor }}
            >
              {testimonial.initials}
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">{testimonial.name}</h3>
            <p className="text-primary">{testimonial.title}</p>
          </div>
        </div>
        <div className="mb-6 flex-grow">
          <p className="text-white/80 italic">"{testimonial.content}"</p>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <div className="text-sm text-white/70">Account Size</div>
            <div className="text-xl font-bold text-primary">
              {formattedAccountSize}
            </div>
          </div>
          <div>
            <div className="text-sm text-white/70">
              {testimonial.duration} Profit
            </div>
            <div className="text-xl font-bold text-green-400">
              {formattedProfit}+
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TestimonialsSection;
