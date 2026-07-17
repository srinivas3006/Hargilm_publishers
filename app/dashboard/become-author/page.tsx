"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BookOpen, Link as LinkIcon, PenTool, CheckCircle2, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuthStore } from "@/store/auth-store";
import toast from "react-hot-toast";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

export default function BecomeAuthorPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState<"none" | "pending" | "approved" | "rejected">("none");
  const [isLoadingStatus, setIsLoadingStatus] = useState(true);

  const [formData, setFormData] = useState({
    penName: "",
    bio: "",
    portfolioUrl: "",
    experience: "",
  });

  // Check if they already have an application
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const { data } = await api.get('/users/me/author-application');
        if (data && data.application) {
          setApplicationStatus(data.application.status);
        }
      } catch (error) {
        // If 404 or similar, it means no application exists yet
      } finally {
        setIsLoadingStatus(false);
      }
    };
    checkStatus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await api.post('/author-applications', {
        penName: formData.penName,
        bio: formData.bio,
        portfolioUrl: formData.portfolioUrl,
        experience: formData.experience,
      });

      toast.success("Application submitted successfully! We will review it shortly.");
      setApplicationStatus("pending");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to submit application.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingStatus) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If already an author or application approved
  if (user?.role === "author" || applicationStatus === "approved") {
    return (
      <div className="max-w-2xl mx-auto mt-12 text-center">
        <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h1 className="text-3xl font-serif font-bold text-foreground mb-4">You are already an Author!</h1>
        <p className="text-muted-foreground mb-8">
          Congratulations! You have full access to the author dashboard and publishing tools.
        </p>
        <Button onClick={() => router.push("/author")}>
          Go to Author Dashboard
        </Button>
      </div>
    );
  }

  // If application is pending
  if (applicationStatus === "pending") {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto mt-12 bg-card border border-border p-8 rounded-2xl shadow-sm text-center"
      >
        <div className="mx-auto w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
          <BookOpen className="h-8 w-8" />
        </div>
        <h1 className="text-3xl font-serif font-bold text-foreground mb-4">Application Under Review</h1>
        <p className="text-muted-foreground mb-6">
          Thank you for applying to become an author at Harglim Publishers. Our administrative team is currently reviewing your application. You will be notified once a decision is made.
        </p>
        <Button variant="outline" onClick={() => router.push("/dashboard")}>
          Return to Dashboard
        </Button>
      </motion.div>
    );
  }

  // Application Form
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-foreground mb-2">Become an Author</h1>
        <p className="text-muted-foreground">
          Join our community of talented writers. Share your stories with the world and earn royalties.
          Please fill out the application below. All fields are optional, but we encourage you to provide your best work!
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border/50 rounded-2xl shadow-sm overflow-hidden"
      >
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="penName">Pen Name (Optional)</Label>
            <div className="relative">
              <UserCircle className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                id="penName"
                placeholder="How you want to be known"
                className="pl-10"
                value={formData.penName}
                onChange={(e) => setFormData({ ...formData, penName: e.target.value })}
              />
            </div>
            <p className="text-xs text-muted-foreground">Leave blank to use your real name.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Author Bio (Optional)</Label>
            <Textarea
              id="bio"
              placeholder="Tell us a little about yourself, your writing style, and the genres you love."
              className="min-h-[100px] resize-none"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="portfolioUrl">Writing Sample / Portfolio Link (Optional)</Label>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                id="portfolioUrl"
                type="url"
                placeholder="https://your-website.com or Google Docs link"
                className="pl-10"
                value={formData.portfolioUrl}
                onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
              />
            </div>
            <p className="text-xs text-muted-foreground">Link to your best piece of writing.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="experience">Previous Experience (Optional)</Label>
            <Textarea
              id="experience"
              placeholder="Have you published anything before? If so, tell us where!"
              className="min-h-[80px] resize-none"
              value={formData.experience}
              onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
            />
          </div>

          <div className="pt-4 border-t border-border/30">
            <Button
              type="submit"
              className="w-full sm:w-auto px-8"
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Submitting Application...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <PenTool className="h-4 w-4" />
                  Submit Application
                </span>
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
