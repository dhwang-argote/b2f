import React from "react";
import Layout from "@/components/layout/layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const PrivacyPolicy = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Card className="bg-[#121212]/70 backdrop-blur-sm border-primary/30">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl font-bold text-white">
              Privacy Policy
            </CardTitle>
            <CardDescription className="text-white/70">
              Last Updated: May 19, 2025
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 text-white/80">
            <div className="space-y-4">
              <p>
                At Bet2Fund, we take your privacy seriously. This Privacy Policy
                explains how we collect, use, disclose, and safeguard your
                information when you visit our website or use our platform.
              </p>
              <p>
                Please read this Privacy Policy carefully. By accessing or using
                our Service, you acknowledge that you have read, understood, and
                agree to be bound by all the terms outlined in this policy.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white">
                1. Information We Collect
              </h2>
              <p>
                We collect several types of information from and about users of
                our Service, including:
              </p>
              <h3 className="text-lg font-medium text-white/90 mt-3">
                Personal Data
              </h3>
              <p>
                When you register for an account, we may collect personally
                identifiable information, such as:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Full name</li>
                <li>Email address</li>
                <li>Phone number</li>
                <li>Address</li>
                <li>Payment information</li>
                <li>Date of birth (for age verification)</li>
              </ul>

              <h3 className="text-lg font-medium text-white/90 mt-3">
                Usage Data
              </h3>
              <p>
                We may also collect information about how you access and use our
                Service, including:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>IP address</li>
                <li>Browser type</li>
                <li>Operating system</li>
                <li>Pages visited</li>
                <li>Time spent on pages</li>
                <li>Referring website</li>
                <li>Device information</li>
                <li>Trading activity and patterns</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white">
                2. How We Use Your Information
              </h2>
              <p>
                We may use the information we collect for various purposes,
                including:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>To provide and maintain our Service</li>
                <li>To verify your identity and eligibility</li>
                <li>To process transactions and send related information</li>
                <li>
                  To analyze trading patterns for compliance with our rules
                </li>
                <li>To send administrative emails and communications</li>
                <li>To provide customer support</li>
                <li>To personalize your experience</li>
                <li>To improve our Service</li>
                <li>To conduct research and analysis</li>
                <li>
                  To detect, prevent, and address technical issues or fraudulent
                  activities
                </li>
                <li>To comply with legal obligations</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white">
                3. Disclosure of Your Information
              </h2>
              <p>
                We may disclose your information in the following circumstances:
              </p>
              <h3 className="text-lg font-medium text-white/90 mt-3">
                Business Partners and Service Providers
              </h3>
              <p>
                We may share your information with third-party service providers
                who perform services on our behalf, such as payment processing,
                data analysis, email delivery, hosting, customer service, and
                marketing assistance.
              </p>

              <h3 className="text-lg font-medium text-white/90 mt-3">
                Legal Requirements
              </h3>
              <p>
                We may disclose your information if required to do so by law or
                in response to valid requests by public authorities (e.g., a
                court or government agency).
              </p>

              <h3 className="text-lg font-medium text-white/90 mt-3">
                Business Transfers
              </h3>
              <p>
                We may share or transfer your information in connection with, or
                during negotiations of, any merger, sale of company assets,
                financing, or acquisition of all or a portion of our business to
                another company.
              </p>

              <h3 className="text-lg font-medium text-white/90 mt-3">
                With Your Consent
              </h3>
              <p>
                We may disclose your information for any other purpose with your
                consent.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white">
                4. Data Security
              </h2>
              <p>
                We implement appropriate technical and organizational measures
                to protect the security of your personal information. However,
                please be aware that no method of transmission over the internet
                or electronic storage is 100% secure, and we cannot guarantee
                absolute security.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white">
                5. Data Retention
              </h2>
              <p>
                We will retain your personal information only for as long as is
                necessary for the purposes set out in this Privacy Policy. We
                will also retain and use your information to the extent
                necessary to comply with our legal obligations, resolve
                disputes, and enforce our policies.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white">
                6. Your Data Protection Rights
              </h2>
              <p>
                Depending on your location, you may have certain rights
                regarding your personal information, including:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  The right to access, update, or delete the information we have
                  about you
                </li>
                <li>
                  The right to rectification (to have your information corrected
                  if it's inaccurate)
                </li>
                <li>
                  The right to object (to our processing of your personal
                  information)
                </li>
                <li>
                  The right of restriction (to request that we restrict
                  processing of your information)
                </li>
                <li>
                  The right to data portability (to receive a copy of your
                  information in a structured, machine-readable format)
                </li>
                <li>The right to withdraw consent</li>
              </ul>
              <p>
                To exercise any of these rights, please contact us using the
                contact information provided below.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white">
                7. Cookies and Tracking Technologies
              </h2>
              <p>
                We use cookies and similar tracking technologies to track
                activity on our Service and store certain information. You can
                instruct your browser to refuse all cookies or to indicate when
                a cookie is being sent. However, if you do not accept cookies,
                you may not be able to use some portions of our Service.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white">
                8. Third-Party Websites
              </h2>
              <p>
                Our Service may contain links to third-party websites that are
                not operated by us. If you click on a third-party link, you will
                be directed to that third party's site. We strongly advise you
                to review the Privacy Policy of every site you visit. We have no
                control over and assume no responsibility for the content,
                privacy policies, or practices of any third-party sites or
                services.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white">
                9. Children's Privacy
              </h2>
              <p>
                Our Service is not intended for use by individuals under the age
                of 18. We do not knowingly collect personally identifiable
                information from children under 18. If we become aware that we
                have collected personal data from a child under 18 without
                verification of parental consent, we will take steps to remove
                that information from our servers.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white">
                10. Changes to This Privacy Policy
              </h2>
              <p>
                We may update our Privacy Policy from time to time. We will
                notify you of any changes by posting the new Privacy Policy on
                this page and updating the "Last Updated" date at the top. You
                are advised to review this Privacy Policy periodically for any
                changes.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white">
                11. Contact Us
              </h2>
              <p>
                If you have any questions about this Privacy Policy, please
                contact us:
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

export default PrivacyPolicy;
