'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import api from '@/lib/api';
import {
  BookOpen,
  Edit,
  Image as ImageIcon,
  Megaphone,
  Truck,
  DollarSign,
  ArrowRight,
  CheckCircle,
  FileText,
  Award,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const services = [
  {
    icon: Edit,
    title: 'Professional Editing',
    description: 'Expert editors polish your manuscript for clarity, grammar, and style.',
    features: ['Copy editing', 'Line editing', 'Proofreading', 'Developmental editing'],
  },
  {
    icon: ImageIcon,
    title: 'Cover Design',
    description: 'Eye-catching cover designs that capture your book&apos;s essence.',
    features: ['Custom illustrations', 'Typography', 'Multiple concepts', 'Print-ready files'],
  },
  {
    icon: FileText,
    title: 'Formatting & Layout',
    description: 'Professional interior design for print and digital formats.',
    features: ['Print formatting', 'Ebook conversion', 'Custom layouts', 'Multiple formats'],
  },
  {
    icon: Megaphone,
    title: 'Marketing & Promotion',
    description: 'Comprehensive marketing to reach your target audience.',
    features: ['Social media campaigns', 'Book launch', 'Press releases', 'Author branding'],
  },
  {
    icon: Truck,
    title: 'Distribution',
    description: 'Get your book into bookstores and online platforms worldwide.',
    features: ['Amazon', 'Flipkart', 'Bookstores', 'International markets'],
  },
  {
    icon: DollarSign,
    title: 'Fair Royalties',
    description: 'Competitive royalty rates with transparent reporting.',
    features: ['Up to 70% royalties', 'Monthly payments', 'Real-time tracking', 'No hidden fees'],
  },
];

const publishingSteps = [
  {
    step: 1,
    title: 'Submit Manuscript',
    description: 'Upload your manuscript and book details through our submission portal.',
  },
  {
    step: 2,
    title: 'Review & Approval',
    description: 'Our editorial team reviews your work and provides feedback within 7 days.',
  },
  {
    step: 3,
    title: 'Editing & Design',
    description: 'Work with our team to perfect your book with professional editing and design.',
  },
  {
    step: 4,
    title: 'Publication & Launch',
    description: 'Your book goes live on all major platforms with a coordinated launch.',
  },
];

export default function PublishPage() {
  const [packages, setPackages] = useState<any[]>([]);
  const [loadingPackages, setLoadingPackages] = useState(true);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const { data } = await api.get('/publish-packages');
        setPackages(data.data || data);
      } catch (error) {
        console.error("Failed to fetch publishing packages:", error);
      } finally {
        setLoadingPackages(false);
      }
    };
    fetchPackages();
  }, []);

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  return (
    <div className="bg-background min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-3xl mx-auto text-center"
          >
            <motion.div variants={fadeInUp} className="mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-sm font-medium backdrop-blur-sm border border-white/20">
                <Award className="h-4 w-4" />
                India&apos;s Most Trusted Publisher
              </span>
            </motion.div>
            <motion.h1
              variants={fadeInUp}
              className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6"
            >
              Publish Your Book <span className="text-secondary">With Us</span>
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-lg md:text-xl text-primary-foreground/90 mb-8"
            >
              Transform your manuscript into a professionally published book. We handle everything
              from editing to distribution, so you can focus on what you do best - writing.
            </motion.p>
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/author/manuscripts/new">
                <Button size="lg" variant="secondary" className="text-base px-8 h-12 font-semibold">
                  Submit Your Manuscript
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="#packages">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-base px-8 h-12 font-semibold bg-transparent border-2 border-white/30 text-white hover:bg-white/10"
                >
                  View Packages
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
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
              How It Works
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our streamlined publishing process makes it easy to bring your book to life
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {publishingSteps.map((step, index) => (
              <motion.div key={index} variants={fadeInUp} className="relative">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold text-xl mb-4">
                    {step.step}
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
                {index < publishingSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-6 left-[60%] w-[80%] h-0.5 bg-border" />
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Services */}
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
              Our Services
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to publish a successful book
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {services.map((service, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-card p-6 rounded-xl border border-border hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <service.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{service.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Packages */}
      <section id="packages" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
              Publishing Packages
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Choose the package that fits your needs and budget
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {loadingPackages ? (
              <div className="col-span-1 md:col-span-3 flex justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
              </div>
            ) : packages.length > 0 ? (
              packages.map((pkg, index) => (
                <motion.div
                  key={pkg.id || pkg._id || index}
                variants={fadeInUp}
                className={`bg-card p-8 rounded-xl border-2 ${
                  pkg.highlighted
                    ? 'border-primary shadow-lg scale-105'
                    : 'border-border'
                }`}
              >
                {pkg.highlighted && (
                  <div className="text-center mb-4">
                    <span className="inline-block px-3 py-1 bg-primary text-primary-foreground text-sm font-medium rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold text-foreground mb-1">{pkg.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{pkg.description}</p>
                  <div className="text-3xl font-bold text-primary">₹{pkg.price?.toLocaleString()}</div>
                </div>
                <ul className="space-y-3 mb-8">
                  {pkg.features?.map((feature: any, idx: number) => (
                    <li key={idx} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link href="/author/manuscripts/new">
                  <Button className="w-full" variant="default" size="lg">
                    Get Started
                  </Button>
                </Link>
              </motion.div>
            ))
          ) : (
            <div className="col-span-1 md:col-span-3 text-center text-muted-foreground">
              No packages available at the moment.
            </div>
          )}
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
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
              What Our Authors Say
            </h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
          >
            {[
              {
                name: 'Priya Sharma',
                book: 'The Midnight Library',
                quote: 'Harglim made my publishing dream a reality. Their team was incredibly supportive!',
                image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
              },
              {
                name: 'Rahul Mehta',
                book: 'Digital Dreams',
                quote: 'Professional editing and beautiful cover design. Exceeded all expectations!',
                image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-card p-6 rounded-xl border border-border"
              >
                <p className="text-muted-foreground italic mb-4">&ldquo;{testimonial.quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
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

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <BookOpen className="h-16 w-16 mx-auto mb-6 text-secondary" />
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">
              Ready to Publish Your Book?
            </h2>
            <p className="text-lg text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              Join hundreds of successful authors who have published with Harglim.
              Your story deserves to be told.
            </p>
            <Link href="/author/manuscripts/new">
              <Button size="lg" variant="secondary" className="text-base px-8 h-12 font-semibold">
                Start Your Publishing Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
