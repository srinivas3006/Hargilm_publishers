"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  BookOpen,
  Users,
  Truck,
  Star,
  ArrowRight,
  Sparkles,
  Award,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BookCard } from "@/components/books/book-card";
import type { Book } from "@/types";
import toast from "react-hot-toast";
import api from "@/lib/api";

// Mock data for demonstration
// TODO: Fetch from backend API
const mockFeaturedBooks: Book[] = [];

const testimonials = [
  {
    name: "Priya Sharma",
    book: "The Forgotten Path",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    quote:
      "Harglim made my dream of becoming an author come true. The team was incredibly supportive throughout the process.",
  },
  {
    name: "Rahul Mehta",
    book: "Digital Dreams",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    quote:
      "Professional team, excellent editing, and beautiful cover design. My book sales exceeded expectations!",
  },
  {
    name: "Anjali Nair",
    book: "Whispers of the Heart",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    quote:
      "The publishing process was smooth and transparent. Highly recommended for first-time authors.",
  },
];

const stats = [
  { label: "Books Published", value: "500+", icon: BookOpen },
  { label: "Happy Authors", value: "200+", icon: Users },
  { label: "Countries Reached", value: "25+", icon: Globe },
  { label: "Awards Won", value: "15+", icon: Award },
];

export default function Home() {
  const [featuredBooks, setFeaturedBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const { data } = await api.get('/books?featured=true&limit=4');
        setFeaturedBooks(data.data || []);
      } catch (error) {
        console.error("Failed to fetch featured books:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-primary/95 to-primary/85 text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/50 to-transparent" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl -ml-48 -mb-48" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 md:py-40 lg:py-48">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-3xl mx-auto text-center"
          >
            <motion.div variants={fadeInUp} className="mb-8">
              <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/15 text-sm font-semibold backdrop-blur-md border border-white/25 shadow-lg">
                <Sparkles className="h-4 w-4" />
                Where Stories Come to Life
              </span>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold mb-8 leading-tight tracking-tight"
            >
              Discover Your Next{" "}
              <span className="text-secondary">Great Read</span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-lg md:text-xl mb-12 text-primary-foreground/95 max-w-2xl mx-auto font-light leading-relaxed"
            >
              Join thousands of readers discovering extraordinary books from
              talented authors worldwide. Publish your story or find your next
              favorite book.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link href="/books">
                <Button
                  size="lg"
                  className="text-base px-10 h-14 font-bold bg-white text-primary hover:bg-primary-foreground shadow-xl hover:shadow-2xl transition-all"
                >
                  Browse Books
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/publish">
                <Button
                  size="lg"
                  className="text-base px-10 h-14 font-bold bg-transparent border-2 border-white/40 text-white hover:bg-white/10 hover:border-white/60 transition-all backdrop-blur-sm shadow-lg"
                >
                  Publish Your Book
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto"
            preserveAspectRatio="none"
          >
            <path
              d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              className="fill-background"
            />
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
                  <stat.icon className="h-7 w-7 text-primary" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-foreground mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-b from-background via-background to-muted/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6">
              Why Choose Harglim?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We provide everything you need for a seamless reading and
              publishing experience
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: BookOpen,
                title: "Wide Selection",
                description:
                  "Thousands of books across multiple genres from talented authors worldwide.",
              },
              {
                icon: Users,
                title: "Support Authors",
                description:
                  "Fair royalties and professional publishing services for aspiring writers.",
              },
              {
                icon: Truck,
                title: "Free Shipping",
                description:
                  "Free delivery on orders over ₹499. Fast and reliable shipping across India.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-gradient-to-br from-card to-card/50 p-8 rounded-2xl border border-border hover:border-primary/50 hover:shadow-2xl transition-all duration-300 group"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 mb-8 group-hover:from-primary/30 group-hover:to-primary/20 transition-all">
                  <feature.icon className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-foreground mb-4">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Books */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="flex flex-col md:flex-row md:items-end md:justify-between mb-16"
          >
            <div>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
                Featured Books
              </h2>
              <p className="text-lg text-muted-foreground max-w-xl">
                Discover our hand-picked selection of must-read books from
                talented authors
              </p>
            </div>
            <Link
              href="/books"
              className="mt-6 md:mt-0 inline-flex items-center gap-2 text-primary font-bold text-lg hover:gap-3 transition-all"
            >
              View All Books <ArrowRight className="h-5 w-5" />
            </Link>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[2/3] bg-muted rounded-lg mb-4" />
                  <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {featuredBooks.map((book) => (
                <motion.div key={book._id} variants={fadeInUp}>
                  <BookCard book={book} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      {/* CTA Section */}
      <section className="py-28 bg-gradient-to-br from-primary via-primary/92 to-primary/88 text-primary-foreground overflow-hidden relative">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/30 rounded-full blur-3xl -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/30 rounded-full blur-3xl -ml-48 -mb-48" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center"
          >
            <h2 className="text-5xl md:text-6xl font-serif font-bold mb-8 leading-tight">
              Ready to Publish Your Book?
            </h2>
            <p className="text-xl text-primary-foreground/95 mb-12 max-w-3xl mx-auto leading-relaxed">
              Join our community of successful authors. Submit your manuscript
              today and reach readers worldwide. We offer professional editing,
              cover design, and marketing support.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/publish">
                <Button
                  size="lg"
                  className="text-lg px-12 h-14 font-bold bg-white text-primary hover:bg-primary-foreground shadow-2xl hover:shadow-3xl transition-all"
                >
                  Start Your Publishing Journey
                  <ArrowRight className="ml-2 h-6 w-6" />
                </Button>
              </Link>
              <Link href="/about">
                <Button
                  size="lg"
                  className="text-lg px-12 h-14 font-bold bg-transparent border-2 border-white/50 text-white hover:bg-white/15 hover:border-white/70 transition-all backdrop-blur-sm"
                >
                  Learn More
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
              What Our Authors Say
            </h2>
            <p className="text-lg text-muted-foreground">
              Success stories from our publishing community
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-gradient-to-br from-card to-card/50 p-8 rounded-2xl border border-border hover:border-primary/50 hover:shadow-2xl transition-all duration-300 group"
              >
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 fill-primary text-primary"
                    />
                  ))}
                </div>
                <p className="text-muted-foreground mb-8 italic text-lg leading-relaxed">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div className="flex items-center gap-4 pt-6 border-t border-border/30">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    width={56}
                    height={56}
                    className="rounded-full object-cover ring-2 ring-primary/20"
                  />
                  <div>
                    <p className="font-semibold text-foreground text-lg">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Author of &ldquo;{testimonial.book}&rdquo;
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="bg-gradient-to-br from-card via-card to-card/50 rounded-3xl border border-border hover:border-primary/50 hover:shadow-2xl transition-all p-10 md:p-16 text-center"
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6">
              Stay Updated
            </h2>
            <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
              Get notified about new releases, author interviews, and
              exclusive offers.
            </p>
            <form 
              className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto"
              onSubmit={(e) => { e.preventDefault(); toast.success('Subscribed successfully!'); }}
            >
              <input
                type="email"
                required
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              />
              <Button
                type="submit"
                size="lg"
                className="px-10 h-12 font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all"
              >
                Subscribe
              </Button>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
