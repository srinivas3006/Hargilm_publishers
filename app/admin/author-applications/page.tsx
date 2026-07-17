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
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchApplications = async () => {
    try {
      setIsLoading(true);
      // Backend expects an admin route to fetch applications
      const { data } = await api.get('/admin/author-applications?status=pending');
      setApplications(data.data || data || []);
    } catch (error) {
      console.error("Failed to fetch applications:", error);
      toast.error("Failed to load applications");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleStatusChange = async (id: string, newStatus: "approved" | "rejected") => {
    try {
      setUpdatingId(id);
      await api.put(`/admin/author-applications/${id}/status`, {
        status: newStatus,
      });
      toast.success(`Application ${newStatus} successfully`);
      // Remove from the pending list
      setApplications(applications.filter(app => app._id !== id));
    } catch (error: any) {
      toast.error(error.response?.data?.message || `Failed to mark as ${newStatus}`);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredApps = applications.filter((app) =>
    app.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.penName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Author Applications</h1>
          <p className="text-muted-foreground">
            Review and approve requests from users who want to become authors.
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="border rounded-md bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Applicant</TableHead>
              <TableHead>Pen Name</TableHead>
              <TableHead className="w-[300px]">Bio & Experience</TableHead>
              <TableHead>Portfolio</TableHead>
              <TableHead>Date</TableHead>
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
                  No pending applications found.
                </TableCell>
              </TableRow>
            ) : (
              filteredApps.map((app) => (
                <TableRow key={app._id}>
                  <TableCell>
                    <div className="font-medium">{app.user?.name}</div>
                    <div className="text-sm text-muted-foreground">{app.user?.email}</div>
                  </TableCell>
                  <TableCell>{app.penName || "-"}</TableCell>
                  <TableCell>
                    <div className="text-sm line-clamp-2" title={app.bio}>
                      <span className="font-semibold">Bio:</span> {app.bio || "None"}
                    </div>
                    <div className="text-sm text-muted-foreground line-clamp-1 mt-1" title={app.experience}>
                      <span className="font-semibold text-foreground/80">Exp:</span> {app.experience || "None"}
                    </div>
                  </TableCell>
                  <TableCell>
                    {app.portfolioUrl ? (
                      <a 
                        href={app.portfolioUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center text-primary hover:underline text-sm"
                      >
                        View Link <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    ) : (
                      <span className="text-muted-foreground text-sm">None</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {new Date(app.createdAt || Date.now()).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200"
                        onClick={() => handleStatusChange(app._id, "approved")}
                        disabled={updatingId === app._id}
                      >
                        {updatingId === app._id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <CheckCircle className="h-4 w-4 mr-1" />
                        )}
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                        onClick={() => handleStatusChange(app._id, "rejected")}
                        disabled={updatingId === app._id}
                      >
                        {updatingId === app._id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <XCircle className="h-4 w-4 mr-1" />
                        )}
                        Reject
                      </Button>
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
