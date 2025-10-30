import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { IconChevronDown } from "@/components/icons";

// Static FAQ data for bet2fund platform
const faqData = [
  {
    id: 1,
    question: "What is the Bet2Fund Challenge?",
    answer: "The Bet2Fund Challenge is a funded trader program where you pick with our capital after passing an evaluation. You need to achieve a 33% profit target within 5 picking days while adhering to our risk management rules."
  },
  {
    id: 2,
    question: "How much capital can I get funded with?",
    answer: "We offer funding from $10K to $200K based on the challenge package you choose. After successfully completing the challenge, you'll receive the full account balance to pick with."
  },
  {
    id: 3,
    question: "What are the challenge rules?",
    answer: "Key rules include: 33% profit target, overall drawdown 20%, daily drawdown 15%, 5 picking days limit, no overnight positions on major news events, and adherence to risk management protocols. Overall drawdown means your total account equity cannot fall more than 20% from peak; daily drawdown means you cannot lose more than 15% in a single day."
  },
  {
    id: 4,
    question: "How do I get paid?",
    answer: "After passing the challenge, you keep 80% of all profits generated. Payouts are processed bi-weekly via cryptocurrency to your designated wallet address."
  },
  {
    id: 5,
    question: "What happens if I fail the challenge?",
    answer:
      "If you don't meet the profit target or violate risk rules, you can retake the challenge by purchasing a new evaluation. Many succeed on their second or third attempt.",
  },
  {
    id: 6,
    question: "Can I pick any market?",
    answer: "You can pick major forex pairs, cryptocurrencies, indices, and commodities. We provide access to premium platforms with real-time market data and advanced charting tools to support your picking decisions."
  },
  {
    id: 7,
    question: "Is there ongoing support?",
    answer: "Yes! We provide 24/7 technical support, picking education resources, market analysis, and access to our community of funded traders."
  },
  {
    id: 8,
    question: "How long does the evaluation take?",
    answer: "The challenge must be completed within 5 picking days. Most successful participants complete it in 3-4 days. You have full control over your picking schedule within this timeframe."
  }
];

const FAQSection = () => {
  // Group FAQs into two columns
  const getColumnFaqs = (column: number) => {
    const halfwayIndex = Math.ceil(faqData.length / 2);
    return column === 1
      ? faqData.slice(0, halfwayIndex)
      : faqData.slice(halfwayIndex);
  };

  return (
    <section id="faq" className="relative py-16 md:py-24">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#121212]/95 to-[#0039B3]/10"></div>
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
            Frequently Asked <span className="text-primary">Questions</span>
          </h2>
          <p className="text-white/80 text-lg">
            General Questions — Find details about our funding process, challenge rules, payouts, and how to get started.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* FAQ Column 1 */}
          <div className="space-y-4">
            {getColumnFaqs(1).map((faq) => (
              <FAQItem key={faq.id} faq={faq} />
            ))}
          </div>

          {/* FAQ Column 2 */}
          <div className="space-y-4">
            {getColumnFaqs(2).map((faq) => (
              <FAQItem key={faq.id} faq={faq} />
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-12 text-center"
        >
          <p className="text-white/80 mb-4">Still have questions?</p>
          <a
            href="mailto:support@bet2fund.com"
            className="inline-block py-[6px] px-6 bg-transparent hover:bg-primary/10 hover:text-white text-primary border border-primary rounded-md font-medium transition-all"
          >
            Contact Our Support Team
          </a>
        </motion.div>
      </div>
    </section>
  );
};

interface FAQItemProps {
  faq: {
    id: number;
    question: string;
    answer: string;
  };
}

const FAQItem = ({ faq }: FAQItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-[#121212]/70 backdrop-blur-sm rounded-xl border border-primary/30 overflow-hidden"
    >
      <button
        className="flex justify-between items-center w-full p-6 text-left focus:outline-none"
        onClick={toggleAccordion}
        aria-expanded={isOpen}
      >
        <h3 className="text-lg font-medium">{faq.question}</h3>
        <IconChevronDown
          className={`text-primary transition-transform ${isOpen ? "rotate-180" : ""
            }`}
        />
      </button>
      <div
        className={`px-6 pb-6 transition-all duration-300 ${isOpen ? "block" : "hidden"
          }`}
      >
        <p className="text-white/70">{faq.answer}</p>
      </div>
    </motion.div>
  );
};

export default FAQSection;
