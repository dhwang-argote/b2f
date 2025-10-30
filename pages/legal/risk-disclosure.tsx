import React, { useEffect } from "react";
import Layout from "@/components/layout/layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const RiskDisclosure = () => {
  useEffect(() => {
    // Scroll to top when component loads
    window.scrollTo(0, 0);
  }, []);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Card className="bg-[#121212]/70 backdrop-blur-sm border-primary/30">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl font-bold text-white">
              Risk Disclosure
            </CardTitle>
            <CardDescription className="text-white/70">
              Last Updated: May 19, 2025
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 text-white/80">
            <div className="space-y-4">
              <p>
                This Risk Disclosure statement is provided to you as a
                participant or prospective participant in Bet2Fund's funded
                sports picking program. It is important that you read and
                understand the risks associated with sports picking and our
                funding program before participating.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white">
                1. General Risk Warning
              </h2>
              <p>
                Sports picking carries a high level of risk and may not be
                suitable for all individuals. Before deciding to participate in
                our program, you should carefully consider your investment
                objectives, level of experience, and risk appetite. The
                possibility exists that you could sustain a loss of some or all
                of your investment, and therefore you should not invest funds
                that you cannot afford to lose.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white">
                2. Challenge Fee Risk
              </h2>
              <p>
                By purchasing a Bet2Fund Challenge, you acknowledge and accept
                that:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  The Challenge fee paid is non-refundable except as specified
                  in our Refund Policy.
                </li>
                <li>
                  There is no guarantee that you will pass the Challenge and
                  qualify for funding.
                </li>
                <li>
                  The Challenge fee does not represent an investment into a
                  sports picking account but rather a fee for participating in
                  our evaluation program.
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white">
                3. Sports picking Performance Risks
              </h2>
              <p>
                Sports picking involves substantial risks, including but not
                limited to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Market Volatility:</strong> Sports picking markets can
                  be highly volatile and unpredictable, with odds changing
                  rapidly in response to events, news, or betting patterns.
                </li>
                <li>
                  <strong>Loss of Capital:</strong> Sports picking in sports
                  markets can result in the loss of some or all of your
                  investment, particularly when proper risk management is not
                  employed.
                </li>
                <li>
                  <strong>Past Performance:</strong> Past performance of any
                  sports picking system or methodology is not necessarily
                  indicative of future results. Any examples of past performance
                  provided by Bet2Fund should not be considered a guarantee of
                  future performance.
                </li>
                <li>
                  <strong>Psychological Factors:</strong> Sports picking can be
                  emotionally challenging. Fear, greed, and other emotions can
                  adversely affect sports picking decisions and performance.
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white">
                4. Funded Account Risks
              </h2>
              <p>
                If you qualify for a funded account, additional risks apply,
                including:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Compliance Risk:</strong> Failure to comply with the
                  challenge rules and parameters of your funded account may
                  result in the termination of your account and forfeiture of
                  any accrued profits.
                </li>
                <li>
                  <strong>Profit Payout Risk:</strong> While Bet2Fund endeavors
                  to process profit payouts as outlined in our terms, various
                  factors may affect the timing or execution of payouts,
                  including regulatory requirements, verification processes, or
                  operational constraints.
                </li>
                <li>
                  <strong>Account Termination Risk:</strong> Bet2Fund reserves
                  the right to terminate funded accounts at our discretion,
                  including but not limited to instances of rule violations,
                  suspicious sports picking patterns, or business necessity.
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white">
                5. Technical and Operational Risks
              </h2>
              <p>
                Using our platform and participating in our program involve
                various technical and operational risks, including:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Platform Risks:</strong> Technical issues, system
                  failures, or errors in our platform may affect your ability to
                  trade, monitor positions, or access your account.
                </li>
                <li>
                  <strong>Data Risks:</strong> Inaccuracies or delays in market
                  data, quotes, or other information provided through our
                  platform may affect sports picking decisions and outcomes.
                </li>
                <li>
                  <strong>Connectivity Risks:</strong> Internet connectivity
                  issues, power failures, or other circumstances beyond our
                  control may impact your ability to access our platform.
                </li>
                <li>
                  <strong>Cybersecurity Risks:</strong> Despite our security
                  measures, there is inherent risk in transmitting information
                  online, and we cannot guarantee absolute protection of your
                  information.
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white">
                6. Regulatory and Legal Risks
              </h2>
              <p>
                Sports picking and sports picking activities are subject to
                various laws and regulations that may change over time:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Regulatory Changes:</strong> Changes in laws,
                  regulations, or regulatory interpretations may affect our
                  ability to operate or provide services in certain
                  jurisdictions.
                </li>
                <li>
                  <strong>Tax Obligations:</strong> You are solely responsible
                  for any tax obligations arising from your participation in our
                  program and any profits earned.
                </li>
                <li>
                  <strong>Legal Restrictions:</strong> It is your responsibility
                  to ensure that your participation in our program complies with
                  all applicable laws in your jurisdiction.
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white">
                7. Risk Mitigation
              </h2>
              <p>
                While risks cannot be eliminated entirely, you can take steps to
                mitigate them:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Only participate with funds you can afford to lose</li>
                <li>
                  Educate yourself about sports picking markets and sports
                  picking strategies
                </li>
                <li>
                  Develop and adhere to a disciplined risk management approach
                </li>
                <li>
                  Start with lower-tier Challenges until you gain experience
                </li>
                <li>
                  Regularly review your sports picking performance and adjust
                  your approach as needed
                </li>
                <li>Maintain realistic expectations about potential returns</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white">
                8. No Financial Advice
              </h2>
              <p>
                Bet2Fund does not provide financial, investment, legal, or tax
                advice. The information provided on our platform, including
                educational materials, market data, and sports picking tools, is
                for informational and educational purposes only and should not
                be construed as professional advice.
              </p>
              <p>
                You should consult with qualified professionals regarding your
                specific situation before making any financial decisions or
                engaging in sports picking activities.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white">
                9. Acknowledgement
              </h2>
              <p>
                By participating in Bet2Fund's programs, you acknowledge that
                you have read and understood this Risk Disclosure statement and
                accept the risks associated with sports sports picking and our
                funding program.
              </p>
              <p>
                You further acknowledge that this Risk Disclosure statement is
                not exhaustive and that other risks not described here may also
                apply.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white">
                10. Contact Information
              </h2>
              <p>
                If you have any questions about this Risk Disclosure statement,
                please contact us:
              </p>
              <p>
                Email: support@bet2fund.com
                <br />
                Address: Wyoming, Suite 456, New York, NY 10001
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default RiskDisclosure;
