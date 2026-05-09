"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FileText,
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
  Edit2,
  Eye,
  Trash2,
  Search,
  Filter,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import toast from "react-hot-toast";

const manuscripts = [
  {
    id: 1,
    title: "The Future of Artificial Intelligence",
    category: "Technology",
    wordCount: 65000,
    submittedDate: "2024-01-10",
    status: "Under Review",
    progress: 75,
    feedback: null,
  },
  {
    id: 2,
    title: "Leadership Lessons from History",
    category: "Business",
    wordCount: 48000,
    submittedDate: "2024-01-05",
    status: "In Editing",
    progress: 45,
    feedback: "Great content! Minor edits needed in chapters 3-5.",
  },
  {
    id: 3,
    title: "Modern Poetry Collection",
    category: "Literature",
    wordCount: 12000,
    submittedDate: "2023-12-20",
    status: "Approved",
    progress: 100,
    feedback: "Approved for publication. Expected release: Feb 2024.",
  },
  {
    id: 4,
    title: "Investment Strategies for Beginners",
    category: "Finance",
    wordCount: 55000,
    submittedDate: "2023-12-15",
    status: "Revision Required",
    progress: 30,
    feedback: "Please revise chapters 7-9 with more practical examples.",
  },
  {
    id: 5,
    title: "Digital Marketing Handbook",
    category: "Business",
    wordCount: 42000,
    submittedDate: "2024-01-18",
    status: "Submitted",
    progress: 10,
    feedback: null,
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Approved":
      return "bg-emerald-500/10 text-emerald-600";
    case "Under Review":
      return "bg-amber-500/10 text-amber-600";
    case "In Editing":
      return "bg-blue-500/10 text-blue-600";
    case "Revision Required":
      return "bg-red-500/10 text-red-600";
    case "Submitted":
      return "bg-muted text-muted-foreground";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Approved":
      return CheckCircle;
    case "Revision Required":
      return AlertCircle;
    default:
      return Clock;
  }
};

export default function ManuscriptsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [items, setItems] = useState(manuscripts);

  const filteredManuscripts = items.filter((m) => {
    const matchesSearch = m.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || m.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = (id: number) => {
    setItems(items.filter((m) => m.id !== id));
    toast.success("Manuscript deleted");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold lg:text-3xl">Manuscripts</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track your manuscript submissions
          </p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/author/manuscripts/new">
            <Plus className="h-4 w-4" />
            Submit New Manuscript
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{items.length}</p>
                <p className="text-sm text-muted-foreground">Total</p>
              </div>
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">
                  {items.filter((m) => m.status === "Under Review").length}
                </p>
                <p className="text-sm text-muted-foreground">Under Review</p>
              </div>
              <Clock className="h-8 w-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">
                  {items.filter((m) => m.status === "Approved").length}
                </p>
                <p className="text-sm text-muted-foreground">Approved</p>
              </div>
              <CheckCircle className="h-8 w-8 text-emerald-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">
                  {items.filter((m) => m.status === "Revision Required").length}
                </p>
                <p className="text-sm text-muted-foreground">Needs Revision</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search manuscripts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Submitted">Submitted</SelectItem>
                <SelectItem value="Under Review">Under Review</SelectItem>
                <SelectItem value="In Editing">In Editing</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Revision Required">Revision Required</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Manuscripts List */}
      <div className="space-y-4">
        {filteredManuscripts.map((manuscript, index) => {
          const StatusIcon = getStatusIcon(manuscript.status);
          return (
            <motion.div
              key={manuscript.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">
                            {manuscript.title}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline">{manuscript.category}</Badge>
                            <span className="text-sm text-muted-foreground">
                              {manuscript.wordCount.toLocaleString()} words
                            </span>
                          </div>
                        </div>
                        <Badge className={getStatusColor(manuscript.status)}>
                          <StatusIcon className="mr-1 h-3 w-3" />
                          {manuscript.status}
                        </Badge>
                      </div>

                      {/* Progress */}
                      <div>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-muted-foreground">
                            Review Progress
                          </span>
                          <span className="font-medium">{manuscript.progress}%</span>
                        </div>
                        <Progress value={manuscript.progress} className="h-2" />
                      </div>

                      {/* Feedback */}
                      {manuscript.feedback && (
                        <div className="rounded-lg bg-muted/50 p-3">
                          <p className="text-sm font-medium mb-1">Editor Feedback</p>
                          <p className="text-sm text-muted-foreground">
                            {manuscript.feedback}
                          </p>
                        </div>
                      )}

                      <p className="text-sm text-muted-foreground">
                        Submitted on{" "}
                        {new Date(manuscript.submittedDate).toLocaleDateString()}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 lg:flex-col">
                      <Button variant="outline" size="sm" className="gap-2">
                        <Eye className="h-4 w-4" />
                        View
                      </Button>
                      {manuscript.status === "Revision Required" && (
                        <Button size="sm" className="gap-2">
                          <Edit2 className="h-4 w-4" />
                          Revise
                        </Button>
                      )}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-2 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Manuscript?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently
                              delete your manuscript submission.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              onClick={() => handleDelete(manuscript.id)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}

        {filteredManuscripts.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="font-semibold text-lg">No manuscripts found</h3>
              <p className="text-muted-foreground text-center">
                {searchQuery || statusFilter !== "all"
                  ? "Try adjusting your filters"
                  : "Start by submitting your first manuscript"}
              </p>
              <Button asChild className="mt-4">
                <Link href="/author/manuscripts/new">Submit Manuscript</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
