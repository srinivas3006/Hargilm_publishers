"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DollarSign, RefreshCw, X, Plus, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import api from "@/lib/api";
import toast from "react-hot-toast";

export default function AdminSettlementsPage() {
  const [settlements, setSettlements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"settlements" | "preview">("settlements");

  // Preview State
  const [authorId, setAuthorId] = useState("");
  const [previewData, setPreviewData] = useState<any>(null);
  const [previewing, setPreviewing] = useState(false);

  // Mark Paid Modal State
  const [selectedSettlement, setSelectedSettlement] = useState<any>(null);
  const [payoutForm, setPayoutForm] = useState({
    paymentMethod: "bank_transfer",
    transactionReference: "",
    notes: "External bank payout transfer completed.",
    paidAt: new Date().toISOString().split("T")[0],
  });
  const [submittingPayout, setSubmittingPayout] = useState(false);

  // Load Settlements
  const loadSettlements = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/royalty-settlements");
      const list = data?.data || data || [];
      setSettlements(Array.isArray(list) ? list : []);
    } catch (err: any) {
      console.warn("Failed to load settlements:", err);
      toast.error("Failed to load royalty settlements.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettlements();
  }, []);

  // Handle Settlement Batch Preview
  const handlePreview = async (e: React.FormEvent) => {
    e.preventDefault();
    setPreviewing(true);
    try {
      const { data } = await api.post("/admin/royalty-settlements/preview", {
        ...(authorId ? { authorId } : {}),
      });
      setPreviewData(data?.data || data);
      toast.success("Preview candidate royalties loaded.");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to generate settlement preview.");
    } finally {
      setPreviewing(false);
    }
  };

  // Handle Create Draft Batch
  const handleCreateDraftBatch = async (authorTargetId?: string) => {
    try {
      await api.post("/admin/royalty-settlements", {
        ...(authorTargetId || authorId ? { authorId: authorTargetId || authorId } : {}),
      });
      toast.success("Draft settlement batch created!");
      setActiveTab("settlements");
      loadSettlements();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to create draft settlement batch.");
    }
  };

  // Handle Approve Batch
  const handleApproveBatch = async (id: string) => {
    try {
      await api.post(`/admin/royalty-settlements/${id}/approve`);
      toast.success("Settlement batch approved!");
      loadSettlements();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to approve settlement batch.");
    }
  };

  // Handle Mark Paid Submit
  const handleMarkPaidSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!payoutForm.transactionReference.trim()) {
      toast.error("Please enter a transaction reference number.");
      return;
    }

    const id = selectedSettlement?._id || selectedSettlement?.id;
    setSubmittingPayout(true);
    try {
      await api.post(`/admin/royalty-settlements/${id}/mark-paid`, payoutForm);
      toast.success("Manual payout recorded successfully!");
      setSelectedSettlement(null);
      loadSettlements();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to record manual payout.");
    } finally {
      setSubmittingPayout(false);
    }
  };

  // Handle Cancel Batch
  const handleCancelBatch = async (id: string) => {
    try {
      await api.post(`/admin/royalty-settlements/${id}/cancel`, {
        reason: "Cancelled by Admin",
      });
      toast.success("Settlement batch cancelled.");
      loadSettlements();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to cancel settlement batch.");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toUpperCase()) {
      case "DRAFT":
        return <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20">Draft</Badge>;
      case "APPROVED":
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/20">Approved (Payment Pending)</Badge>;
      case "PAID":
        return <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">Paid Out</Badge>;
      case "CANCELLED":
        return <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-foreground">
            Royalty Settlement Accounting
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Preview, create, approve, and record manual external payouts for author royalties.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={activeTab === "settlements" ? "default" : "outline"}
            onClick={() => setActiveTab("settlements")}
            size="sm"
          >
            All Settlements
          </Button>
          <Button
            variant={activeTab === "preview" ? "default" : "outline"}
            onClick={() => setActiveTab("preview")}
            size="sm"
            className="gap-1.5"
          >
            <Plus className="h-4 w-4" />
            <span>Preview & Create</span>
          </Button>
          <Button variant="ghost" size="icon" onClick={loadSettlements} title="Refresh">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {activeTab === "preview" ? (
        <Card className="border border-border/80 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Preview & Create Settlement Batch</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handlePreview} className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 space-y-1">
                <Label htmlFor="authorId" className="text-xs font-semibold text-muted-foreground uppercase">
                  Author ID (Optional)
                </Label>
                <Input
                  id="authorId"
                  placeholder="Leave empty for all eligible authors or enter specific Author ID"
                  value={authorId}
                  onChange={(e) => setAuthorId(e.target.value)}
                />
              </div>
              <Button type="submit" disabled={previewing} className="sm:self-end h-10">
                {previewing ? "Generating..." : "Generate Preview"}
              </Button>
            </form>

            {previewData && (
              <div className="space-y-4 pt-4 border-t border-border">
                <div className="flex items-center justify-between p-4 rounded-xl bg-muted/40 border border-border">
                  <div>
                    <h4 className="font-bold text-foreground">Candidate Royalty Preview Summary</h4>
                    <p className="text-xs text-muted-foreground">
                      Total Eligible Claims: {previewData.totalClaims || previewData.claims?.length || 0}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
                      ₹{(previewData.totalAmount || previewData.amount || 0).toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">Total Payable Amount</p>
                  </div>
                </div>

                <Button onClick={() => handleCreateDraftBatch()} className="w-full h-11 font-medium gap-2">
                  <Send className="h-4 w-4" />
                  <span>Create Draft Settlement Batch</span>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card className="border border-border/80 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Settlement Batches</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-12 flex justify-center">
                <RefreshCw className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : settlements.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground text-sm space-y-2">
                <DollarSign className="h-8 w-8 mx-auto text-muted-foreground/40" />
                <p>No royalty settlement batches created yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-muted/50 text-xs font-semibold text-muted-foreground uppercase border-b">
                    <tr>
                      <th className="py-3 px-4">Settlement ID</th>
                      <th className="py-3 px-4">Author</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Created Date</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y border-b">
                    {settlements.map((item) => (
                      <tr key={item._id || item.id} className="hover:bg-muted/30">
                        <td className="py-3 px-4 font-mono text-xs text-muted-foreground">
                          {item._id || item.id}
                        </td>
                        <td className="py-3 px-4 font-medium">
                          {item.author?.name || item.author?.email || item.author || "All Authors"}
                        </td>
                        <td className="py-3 px-4 font-bold text-foreground">
                          ₹{(item.amount || item.totalAmount || 0).toLocaleString()}
                        </td>
                        <td className="py-3 px-4">{getStatusBadge(item.status)}</td>
                        <td className="py-3 px-4 text-xs text-muted-foreground">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-right space-x-2">
                          {item.status === "DRAFT" && (
                            <Button size="sm" onClick={() => handleApproveBatch(item._id || item.id)}>
                              Approve
                            </Button>
                          )}
                          {item.status === "APPROVED" && (
                            <Button
                              size="sm"
                              variant="default"
                              className="bg-emerald-600 hover:bg-emerald-700 text-white"
                              onClick={() => setSelectedSettlement(item)}
                            >
                              Record Payout
                            </Button>
                          )}
                          {item.status !== "PAID" && item.status !== "CANCELLED" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-destructive hover:bg-destructive/10"
                              onClick={() => handleCancelBatch(item._id || item.id)}
                            >
                              Cancel
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Record Manual Payout Modal */}
      <AnimatePresence>
        {selectedSettlement && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md p-6 border bg-card rounded-2xl shadow-xl space-y-4"
            >
              <button
                onClick={() => setSelectedSettlement(null)}
                aria-label="Close"
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground p-1 rounded-full"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="space-y-1">
                <h3 className="text-xl font-bold text-foreground">Record External Bank Payout</h3>
                <p className="text-xs text-muted-foreground">
                  Record transaction details after completing manual bank transfer of ₹
                  {(selectedSettlement.amount || 0).toLocaleString()}.
                </p>
              </div>

              <form onSubmit={handleMarkPaidSubmit} className="space-y-4 pt-2">
                <div className="space-y-1">
                  <Label htmlFor="paymentMethod" className="text-xs font-semibold uppercase text-muted-foreground">
                    Payment Method
                  </Label>
                  <Input
                    id="paymentMethod"
                    value={payoutForm.paymentMethod}
                    onChange={(e) => setPayoutForm({ ...payoutForm, paymentMethod: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="transactionReference" className="text-xs font-semibold uppercase text-muted-foreground">
                    Transaction / UTR Reference *
                  </Label>
                  <Input
                    id="transactionReference"
                    placeholder="e.g. TXN9876543210"
                    value={payoutForm.transactionReference}
                    onChange={(e) => setPayoutForm({ ...payoutForm, transactionReference: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="notes" className="text-xs font-semibold uppercase text-muted-foreground">
                    Notes
                  </Label>
                  <Input
                    id="notes"
                    value={payoutForm.notes}
                    onChange={(e) => setPayoutForm({ ...payoutForm, notes: e.target.value })}
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <Button type="button" variant="ghost" onClick={() => setSelectedSettlement(null)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={submittingPayout} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                    {submittingPayout ? "Recording..." : "Record Paid Payout"}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
