"use client";

import { useState, useEffect } from "react";
import { useSiteContent, SiteContent, defaultSiteContent } from "@/context/site-content-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Globe,
  Save,
  RotateCcw,
  Home,
  Building2,
  BookOpen,
  HelpCircle,
  Megaphone,
  Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";

export default function AdminContentPage() {
  const { content: globalContent, updateContent, resetContent, loading } = useSiteContent();
  const [formData, setFormData] = useState<SiteContent>(globalContent);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"home" | "contact" | "publish" | "about">("home");

  useEffect(() => {
    if (globalContent) {
      setFormData(globalContent);
    }
  }, [globalContent]);

  const handleSave = async () => {
    // Validate Packages JSON
    try {
      if (formData.packagesJson) {
        JSON.parse(formData.packagesJson);
      }
    } catch (e) {
      toast.error("Invalid JSON in Publishing Packages. Check your syntax.");
      return;
    }

    // Validate FAQs JSON
    try {
      if (formData.faqsJson) {
        JSON.parse(formData.faqsJson);
      }
    } catch (e) {
      toast.error("Invalid JSON in FAQ section. Check your syntax.");
      return;
    }

    setIsSaving(true);
    try {
      await updateContent(formData);
      toast.success("Site content saved & updated live globally!");
    } catch (err) {
      console.error("Failed to update site content:", err);
      toast.error("Failed to save site content.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all site content to defaults?")) {
      resetContent();
      setFormData(defaultSiteContent);
      toast.success("Site content reset to original defaults.");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card p-6 rounded-2xl border border-border shadow-xs">
        <div>
          <h1 className="text-2xl font-bold lg:text-3xl flex items-center gap-2 text-foreground font-serif">
            <Globe className="h-7 w-7 text-primary" />
            Global Site Content Editor
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Edit text across the website. Click save to publish changes live instantly.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleReset} size="sm" className="gap-1.5 text-xs">
            <RotateCcw className="h-4 w-4" />
            Reset Defaults
          </Button>
          <Button onClick={handleSave} disabled={isSaving} className="gap-2 bg-primary text-primary-foreground font-bold shadow-md">
            <Save className="h-4 w-4" />
            {isSaving ? "Publishing..." : "Save All Changes"}
          </Button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-border gap-2 sm:gap-6 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab("home")}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
            activeTab === "home"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Home className="h-4 w-4" />
          <span>Home & Announcement</span>
        </button>

        <button
          onClick={() => setActiveTab("contact")}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
            activeTab === "contact"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Building2 className="h-4 w-4" />
          <span>Contact & Company</span>
        </button>

        <button
          onClick={() => setActiveTab("publish")}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
            activeTab === "publish"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <BookOpen className="h-4 w-4" />
          <span>Publish & Guidelines</span>
        </button>

        <button
          onClick={() => setActiveTab("about")}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
            activeTab === "about"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <HelpCircle className="h-4 w-4" />
          <span>About Us & FAQs</span>
        </button>
      </div>

      {/* TAB CONTENT */}

      {/* ---------------- TAB 1: HOME & ANNOUNCEMENT ---------------- */}
      {activeTab === "home" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Megaphone className="h-5 w-5 text-primary" />
                Global Top Announcement Bar
              </CardTitle>
              <CardDescription>
                Promotional banner text displayed across the website header.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/40">
                <Label htmlFor="announcementActive" className="cursor-pointer font-medium">
                  Enable Announcement Banner
                </Label>
                <Switch
                  id="announcementActive"
                  checked={formData.announcementActive}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, announcementActive: checked })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="announcementText">Announcement Message</Label>
                <Input
                  id="announcementText"
                  value={formData.announcementText}
                  onChange={(e) =>
                    setFormData({ ...formData, announcementText: e.target.value })
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Home Hero Section</CardTitle>
              <CardDescription>Main title and call to action on the landing page.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="homeTitle">Hero Title</Label>
                <Textarea
                  id="homeTitle"
                  rows={2}
                  value={formData.homeTitle}
                  onChange={(e) => setFormData({ ...formData, homeTitle: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="homeSubtitle">Hero Subtitle</Label>
                <Textarea
                  id="homeSubtitle"
                  rows={3}
                  value={formData.homeSubtitle}
                  onChange={(e) => setFormData({ ...formData, homeSubtitle: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="homeHeroCtaText">Hero Catalog CTA Button Text</Label>
                <Input
                  id="homeHeroCtaText"
                  value={formData.homeHeroCtaText}
                  onChange={(e) => setFormData({ ...formData, homeHeroCtaText: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Section Titles & Banners</CardTitle>
              <CardDescription>Custom headings for bookstore sections.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="homeFeaturedTitle">Featured Section Heading</Label>
                  <Input
                    id="homeFeaturedTitle"
                    value={formData.homeFeaturedTitle}
                    onChange={(e) => setFormData({ ...formData, homeFeaturedTitle: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="homeBestsellerTitle">Bestsellers Section Heading</Label>
                  <Input
                    id="homeBestsellerTitle"
                    value={formData.homeBestsellerTitle}
                    onChange={(e) => setFormData({ ...formData, homeBestsellerTitle: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-border">
                <Label htmlFor="homeCtaHeading">Bottom Banner Heading</Label>
                <Input
                  id="homeCtaHeading"
                  value={formData.homeCtaHeading}
                  onChange={(e) => setFormData({ ...formData, homeCtaHeading: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="homeCtaSubtitle">Bottom Banner Subtitle</Label>
                <Input
                  id="homeCtaSubtitle"
                  value={formData.homeCtaSubtitle}
                  onChange={(e) => setFormData({ ...formData, homeCtaSubtitle: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="homeCtaButtonText">Bottom Banner Button Text</Label>
                <Input
                  id="homeCtaButtonText"
                  value={formData.homeCtaButtonText}
                  onChange={(e) => setFormData({ ...formData, homeCtaButtonText: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ---------------- TAB 2: CONTACT & COMPANY ---------------- */}
      {activeTab === "contact" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contact Information</CardTitle>
              <CardDescription>Primary company contact details shown on the Contact page & Footer.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Primary Phone Number</Label>
                  <Input
                    id="contactPhone"
                    value={formData.contactPhone}
                    onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactHours">Working Hours</Label>
                  <Input
                    id="contactHours"
                    value={formData.contactHours}
                    onChange={(e) => setFormData({ ...formData, contactHours: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">General Email</Label>
                  <Input
                    id="contactEmail"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactSupportEmail">Support Email</Label>
                  <Input
                    id="contactSupportEmail"
                    value={formData.contactSupportEmail}
                    onChange={(e) => setFormData({ ...formData, contactSupportEmail: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactAddressLine1">Address Line 1</Label>
                <Input
                  id="contactAddressLine1"
                  value={formData.contactAddressLine1}
                  onChange={(e) => setFormData({ ...formData, contactAddressLine1: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactAddressLine2">Address Line 2</Label>
                <Input
                  id="contactAddressLine2"
                  value={formData.contactAddressLine2}
                  onChange={(e) => setFormData({ ...formData, contactAddressLine2: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Social Media Links</CardTitle>
              <CardDescription>Social media profile URLs.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="socialFacebook">Facebook URL</Label>
                  <Input
                    id="socialFacebook"
                    value={formData.socialFacebook}
                    onChange={(e) => setFormData({ ...formData, socialFacebook: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="socialTwitter">Twitter / X URL</Label>
                  <Input
                    id="socialTwitter"
                    value={formData.socialTwitter}
                    onChange={(e) => setFormData({ ...formData, socialTwitter: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="socialInstagram">Instagram URL</Label>
                  <Input
                    id="socialInstagram"
                    value={formData.socialInstagram}
                    onChange={(e) => setFormData({ ...formData, socialInstagram: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="socialLinkedin">LinkedIn URL</Label>
                  <Input
                    id="socialLinkedin"
                    value={formData.socialLinkedin}
                    onChange={(e) => setFormData({ ...formData, socialLinkedin: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ---------------- TAB 3: PUBLISH & GUIDELINES ---------------- */}
      {activeTab === "publish" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Publish With Us Header</CardTitle>
              <CardDescription>Hero text on the Publish page.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="publishTitle">Publish Hero Title</Label>
                <Input
                  id="publishTitle"
                  value={formData.publishTitle}
                  onChange={(e) => setFormData({ ...formData, publishTitle: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="publishSubtitle">Publish Hero Subtitle</Label>
                <Textarea
                  id="publishSubtitle"
                  rows={2}
                  value={formData.publishSubtitle}
                  onChange={(e) => setFormData({ ...formData, publishSubtitle: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Publishing Packages (JSON Format)</CardTitle>
              <CardDescription>Configure packages displayed on the Publish page.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Textarea
                  id="packagesJson"
                  rows={10}
                  className="font-mono text-xs bg-muted/30"
                  value={formData.packagesJson}
                  onChange={(e) => setFormData({ ...formData, packagesJson: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Author Guidelines & Royalties</CardTitle>
              <CardDescription>Summary text on royalty info and manuscript guidelines.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="royaltySummary">Royalty Policy Summary</Label>
                <Textarea
                  id="royaltySummary"
                  rows={2}
                  value={formData.royaltySummary}
                  onChange={(e) => setFormData({ ...formData, royaltySummary: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="authorGuidelinesText">Author Submission Guidelines</Label>
                <Textarea
                  id="authorGuidelinesText"
                  rows={3}
                  value={formData.authorGuidelinesText}
                  onChange={(e) => setFormData({ ...formData, authorGuidelinesText: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ---------------- TAB 4: ABOUT US & FAQS ---------------- */}
      {activeTab === "about" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">About Us Content</CardTitle>
              <CardDescription>Main title, mission, and vision on the About page.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="aboutTitle">About Page Title</Label>
                <Input
                  id="aboutTitle"
                  value={formData.aboutTitle}
                  onChange={(e) => setFormData({ ...formData, aboutTitle: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="aboutSubtitle">Tagline / Subtitle</Label>
                <Input
                  id="aboutSubtitle"
                  value={formData.aboutSubtitle}
                  onChange={(e) => setFormData({ ...formData, aboutSubtitle: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="aboutMission">Mission Statement</Label>
                <Textarea
                  id="aboutMission"
                  rows={3}
                  value={formData.aboutMission}
                  onChange={(e) => setFormData({ ...formData, aboutMission: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="aboutVision">Vision Statement</Label>
                <Textarea
                  id="aboutVision"
                  rows={3}
                  value={formData.aboutVision}
                  onChange={(e) => setFormData({ ...formData, aboutVision: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Frequently Asked Questions (JSON Format)</CardTitle>
              <CardDescription>JSON array of questions and answers for the FAQ page.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Textarea
                  id="faqsJson"
                  rows={10}
                  className="font-mono text-xs bg-muted/30"
                  value={formData.faqsJson}
                  onChange={(e) => setFormData({ ...formData, faqsJson: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

