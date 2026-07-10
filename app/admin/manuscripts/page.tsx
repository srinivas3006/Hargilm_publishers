"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import api from "@/lib/api";
import { ErrorState } from "@/components/ui/error-state";
import {
  FileText,
  Search,
  Filter,
  MoreVertical,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Download,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import toast from "react-hot-toast";
import Link from "next/link";

const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case "approved":
    case "published":
      return "bg-emerald-500/10 text-emerald-600";
    case "pending":
    case "under_review":
      return "bg-amber-500/10 text-amber-600";
    case "rejected":
      return "bg-red-500/10 text-red-600";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const getStatusIcon = (status: string) => {
  switch (status?.toLowerCase()) {
    case "approved":
    case "published":
      return CheckCircle;
    case "pending":
    case "under_review":
      return Clock;
    case "rejected":
      return XCircle;
    default:
      return FileText;
  }
};

export default function AdminManuscriptsPage() {
  const [manuscripts, setManuscripts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchManuscripts = async () => {
    setLoading(true);
    setError(false);
    try {
      const { data } = await api.get("/admin/publish-requests");
      setManuscripts(data.data || data);
    } catch (err) {
      console.error("Failed to fetch admin manuscripts:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchManuscripts();
  }, []);

  const filteredManuscripts = manuscripts.filter((manuscript: any) => {
    const title = manuscript.title || "";
    const author = manuscript.authorName || manuscript.author?.name || "";
    const matchesSearch =
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || manuscript.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await api.put(`/admin/publish-requests/${id}/status`, { status: newStatus });
      setManuscripts(
        manuscripts.map((m: any) => ((m.id || m._id) === id ? { ...m, status: newStatus } : m))
      );
      toast.success(`Manuscript status updated to ${newStatus}`);
    } catch (err) {
      console.error("Failed to update manuscript status:", err);
      toast.error("Failed to update manuscript status");
    }
  };

  if (error) {
    return (
      <ErrorState
        title="Could not load manuscripts"
        message="We encountered an issue fetching the publish requests list. Please try again."
        onRetry={fetchManuscripts}
      />
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold lg:text-3xl">Manuscripts</h1>
          <p className="text-muted-foreground mt-1">
            Review and manage author publish requests
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by title or author..."
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
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="under_review">Under Review</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Manuscripts Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Package</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredManuscripts.length > 0 ? (
                  filteredManuscripts.map((manuscript: any, index: number) => {
                    const StatusIcon = getStatusIcon(manuscript.status);
                    return (
                      <motion.tr
                        key={manuscript.id || manuscript._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b"
                      >
                        <TableCell className="font-medium">
                          {manuscript.title}
                        </TableCell>
                        <TableCell>
                          {manuscript.authorName || manuscript.author?.name || "Unknown"}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{manuscript.category || "Uncategorized"}</Badge>
                        </TableCell>
                        <TableCell>
                          {manuscript.package?.name || manuscript.packageId || "None"}
                        </TableCell>
                        <TableCell>
                          {new Date(manuscript.createdAt || manuscript.submittedDate || Date.now()).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Badge className={`gap-1 ${getStatusColor(manuscript.status)}`}>
                            <StatusIcon className="h-3 w-3" />
                            {manuscript.status || "Pending"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {manuscript.documentUrl && (
                                <DropdownMenuItem asChild>
                                  <a href={manuscript.documentUrl} target="_blank" rel="noopener noreferrer">
                                    <Download className="mr-2 h-4 w-4" />
                                    Download Manuscript
                                  </a>
                                </DropdownMenuItem>
                              )}
                              {manuscript.status === "pending" && (
                                <DropdownMenuItem
                                  onClick={() => updateStatus(manuscript.id || manuscript._id, "under_review")}
                                >
                                  <Clock className="mr-2 h-4 w-4" />
                                  Mark Under Review
                                </DropdownMenuItem>
                              )}
                              {(manuscript.status === "pending" || manuscript.status === "under_review") && (
                                <>
                                  <DropdownMenuItem
                                    onClick={() => updateStatus(manuscript.id || manuscript._id, "approved")}
                                  >
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Approve Request
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="text-destructive"
                                    onClick={() => updateStatus(manuscript.id || manuscript._id, "rejected")}
                                  >
                                    <XCircle className="mr-2 h-4 w-4" />
                                    Reject Request
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </motion.tr>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                      No manuscripts found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
