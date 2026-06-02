"use client";

import { motion } from "framer-motion";
import { Shield, Lock, Eye, Mail, User, Database } from "lucide-react";
import Link from "next/link";

export default function PrivacyPolicyPage() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const sections = [
    {
      title: "1. Introduction",
      icon: Shield,
      content: `Harglim Publishers ("Company", "we", "our", or "us") operates the Harglim Publishers website and mobile application (the "Service"). This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data. Our Privacy Policy applies to all visitors, users, and others who access the Service. If you do not agree with our policies and practices, please do not use our Service.`,
    },
    {
      title: "2. Information Collection and Use",
      icon: Database,
      content: `We collect several different types of information for various purposes to provide and improve our Service to you.

Types of Data Collected:
• Personal Data: Name, email address, phone number, postal address, payment information, and cookies or similar tracking technologies
• Book Purchase Information: Books purchased, reading preferences, and order history
• Author Information: Manuscript details, publishing information, and royalty data
• Device Information: Browser type, IP address, and operating system

Reasons for Collection:
• To provide and maintain our Service
• To process transactions and send related information
• To provide customer support
• To monitor usage patterns and improve our Service
• To detect and prevent fraudulent transactions
• To send promotional emails and newsletters (with consent)`,
    },
    {
      title: "3. Use of Data",
      icon: Eye,
      content: `Harglim Publishers uses the collected data for various purposes:

• Providing and maintaining our Service
• Notifying you about changes to our Service
• Providing customer care and support
• Gathering analysis or valuable information to improve our Service
• Monitoring the usage of our Service
• Detecting, preventing and addressing technical issues and fraud
• With your consent, to provide you with news, special offers and general information

We will not sell, trade, or rent your personal information to third parties without your explicit consent, except as required by law or in cases of emergency.`,
    },
    {
      title: "4. Security of Data",
      icon: Lock,
      content: `The security of your data is important to us but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal data, we cannot guarantee its absolute security.

Security Measures:
• SSL/TLS encryption for data in transit
• Secure password hashing and storage
• Regular security audits and updates
• Limited access to personal data
• Compliance with industry standards
• Incident response procedures`,
    },
    {
      title: "5. Communication Preferences",
      icon: Mail,
      content: `We will send you promotional emails and newsletters with your consent. You can opt out of receiving promotional emails by clicking the "unsubscribe" link in our emails or by logging into your account and adjusting your preferences.

However, we will continue to send you transactional and service-related emails (such as order confirmations, shipping updates, and account notifications) even if you opt out of promotional emails.`,
    },
    {
      title: "6. User Rights",
      icon: User,
      content: `You have the following rights regarding your personal data:

• Right to Access: You can request a copy of your personal data
• Right to Correction: You can request correction of inaccurate data
• Right to Deletion: You can request deletion of your data (right to be forgotten)
• Right to Data Portability: You can request your data in a portable format
• Right to Withdraw Consent: You can withdraw previously given consent
• Right to Lodge Complaint: You can file a complaint with data protection authorities

To exercise these rights, please contact us at privacy@harglim.com with your request.`,
    },
    {
      title: "7. Third-Party Links",
      icon: Shield,
      content: `Our Service may contain links to third-party websites, applications, and services that are not operated by us. This Privacy Policy does not apply to third-party services, and we are not responsible for their privacy practices. We encourage you to review the privacy policies of any third-party services before providing your personal information.`,
    },
    {
      title: "8. Children's Privacy",
      icon: User,
      content: `Our Service is not intended for use by children under the age of 13. We do not knowingly collect personal information from children under 13. If we discover that a child under 13 has provided us with personal data, we will delete such information immediately.

If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately at privacy@harglim.com.`,
    },
    {
      title: "9. Changes to This Privacy Policy",
      icon: Shield,
      content: `We may update our Privacy Policy from time to time to reflect changes in our practices or other operational, legal, or regulatory reasons. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.

Your continued use of the Service after such modifications constitutes your acknowledgment and acceptance of the updated Privacy Policy.`,
    },
    {
      title: "10. Contact Us",
      icon: Mail,
      content: `If you have any questions about this Privacy Policy or our privacy practices, please contact us at:

Harglim Publishers
Email: privacy@harglim.com
Address: 123 Publishing Lane, Mumbai, India 400001
Phone: +91 98765 43210

We will respond to your inquiry within 7 business days.`,
    },
  ];

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary to-primary/80 text-primary-foreground overflow-hidden py-20">
        <div className="absolute inset-0 opacity-10 bg-gradient-to-t from-primary/50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="max-w-3xl"
          >
            <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6">
              Privacy Policy
            </h1>
            <p className="text-xl text-primary-foreground/90">
              Effective Date: June 1, 2026 | Last Updated: June 2, 2026
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {sections.map((section, index) => (
            <motion.div
              key={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="bg-card rounded-2xl border border-border p-8 hover:shadow-lg transition-all"
            >
              <div className="flex items-start gap-4 mb-4">
                <section.icon className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
                <h2 className="text-3xl font-bold text-foreground">
                  {section.title}
                </h2>
              </div>
              <div className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {section.content}
              </div>
            </motion.div>
          ))}

          {/* Summary Box */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="bg-primary/10 border-2 border-primary rounded-2xl p-8"
          >
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Your Privacy Rights
            </h3>
            <ul className="space-y-3 text-foreground">
              <li className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span>
                  Your personal data is encrypted and protected with
                  industry-standard security
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span>
                  You have full control over your data and can request access,
                  modification, or deletion
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span>
                  We never sell your personal information to third parties
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span>
                  You can opt out of promotional communications anytime
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span>
                  We comply with GDPR, CCPA, and other privacy regulations
                </span>
              </li>
            </ul>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl font-serif font-bold text-foreground mb-4">
              Privacy Questions?
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              If you have any concerns about your privacy, please reach out to
              our privacy team.
            </p>
            <div className="bg-card border border-border rounded-xl p-6 inline-block">
              <p className="text-muted-foreground mb-2">Email us at:</p>
              <Link
                href="mailto:privacy@harglim.com"
                className="text-primary hover:underline font-bold text-lg"
              >
                privacy@harglim.com
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
