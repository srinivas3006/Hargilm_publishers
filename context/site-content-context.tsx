'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '@/lib/api';

export interface SiteContent {
  // Announcement Bar
  announcementActive: boolean;
  announcementText: string;

  // Home Page
  homeTitle: string;
  homeSubtitle: string;
  homeHeroCtaText: string;
  homeFeaturedTitle: string;
  homeBestsellerTitle: string;
  homeCtaHeading: string;
  homeCtaSubtitle: string;
  homeCtaButtonText: string;

  // Contact Info & Company
  contactPhone: string;
  contactEmail: string;
  contactSupportEmail: string;
  contactAddressLine1: string;
  contactAddressLine2: string;
  contactHours: string;
  socialFacebook: string;
  socialTwitter: string;
  socialInstagram: string;
  socialLinkedin: string;

  // Publish Page
  publishTitle: string;
  publishSubtitle: string;
  packagesJson: string;
  royaltySummary: string;
  authorGuidelinesText: string;

  // About Us & FAQ Pages
  aboutTitle: string;
  aboutSubtitle: string;
  aboutMission: string;
  aboutVision: string;
  faqsJson: string;

  // Admin Profile & Avatar
  adminProfileImage?: string;
}

export const defaultSiteContent: SiteContent = {
  adminProfileImage: "",
  // Announcement Bar
  announcementActive: false,
  announcementText: "",

  // Home Page
  homeTitle: "You write, we print.\nYou dream, we publish",
  homeSubtitle: "Explore inspiring books from talented authors across multiple genres, or publish your own masterpiece with Harglim Publishers. We make reading enjoyable and publishing effortless.",
  homeHeroCtaText: "Browse Books Catalog",
  homeFeaturedTitle: "Featured Masterpieces",
  homeBestsellerTitle: "Popular & Bestselling Books",
  homeCtaHeading: "Ready to Publish Your Masterpiece?",
  homeCtaSubtitle: "Join hundreds of successful authors who brought their stories to life with Harglim Publishers.",
  homeCtaButtonText: "Start Publishing Journey",

  // Contact Info & Company
  contactPhone: "+91 9392346914",
  contactEmail: "harglimpublication@gmail.com",
  contactSupportEmail: "harglim.support@gmail.com",
  contactAddressLine1: "GSP Towers, Beside ESI Hospital Metro Station, Metro pillar no: 1008",
  contactAddressLine2: "Opposite TIMS, 500038, SR Nagar, Hyderabad, Telangana, India.",
  contactHours: "Mon - Sun: 9:00 AM - 10:00 PM",
  socialFacebook: "https://facebook.com/harglimpublishers",
  socialTwitter: "https://twitter.com/harglim",
  socialInstagram: "https://instagram.com/harglimpublishers",
  socialLinkedin: "https://linkedin.com/company/harglim",

  // Publish Page
  publishTitle: "Publish Your Book With Us",
  publishSubtitle: "Transform your manuscript into a professionally published book. We handle everything from editing to distribution, so you can focus on writing.",
  packagesJson: JSON.stringify([
    {
      id: "pkg-999",
      name: "Starter Package",
      tagline: "Essential e-book & digital publishing starter kit",
      price: 999,
      highlighted: false,
      features: [
        "ISBN & Barcode Allocation",
        "Cover Design",
        "Book formatting & Manuscript design",
        "E-book & E-certificate",
        "50% Royalty",
        "Author copies at printing cost (Lifetime)",
        "Book available on Amazon and Kindle",
        "Page limit – 120",
        "Book launch poster",
        "Books will be taken to book fairs under HarGlim (if the author pays for copies)"
      ]
    },
    {
      id: "pkg-1999",
      name: "Standard Package",
      tagline: "Standard paperback publishing with 80% royalty share",
      price: 1999,
      highlighted: false,
      features: [
        "ISBN & Barcode Allocation",
        "Cover Design",
        "Book formatting & Manuscript design",
        "1 Author copy (Paperback)",
        "Certificate",
        "80% Royalty",
        "Author copies at printing cost (Lifetime)",
        "Book available on Amazon and Kindle",
        "Page limit – 120",
        "Book launch poster",
        "Books will be taken to book fairs under HarGlim (if the author pays for copies)"
      ]
    },
    {
      id: "pkg-2999",
      name: "Silver Package",
      tagline: "100% Royalty & global distribution across 12+ platforms",
      price: 2999,
      highlighted: false,
      features: [
        "ISBN & Barcode Allocation",
        "Cover Design",
        "Book formatting & Manuscript design",
        "2 Author copies (Paperback)",
        "Certificate",
        "100% Royalty",
        "Author copies at printing cost (Lifetime)",
        "Book available on Amazon, Kindle, and 12+ International platforms",
        "Page limit – 150",
        "Book launch posters",
        "Books will be taken to book fairs under HarGlim (if the author pays for copies)"
      ]
    },
    {
      id: "pkg-3499",
      name: "Gold Package",
      tagline: "Extended 300 page limit & full global distribution",
      price: 3499,
      highlighted: false,
      features: [
        "ISBN & Barcode Allocation",
        "Cover Design",
        "Book formatting & Manuscript design",
        "2 Author copies (Paperback)",
        "Certificate",
        "100% Royalty",
        "Author copies at printing cost (Lifetime)",
        "Book available on Amazon, Kindle, and 12+ International platforms",
        "Page limit – 300",
        "Book launch posters",
        "Books will be taken to book fairs under HarGlim (if the author pays for copies)"
      ]
    },
    {
      id: "pkg-4999",
      name: "Platinum Bestseller Package",
      tagline: "Full promotional kit with video trailer & author interview",
      price: 4999,
      highlighted: true,
      badge: "Most Popular Choice",
      features: [
        "ISBN & Barcode Allocation",
        "Cover Design",
        "Book formatting & Manuscript design",
        "4 Author copies (Paperback)",
        "Certificate",
        "100% Royalty",
        "Author copies at printing cost (Lifetime)",
        "Book available on Amazon, Kindle, and 12+ International platforms",
        "Page limit – 250",
        "Book launch posters",
        "Books will be taken to book fairs under HarGlim (if the author pays for copies)",
        "Video trailer",
        "Author interview (Recorded video will be sent to the author and posted on our social media)"
      ]
    },
    {
      id: "pkg-9999",
      name: "VIP Executive Mastermind",
      tagline: "Ultimate publishing package with 1-on-1 dedicated guide & custom bookmarks",
      price: 9999,
      highlighted: false,
      features: [
        "ISBN & Barcode Allocation",
        "Cover Design (2 options)",
        "Professional Customised Book formatting & Manuscript design",
        "6 Author copies (Paperback)",
        "Certificate",
        "100% Royalty",
        "Author copies at printing cost (Lifetime)",
        "Book available on Amazon, Kindle, and 12+ International platforms",
        "Page limit – 300",
        "Book launch posters",
        "Books will be taken to book fairs under HarGlim (if the author pays for copies)",
        "Author interview (Recorded video will be sent to the author and posted on our social media)",
        "Bookmarks with book cover image & author's signature (30)",
        "Video trailer",
        "Dedicated project guide assigned (5 sessions, 1 hour each, complete guidance from scratch)"
      ]
    }
  ], null, 2),
  royaltySummary: "Earn up to 70% royalties on every book sold. Transparent monthly reporting and direct payouts.",
  authorGuidelinesText: "We welcome manuscripts across Fiction, Non-Fiction, Poetry, Academic, and Business. Submissions must be original and in MS Word or PDF format.",

  // About Us & FAQ Pages
  aboutTitle: "About Harglim Publishers",
  aboutSubtitle: "Empowering authors and delighting readers worldwide since 2020.",
  aboutMission: "Our mission is to democratize publishing by giving every voice a platform and bringing high-quality literature to readers everywhere.",
  aboutVision: "To become South Asia's premier publishing house recognized for literary excellence, author empowerment, and innovative digital distribution.",
  faqsJson: JSON.stringify([
    {
      question: "How do I submit my manuscript?",
      answer: "You can submit your manuscript through our Publish With Us page or directly email our editorial team at harglimpublication@gmail.com."
    },
    {
      question: "What royalties do authors receive?",
      answer: "Authors earn between 50% to 70% royalties depending on the selected publishing package and sales channel."
    },
    {
      question: "How long does the publishing process take?",
      answer: "Typically 3 to 6 weeks from final manuscript submission to worldwide availability."
    }
  ], null, 2),
};

const STORAGE_KEY = 'harglim_site_content_cache';

interface SiteContentContextType {
  content: SiteContent;
  updateContent: (newContent: Partial<SiteContent>) => Promise<boolean>;
  resetContent: () => void;
  loading: boolean;
}

const SiteContentContext = createContext<SiteContentContextType>({
  content: defaultSiteContent,
  updateContent: async () => false,
  resetContent: () => {},
  loading: false,
});

export function SiteContentProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<SiteContent>(defaultSiteContent);
  const [loading, setLoading] = useState(true);

  // Load content from localStorage & backend on mount
  useEffect(() => {
    const loadContent = async () => {
      try {
        // 1. Try local cache first for instant render
        const cached = localStorage.getItem(STORAGE_KEY);
        if (cached) {
          try {
            const parsed = JSON.parse(cached);
            setContent((prev) => ({ ...prev, ...parsed }));
          } catch (e) {
            console.error('Failed to parse cached site content:', e);
          }
        }

        // 2. Fetch fresh content from backend API if available
        const res = await api.get('/content').catch(() => null);
        if (res?.data) {
          const apiData = res.data.data || res.data;
          if (apiData && typeof apiData === 'object') {
            const merged = { ...defaultSiteContent, ...apiData };
            setContent(merged);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
          }
        }
      } catch (err) {
        console.error('Error fetching global site content:', err);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, []);

  const updateContent = async (newFields: Partial<SiteContent>): Promise<boolean> => {
    const updated = { ...content, ...newFields };
    setContent(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    try {
      await api.put('/admin/content', updated);
      return true;
    } catch (err) {
      console.warn('API update failed, saved to local cache:', err);
      return true; // Saved locally
    }
  };

  const resetContent = () => {
    setContent(defaultSiteContent);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <SiteContentContext.Provider
      value={{
        content,
        updateContent,
        resetContent,
        loading,
      }}
    >
      {children}
    </SiteContentContext.Provider>
  );
}

export function useSiteContent() {
  return useContext(SiteContentContext);
}
