import React from "react";
import Layout from "@/components/layout/layout";
import { motion } from "framer-motion";

const TermsOfService = () => {
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
            Terms of Service
          </h1>
          <p className="text-lg text-white/70 max-w-3xl mx-auto">
            Last Updated: May 19, 2025
          </p>
        </motion.div>

        <div className="bg-[#121212]/70 backdrop-blur-sm border border-primary/20 rounded-lg p-6 md:p-8">
          <div className="prose prose-lg prose-invert max-w-none">
            <h2>1. Agreement to Terms</h2>
            <p>
              These Terms of Service constitute a legally binding agreement made
              between you and Bet2Fund ("we," "us," or "our"), concerning your
              access to and use of the Bet2Fund website and platform. By
              accessing or using our services, you agree to be bound by these
              Terms.
            </p>

            <h2>2. Services Description</h2>
            <p>
              Bet2Fund offers a proprietary picking platform that allows users
              to participate in funded picking challenges. Upon successful
              completion of these challenges, users may qualify to receive
              funding for sports picking accounts. The specific details and
              requirements for each challenge are provided on our website.
            </p>

            <h2>3. Account Registration and Security</h2>
            <p>
              To access certain features of our platform, you must register for
              an account. You agree to provide accurate, current, and complete
              information during the registration process. You are responsible
              for maintaining the confidentiality of your account credentials
              and for all activities that occur under your account.
            </p>

            <h2>4. Eligibility</h2>
            <p>
              You must be at least 18 years old and legally able to enter into
              binding contracts to use our services. By using our platform, you
              represent and warrant that you meet these requirements. Our
              services may not be available in all jurisdictions, and it is your
              responsibility to determine whether you can legally use our
              services in your location.
            </p>

            <h2>5. Challenge Rules and Evaluation Criteria</h2>
            <p>
              Each picking challenge has specific rules and evaluation criteria
              that must be followed. These include, but are not limited to,
              profit targets, maximum drawdown limits, and picking day
              requirements. Failure to adhere to these rules may result in
              disqualification from the challenge without refund.
            </p>

            <h2>6. Fee Structure and Payments</h2>
            <p>
              Challenge fees are non-refundable upon purchase. If you receive
              funding after successfully completing a challenge, profit splits
              will be paid according to the terms specified for your account
              type. We reserve the right to modify our fee structure with notice
              to users.
            </p>

            <h2>7. Prohibited Activities</h2>
            <p>
              You agree not to engage in any prohibited picking activities,
              including but not limited to arbitrage, betting on all outcomes of
              an event, exploitation of promotional offers, or any other
              activity that violates the spirit of fair picking. We reserve the
              right to determine what constitutes prohibited activity at our
              sole discretion.
            </p>

            <h2>8. Intellectual Property Rights</h2>
            <p>
              The Bet2Fund platform, including all content, features, and
              functionality, is owned by us, our licensors, or other providers
              and is protected by copyright, trademark, and other intellectual
              property laws. You may not reproduce, distribute, modify, create
              derivative works from, or otherwise exploit our content without
              our prior written consent.
            </p>

            <h2>9. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, Bet2Fund and its
              affiliates shall not be liable for any indirect, incidental,
              special, consequential, or punitive damages resulting from your
              use or inability to use the platform, including but not limited to
              picking losses, loss of profits, or data loss.
            </p>

            <h2>10. Termination</h2>
            <p>
              We reserve the right to suspend or terminate your account at our
              sole discretion, without notice, for conduct that we determine
              violates these Terms, applicable laws, or is harmful to our
              interests or those of another user.
            </p>

            <h2>11. Changes to Terms</h2>
            <p>
              We may modify these Terms at any time by posting the revised terms
              on our website. Your continued use of our platform following the
              posting of updated Terms constitutes your acceptance of the
              changes.
            </p>

            <h2>12. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with
              the laws of the jurisdiction in which Bet2Fund is registered,
              without regard to its conflict of law provisions.
            </p>

            <h2>13. Contact Information</h2>
            <p>
              If you have any questions about these Terms, please contact us at
              support@bet2fund.com.
            </p>
            <p className="mt-4">
              Bet2Fund<br />
              1309 Coffeen Avenue STE 1200, Sheridan, Wyoming 82801
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TermsOfService;
