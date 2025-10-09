import React from 'react';
import Layout from '@/components/layout/layout';
import { motion } from 'framer-motion';

const PrivacyPolicy = () => {
  return (
    <Layout>
      <div className="container mx-auto py-16 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-5xl font-bold mb-4 text-white">Privacy Policy</h1>
          <p className="text-lg text-white/70 max-w-3xl mx-auto">
            Last Updated: May 19, 2025
          </p>
        </motion.div>

        <div className="bg-[#121212]/70 backdrop-blur-sm border border-primary/20 rounded-lg p-6 md:p-8">
          <div className="prose prose-lg prose-invert max-w-none">
            <h2>1. Introduction</h2>
            <p>
              At Bet2Fund, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our platform. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
            </p>

            <h2>2. Information We Collect</h2>

            <h3>2.1 Personal Data</h3>
            <p>
              We may collect personal information that you voluntarily provide to us when you register on our platform, express interest in obtaining information about us or our products, or otherwise contact us. The personal information we collect may include:
            </p>
            <ul>
              <li>Name</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Date of birth</li>
              <li>Billing information</li>
              <li>Any other information you choose to provide</li>
            </ul>

            <h3>2.2 Picking Data</h3>
            <p>
              We collect data related to your picking activities on our platform, including:
            </p>
            <ul>
              <li>Picking history and performance</li>
              <li>Account balances</li>
              <li>Profit and loss records</li>
              <li>Challenge progress metrics</li>
            </ul>

            <h3>2.3 Automatically Collected Information</h3>
            <p>
              When you access our platform, we may automatically collect certain information about your device, including:
            </p>
            <ul>
              <li>IP address</li>
              <li>Browser type</li>
              <li>Operating system</li>
              <li>Access times</li>
              <li>Pages viewed</li>
              <li>Other usage information</li>
            </ul>

            <h2>3. How We Use Your Information</h2>
            <p>
              We may use the information we collect for various purposes, including:
            </p>
            <ul>
              <li>Providing, operating, and maintaining our platform</li>
              <li>Evaluating your trading performance for challenge completion</li>
              <li>Processing transactions and sending related information</li>
              <li>Sending administrative information</li>
              <li>Responding to inquiries and offering support</li>
              <li>Sending promotional communications</li>
              <li>Monitoring and analyzing usage patterns</li>
              <li>Detecting, preventing, and addressing technical issues</li>
              <li>Improving our platform and user experience</li>
            </ul>

            <h2>4. Disclosure of Your Information</h2>
            <p>
              We may share your information in the following situations:
            </p>
            <ul>
              <li><strong>Compliance with Laws:</strong> We may disclose your information where required by law or to comply with legal processes.</li>
              <li><strong>Business Transfers:</strong> We may share information in connection with a merger, sale, or acquisition.</li>
              <li><strong>Service Providers:</strong> We may share your information with third-party vendors who provide services on our behalf.</li>
              <li><strong>With Your Consent:</strong> We may disclose your information for any other purpose with your consent.</li>
            </ul>

            <h2>5. Data Security</h2>
            <p>
              We implement appropriate technical and organizational security measures to protect your information. However, no electronic transmission or storage system is completely secure, and we cannot guarantee the absolute security of your data.
            </p>

            <h2>6. Your Data Protection Rights</h2>
            <p>
              Depending on your location, you may have certain rights regarding your personal information, such as:
            </p>
            <ul>
              <li>The right to access your personal data</li>
              <li>The right to rectify inaccurate or incomplete information</li>
              <li>The right to erasure of your personal data</li>
              <li>The right to restrict processing of your personal data</li>
              <li>The right to data portability</li>
              <li>The right to object to processing of your personal data</li>
            </ul>
            <p>
              To exercise these rights, please contact us using the information provided in the "Contact Us" section.
            </p>

            <h2>7. Cookies and Tracking Technologies</h2>
            <p>
              We use cookies and similar tracking technologies to collect and track information about your browsing activities on our platform. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
            </p>

            <h2>8. Third-Party Websites</h2>
            <p>
              Our platform may contain links to third-party websites. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party websites or services.
            </p>

            <h2>9. Children's Privacy</h2>
            <p>
              Our platform is not intended for individuals under the age of 18. We do not knowingly collect or solicit personal information from children. If we learn that we have collected personal information from a child, we will delete that information as quickly as possible.
            </p>

            <h2>10. Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date at the top.
            </p>

            <h2>11. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <p>
              Bet2Fund<br />
              Email: privacy@bet2fund.com<br />
              1309 Coffeen Avenue STE 1200, Sheridan, Wyoming 82801
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PrivacyPolicy;