"use client";

import Link from "next/link";
import Image from "next/image";
import logo from "@/public/logo.webp";
import { usePathname } from "next/navigation";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { siteConfig } from "@/config/site";

const footerLinks = {
  company: [
    { label: "About Us", href: "/about" },
    { label: "Our Team", href: "/about#team" },
    { label: "Careers", href: "/careers" },
    { label: "Contact", href: "/contact" },
  ],
  forReaders: [
    { label: "Browse Books", href: "/books" },
    { label: "Categories", href: "/categories" },
    { label: "Bestsellers", href: "/books?sort=bestseller" },
    { label: "New Releases", href: "/books?sort=new" },
  ],
  forAuthors: [
    { label: "Publish with Us", href: "/publish" },
    { label: "Publishing Packages", href: "/publish#packages" },
    { label: "Author Guidelines", href: "/author-guidelines" },
    { label: "Royalty Info", href: "/royalty-info" },
  ],
  support: [
    { label: "FAQ", href: "/faq" },
    { label: "Track Order", href: "/track-order" },
    { label: "Returns Policy", href: "/returns" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy" },
  ],
};

const socialLinks = [
  {
    icon: Facebook,
    href: siteConfig.social.facebook,
    label: "Facebook",
  },
  { icon: Twitter, href: siteConfig.social.twitter, label: "Twitter" },
  {
    icon: Instagram,
    href: siteConfig.social.instagram,
    label: "Instagram",
  },
  {
    icon: Linkedin,
    href: siteConfig.social.linkedin,
    label: "LinkedIn",
  },
];

export function Footer() {
  const pathname = usePathname();
  const isHiddenRoute = 
    pathname?.startsWith('/admin') || 
    pathname?.startsWith('/author') ||
    pathname?.startsWith('/dashboard') ||
    pathname?.startsWith('/login') ||
    pathname?.startsWith('/register');

  if (isHiddenRoute) return null;

  return (
    <footer className="bg-black text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Image
                src={logo}
                alt="Harglim Publishers"
                className="h-10 w-auto object-contain"
              />
              <span className="font-serif text-xl font-bold">
                Harglim Publishers
              </span>
            </Link>
            <p className="text-white/70 mb-4 max-w-sm">
              Empowering authors and delighting readers since 2020. We bring
              stories to life with professional publishing services.
            </p>
            <div className="space-y-2 text-sm text-white/70">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{siteConfig.contact.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>{siteConfig.contact.phonePrimary}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>{siteConfig.contact.email}</span>
              </div>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">For Readers</h4>
            <ul className="space-y-2">
              {footerLinks.forReaders.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">For Authors</h4>
            <ul className="space-y-2">
              {footerLinks.forAuthors.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-sm text-white/70">
              <p>
                &copy; {new Date().getFullYear()} Harglim Publishers. All rights reserved.
              </p>
              <div className="hidden md:block w-1 h-1 rounded-full bg-white/30" />
              <div className="flex items-center gap-4">
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms
                </Link>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/70 hover:text-white transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
