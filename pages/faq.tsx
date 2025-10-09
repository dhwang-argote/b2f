import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/layout/layout";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  const { data: faqs, isLoading } = useQuery({
    queryKey: ["/api/faqs"],
    queryFn: async () => {
      const res = await fetch("/api/faqs");
      if (!res.ok) throw new Error("Failed to fetch FAQs");
      return res.json();
    },
  });

  // Group FAQs by category
  const faqsByCategory = faqs?.reduce(
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

        {isLoading ? (
          <div className="space-y-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-[#121212]/70 backdrop-blur-sm border border-primary/20 rounded-lg p-6 animate-pulse"
              >
                <div className="h-8 bg-gray-700 rounded w-1/3 mb-8"></div>
                {[1, 2, 3].map((j) => (
                  <div key={j} className="mb-6">
                    <div className="h-6 bg-gray-700 rounded w-3/4 mb-3"></div>
                    <div className="h-4 bg-gray-700/50 rounded w-full"></div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-12">
            {faqsByCategory &&
              Object.entries(faqsByCategory).map(
                ([category, categoryFaqs], index) => (
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
                )
              )}

            {/* Static FAQs if no dynamic content is available */}
            {(!faqsByCategory || Object.keys(faqsByCategory).length === 0) && (
              <div className="space-y-12">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-[#121212]/70 backdrop-blur-sm border border-primary/20 rounded-lg p-6 md:p-8"
                >
                  <h2 className="text-2xl font-bold mb-6 text-white">
                    General Questions
                  </h2>

                  <Accordion type="single" collapsible className="space-y-4">
                    <AccordionItem
                      value="faq-1"
                      className="border border-primary/10 rounded-lg px-6 py-2 bg-black/20"
                    >
                      <AccordionTrigger className="text-white hover:text-primary text-left font-medium py-4">
                        How does the funding process work?
                      </AccordionTrigger>
                      <AccordionContent className="text-white/80 pt-2 pb-6">
                        Our funding process is simple: purchase a challenge,
                        meet the profit target while following our risk rules,
                        and get funded with our capital. You'll keep up to 80%
                        of the profits you generate while trading with our
                        money.
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem
                      value="faq-2"
                      className="border border-primary/10 rounded-lg px-6 py-2 bg-black/20"
                    >
                      <AccordionTrigger className="text-white hover:text-primary text-left font-medium py-4">
                        What sports can I trade?
                      </AccordionTrigger>
                      <AccordionContent className="text-white/80 pt-2 pb-6">
                        You can trade on any major sports including NBA, NFL,
                        MLB, NHL, soccer (Premier League, La Liga, etc.),
                        tennis, UFC/MMA, golf, and more. We provide real-time
                        odds access to all these markets.
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem
                      value="faq-3"
                      className="border border-primary/10 rounded-lg px-6 py-2 bg-black/20"
                    >
                      <AccordionTrigger className="text-white hover:text-primary text-left font-medium py-4">
                        How soon can I get funded?
                      </AccordionTrigger>
                      <AccordionContent className="text-white/80 pt-2 pb-6">
                        You can get funded as soon as you complete the challenge
                        requirements. This includes reaching the profit target
                        (33%), trading for the minimum number of days (5), and
                        maintaining proper risk management throughout the
                        challenge.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="bg-[#121212]/70 backdrop-blur-sm border border-primary/20 rounded-lg p-6 md:p-8"
                >
                  <h2 className="text-2xl font-bold mb-6 text-white">
                    Challenge Rules
                  </h2>

                  <Accordion type="single" collapsible className="space-y-4">
                    <AccordionItem
                      value="faq-4"
                      className="border border-primary/10 rounded-lg px-6 py-2 bg-black/20"
                    >
                      <AccordionTrigger className="text-white hover:text-primary text-left font-medium py-4">
                        What are the daily drawdown limits?
                      </AccordionTrigger>
                      <AccordionContent className="text-white/80 pt-2 pb-6">
                        The daily drawdown limit is typically 15% of your
                        account balance. This means if your account drops by 15%
                        or more from the starting balance of the day, trading
                        will be restricted for the remainder of that day.
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem
                      value="faq-5"
                      className="border border-primary/10 rounded-lg px-6 py-2 bg-black/20"
                    >
                      <AccordionTrigger className="text-white hover:text-primary text-left font-medium py-4">
                        What is the maximum overall drawdown?
                      </AccordionTrigger>
                      <AccordionContent className="text-white/80 pt-2 pb-6">
                        The maximum overall drawdown is typically 20% of your
                        starting account balance. If your account drops by 20%
                        or more at any point during the challenge, the challenge
                        will be considered failed.
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem
                      value="faq-6"
                      className="border border-primary/10 rounded-lg px-6 py-2 bg-black/20"
                    >
                      <AccordionTrigger className="text-white hover:text-primary text-left font-medium py-4">
                        Can I place picks on weekends?
                      </AccordionTrigger>
                      <AccordionContent className="text-white/80 pt-2 pb-6">
                        Yes, you can on weekends as long as there are sporting
                        events available. Many sports like soccer, NBA, NFL, and
                        UFC have weekend games which provide plenty of
                        opportunities.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-[#121212]/70 backdrop-blur-sm border border-primary/20 rounded-lg p-6 md:p-8"
                >
                  <h2 className="text-2xl font-bold mb-6 text-white">
                    Payouts & Scaling
                  </h2>

                  <Accordion type="single" collapsible className="space-y-4">
                    <AccordionItem
                      value="faq-7"
                      className="border border-primary/10 rounded-lg px-6 py-2 bg-black/20"
                    >
                      <AccordionTrigger className="text-white hover:text-primary text-left font-medium py-4">
                        How often do I receive payouts
                      </AccordionTrigger>
                      <AccordionContent className="text-white/80 pt-2 pb-6">
                        Payouts are typically processed bi-weekly.
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem
                      value="faq-8"
                      className="border border-primary/10 rounded-lg px-6 py-2 bg-black/20"
                    >
                      <AccordionTrigger className="text-white hover:text-primary text-left font-medium py-4">
                        Can I scale my account?
                      </AccordionTrigger>
                      <AccordionContent className="text-white/80 pt-2 pb-6">
                        Yes, after demonstrating consistent profitability with
                        your funded account, you can qualify for our scaling
                        program. This allows you to increase your account size
                        and potential profits over time.
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem
                      value="faq-9"
                      className="border border-primary/10 rounded-lg px-6 py-2 bg-black/20"
                    >
                      <AccordionTrigger className="text-white hover:text-primary text-left font-medium py-4">
                        What payment methods do you accept?
                      </AccordionTrigger>
                      <AccordionContent className="text-white/80 pt-2 pb-6">
                        We accept credit/debit cards, PayPal, and various
                        cryptocurrency options for purchasing challenges. For
                        payouts, we offer bank transfers, PayPal, and
                        cryptocurrency payments.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </motion.div>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default FAQ;
