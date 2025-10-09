import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { createClient, User } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

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

type Challenge = {
  id: string;
  user_id: string;
  account_size: string;
  challenge_type: string;
  fee: number;
  steps: Step[];
  status: string;
  current_step: number;
  progress: number;
  activated_at: string;
};

const PlansSection = () => {
  const [plansData, setPlansData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlansData();
  }, []);

  const fetchPlansData = async () => {
    try {
      const { data, error } = await supabase.from("plans").select("*");

      if (error) {
        console.error("Error fetching plans:", error);
        return;
      }

      // Transform the data into the same structure as the original hardcoded data
      const transformedData: {
        [accountSize: string]: {
          accountSize: number;
          challenges: {
            [challengeType: string]: {
              fee: number;
              steps: Step[];
            };
          };
        };
      } = {};

      data.forEach((plan: any) => {
        if (!transformedData[plan.account_size]) {
          transformedData[plan.account_size] = {
            accountSize: parseInt(plan.account_size.replace("k", "000")),
            challenges: {},
          };
        }

        transformedData[plan.account_size].challenges[plan.challenge_type] = {
          fee: plan.fee,
          steps: plan.steps,
        };
      });

      setPlansData(transformedData);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section
        id="plans"
        className="bg-black py-16 md:py-24 min-h-screen flex items-center justify-center"
      >
        <div className="text-white text-xl">Loading plans...</div>
      </section>
    );
  }

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
                plansData={plansData}
              />
            </div>

            <div className="min-w-[85%] snap-center lg:min-w-0">
              <PlanCard
                challengeType="2step"
                title="2 Step Challenge"
                badge="2 Step Challenge"
                description="Faster track to funding with more tangible goals. Conquer each step in 30 days to get funded."
                isPopular
                plansData={plansData}
              />
            </div>

            <div className="min-w-[85%] snap-center lg:min-w-0">
              <PlanCard
                challengeType="1step"
                title="1 Step Challenge"
                badge="1 Step Challenge"
                description="The industry’s only one step to get funded. Complete this only challenge, and start earning rewards."
                plansData={plansData}
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
  plansData: {
    [accountSize: string]: {
      accountSize: number;
      challenges: {
        [challengeType: string]: {
          fee: number;
          steps: Step[];
        };
      };
    };
  };
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
  const [activating, setActivating] = useState(false);
  const [paying, setPaying] = useState(false);
  const { toast } = useToast();
  // guestToken/modal removed — we auto-redirect guests to registration and store token in localStorage

  // Bitcoin payment configuration
  const BITCOIN_WALLET_ADDRESS = "3LwexZ7yioDJA6tSubiqZawXxesZkugx2B";
  // perform Bitcoin payment for verification
  const performBitcoinPayment = async (
    usdAmount: number
  ): Promise<{
    success: boolean;
    txHash?: string | null;
    paymentMethod?: string;
    btcAmount?: number;
  }> => {
    try {
      // In development mode, allow skipping actual payment
      if (import.meta.env.DEV) {
        toast({
          title: "Development Mode",
          description: "Skipping Bitcoin payment in development.",
          variant: "default",
        });
        return {
          success: true,
          txHash: `dev-btc-${Date.now()}`,
          paymentMethod: "bitcoin",
          btcAmount: 0.001,
        };
      }

      // Get current BTC price from a free API
      const btcPrice = await getBitcoinPrice();
      const btcAmount = usdAmount / btcPrice;

      // Create payment request
      const paymentData = {
        address: BITCOIN_WALLET_ADDRESS,
        amount: btcAmount,
        label: "Bet2Fund Challenge Payment",
        message: `Payment for ${usdAmount} USD challenge activation`,
      };

      // Create Bitcoin URI for payment
      const bitcoinURI = `bitcoin:${BITCOIN_WALLET_ADDRESS}?amount=${btcAmount}&label=${encodeURIComponent(
        paymentData.label
      )}&message=${encodeURIComponent(paymentData.message)}`;

      // Show payment modal/instructions
      const confirmed = await showBitcoinPaymentModal(
        bitcoinURI,
        btcAmount,
        usdAmount
      );

      if (confirmed) {
        return {
          success: true,
          txHash: `manual-btc-${Date.now()}`, // In real implementation, user would provide tx hash
          paymentMethod: "bitcoin",
          btcAmount: btcAmount,
        };
      } else {
        return { success: false };
      }
    } catch (err: any) {
      console.error("Bitcoin payment error:", err);
      toast({
        title: "Payment failed",
        description: err?.message || "Bitcoin payment was not completed.",
        variant: "destructive",
      });
      return { success: false };
    }
  };

  // Get current Bitcoin price
  const getBitcoinPrice = async (): Promise<number> => {
    try {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd"
      );
      const data = await response.json();
      return data.bitcoin.usd;
    } catch (error) {
      console.error("Error fetching Bitcoin price:", error);
      // Fallback price if API fails
      return 45000; // Default BTC price
    }
  };

  // Show Bitcoin payment modal
  const showBitcoinPaymentModal = (
    bitcoinURI: string,
    btcAmount: number,
    usdAmount: number
  ): Promise<boolean> => {
    return new Promise((resolve) => {
      // Create modal overlay
      const overlay = document.createElement("div");
      overlay.className =
        "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50";

      // Create modal content
      overlay.innerHTML = `
        <div class="bg-gray-900 border border-blue-500/30 rounded-xl p-6 max-w-md mx-4 text-white">
          <h3 class="text-xl font-bold mb-4 text-center">Bitcoin Payment Required</h3>
          <div class="space-y-4">
            <div class="text-center">
              <p class="text-sm text-gray-400 mb-2">Amount to pay:</p>
              <p class="text-lg font-bold text-blue-400">${btcAmount.toFixed(
        8
      )} BTC</p>
              <p class="text-sm text-gray-400">($${usdAmount} USD)</p>
            </div>
            
            <div class="bg-gray-800 p-3 rounded-lg">
              <p class="text-xs text-gray-400 mb-2">Send Bitcoin to:</p>
              <div class="flex items-center space-x-2">
                <input 
                  id="btc-address" 
                  type="text" 
                  value="${BITCOIN_WALLET_ADDRESS}" 
                  readonly 
                  class="flex-1 bg-gray-700 text-white text-xs p-2 rounded border-none outline-none"
                />
                <button 
                  onclick="navigator.clipboard.writeText('${BITCOIN_WALLET_ADDRESS}'); this.textContent='Copied!'"
                  class="bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded text-xs font-medium"
                >
                  Copy
                </button>
              </div>
            </div>

            <div class="text-center">
              <a 
                href="${bitcoinURI}" 
                class="inline-block bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded-lg text-sm font-medium mb-3"
              >
                Open in Bitcoin Wallet
              </a>
            </div>

            <div class="text-xs text-gray-400 text-center mb-4">
              <p>Please send the exact amount and wait for confirmation.</p>
              <p>Click "Payment Sent" after completing the transaction.</p>
            </div>

            <div class="flex space-x-3">
              <button 
                id="confirm-payment" 
                class="flex-1 bg-green-600 hover:bg-green-700 py-2 rounded-lg font-medium"
              >
                Payment Sent
              </button>
              <button 
                id="cancel-payment" 
                class="flex-1 bg-gray-600 hover:bg-gray-700 py-2 rounded-lg font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      `;

      // Add event listeners
      const confirmBtn = overlay.querySelector("#confirm-payment");
      const cancelBtn = overlay.querySelector("#cancel-payment");

      confirmBtn?.addEventListener("click", () => {
        document.body.removeChild(overlay);
        resolve(true);
      });

      cancelBtn?.addEventListener("click", () => {
        document.body.removeChild(overlay);
        resolve(false);
      });

      // Close on overlay click
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) {
          document.body.removeChild(overlay);
          resolve(false);
        }
      });

      document.body.appendChild(overlay);
    });
  };

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

  const handleActivatePlan = async () => {
    if (!effectiveStep || !effectivePlanData?.fee) return;

    setActivating(true);

    try {
      // Get current user (may be null for guest purchases)
      const storedUser = localStorage.getItem("b2f_user");
      const userObj: User | null = storedUser ? JSON.parse(storedUser) : null;

      // Determine planId fallback for guest purchase if frontend doesn't have exact plan id
      const guestPlanId = planIdFromData(effectiveAccountSize);

      // If user is logged in, check if they have enough balance
      let profile: any = null;
      if (userObj) {
        const { data: profileData, error: profileFetchError } = await supabase
          .from("profiles")
          .select("balance, total_challenges, active_plans")
          .eq("id", userObj.id)
          .single();

        if (profileFetchError || !profileData) {
          console.error("Error fetching profile:", profileFetchError);
          toast({
            title: "Profile Error",
            description: "Could not fetch your profile. Please try again.",
            variant: "destructive",
          });
          setActivating(false);
          return;
        }

        profile = profileData;

        if (profile.balance < effectivePlanData.fee) {
          toast({
            title: "Insufficient Balance",
            description: "Please add funds to your account.",
            variant: "destructive",
          });
          setActivating(false);
          return;
        }
      }

      // perform Bitcoin payment verification
      setPaying(true);
      const paymentResult = await performBitcoinPayment(effectivePlanData.fee);
      setPaying(false);

      // paymentResult is an object { success: boolean, txHash?, paymentMethod?, btcAmount? }
      if (!paymentResult || paymentResult.success !== true) {
        // Payment failed or was rejected. Stop activation.
        setActivating(false);
        return;
      }
      // If user is not logged in, create guest purchase and show token
      if (!userObj) {
        try {
          const resp = await fetch('/api/guest/purchase', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              planId: guestPlanId,
              amount: effectivePlanData.fee,
              txHash: paymentResult.txHash || null,
              paymentMethod: paymentResult.paymentMethod || 'bitcoin',
            }),
          });

          if (!resp.ok) {
            const err = await resp.json().catch(() => ({ message: 'Unknown error' }));
            console.error('Guest purchase failed:', err);
            toast({ title: 'Purchase failed', description: err.message || 'Could not create purchase', variant: 'destructive' });
            setActivating(false);
            return;
          }

          const data = await resp.json();
          // Save token automatically and redirect guest to registration where the draft will auto-include it
          try {
            // Save both purchase token and transaction id as fallbacks. Some DBs may not persist purchase_token
            // so transactionId is a reliable identifier to claim later.
            if (data.purchaseToken) localStorage.setItem('b2f_purchase_token', data.purchaseToken);
            if (data.transactionId) localStorage.setItem('b2f_transaction_id', data.transactionId);
          } catch (e) {
            console.warn('Failed to save purchase identifiers to localStorage', e);
          }

          toast({ title: 'Purchase created', description: 'Redirecting to registration...', variant: 'default' });
          // Redirect to registration page so user can complete signup; registration form auto-injects token from localStorage
          window.location.href = '/register';
        } catch (err) {
          console.error('Guest purchase error:', err);
          toast({ title: 'Purchase failed', description: 'Could not create purchase', variant: 'destructive' });
        } finally {
          setActivating(false);
        }

        return; // guest flow ends here — user will complete registration
      }

      // Create the challenge record
      const { data: challenge, error: challengeError } = await supabase
        .from("user_challenges")
        .insert({
          user_id: userObj.id,
          account_size: effectiveAccountSize,
          challenge_type: challengeType,
          fee: effectivePlanData.fee,
          steps: effectivePlanData.steps,
          status: "active",
          current_step: 0,
          progress: 0,
          activated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (challengeError || !challenge) {
        console.error("Error creating challenge:", challengeError);
        toast({
          title: "Error Activating Plan",
          description: "Please try again.",
          variant: "destructive",
        });
        setActivating(false);
        return;
      }

      // Create transaction record (persist Bitcoin payment info in description)
      const bitcoinInfo = paymentResult.btcAmount
        ? ` (${paymentResult.btcAmount.toFixed(8)} BTC)`
        : "";
      const { error: transactionError } = await supabase
        .from("transactions")
        .insert({
          user_id: userObj.id,
          type: "purchase",
          amount: -effectivePlanData.fee, // Negative amount for deduction
          description: `Activated ${effectiveAccountSize} ${challengeType} challenge via Bitcoin payment${bitcoinInfo}`,
          related_entity: "challenge",
          related_entity_id: challenge.id,
          status: "completed",
          tx_hash: paymentResult.txHash ?? null,
        });

      if (transactionError) {
        console.error("Error creating transaction:", transactionError);
      }

      // Update user profile
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          balance: profile.balance - effectivePlanData.fee,
          total_challenges: (profile.total_challenges || 0) + 1,
          active_plans: [...(profile.active_plans || []), challenge.id],
        })
        .eq("id", userObj.id);

      if (profileError) {
        console.error("Error updating profile:", profileError);
      }

      toast({
        title: "Plan Activated",
        description: "You can view your progress in your profile.",
        variant: "default",
      });
    } catch (error) {
      console.error("Error activating plan:", error);
      toast({
        title: "Error Activating Plan",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setActivating(false);
    }
  };

  // Helper to map account size string like '2k' to a plan id if needed (fallback placeholder)
  function planIdFromData(accountSizeStr: string) {
    // In this implementation the frontend doesn't reliably know plan ids; backend can accept planId or related_entity_id
    // Use a simple heuristic / fallback: map common sizes to assumed plan ids (adjust if your DB differs)
    if (accountSizeStr === '2k') return 1;
    if (accountSizeStr === '5k') return 2;
    if (accountSizeStr === '10k') return 3;
    if (accountSizeStr === '25k') return 4;
    if (accountSizeStr === '50k') return 5;
    return 1;
  }


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
            onClick={handleActivatePlan}
            disabled={
              !effectiveStep || !effectivePlanData?.fee || activating || paying
            }
            className={`w-full font-bold py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02] mt-auto ${effectiveStep && effectivePlanData?.fee && !activating && !paying
              ? "bg-primary hover:bg-primary/90 text-white"
              : "bg-gray-600 text-gray-400 cursor-not-allowed"
              }`}
          >
            {paying
              ? "Processing Bitcoin Payment..."
              : activating
                ? "Activating..."
                : effectiveStep && effectivePlanData?.fee
                  ? "Activate"
                  : "Not Available"}
          </button>
        </div>
      </motion.div>
      {/* Guest Purchase Modal removed: guest flow now auto-redirects to registration after purchase. */}
    </>
  );
};

export default PlansSection;
