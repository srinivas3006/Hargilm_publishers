"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, Users, Globe, Award, ArrowRight, Target, Heart, Sparkles, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const stats = [
  { label: "Books Published", value: "30+", icon: BookOpen },
  { label: "Happy Authors", value: "25+", icon: Users },
  { label: "Countries Reached", value: "5+", icon: Globe },
];

const values = [
  {
    icon: Target,
    title: "Quality Editorial First",
    description: "We maintain strict editorial standards in editing, typography, cover design, and archival printing so every book stands out.",
  },
  {
    icon: Heart,
    title: "Author-Centric Values",
    description: "Our authors retain 100% copyright ownership, receiving transparent monthly royalty settlements and dedicated editorial guidance.",
  },
  {
    icon: Sparkles,
    title: "Modern Print Innovation",
    description: "We leverage print-on-demand technology and digital e-book distribution to reach global reader communities seamlessly.",
  },
];

const team = [
  {
    name: "Sunkarapally Sai Teja",
    role: "Founder & CEO",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-[#F8F9F7] min-h-screen text-[#0F3D3E] font-sans">
      
      {/* 1. HERO SECTION */}
      <section className="relative bg-gradient-to-b from-[#0B2E2F] via-[#0F3D3E] to-[#082223] text-white py-20 md:py-28 overflow-hidden text-center">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-serif font-bold">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Our Publishing Philosophy</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-white tracking-tight">
            About Harglim Publishers
          </h1>

          <p className="text-base sm:text-lg text-white/80 max-w-2xl mx-auto font-light leading-relaxed">
            Founded with a mission to empower authors and delight readers, Harglim Publishers is one of India&apos;s most trusted publishing houses, bringing great stories to the world.
          </p>
        </div>
      </section>

      {/* 2. STATS BAR */}
      <section className="py-12 bg-white border-b border-[#E2E6DF]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {stats.map((stat, idx) => (
              <div key={idx} className="space-y-1">
                <div className="h-12 w-12 rounded-2xl bg-[#0F3D3E] text-[#D4AF37] flex items-center justify-center mx-auto shadow-xs mb-2">
                  <stat.icon className="h-6 w-6" />
                </div>
                <p className="text-3xl sm:text-4xl font-serif font-bold text-[#0F3D3E]">
                  {stat.value}
                </p>
                <p className="text-xs text-[#5C6E6E] font-medium uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. OUR STORY */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] block">
              Empowering Writers Since 2025
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#0F3D3E]">
              Our Story & Mission
            </h2>
            <div className="space-y-4 text-xs sm:text-sm text-[#5C6E6E] leading-relaxed font-sans">
              <p>
                Harglim Publishers was born from a simple yet powerful belief: every aspiring writer deserves an opportunity to become a published author.
              </p>
              <p>
                We recognised that many talented writers, especially first-time authors, struggle to find trustworthy and affordable publishing support. Countless manuscripts remain unpublished because the traditional publishing path often feels confusing, expensive, or out of reach. We provide end-to-end publishing solutions that empower authors to confidently share their work.
              </p>
              <p>
                Today, Harglim Publishers continues to grow as a trusted partner for emerging and established writers alike. Every book we publish represents a dream fulfilled, a voice amplified, and a story brought to life.
              </p>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-xl border-2 border-[#D4AF37]/30">
              <Image
                src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&h=600&fit=crop"
                alt="Harglim Library"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 4. CORE VALUES */}
      <section className="py-16 sm:py-20 bg-white border-y border-[#E2E6DF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] block">
              What Guides Us
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#0F3D3E]">
              Our Core Principles
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((v, idx) => (
              <Card key={idx} className="bg-[#F8F9F7] border border-[#E2E6DF] rounded-2xl p-6 shadow-xs text-center space-y-4">
                <div className="h-14 w-14 rounded-2xl bg-[#0F3D3E] text-[#D4AF37] flex items-center justify-center mx-auto shadow-xs">
                  <v.icon className="h-7 w-7" />
                </div>
                <h3 className="font-serif font-bold text-lg text-[#0F3D3E]">{v.title}</h3>
                <p className="text-xs text-[#5C6E6E] leading-relaxed">{v.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 5. FOUNDER HIGHLIGHT */}
      <section className="py-16 sm:py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] block">
            Leadership
          </span>
          <h2 className="text-3xl font-serif font-bold text-[#0F3D3E]">
            Meet Our Founder
          </h2>
        </div>

        <div className="bg-white border border-[#E2E6DF] rounded-3xl p-8 shadow-xs max-w-md mx-auto space-y-4">
          <div className="relative h-28 w-28 rounded-full overflow-hidden border-4 border-[#0F3D3E] mx-auto shadow-md">
            <Image
              src={team[0].image}
              alt={team[0].name}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h3 className="font-serif font-bold text-xl text-[#0F3D3E]">{team[0].name}</h3>
            <p className="text-xs text-[#D4AF37] font-bold uppercase tracking-wider mt-0.5">{team[0].role}</p>
          </div>
          <p className="text-xs text-[#5C6E6E] leading-relaxed">
            Championing independent authors and building India&apos;s premier literary publishing house.
          </p>
        </div>
      </section>
    </div>
  );
}
