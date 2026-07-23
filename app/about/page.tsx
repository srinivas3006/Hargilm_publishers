'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BookOpen, Users, Globe, Award, ArrowRight, Target, Heart, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const stats = [
  { label: 'Books Published', value: '30+', icon: BookOpen },
  { label: 'Happy Authors', value: '25+', icon: Users },
  { label: 'Countries Reached', value: '5+', icon: Globe },
];

const values = [
  {
    icon: Target,
    title: 'Quality First',
    description: 'We maintain the highest standards in editing, design, and production to ensure every book we publish is of exceptional quality.',
  },
  {
    icon: Heart,
    title: 'Author-Centric',
    description: 'Our authors are our partners. We provide fair royalties, transparent processes, and dedicated support throughout the publishing journey.',
  },
  {
    icon: Sparkles,
    title: 'Innovation',
    description: 'We embrace new technologies and trends in publishing to help our authors reach wider audiences across multiple platforms.',
  },
];

const team = [
  {
    name: 'Sunkarapally Sai Teja',
    role: 'Founder & CEO',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop',
  }
];

export default function AboutPage() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-3xl mx-auto text-center"
          >
            <motion.h1
              variants={fadeInUp}
              className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6"
            >
              About Harglim
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-lg md:text-xl text-primary-foreground/90"
            >
              We are passionate about bringing great stories to the world. Founded with a mission
              to empower authors and delight readers, Harglim has become one of India&apos;s most
              trusted publishing houses.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-background border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div key={index} variants={fadeInUp} className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
                  <stat.icon className="h-7 w-7 text-primary" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-foreground mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center max-w-4xl mx-auto"
          >
            <p className="text-lg md:text-xl text-muted-foreground">
              Harglim Publishers was born from the belief that no dream of becoming an author should be left unrealized. We exist to empower beginner and emerging writers who often face challenges in finding publishing opportunities. By providing professional guidance and end-to-end publishing services, we help transform manuscripts into published books and dreams into reality.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Founded in 2025, Harglim Publishers was born from a simple yet powerful belief: every
                  aspiring author deserves an opportunity to become a published author.
                </p>
                <p>
                  We recognised that many talented writers, especially first-time authors, struggle to find
                  trustworthy and affordable publishing support. Despite having inspiring stories and valuable
                  ideas, countless manuscripts remain unpublished because the path to publishing often feels
                  confusing, expensive, or out of reach. We provide end-to-end publishing solutions that
                  empower authors to confidently share their work with the world.
                </p>
                <p>
                  Today, Harglim Publishers continues to grow as a trusted partner for emerging and established
                  writers alike. Every book we publish represents a dream fulfilled, a voice amplified, and a story
                  brought to life.
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-[4/3] rounded-2xl overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&h=600&fit=crop"
                  alt="Harglim Library"
                  fill
                  className="object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
              Our Values
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do at Harglim
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {values.map((value, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-card p-8 rounded-xl border border-border text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                  <value.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
              Meet Our Founder
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The passionate visionary behind Harglim&apos;s success
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="flex justify-center"
          >
            {team.map((member, index) => (
              <motion.div key={index} variants={fadeInUp} className="text-center">
                <div className="relative w-20 h-20 mx-auto mb-4">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover rounded-full ring-4 ring-muted"
                  />
                </div>
                <h3 className="font-semibold text-foreground">{member.name}</h3>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">
              Ready to Start Your Journey?
            </h2>
            <p className="text-lg text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              Whether you want to publish your book or discover your next favorite read,
              we&apos;re here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/publish">
                <Button size="lg" variant="secondary" className="text-base px-8 h-12 font-semibold">
                  Publish Your Book
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/books">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-base px-8 h-12 font-semibold bg-transparent border-2 border-white/30 text-white hover:bg-white/10"
                >
                  Browse Books
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
