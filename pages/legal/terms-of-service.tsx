import React from "react";
import Layout from "@/components/layout/layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const TermsOfService = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Card className="bg-[#121212]/70 backdrop-blur-sm border-primary/30">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl font-bold text-white">
              Terms of Service
            </CardTitle>
            <CardDescription className="text-white/70">
              Last Updated: May 19, 2025
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 text-white/80">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white">
                1. Acceptance of Terms
              </h2>
              <p>
                By accessing or using Bet2Fund (the "Service"), you agree to be
                bound by these Terms of Service. If you do not agree to these
                terms, please do not use our Service.
              </p>
              <p>
                Bet2Fund provides a proprietary evaluation program designed to
                identify and develop skilled sports traders. These terms govern
                your use of our website, platform, and all related services.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white">
                2. Eligibility
              </h2>
              <p>
                You must be at least 18 years of age or the age of legal
                majority in your jurisdiction, whichever is higher, to use our
                Service. By using the Service, you represent and warrant that
                you meet these eligibility requirements.
              </p>
              <p>
                Bet2Fund's services are not available in jurisdictions where
                online sports picking or trading is illegal. It is your
                responsibility to ensure compliance with all applicable laws in
                your jurisdiction.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white">
                3. Account Registration
              </h2>
              <p>
                To access certain features of our Service, you must register for
                an account. You agree to provide accurate, current, and complete
                information during the registration process and to update such
                information to keep it accurate, current, and complete.
              </p>
              <p>
                You are solely responsible for safeguarding your account
                credentials and for any activity that occurs under your account.
                You must notify us immediately of any unauthorized use of your
                account.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white">
                4. Funded Trader Program
              </h2>
              <p>
                Our Funded Trader Program ("Challenge") is an evaluation process
                designed to identify skilled sports traders. By purchasing a
                Challenge, you acknowledge and agree to the following:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  The Challenge fee is non-refundable unless otherwise specified
                  in our Refund Policy.
                </li>
                <li>
                  You must comply with all challenge rules and parameters
                  specified for your Challenge tier.
                </li>
                <li>
                  Meeting the Challenge objectives does not guarantee approval
                  or funding.
                </li>
                <li>
                  Bet2Fund reserves the right to review all trading activity and
                  may deny funding based on trading patterns that suggest
                  manipulation or violation of our rules.
                </li>
                <li>
                  Funded accounts remain the property of Bet2Fund, with profits
                  shared according to the agreed-upon split for your Challenge
                  tier.
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white">
                5. Challenge Rules and Conduct
              </h2>
              <p>
                As a participant in our Challenge or funded program, you agree
                to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Adhere to all specified risk management parameters, including
                  maximum drawdown limits and position size restrictions.
                </li>
                <li>
                  Not engage in any form of trading manipulation, including but
                  not limited to arbitrage, latency exploitation, or use of
                  insider information.
                </li>
                <li>
                  Not use automated trading systems, bots, or algorithms unless
                  explicitly authorized.
                </li>
                <li>
                  Maintain regular trading activity as specified in the
                  Challenge parameters.
                </li>
                <li>Not share or transfer your account to any third party.</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white">
                6. Payments and Profit Sharing
              </h2>
              <p>
                Challenge fees are due at the time of purchase. For funded
                traders, profit payouts will be processed according to the
                schedule specified in your account, typically monthly, provided
                minimum profit thresholds are met.
              </p>
              <p>
                You are responsible for all taxes applicable to any payments
                received from Bet2Fund. We reserve the right to request tax
                documentation before processing payouts.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white">
                7. Intellectual Property
              </h2>
              <p>
                All content, features, and functionality of our Service,
                including but not limited to text, graphics, logos, icons, and
                software, are owned by Bet2Fund or its licensors and are
                protected by intellectual property laws.
              </p>
              <p>
                You may not reproduce, distribute, modify, create derivative
                works of, publicly display, publicly perform, republish,
                download, store, or transmit any materials from our Service
                without our prior written consent.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white">
                8. Termination
              </h2>
              <p>
                We reserve the right to suspend or terminate your access to our
                Service at any time, with or without cause, and with or without
                notice. Upon termination, your right to use the Service will
                immediately cease.
              </p>
              <p>
                Causes for termination may include, but are not limited to,
                violations of these Terms, suspected fraudulent activity, or
                behavior that poses a risk to Bet2Fund or other users.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white">
                9. Disclaimer of Warranties
              </h2>
              <p>
                THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT
                WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. TO THE
                FULLEST EXTENT PERMISSIBLE UNDER APPLICABLE LAW, BET2FUND
                DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING, BUT NOT
                LIMITED TO, IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
                PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
              </p>
              <p>
                WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED OR
                ERROR-FREE, THAT DEFECTS WILL BE CORRECTED, OR THAT THE SERVICE
                IS FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white">
                10. Limitation of Liability
              </h2>
              <p>
                TO THE FULLEST EXTENT PERMITTED BY LAW, BET2FUND SHALL NOT BE
                LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR
                PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUE, WHETHER
                INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE,
                GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM YOUR ACCESS
                TO OR USE OF OR INABILITY TO ACCESS OR USE THE SERVICE.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white">
                11. Governing Law
              </h2>
              <p>
                These Terms shall be governed by and construed in accordance
                with the laws of the jurisdiction in which Bet2Fund is
                registered, without giving effect to any principles of conflicts
                of law.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white">
                12. Changes to Terms
              </h2>
              <p>
                We reserve the right to modify these Terms at any time. If we
                make changes, we will provide notice through the Service, such
                as by posting the updated Terms on this page. Your continued use
                of the Service after any such changes constitutes your
                acceptance of the new Terms.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white">
                13. Contact Us
              </h2>
              <p>
                If you have any questions about these Terms, please contact us
                at:
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

export default TermsOfService;
