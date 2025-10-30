import Layout from '@/components/layout/layout';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { IconCheck } from '@/components/icons';
import { Link } from 'wouter';

const Plans = () => {
  const plans = [
    {
      id: 1,
      name: "Starter Challenge",
      description:
        "Perfect for new sports strategists looking to prove their skills.",
      accountSize: 10000,
      price: 9900, // $99.00
      profitTarget: 8,
      maxDrawdown: 5,
      profitSplit: 70,
      minTradingDays: 5,
      maxDailyProfit: 5,
      features: JSON.stringify([
        "0K Demo Account",
        "8% Profit Target (30 Days)",
        "5% Maximum Drawdown",
        "70% Profit Split",
        "5 Minimum Trading Days",
        "Bi-weekly Payouts",
        "2-Step Challenge",
      ]),
      isActive: true,
      payoutFrequency: "bi-weekly",
      challengeType: "2-step",
      phaseCount: 2,
    },
    {
      id: 2,
      name: "Advanced Challenge",
      description:
        "For experienced sports strategists seeking significant capital.",
      accountSize: 50000,
      price: 29900, // $299.00
      profitTarget: 10,
      maxDrawdown: 8,
      profitSplit: 75,
      minTradingDays: 5,
      maxDailyProfit: 5,
      features: JSON.stringify([
        "$50K Demo Account",
        "10% Profit Target (30 Days)",
        "8% Maximum Drawdown",
        "75% Profit Split",
        "5 Minimum Trading Days",
        "Weekly Payouts",
        "Premium Analytics",
        "3-Step Challenge",
      ]),
      isActive: true,
      payoutFrequency: "weekly",
      challengeType: "3-step",
      phaseCount: 3,
    },
    {
      id: 3,
      name: "Professional Challenge",
      description:
        "For elite sports strategists with proven performance history.",
      accountSize: 100000,
      price: 49900, // $499.00
      profitTarget: 10,
      maxDrawdown: 6,
      profitSplit: 80,
      minTradingDays: 10,
      maxDailyProfit: 5,
      features: JSON.stringify([
        "00K Demo Account",
        "10% Profit Target (30 Days)",
        "6% Maximum Drawdown",
        "80% Profit Split",
        "10 Minimum Trading Days",
        "Daily Payouts",
        "Premium Analytics",
        "Dedicated Support",
        "Blitz Challenge",
      ]),
      isActive: true,
      payoutFrequency: "daily",
      challengeType: "blitz",
      phaseCount: 1,
    },
  ];

  const isLoading = false;

  return (
    <Layout>
      <div className="container mx-auto py-16 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-5xl font-bold mb-4 text-white">Choose Your Plan</h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Select the account size that best matches your picking goals and get funded after proving your skills.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans?.map((plan: any) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * plan.id }}
              className="bg-[#121212]/70 backdrop-blur-sm border border-primary/20 rounded-lg p-6 flex flex-col h-full"
            >
              <h2 className="text-2xl font-bold mb-2 text-white">{plan.name}</h2>
              <p className="text-white/70 mb-6">{plan.description}</p>

              <div className="text-4xl font-bold text-primary mb-2">
                ${plan.accountSize.toLocaleString()}
              </div>
              <p className="text-white/70 mb-6">Picking Account</p>

              <div className="space-y-4 mb-8 flex-grow">
                <div className="flex items-start">
                  <IconCheck className="text-primary mr-3 flex-shrink-0 mt-1" />
                  <span className="text-white/80">{plan.profitTarget}% Profit Target</span>
                </div>
                <div className="flex items-start">
                  <IconCheck className="text-primary mr-3 flex-shrink-0 mt-1" />
                  <span className="text-white/80">{plan.maxDrawdown}% Max Drawdown</span>
                </div>
                <div className="flex items-start">
                  <IconCheck className="text-primary mr-3 flex-shrink-0 mt-1" />
                  <span className="text-white/80">Min {plan.minTradingDays} Picking Days</span>
                </div>
                <div className="flex items-start">
                  <IconCheck className="text-primary mr-3 flex-shrink-0 mt-1" />
                  <span className="text-white/80">{plan.profitSplit}% Profit Split</span>
                </div>
                <div className="flex items-start">
                  <IconCheck className="text-primary mr-3 flex-shrink-0 mt-1" />
                  <span className="text-white/80">{plan.payoutFrequency} Payouts</span>
                </div>
              </div>

              <Link href="/register">
                <Button className="w-full bg-primary hover:bg-primary/90 py-6 text-lg shadow-[0_0_15px_rgba(0,178,255,0.5)]">
                  ${(plan.price / 100).toFixed(2)}
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 bg-[#121212]/70 backdrop-blur-sm border border-primary/20 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-white">Frequently Asked Questions</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2 text-white">What happens if I don't pass the challenge?</h3>
              <p className="text-white/80">
                If you don't meet the profit target or breach any rules like exceeding the maximum drawdown, you'll need to purchase a new challenge. However, we offer discounted reset options and frequent promotions.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2 text-white">Do you offer refunds?</h3>
              <p className="text-white/80">
                Challenge fees are non-refundable as they provide immediate access to our proprietary picking platform and educational resources. However, we do offer reset discounts if you don't pass on your first attempt.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2 text-white">Can I have multiple funded accounts?</h3>
              <p className="text-white/80">
                Yes, after passing your first challenge and receiving funding, you're eligible to take on additional challenges to manage multiple funded accounts simultaneously.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Plans;