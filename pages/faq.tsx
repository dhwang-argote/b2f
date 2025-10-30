import Layout from "@/components/layout/layout";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  const faqs = [
    {
      id: 1,
      question: "How does the funding process work?",
      answer:
        "Our funding process is straightforward: First, you purchase a challenge based on your desired account size. You'll need to meet the profit target while following our risk management rules. Once successful, you'll receive access to a funded account with our capital, and you can start trading immediately while keeping up to 80% of the profits you generate.",
      category: "General Questions",
      order: 1,
      isActive: true,
    },
    {
      id: 2,
      question: "What happens if I lose money?",
      answer:
        "If you exceed the maximum drawdown limit during the evaluation or funded phase, your account will be closed. However, you can always purchase a new challenge and try again. The key advantage is that you're never risking your own capital once funded - we take all the financial risk.",
      category: "General Questions",
      order: 2,
      isActive: true,
    },
    {
      id: 3,
      question: "How quickly will I receive payouts?",
      answer:
        "Payouts are processed according to your account tier - weekly for Professional and Advanced accounts, and bi-weekly for Starter accounts. All payouts are subject to a minimum threshold of $100 and are typically processed within 1-2 business days after the payout period ends.",
      category: "General Questions",
      order: 3,
      isActive: true,
    },
    {
      id: 4,
      question: "Can I trade multiple sports simultaneously?",
      answer:
        "Yes, you can trade any sports and markets that are permitted under our rules. Many of our successful traders specialize in multiple sports to capitalize on various seasons and opportunities throughout the year.",
      category: "General Questions",
      order: 4,
      isActive: true,
    },
    {
      id: 5,
      question: "Is there a time limit to complete the challenge?",
      answer:
        "Yes, you have 30 calendar days to complete the evaluation phase and reach your profit target. You must also trade on a minimum of 10 different days during this period to demonstrate consistency.",
      category: "General Questions",
      order: 5,
      isActive: true,
    },
    {
      id: 6,
      question: "Can I have more than 1 account?",
      answer:
        "You may participate in up to five challenges simultaneously, regardless of your account size. This limit is in place to ensure a balanced and manageable experience.",
      category: "General Questions",
      order: 6,
      isActive: true,
    },
    {
      id: 7,
      question: "What trading platform do you use?",
      answer:
        "We've developed a proprietary trading platform that integrates with major sportsbooks and provides advanced analytics tools. The platform allows you to execute trades, track performance, and access real-time odds across multiple bookmakers.",
      category: "Platform Specifics",
      order: 6,
      isActive: true,
    },
    {
      id: 8,
      question: "Do you offer refunds if I don't pass the challenge?",
      answer:
        "We do not offer refunds for challenges that aren't successfully completed. The challenge fee covers the costs of providing you with the simulation environment, tools, and evaluation services. However, we do offer a 50% discount on a second attempt if you fail your first challenge.",
      category: "Payment and Refunds",
      order: 7,
      isActive: true,
    },
    {
      id: 9,
      question: "Where can I trade from? Are there country restrictions?",
      answer:
        "You can trade from most countries worldwide. However, due to regulatory constraints, we cannot accept traders from certain jurisdictions. Please check our Terms of Service for the current list of restricted countries, or contact our support team for clarification.",
      category: "Legal and Compliance",
      order: 8,
      isActive: true,
    },
    {
      id: 10,
      question: "Can I have multiple funded accounts?",
      answer:
        "Yes, successful traders can manage multiple funded accounts. However, each account must be earned by passing a separate challenge. Many of our traders start with one account and add more as they prove their profitability and develop different strategies.",
      category: "Account Management",
      order: 9,
      isActive: true,
    },
    {
      id: 11,
      question: "What support do you provide to traders?",
      answer:
        "We provide comprehensive support including 24/7 technical assistance, educational resources, market analysis tools, and access to our trader community. Professional and Advanced account holders also receive personalized coaching sessions and priority support.",
      category: "Support and Community",
      order: 10,
      isActive: true,
    },
  ];

  // Group FAQs by category
  const faqsByCategory = faqs.reduce(
    (acc: Record<string, any[]>, faq: any) => {
      if (!acc[faq.category]) {
        acc[faq.category] = [];
      }
      acc[faq.category].push(faq);
      return acc;
    },
    {}
  );

  return (
    <Layout>
      <div className="container mx-auto py-16 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-5xl font-bold mb-4 text-white">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Find answers to the most common questions about our funded sports
            program
          </p>
        </motion.div>

        <div className="space-y-12">
          {Object.entries(faqsByCategory).map(([category, categoryFaqs], index) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className="bg-[#121212]/70 backdrop-blur-sm border border-primary/20 rounded-lg p-6 md:p-8"
            >
              <h2 className="text-2xl font-bold mb-6 text-white">
                {category}
              </h2>

              <Accordion type="single" collapsible className="space-y-4">
                {categoryFaqs.map((faq: any) => (
                  <AccordionItem
                    key={faq.id}
                    value={`faq-${faq.id}`}
                    className="border border-primary/10 rounded-lg px-6 py-2 bg-black/20"
                  >
                    <AccordionTrigger className="text-white hover:text-primary text-left font-medium py-4">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-white/80 pt-2 pb-6">
                      <div
                        dangerouslySetInnerHTML={{ __html: faq.answer }}
                      />
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default FAQ;
