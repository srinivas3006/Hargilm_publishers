"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, CheckCircle, XCircle, ExternalLink, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/api";
import toast from "react-hot-toast";

interface Application {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  penName?: string;
  bio?: string;
  portfolioUrl?: string;
  experience?: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

export default function AuthorApplicationsPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchApplications = async () => {
    try {
      setIsLoading(true);
      const queryParam = statusFilter === "all" ? "" : `?status=${statusFilter}`;
      const { data } = await api.get(`/admin/author-applications${queryParam}`);
      const appsList = data.data || data || [];
      setApplications(Array.isArray(appsList) ? appsList : []);
    } catch (error) {
      console.error("Failed to fetch applications:", error);
      toast.error("Failed to load applications");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [statusFilter]);

  const handleStatusChange = async (id: string, newStatus: "approved" | "rejected") => {
    try {
      setUpdatingId(id);
      await api.put(`/admin/author-applications/${id}/status`, {
        status: newStatus,
      });
      toast.success(`Application ${newStatus} successfully`);
      fetchApplications();
    } catch (error: any) {
      toast.error(error.response?.data?.message || `Failed to mark as ${newStatus}`);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredApps = applications.filter((app: any) => {
    const fullName = app.fullName || app.user?.name || app.penName || "";
    const email = app.email || app.user?.email || "";
    const phone = app.phone || app.user?.phone || app.phoneNumber || "";
    const matchesSearch =
      fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      phone.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || app.status?.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-200">Approved</Badge>;
      case "rejected":
        return <Badge className="bg-red-500/10 text-red-600 border-red-200">Rejected</Badge>;
      default:
        return <Badge className="bg-amber-500/10 text-amber-600 border-amber-200">Pending</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Author Applications</h1>
          <p className="text-muted-foreground">
            Review and manage requests from users who want to become authors.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or phone..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 bg-muted p-1 rounded-xl border border-border">
          {(["pending", "approved", "rejected", "all"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all ${
                statusFilter === status
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="border rounded-md bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Full Name</TableHead>
              <TableHead>Email Address</TableHead>
              <TableHead>Phone Number</TableHead>
              <TableHead>Applied Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                </TableCell>
              </TableRow>
            ) : filteredApps.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No author applications found under &quot;{statusFilter}&quot;.
                </TableCell>
              </TableRow>
            ) : (
              filteredApps.map((app: any) => (
                <TableRow key={app._id || app.id}>
                  <TableCell>
                    <div className="font-semibold text-foreground">
                      {app.fullName || app.user?.name || app.penName || "N/A"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm font-medium text-foreground">
                      {app.email || app.user?.email || "N/A"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-foreground">
                      {app.phone || app.user?.phone || app.phoneNumber || "Not provided"}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : "Recently"}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(app.status)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {app.status?.toLowerCase() !== "approved" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200 font-medium"
                          onClick={() => handleStatusChange(app._id || app.id, "approved")}
                          disabled={updatingId === (app._id || app.id)}
                        >
                          {updatingId === (app._id || app.id) ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <CheckCircle className="h-4 w-4 mr-1" />
                          )}
                          Approve
                        </Button>
                      )}
                      {app.status?.toLowerCase() !== "rejected" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 font-medium"
                          onClick={() => handleStatusChange(app._id || app.id, "rejected")}
                          disabled={updatingId === (app._id || app.id)}
                        >
                          {updatingId === (app._id || app.id) ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <XCircle className="h-4 w-4 mr-1" />
                          )}
                          Reject
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
