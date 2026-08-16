"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Users,
  Truck,
  Star,
  ArrowRight,
  Sparkles,
  Award,
  Globe,
  ShieldCheck,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Search,
  Mail,
  Send,
  Heart,
  TrendingUp,
  Feather,
  Layers,
  ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BookCard } from "@/components/books/book-card";
import { ErrorState } from "@/components/ui/error-state";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import api from "@/lib/api";
import type { Book } from "@/types";
import { BookCardSkeleton } from "@/components/books/book-card-skeleton";

import { useSiteContent } from "@/context/site-content-context";

const trustBadges = [
  { label: "30+", sub: "Books Published", icon: BookOpen, color: "text-[#D4AF37]" },
  { label: "25+", sub: "Happy Authors", icon: Users, color: "text-emerald-400" },
  { label: "5+", sub: "Countries Reached", icon: Globe, color: "text-blue-400" },
];

const whyChooseBlocks = [
  {
    title: "100% Author Rights & Freedom",
    description: "You retain total copyright ownership and creative control over your manuscript and book covers.",
    icon: Feather,
    highlight: "Author Centric",
  },
  {
    title: "Premium Print & Hardcover Quality",
    description: "Acid-free archival paper, rich color saturation, and durable matte/gloss hardcover bindings.",
    icon: Layers,
    highlight: "Luxury Finish",
  },
  {
    title: "Pan-India Express Distribution",
    description: "Direct listing across online stores, local bookstore partnerships, and fast door-step delivery.",
    icon: Truck,
    highlight: "Fast Delivery",
  },
  {
    title: "Transparent Royalty Settlements",
    description: "Real-time dashboard reporting on copy sales, transparent split, and automated monthly payouts.",
    icon: ShieldCheck,
    highlight: "Guaranteed Payouts",
  },
];

const defaultFaqs = [
  {
    question: "How do I publish my manuscript with Harglim Publishers?",
    answer: "Getting published is simple! Navigate to our 'Publish With Us' page, fill out the manuscript submission form with your book details, sample chapters, and contact information. Our editorial review team will respond within 3 to 5 business days.",
  },
  {
    question: "What royalty percentages do authors earn on book sales?",
    answer: "Authors earn up to 70% net royalties on print sales and e-books. All earnings are calculated transparently and visible inside your Author Dashboard with automated monthly settlements.",
  },
  {
    question: "Do I retain full copyright ownership of my book?",
    answer: "Yes, 100%! You retain complete copyright ownership, translation rights, and adaptation rights to your work. Harglim Publishers acts strictly as your printing, distribution, and publishing partner.",
  },
  {
    question: "How long does shipping take for ordered books?",
    answer: "Orders are processed and printed within 24 to 48 hours. Express shipping across India typically arrives within 3 to 5 business days with live SMS and email tracking.",
  },
];

export default function Home() {
  const { content } = useSiteContent();
  const [featuredBooks, setFeaturedBooks] = useState<Book[]>([]);
  const [bestsellers, setBestsellers] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // FAQ Accordion & Search State
  const [faqSearch, setFaqSearch] = useState("");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Newsletter State
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubmitting, setNewsletterSubmitting] = useState(false);

  // Parse FAQs dynamically if provided in site content
  let activeFaqs = defaultFaqs;
  if (content?.faqsJson) {
    try {
      const parsed = JSON.parse(content.faqsJson);
      if (Array.isArray(parsed) && parsed.length > 0) {
        activeFaqs = parsed;
      }
    } catch (e) {
      // Fallback
    }
  }

  const fetchBooks = async () => {
    try {
      setLoading(true);
      setError(false);

      const [booksRes, bestsellersRes] = await Promise.allSettled([
        api.get("/books?featured=true&limit=8"),
        api.get("/books?sort=rating&limit=4"),
      ]);

      if (booksRes.status === "fulfilled") {
        const data = booksRes.value.data;
        const items = data.data?.books || data.data || data || [];
        setFeaturedBooks(Array.isArray(items) ? items : []);
      }

      if (bestsellersRes.status === "fulfilled") {
        const data = bestsellersRes.value.data;
        const items = data.data?.books || data.data || data || [];
        setBestsellers(Array.isArray(items) ? items : []);
      }
    } catch (error) {
      console.error("Failed to fetch home page data:", error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setNewsletterSubmitting(true);
    setTimeout(() => {
      toast.success("Thank you for subscribing to Harglim Publishers! 📚");
      setNewsletterEmail("");
      setNewsletterSubmitting(false);
    }, 800);
  };

  const filteredFaqs = activeFaqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(faqSearch.toLowerCase()) ||
      faq.answer.toLowerCase().includes(faqSearch.toLowerCase())
  );

  return (
    <div className="bg-[#F8F9F7] text-[#0F3D3E] overflow-hidden font-sans">
      
      {/* ------------------------------------------------------------------ */}
      {/* 1. HERO SECTION (Layered Gradient + Floating Book Mockup + CTAs) */}
      {/* ------------------------------------------------------------------ */}
      <section className="relative bg-gradient-to-b from-[#0B2E2F] via-[#0F3D3E] to-[#082223] text-white pt-24 pb-20 md:pt-32 md:pb-28 lg:pt-36 lg:pb-32 overflow-hidden">
        {/* Subtle Background Glow Spheres */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-10 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content (7 Cols) */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="lg:col-span-7 text-center lg:text-left space-y-6"
            >
              {/* Top Tag Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-serif font-bold tracking-wide shadow-sm">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Professional Book Publishing &amp; Distribution House</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold tracking-tight text-white leading-[1.1] whitespace-pre-line">
                {content?.homeTitle || "You write, we print.\nYou dream, we publish"}
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-white/80 max-w-2xl mx-auto lg:mx-0 font-light leading-relaxed">
                {content?.homeSubtitle ||
                  "Discover inspiring stories from extraordinary authors across multiple genres, or publish your own literary masterpiece with Harglim Publishers."}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
                <Link href="/publish">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-[#D4AF37] hover:bg-[#C29F2F] text-[#0F3D3E] font-serif font-bold h-14 px-8 rounded-full shadow-[0_0_25px_rgba(212,175,55,0.4)] hover:shadow-[0_0_35px_rgba(212,175,55,0.6)] transition-all gap-2 text-base"
                  >
                    <span>{content?.homeCtaButtonText || "Start Your Publishing Journey"}</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>

                <Link href="/books">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-white/10 hover:bg-white/20 border-2 border-white/40 text-white font-serif font-bold h-14 px-8 rounded-full text-base transition-all"
                  >
                    <span>{content?.homeHeroCtaText || "Explore Books Catalog"}</span>
                  </Button>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="pt-8 border-t border-white/10 grid grid-cols-3 gap-4 text-left">
                {trustBadges.map((badge, idx) => (
                  <div key={idx} className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <badge.icon className={`h-4 w-4 ${badge.color}`} />
                      <span className="font-serif font-bold text-sm text-white">{badge.label}</span>
                    </div>
                    <p className="text-[11px] text-white/60 hidden sm:block font-sans">{badge.sub}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right Column: 3D Floating Book Mockup (5 Cols) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-5 flex justify-center"
            >
              <div className="relative w-full max-w-[340px] aspect-[2/3] group">
                {/* Aura Glow */}
                <div className="absolute -inset-4 bg-gradient-to-r from-[#D4AF37]/30 to-emerald-500/30 rounded-3xl blur-2xl opacity-60 group-hover:opacity-100 transition-opacity" />

                {/* 3D Floating Book Cover Card */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl border-2 border-[#D4AF37]/40 bg-[#0C3233]"
                >
                  <Image
                    src={featuredBooks[0]?.coverImage || "/logo.webp"}
                    alt="Featured Harglim Book"
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F3D3E] via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-6 left-6 right-6 space-y-1 text-white">
                    <span className="px-2 py-0.5 rounded bg-[#D4AF37] text-[#0F3D3E] text-[10px] font-bold uppercase tracking-wider">
                      Editor&apos;s Highlight
                    </span>
                    <h3 className="font-serif font-bold text-xl line-clamp-1">
                      {featuredBooks[0]?.title || "The Art of Publishing"}
                    </h3>
                    <p className="text-xs text-white/80">By Harglim Publishers</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 2. FEATURED BOOKS CAROUSEL (Netflix-style horizontal snap scroll) */}
      {/* ------------------------------------------------------------------ */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#D4AF37] mb-1">
              <TrendingUp className="h-4 w-4" />
              <span>Curated Selection</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#0F3D3E]">
              Featured Releases
            </h2>
          </div>
          <Link href="/books" className="hidden sm:flex items-center gap-1 text-sm font-serif font-bold text-[#0F3D3E] hover:text-[#D4AF37]">
            <span>View All Books</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <BookCardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <ErrorState
            title="Could not load books"
            message="We had trouble fetching featured books. Please try again."
            onRetry={fetchBooks}
          />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredBooks.slice(0, 4).map((book) => (
              <BookCard key={book._id || (book as any).id} book={book} />
            ))}
          </div>
        )}
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 3. WHY CHOOSE HARGILM (Glassmorphic Trust Blocks) */}
      {/* ------------------------------------------------------------------ */}
      <section className="py-16 sm:py-20 bg-white border-y border-[#E2E6DF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] block">
              Why Publish With Us
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#0F3D3E]">
              Built for Writers, Loved by Readers
            </h2>
            <p className="text-sm text-[#5C6E6E]">
              We empower authors with complete creative freedom, transparent royalty tracking, and nationwide bookstores distribution.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyChooseBlocks.map((block, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -6 }}
                className="bg-[#F8F9F7] border border-[#E2E6DF] hover:border-[#D4AF37] rounded-2xl p-6 shadow-xs transition-all space-y-4 group"
              >
                <div className="flex items-center justify-between">
                  <div className="h-12 w-12 rounded-xl bg-[#0F3D3E] text-[#D4AF37] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                    <block.icon className="h-6 w-6" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#D4AF37]/20 text-[#0F3D3E]">
                    {block.highlight}
                  </span>
                </div>
                <h3 className="font-serif font-bold text-lg text-[#0F3D3E]">{block.title}</h3>
                <p className="text-xs text-[#5C6E6E] leading-relaxed">{block.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 4. BESTSELLERS / TOP RATED THIS WEEK */}
      {/* ------------------------------------------------------------------ */}
      {bestsellers.length > 0 && (
        <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#D4AF37] mb-1">
                <Star className="h-4 w-4 fill-[#D4AF37]" />
                <span>Reader Favorites</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#0F3D3E]">
                Top Rated This Week
              </h2>
            </div>
            <Link href="/books" className="hidden sm:flex items-center gap-1 text-sm font-serif font-bold text-[#0F3D3E] hover:text-[#D4AF37]">
              <span>Explore Catalog</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestsellers.map((book) => (
              <BookCard key={book._id || (book as any).id} book={book} />
            ))}
          </div>
        </section>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* 5. NEWSLETTER SECTION (Glassmorphic Luxury Subscription Card) */}
      {/* ------------------------------------------------------------------ */}
      <section className="py-16 sm:py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-gradient-to-r from-[#0B2E2F] via-[#0F3D3E] to-[#082223] text-white rounded-3xl p-8 sm:p-12 shadow-2xl border-2 border-[#D4AF37]/40 overflow-hidden text-center space-y-6">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-[#D4AF37] text-[#0F3D3E] mx-auto shadow-md">
            <Mail className="h-7 w-7" />
          </div>

          <div className="max-w-2xl mx-auto space-y-2">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white">
              Stay Connected with Harglim
            </h2>
            <p className="text-sm text-white/80">
              Subscribe to receive exclusive book releases, author interviews, and publishing tips directly in your inbox.
            </p>
          </div>

          <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="email"
                placeholder="Enter your email address..."
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="pl-10 h-12 bg-white text-[#0F3D3E] placeholder:text-gray-400 rounded-xl border-0 font-medium"
                required
              />
            </div>
            <Button
              type="submit"
              disabled={newsletterSubmitting}
              className="h-12 px-6 bg-[#D4AF37] hover:bg-[#C29F2F] text-[#0F3D3E] font-serif font-bold rounded-xl shadow-md gap-2"
            >
              <span>{newsletterSubmitting ? "Subscribing..." : "Subscribe"}</span>
              <Send className="h-4 w-4" />
            </Button>
          </form>

          <p className="text-[11px] text-white/60">
            🔒 No spam. Only valuable updates. Unsubscribe anytime with 1 click.
          </p>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 6. FAQ SECTION (Filterable Accordion with Search) */}
      {/* ------------------------------------------------------------------ */}
      <section className="py-16 sm:py-20 bg-white border-t border-[#E2E6DF]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] block">
              Got Questions?
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#0F3D3E]">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-[#5C6E6E]">
              Everything you need to know about our publishing process, distribution, and royalties.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5C6E6E]" />
            <Input
              type="text"
              placeholder="Search questions (e.g. royalties, publishing, delivery)..."
              value={faqSearch}
              onChange={(e) => setFaqSearch(e.target.value)}
              className="pl-10 h-11 bg-[#F8F9F7] border-[#E2E6DF] rounded-xl text-sm"
            />
          </div>

          {/* Accordion List */}
          <div className="space-y-4 pt-2">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className="border border-[#E2E6DF] rounded-2xl bg-[#F8F9F7] overflow-hidden transition-all"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full p-5 text-left flex items-center justify-between gap-4 font-serif font-bold text-base text-[#0F3D3E] hover:text-[#D4AF37]"
                    >
                      <span>{faq.question}</span>
                      {isOpen ? <ChevronUp className="h-5 w-5 shrink-0 text-[#D4AF37]" /> : <ChevronDown className="h-5 w-5 shrink-0 text-[#5C6E6E]" />}
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="px-5 pb-5 pt-0 text-xs sm:text-sm text-[#5C6E6E] leading-relaxed border-t border-[#E2E6DF]/60 font-sans"
                        >
                          {faq.answer}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })
            ) : (
              <p className="text-center text-xs text-[#5C6E6E] py-8">
                No questions found matching &ldquo;{faqSearch}&rdquo;. Try another search term.
              </p>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}
