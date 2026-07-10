"use client";

import { motion } from "framer-motion";
import { FileText, User, ShoppingBag, BookOpen, AlertCircle, Scale } from "lucide-react";
import Link from "next/link";

export default function TermsOfServicePage() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const sections = [
    {
      title: "1. Agreement to Terms",
      icon: FileText,
      content: `By accessing or using the Harglim Publishers website and mobile application (the "Service"), you agree to be bound by these Terms of Service. If you disagree with any part of the terms, then you do not have permission to access the Service.
      
These Terms apply to all visitors, users, authors, and others who access or use the Service.`,
    },
    {
      title: "2. User Accounts",
      icon: User,
      content: `When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.

You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password, whether your password is with our Service or a third-party service.

You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.`,
    },
    {
      title: "3. E-commerce and Purchases",
      icon: ShoppingBag,
      content: `If you wish to purchase any product or service made available through the Service ("Purchase"), you may be asked to supply certain information relevant to your Purchase including, without limitation, your credit card number, the expiration date of your credit card, your billing address, and your shipping information.

You represent and warrant that: (i) you have the legal right to use any credit card(s) or other payment method(s) in connection with any Purchase; and that (ii) the information you supply to us is true, correct and complete.

We reserve the right to refuse or cancel your order at any time for certain reasons including but not limited to: product or service availability, errors in the description or price of the product or service, error in your order or other reasons.`,
    },
    {
      title: "4. Author Publishing",
      icon: BookOpen,
      content: `Authors who submit manuscripts or publish through Harglim Publishers retain the copyright to their original works. By publishing with us, you grant Harglim Publishers a non-exclusive, worldwide, royalty-bearing license to reproduce, distribute, display, and sell your book through our platform and partner networks.

Authors are responsible for ensuring that their content does not infringe upon the intellectual property rights of others and does not contain libelous, defamatory, or otherwise unlawful material.

Royalties and payment terms for authors are governed by the specific Publishing Agreement provided during the manuscript acceptance process.`,
    },
    {
      title: "5. Intellectual Property",
      icon: Scale,
      content: `The Service and its original content (excluding Content provided by users and authors), features, and functionality are and will remain the exclusive property of Harglim Publishers and its licensors. The Service is protected by copyright, trademark, and other laws of both India and foreign countries.

Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of Harglim Publishers.`,
    },
    {
      title: "6. Limitation of Liability",
      icon: AlertCircle,
      content: `In no event shall Harglim Publishers, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:

(i) your access to or use of or inability to access or use the Service;
(ii) any conduct or content of any third party on the Service;
(iii) any content obtained from the Service; and
(iv) unauthorized access, use or alteration of your transmissions or content.`,
    },
    {
      title: "7. Changes to Terms",
      icon: FileText,
      content: `We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.

By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, please stop using the Service.`,
    },
  ];

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary to-primary/80 text-primary-foreground overflow-hidden py-20">
        <div className="absolute inset-0 opacity-10 bg-[url('/grid.svg')] bg-center" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="max-w-3xl"
          >
            <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6">
              Terms of Service
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
              Questions About Our Terms?
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              If you have any questions or concerns regarding our Terms of Service, please contact us.
            </p>
            <div className="bg-card border border-border rounded-xl p-6 inline-block">
              <p className="text-muted-foreground mb-2">Email us at:</p>
              <Link
                href="mailto:legal@harglim.com"
                className="text-primary hover:underline font-bold text-lg"
              >
                legal@harglim.com
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
