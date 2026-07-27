"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { ErrorState } from "@/components/ui/error-state";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save, Globe } from "lucide-react";
import toast from "react-hot-toast";

// Default fallback content if API is empty
const defaultContent = {
  homeTitle: "You write, we print.\nYou dream, we publish",
  homeSubtitle: "Explore inspiring books from talented authors across multiple genres, or publish your own masterpiece with Harglim Publishers. We make reading enjoyable and publishing effortless.",
  publishTitle: "Publish Your Book With Us",
  publishSubtitle: "Transform your manuscript into a professionally published book. We handle everything from editing to distribution, so you can focus on what you do best - writing.",
  packagesJson: "[\n  {\n    \"name\": \"Basic Package\",\n    \"description\": \"Perfect for first-time authors\",\n    \"price\": 5000,\n    \"features\": [\"Basic Editing\", \"Standard Cover\", \"E-book Formatting\"]\n  }\n]"
};

export default function AdminContentPage() {
  const [content, setContent] = useState(defaultContent);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(false);

  const fetchContent = async () => {
    setLoading(true);
    setError(false);
    try {
      // Assuming your backend has this endpoint to fetch global text content
      const { data } = await api.get("/content");
      if (data && Object.keys(data).length > 0) {
        setContent({
          homeTitle: data.homeTitle || defaultContent.homeTitle,
          homeSubtitle: data.homeSubtitle || defaultContent.homeSubtitle,
          publishTitle: data.publishTitle || defaultContent.publishTitle,
          publishSubtitle: data.publishSubtitle || defaultContent.publishSubtitle,
          packagesJson: data.packagesJson || defaultContent.packagesJson,
        });
      }
    } catch (err: any) {
      // If endpoint doesn't exist yet (404), we just use defaults. 
      // If it's another error, we might log it.
      if (err.response?.status !== 404) {
        console.error("Failed to fetch site content:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const handleSave = async () => {
    // Validate JSON before saving
    try {
      JSON.parse(content.packagesJson);
    } catch (e) {
      toast.error("Invalid JSON format in Packages field. Please check your syntax.");
      return;
    }

    setIsSaving(true);
    try {
      await api.put("/admin/content", content);
      toast.success("Site content updated successfully! Changes are live globally.");
    } catch (err) {
      console.error("Failed to update content:", err);
      toast.error("Failed to update site content.");
    } finally {
      setIsSaving(false);
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold lg:text-3xl flex items-center gap-2">
            <Globe className="h-6 w-6 text-primary" />
            Global Site Content
          </h1>
          <p className="text-muted-foreground mt-1">
            Edit text across the website. Click save to publish changes instantly.
          </p>
        </div>
        <Button onClick={handleSave} disabled={isSaving} size="lg" className="gap-2">
          <Save className="h-5 w-5" />
          {isSaving ? "Saving..." : "Save All Changes"}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Home Page Content</CardTitle>
            <CardDescription>Main text displayed on the landing page.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="homeTitle">Hero Title</Label>
              <Textarea
                id="homeTitle"
                rows={2}
                value={content.homeTitle}
                onChange={(e) => setContent({ ...content, homeTitle: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="homeSubtitle">Hero Subtitle</Label>
              <Textarea
                id="homeSubtitle"
                rows={3}
                value={content.homeSubtitle}
                onChange={(e) => setContent({ ...content, homeSubtitle: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Publish With Us Page</CardTitle>
            <CardDescription>Hero text and packages displayed on the Publish page.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="publishTitle">Publish Hero Title</Label>
              <Input
                id="publishTitle"
                value={content.publishTitle}
                onChange={(e) => setContent({ ...content, publishTitle: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="publishSubtitle">Publish Hero Subtitle</Label>
              <Textarea
                id="publishSubtitle"
                rows={3}
                value={content.publishSubtitle}
                onChange={(e) => setContent({ ...content, publishSubtitle: e.target.value })}
              />
            </div>
            <div className="space-y-2 pt-4">
              <Label htmlFor="packagesJson">Publishing Packages (JSON Format)</Label>
              <p className="text-xs text-muted-foreground mb-2">
                Edit the array of packages below. Make sure it is valid JSON.
              </p>
              <Textarea
                id="packagesJson"
                rows={12}
                className="font-mono text-sm"
                value={content.packagesJson}
                onChange={(e) => setContent({ ...content, packagesJson: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
