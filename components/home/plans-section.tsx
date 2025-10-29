import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const accountSizes = ["2k", "5k", "10k", "25k", "50k"];

// Define types
type Step = {
  label: string;
  minPicks: number;
  minPickAmount: number;
  maxPickAmount: number;
  maxLoss: number;
  maxDailyLoss?: number;
  profitTarget?: number;
  timeLimit?: string;
};

type PlanData = {
  accountSize: number;
  challenges: {
    [challengeType: string]: {
      fee: number;
      steps: Step[];
    };
  };
};

const mockPlansData: { [accountSize: string]: PlanData } = {
  "2k": {
    accountSize: 2000,
    challenges: {
      "3step": {
        fee: 99,
        steps: [
          { label: "Phase 1", minPicks: 5, minPickAmount: 10, maxPickAmount: 200, maxLoss: 100, profitTarget: 160, timeLimit: "30 Days" },
          { label: "Phase 2", minPicks: 5, minPickAmount: 10, maxPickAmount: 200, maxLoss: 100, profitTarget: 100, timeLimit: "30 Days" },
          { label: "Funded", minPicks: 0, minPickAmount: 0, maxPickAmount: 0, maxLoss: 0, profitTarget: 0, timeLimit: "Unlimited" },
        ],
      },
      "2step": {
        fee: 129,
        steps: [
          { label: "Phase 1", minPicks: 5, minPickAmount: 10, maxPickAmount: 250, maxLoss: 120, profitTarget: 200, timeLimit: "30 Days" },
          { label: "Phase 2", minPicks: 5, minPickAmount: 10, maxPickAmount: 250, maxLoss: 120, profitTarget: 120, timeLimit: "30 Days" },
          { label: "Funded", minPicks: 0, minPickAmount: 0, maxPickAmount: 0, maxLoss: 0, profitTarget: 0, timeLimit: "Unlimited" },
        ],
      },
      "1step": {
        fee: 149,
        steps: [
          { label: "Phase 1", minPicks: 5, minPickAmount: 10, maxPickAmount: 300, maxLoss: 150, profitTarget: 300, timeLimit: "30 Days" },
          { label: "Funded", minPicks: 0, minPickAmount: 0, maxPickAmount: 0, maxLoss: 0, profitTarget: 0, timeLimit: "Unlimited" },
        ],
      },
    },
  },
  "5k": {
    accountSize: 5000,
    challenges: {
      "3step": {
        fee: 199,
        steps: [
          { label: "Phase 1", minPicks: 5, minPickAmount: 25, maxPickAmount: 500, maxLoss: 250, profitTarget: 400, timeLimit: "30 Days" },
          { label: "Phase 2", minPicks: 5, minPickAmount: 25, maxPickAmount: 500, maxLoss: 250, profitTarget: 250, timeLimit: "30 Days" },
          { label: "Funded", minPicks: 0, minPickAmount: 0, maxPickAmount: 0, maxLoss: 0, profitTarget: 0, timeLimit: "Unlimited" },
        ],
      },
      "2step": {
        fee: 249,
        steps: [
          { label: "Phase 1", minPicks: 5, minPickAmount: 25, maxPickAmount: 600, maxLoss: 300, profitTarget: 500, timeLimit: "30 Days" },
          { label: "Phase 2", minPicks: 5, minPickAmount: 25, maxPickAmount: 600, maxLoss: 300, profitTarget: 300, timeLimit: "30 Days" },
          { label: "Funded", minPicks: 0, minPickAmount: 0, maxPickAmount: 0, maxLoss: 0, profitTarget: 0, timeLimit: "Unlimited" },
        ],
      },
      "1step": {
        fee: 299,
        steps: [
          { label: "Phase 1", minPicks: 5, minPickAmount: 25, maxPickAmount: 750, maxLoss: 375, profitTarget: 750, timeLimit: "30 Days" },
          { label: "Funded", minPicks: 0, minPickAmount: 0, maxPickAmount: 0, maxLoss: 0, profitTarget: 0, timeLimit: "Unlimited" },
        ],
      },
    },
  },
  "10k": {
    accountSize: 10000,
    challenges: {
      "3step": {
        fee: 349,
        steps: [
          { label: "Phase 1", minPicks: 5, minPickAmount: 50, maxPickAmount: 1000, maxLoss: 500, profitTarget: 800, timeLimit: "30 Days" },
          { label: "Phase 2", minPicks: 5, minPickAmount: 50, maxPickAmount: 1000, maxLoss: 500, profitTarget: 500, timeLimit: "30 Days" },
          { label: "Funded", minPicks: 0, minPickAmount: 0, maxPickAmount: 0, maxLoss: 0, profitTarget: 0, timeLimit: "Unlimited" },
        ],
      },
      "2step": {
        fee: 399,
        steps: [
          { label: "Phase 1", minPicks: 5, minPickAmount: 50, maxPickAmount: 1200, maxLoss: 600, profitTarget: 1000, timeLimit: "30 Days" },
          { label: "Phase 2", minPicks: 5, minPickAmount: 50, maxPickAmount: 1200, maxLoss: 600, profitTarget: 600, timeLimit: "30 Days" },
          { label: "Funded", minPicks: 0, minPickAmount: 0, maxPickAmount: 0, maxLoss: 0, profitTarget: 0, timeLimit: "Unlimited" },
        ],
      },
      "1step": {
        fee: 449,
        steps: [
          { label: "Phase 1", minPicks: 5, minPickAmount: 50, maxPickAmount: 1500, maxLoss: 750, profitTarget: 1500, timeLimit: "30 Days" },
          { label: "Funded", minPicks: 0, minPickAmount: 0, maxPickAmount: 0, maxLoss: 0, profitTarget: 0, timeLimit: "Unlimited" },
        ],
      },
    },
  },
  "25k": {
    accountSize: 25000,
    challenges: {
      "3step": {
        fee: 599,
        steps: [
          { label: "Phase 1", minPicks: 5, minPickAmount: 125, maxPickAmount: 2500, maxLoss: 1250, profitTarget: 2000, timeLimit: "30 Days" },
          { label: "Phase 2", minPicks: 5, minPickAmount: 125, maxPickAmount: 2500, maxLoss: 1250, profitTarget: 1250, timeLimit: "30 Days" },
          { label: "Funded", minPicks: 0, minPickAmount: 0, maxPickAmount: 0, maxLoss: 0, profitTarget: 0, timeLimit: "Unlimited" },
        ],
      },
      "2step": {
        fee: 699,
        steps: [
          { label: "Phase 1", minPicks: 5, minPickAmount: 125, maxPickAmount: 3000, maxLoss: 1500, profitTarget: 2500, timeLimit: "30 Days" },
          { label: "Phase 2", minPicks: 5, minPickAmount: 125, maxPickAmount: 3000, maxLoss: 1500, profitTarget: 1500, timeLimit: "30 Days" },
          { label: "Funded", minPicks: 0, minPickAmount: 0, maxPickAmount: 0, maxLoss: 0, profitTarget: 0, timeLimit: "Unlimited" },
        ],
      },
      "1step": {
        fee: 799,
        steps: [
          { label: "Phase 1", minPicks: 5, minPickAmount: 125, maxPickAmount: 3750, maxLoss: 1875, profitTarget: 3750, timeLimit: "30 Days" },
          { label: "Funded", minPicks: 0, minPickAmount: 0, maxPickAmount: 0, maxLoss: 0, profitTarget: 0, timeLimit: "Unlimited" },
        ],
      },
    },
  },
  "50k": {
    accountSize: 50000,
    challenges: {
      "3step": {
        fee: 999,
        steps: [
          { label: "Phase 1", minPicks: 5, minPickAmount: 250, maxPickAmount: 5000, maxLoss: 2500, profitTarget: 4000, timeLimit: "30 Days" },
          { label: "Phase 2", minPicks: 5, minPickAmount: 250, maxPickAmount: 5000, maxLoss: 2500, profitTarget: 2500, timeLimit: "30 Days" },
          { label: "Funded", minPicks: 0, minPickAmount: 0, maxPickAmount: 0, maxLoss: 0, profitTarget: 0, timeLimit: "Unlimited" },
        ],
      },
      "2step": {
        fee: 1199,
        steps: [
          { label: "Phase 1", minPicks: 5, minPickAmount: 250, maxPickAmount: 6000, maxLoss: 3000, profitTarget: 5000, timeLimit: "30 Days" },
          { label: "Phase 2", minPicks: 5, minPickAmount: 250, maxPickAmount: 6000, maxLoss: 3000, profitTarget: 3000, timeLimit: "30 Days" },
          { label: "Funded", minPicks: 0, minPickAmount: 0, maxPickAmount: 0, maxLoss: 0, profitTarget: 0, timeLimit: "Unlimited" },
        ],
      },
      "1step": {
        fee: 1399,
        steps: [
          { label: "Phase 1", minPicks: 5, minPickAmount: 250, maxPickAmount: 7500, maxLoss: 3750, profitTarget: 7500, timeLimit: "30 Days" },
          { label: "Funded", minPicks: 0, minPickAmount: 0, maxPickAmount: 0, maxLoss: 0, profitTarget: 0, timeLimit: "Unlimited" },
        ],
      },
    },
  },
};

const PlansSection = () => {
  return (
    <section
      id="plans"
      className="bg-black py-16 md:py-24 min-h-screen scroll-mt-28"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Choose Your <span className="text-primary">Challenge</span>
          </h2>
          <p className="text-white/80 text-lg">
            Select your account size and challenge type. Click on steps to see
            specific requirements.
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          <div
            className="
      flex snap-x snap-mandatory overflow-x-auto pb-4 space-x-4
      lg:grid lg:grid-cols-3 lg:gap-6 lg:overflow-visible lg:pb-0 lg:space-x-0 lg:snap-none
      scrollbar-hide
    "
          >
            <div className="min-w-[85%] snap-center lg:min-w-0">
              <PlanCard
                challengeType="3step"
                title="3 Step Challenge"
                badge="3 Step Challenge"
                description="Lower fee, higher intensity that tests your strategic limits. Complete each step within 30 days to unlock funding."
                plansData={mockPlansData}
              />
            </div>

            <div className="min-w-[85%] snap-center lg:min-w-0">
              <PlanCard
                challengeType="2step"
                title="2 Step Challenge"
                badge="2 Step Challenge"
                description="Faster track to funding with more tangible goals. Conquer each step in 30 days to get funded."
                isPopular
                plansData={mockPlansData}
              />
            </div>

            <div className="min-w-[85%] snap-center lg:min-w-0">
              <PlanCard
                challengeType="1step"
                title="1 Step Challenge"
                badge="1 Step Challenge"
                description="The industry’s only one step to get funded. Complete this only challenge, and start earning rewards."
                plansData={mockPlansData}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

type PlanCardProps = {
  challengeType: string;
  title: string;
  badge: string;
  description: string;
  isPopular?: boolean;
  plansData: { [accountSize: string]: PlanData };
};

const PlanCard = ({
  challengeType,
  title,
  badge,
  description,
  isPopular = false,
  plansData,
}: PlanCardProps) => {
  const [selectedAccountSize, setSelectedAccountSize] = useState("2k");
  const [selectedStepIndex, setSelectedStepIndex] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Get available account sizes for this challenge type
  const availableAccountSizes = accountSizes.filter((size) => {
    const plan = plansData[size]?.challenges?.[challengeType];
    return plan && plan.fee !== null && plan.steps.length > 0;
  });

  // Get current plan data
  const currentPlanData =
    plansData[selectedAccountSize]?.challenges?.[challengeType];
  const selectedStep = currentPlanData?.steps?.[selectedStepIndex];

  // Fallback to first available account size if current selection isn't available
  const effectiveAccountSize = currentPlanData
    ? selectedAccountSize
    : availableAccountSizes[0];
  const effectivePlanData =
    plansData[effectiveAccountSize]?.challenges?.[challengeType];
  const effectiveStep =
    effectivePlanData?.steps?.[selectedStepIndex] ||
    effectivePlanData?.steps?.[0];

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className={`relative bg-gradient-to-b from-gray-900/80 to-black/80 border-2 rounded-xl overflow-hidden h-full ${isPopular
          ? "border-blue-500 shadow-2xl shadow-blue-500/30"
          : "border-blue-500/30 hover:border-blue-500/50 transition-all duration-300"
          }`}
        style={{
          background:
            "linear-gradient(135deg, rgba(139, 69, 196, 0.1) 0%, rgba(0, 0, 0, 0.8) 100%)",
          backdropFilter: "blur(10px)",
        }}
      >
        <div className="p-6 h-full flex flex-col">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-2xl font-bold text-white">{title}</h3>
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
                {badge}
              </span>
            </div>
            <p className="text-white/70 text-sm mb-4">{description}</p>
          </div>

          {/* Account Size Dropdown */}
          <div className="mb-6">
            <label className="text-white text-sm mb-2 block">Account size:</label>
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-full bg-primary hover:bg-primary/90 text-white rounded-lg px-4 py-3 font-bold flex items-center justify-between transition-colors"
              >
                $
                {plansData[effectiveAccountSize]?.accountSize?.toLocaleString() ||
                  "10,000"}
                <svg
                  className={`w-4 h-4 transition-transform ${dropdownOpen ? "rotate-180" : ""
                    }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {dropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-blue-500/30 rounded-lg overflow-hidden z-50">
                  {availableAccountSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => {
                        setSelectedAccountSize(size);
                        setSelectedStepIndex(0);
                        setDropdownOpen(false);
                      }}
                      className="w-full px-4 py-3 text-left text-white hover:bg-blue-600/30 transition-colors border-b border-gray-700 last:border-b-0"
                    >
                      ${plansData[size].accountSize.toLocaleString()}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Challenge Fee */}
          <div className="mb-6">
            <div className="flex justify-between items-center">
              <span className="text-white text-sm">Challenge fee:</span>
              <div className="text-right">
                <div className="text-xl font-bold text-white">
                  {effectivePlanData?.fee
                    ? `$${effectivePlanData.fee}`
                    : "Not offered"}
                </div>
                <div className="text-white/60 text-xs">One-time</div>
              </div>
            </div>
          </div>

          {/* Step Navigation */}
          {effectivePlanData?.steps?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {effectivePlanData.steps.map((step, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedStepIndex(index)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${index === selectedStepIndex
                    ? step.label === "Funded"
                      ? "bg-green-500 text-white"
                      : "bg-primary text-white"
                    : "bg-white/10 text-white/70 hover:bg-white/20"
                    }`}
                >
                  {step.label}
                </button>
              ))}
            </div>
          )}

          {/* Step Details */}
          <div className="flex-1 mb-6">
            {effectiveStep ? (
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/70">Minimum Picks</span>
                  <span className="text-white font-semibold">
                    {effectiveStep.minPicks}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Minimum Pick Amount</span>
                  <span className="text-white font-semibold">
                    ${effectiveStep.minPickAmount}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Maximum Pick Amount</span>
                  <span className="text-white font-semibold">
                    ${effectiveStep.maxPickAmount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Max Loss</span>
                  <span className="text-white font-semibold">
                    ${effectiveStep.maxLoss.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Max Daily Loss</span>
                  <span className="text-white font-semibold">
                    {effectiveStep.maxDailyLoss
                      ? `$${effectiveStep.maxDailyLoss.toLocaleString()}`
                      : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Profit Target</span>
                  <span className="text-white font-semibold">
                    {effectiveStep.profitTarget
                      ? `$${effectiveStep.profitTarget.toLocaleString()}`
                      : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Time Limit</span>
                  <span className="text-white font-semibold">
                    {effectiveStep.timeLimit || "N/A"}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-white/50 text-center py-8">
                Not available for this account size
              </div>
            )}
          </div>

          {/* Activate Button */}
          <button
            disabled={true}
            className={`w-full font-bold py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02] mt-auto bg-gray-600 text-gray-400 cursor-not-allowed`}
          >
            Activate
          </button>
        </div>
      </motion.div>
    </>
  );
};

export default PlansSection;
