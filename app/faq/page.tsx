"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const faqCategories = [
    {
      category: "General Questions",
      items: [
        {
          question: "What is Harglim Publishers?",
          answer:
            "Harglim Publishers is a modern, author-friendly publishing platform that empowers writers to publish and distribute their books globally while maintaining creative control and earning competitive royalties.",
        },
        {
          question: "Do I need an agent to publish with Harglim?",
          answer:
            "No, we work directly with authors. You don't need a literary agent to publish with us. Simply create an account and submit your manuscript through our platform.",
        },
        {
          question: "What genres do you accept?",
          answer:
            "We accept all genres including fiction, non-fiction, romance, mystery, science fiction, fantasy, self-help, biography, and more. Our focus is on quality content in any category.",
        },
        {
          question: "Is there a publishing fee?",
          answer:
            "We offer flexible publishing options. We provide free self-publishing services, and also offer premium publishing packages with professional editing, cover design, and marketing support.",
        },
      ],
    },
    {
      category: "Submission & Publishing",
      items: [
        {
          question: "How do I submit my manuscript?",
          answer:
            'Create an author account, go to your dashboard, and use the "Submit Manuscript" button. Upload your manuscript in Word or PDF format and fill out the submission form.',
        },
        {
          question: "How long does the review process take?",
          answer:
            "Our initial review takes 7-14 days. If selected for publication, the complete process from submission to launch typically takes 2-4 weeks depending on required revisions.",
        },
        {
          question: "What if my manuscript is rejected?",
          answer:
            "We provide constructive feedback on rejected manuscripts. Many authors revise and resubmit. We welcome second submissions after addressing our feedback.",
        },
        {
          question: "Can I publish under a pen name?",
          answer:
            "Yes, absolutely. You can publish under any name you choose. Simply provide the pen name in your submission form, and we'll display it as your author name.",
        },
        {
          question: "Do you accept translated works?",
          answer:
            "Yes, we accept quality translations. Please ensure the translation rights are secured and include documentation of rights with your submission.",
        },
      ],
    },
    {
      category: "Books & Distribution",
      items: [
        {
          question: "Where will my book be available?",
          answer:
            "Your book will be available on Harglim Publishers platform, major online retailers (Amazon, Goodreads), and can be ordered through independent bookstores worldwide.",
        },
        {
          question: "Can I print physical copies of my book?",
          answer:
            "Yes! We provide print-on-demand services. Physical copies can be printed in small batches or as orders come in, reducing printing costs.",
        },
        {
          question: "Can I publish in multiple formats?",
          answer:
            "Yes, we support e-book (EPUB, PDF), paperback, hardcover, and audiobook formats. You can publish in one format initially and add others later.",
        },
        {
          question: "Can I change my book after publishing?",
          answer:
            "Yes, you can update your manuscript, cover design, or book details. Changes typically go live within 24-48 hours.",
        },
      ],
    },
    {
      category: "Rights & Copyright",
      items: [
        {
          question: "Do I retain copyright of my book?",
          answer:
            "Yes, you retain full copyright. You grant us permission to publish and distribute, but you remain the sole copyright holder and owner of your work.",
        },
        {
          question: "Can I sell my book elsewhere?",
          answer:
            "You can publish simultaneously with other platforms. We don't require exclusivity unless you choose our exclusive distribution program for enhanced royalties.",
        },
        {
          question: "What if I want to remove my book?",
          answer:
            "You can unpublish your book anytime from your author dashboard. Published copies remain active, but new orders won't be processed after unpublishing.",
        },
        {
          question: "Can I give permission for translations?",
          answer:
            "Yes, as the copyright holder, you can authorize translations. Contact us for guidance on managing translation rights through our platform.",
        },
      ],
    },
    {
      category: "Payments & Royalties",
      items: [
        {
          question: "What are the royalty rates?",
          answer:
            "Royalty rates vary by format: E-books 50%, Paperbacks 40%, Hardcover 45%, Audiobooks 35%. Bestselling authors may qualify for higher rates.",
        },
        {
          question: "When do I get paid?",
          answer:
            "Royalties are calculated monthly and paid quarterly when your balance reaches the minimum threshold of ₹50. Payments are made via bank transfer.",
        },
        {
          question: "How do I track my sales and earnings?",
          answer:
            "Log into your author dashboard anytime to see real-time sales data, earnings by format/region, and download detailed reports.",
        },
        {
          question: "What payment methods do you support?",
          answer:
            "We support direct bank transfers to Indian and international accounts. For international authors, we offer payment in USD or local currency.",
        },
      ],
    },
    {
      category: "Marketing & Promotion",
      items: [
        {
          question: "Do you provide marketing support?",
          answer:
            "Yes! All authors get access to our marketing toolkit, social media templates, and promotional resources. Premium packages include enhanced marketing services.",
        },
        {
          question: "Can you help with book reviews?",
          answer:
            "We facilitate connections with book reviewers and promote your book on our platform and social media. We also encourage author-initiated review campaigns.",
        },
        {
          question: "Can I run promotions and discounts?",
          answer:
            "Yes, you can set up promotional campaigns, temporary discounts, and pre-order campaigns directly from your dashboard.",
        },
        {
          question: "How do I build my author platform?",
          answer:
            "We provide resources on building author websites, email lists, and social media presence. Your Harglim author page serves as a professional online presence.",
        },
      ],
    },
    {
      category: "Technical Support",
      items: [
        {
          question: "What file formats do you accept?",
          answer:
            "We accept manuscripts in .doc, .docx, .rtf, and PDF formats. For publishing, we convert to proper e-book and print formats.",
        },
        {
          question: "What if I have technical issues uploading my manuscript?",
          answer:
            "Our support team is available 24/7. Email support@harglim.com or contact through the live chat on our platform for immediate assistance.",
        },
        {
          question: "How do I reset my password?",
          answer:
            'Click "Forgot Password" on the login page, enter your email, and follow the recovery link sent to your inbox.',
        },
        {
          question: "Can I have multiple books on Harglim?",
          answer:
            "Yes! You can publish as many books as you like under the same author account. Each book is managed separately in your dashboard.",
        },
      ],
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
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-primary-foreground/90">
              Find answers to common questions about publishing and royalties.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {faqCategories.map((categoryGroup, categoryIdx) => (
              <motion.div
                key={categoryIdx}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
              >
                <h2 className="text-3xl font-serif font-bold text-foreground mb-6 pb-4 border-b-2 border-primary">
                  {categoryGroup.category}
                </h2>

                <div className="space-y-4">
                  {categoryGroup.items.map((item, idx) => {
                    const globalIndex = categoryIdx * 10 + idx;
                    return (
                      <motion.div
                        key={idx}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        className="bg-card rounded-lg border border-border overflow-hidden hover:shadow-lg transition-all"
                      >
                        <button
                          onClick={() =>
                            setOpenIndex(
                              openIndex === globalIndex ? null : globalIndex,
                            )
                          }
                          className="w-full p-6 flex items-center justify-between hover:bg-muted/50 transition-colors"
                        >
                          <h3 className="text-lg font-semibold text-foreground text-left">
                            {item.question}
                          </h3>
                          <ChevronDown
                            className={`h-6 w-6 text-primary flex-shrink-0 transition-transform duration-300 ${
                              openIndex === globalIndex ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        {openIndex === globalIndex && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="border-t border-border bg-muted/30 px-6 py-4"
                          >
                            <p className="text-muted-foreground leading-relaxed">
                              {item.answer}
                            </p>
                          </motion.div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl font-serif font-bold text-foreground mb-4">
              Didn't find your answer?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Our support team is here to help. Contact us anytime.
            </p>
            <Link href="/contact">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Contact Support
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
