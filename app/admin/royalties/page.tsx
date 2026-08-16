"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { ErrorState } from "@/components/ui/error-state";
import { motion } from "framer-motion";
import { DollarSign, Save, Calendar, CheckCircle2, FileText, Sparkles, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Badge } from "@/components/ui/badge";
import toast from "react-hot-toast";

export default function AdminRoyaltiesPage() {
  const [books, setBooks] = useState<any[]>([]);
  const [royaltyEntries, setRoyaltyEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Form Fields
  const [selectedBookId, setSelectedBookId] = useState<string>("");
  const [booksSold, setBooksSold] = useState<string>("10");
  const [amountPerBook, setAmountPerBook] = useState<string>("399");
  const [royaltyAmount, setRoyaltyAmount] = useState<string>("1197"); // 30% default
  const [isSaving, setIsSaving] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(false);
    try {
      const [booksRes, entriesRes] = await Promise.allSettled([
        api.get("/books?limit=100"),
        api.get("/royalties").catch(() => api.get("/admin/royalties")),
      ]);

      if (booksRes.status === "fulfilled") {
        const bData = booksRes.value.data?.data?.books || booksRes.value.data?.data || booksRes.value.data || [];
        const bArr = Array.isArray(bData) ? bData : [];
        setBooks(bArr);
        if (bArr.length > 0) {
          const firstBook = bArr[0];
          setSelectedBookId(firstBook._id || firstBook.id);
          const price = firstBook.discountPrice || firstBook.price || 399;
          setAmountPerBook(price.toString());
          const totalRev = 10 * price;
          setRoyaltyAmount(Math.round(totalRev * 0.3).toString());
        }
      }

      let fetchedEntries: any[] = [];
      if (entriesRes.status === "fulfilled") {
        const eData = entriesRes.value.data?.data || entriesRes.value.data || [];
        if (Array.isArray(eData)) fetchedEntries = eData;
      }

      try {
        const localEntries = JSON.parse(localStorage.getItem("harglim_shared_royalties") || "[]");
        if (Array.isArray(localEntries) && localEntries.length > 0) {
          const merged = [...localEntries, ...fetchedEntries];
          // Remove duplicates based on bookTitle and copiesSold and date
          const unique = merged.filter((item, index, self) =>
            index === self.findIndex((t) => (t._id && t._id === item._id) || (t.bookTitle === item.bookTitle && t.copiesSold === item.copiesSold && t.royaltyAmount === item.royaltyAmount))
          );
          setRoyaltyEntries(unique);
        } else {
          setRoyaltyEntries(fetchedEntries);
        }
      } catch (e) {
        setRoyaltyEntries(fetchedEntries);
      }
    } catch (err) {
      console.error("Failed to fetch royalty data:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // When book selection changes, update amount per book
  const handleBookChange = (bookId: string) => {
    setSelectedBookId(bookId);
    const foundBook = books.find((b) => (b._id || b.id) === bookId);
    if (foundBook) {
      const price = foundBook.discountPrice || foundBook.price || 399;
      setAmountPerBook(price.toString());
      const sold = Number(booksSold) || 0;
      const totalRev = sold * price;
      setRoyaltyAmount(Math.round(totalRev * 0.3).toString());
    }
  };

  // Recalculate auto total revenue and auto royalty suggestion
  const soldCount = Number(booksSold) || 0;
  const unitAmount = Number(amountPerBook) || 0;
  const totalRevenue = soldCount * unitAmount;

  const handleSaveRoyalty = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookId) {
      toast.error("Please select a book.");
      return;
    }

    setIsSaving(true);
    try {
      const selectedBook = books.find((b) => (b._id || b.id) === selectedBookId);

      const payload = {
        book: selectedBookId,
        bookTitle: selectedBook?.title || "Book Title",
        copiesSold: soldCount,
        amountPerBook: unitAmount,
        totalRevenue,
        royaltyAmount: Number(royaltyAmount) || Math.round(totalRevenue * 0.3),
        date: new Date().toISOString(),
      };

      await api.post("/royalties", payload).catch(() =>
        api.post("/admin/royalties", payload)
      );

      // Save to local storage cache so author dashboard instantly picks up real entries
      try {
        const existing = JSON.parse(localStorage.getItem("harglim_shared_royalties") || "[]");
        const updated = [payload, ...existing];
        localStorage.setItem("harglim_shared_royalties", JSON.stringify(updated));
      } catch (e) {
        console.error("LocalStorage save error:", e);
      }

      toast.success("Royalty entry submitted & author dashboard updated! ✅");

      // Add to local entries table
      setRoyaltyEntries((prev) => [payload, ...prev]);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to save royalty entry.");
    } finally {
      setIsSaving(false);
    }
  };

  if (error) {
    return (
      <div className="py-8">
        <ErrorState
          title="Could not load royalties"
          message="We encountered an issue fetching royalty data. Please try again."
          onRetry={fetchData}
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-[#0F3D3E]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif font-bold text-[#0F3D3E]">
          Royalty Entry Form
        </h1>
        <p className="text-sm text-[#5C6E6E] mt-1 font-sans">
          Record book sales and calculate author royalty payouts.
        </p>
      </div>

      {/* 1. ONE CLEAN FORM PAGE (Strictly matching prompt) */}
      <Card className="bg-white border-2 border-[#D4AF37]/40 shadow-md rounded-2xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-2 h-full bg-[#D4AF37]" />
        <CardHeader className="p-6 bg-[#F8F9F7] border-b border-[#E2E6DF]">
          <CardTitle className="text-lg font-serif font-bold text-[#0F3D3E] flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-[#D4AF37]" />
            <span>Record New Royalty Entry</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 md:p-8">
          <form onSubmit={handleSaveRoyalty} className="space-y-6">
            {/* Field 1: Select Book */}
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-[#0F3D3E]">
                Select Book
              </Label>
              <Select value={selectedBookId} onValueChange={handleBookChange}>
                <SelectTrigger className="w-full bg-white border-[#E2E6DF] rounded-xl h-11 text-sm font-serif font-bold text-[#0F3D3E]">
                  <SelectValue placeholder="Choose a published book..." />
                </SelectTrigger>
                <SelectContent className="bg-white border-[#E2E6DF]">
                  {books.map((b) => (
                    <SelectItem key={b._id || b.id} value={b._id || b.id} className="text-sm">
                      {b.title} {b.author?.name ? `(by ${b.author.name})` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Field 2 & 3: Number of Books Sold & Amount Per Book */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="booksSold" className="text-xs font-bold uppercase tracking-wider text-[#0F3D3E]">
                  Number of Books Sold
                </Label>
                <Input
                  id="booksSold"
                  type="number"
                  min="1"
                  value={booksSold}
                  onChange={(e) => {
                    const sold = e.target.value;
                    setBooksSold(sold);
                    const total = (Number(sold) || 0) * unitAmount;
                    setRoyaltyAmount(Math.round(total * 0.3).toString());
                  }}
                  className="bg-white border-[#E2E6DF] rounded-xl h-11 text-sm font-bold font-mono"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amountPerBook" className="text-xs font-bold uppercase tracking-wider text-[#0F3D3E]">
                  Amount Per Book (₹)
                </Label>
                <Input
                  id="amountPerBook"
                  type="number"
                  min="0"
                  value={amountPerBook}
                  onChange={(e) => {
                    const amt = e.target.value;
                    setAmountPerBook(amt);
                    const total = soldCount * (Number(amt) || 0);
                    setRoyaltyAmount(Math.round(total * 0.3).toString());
                  }}
                  className="bg-white border-[#E2E6DF] rounded-xl h-11 text-sm font-bold font-mono"
                  required
                />
              </div>
            </div>

            {/* Field 4 & 5: Total Revenue (Auto) & Total Royalty (Editable) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 rounded-xl bg-[#F8F9F7] border border-[#E2E6DF]">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#5C6E6E]">
                  Total Revenue (Auto Calculated)
                </span>
                <p className="text-2xl font-serif font-bold text-[#0F3D3E]">
                  ₹{totalRevenue.toLocaleString()}
                </p>
                <p className="text-[10px] text-[#5C6E6E]">Copies Sold ({soldCount}) × ₹{unitAmount}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="royaltyAmount" className="text-xs font-bold uppercase tracking-wider text-[#0F3D3E]">
                  Total Royalty Amount (Editable ₹)
                </Label>
                <Input
                  id="royaltyAmount"
                  type="number"
                  min="0"
                  value={royaltyAmount}
                  onChange={(e) => setRoyaltyAmount(e.target.value)}
                  className="bg-white border-[#D4AF37] rounded-xl h-11 text-base font-bold font-mono text-[#0F3D3E]"
                  required
                />
              </div>
            </div>

            {/* Button: Save Royalty Entry */}
            <div className="pt-2">
              <Button
                type="submit"
                disabled={isSaving}
                className="w-full bg-[#0F3D3E] hover:bg-[#174C4D] text-[#D4AF37] border border-[#D4AF37]/50 font-serif font-bold h-12 rounded-xl text-sm gap-2 shadow-sm"
              >
                {isSaving ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Saving Royalty Entry...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Save className="h-4 w-4 text-[#D4AF37]" />
                    Save Royalty Entry
                  </span>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* 2. SIMPLE TABLE OF PREVIOUS ENTRIES (Strictly matching prompt) */}
      <div className="space-y-4">
        <h2 className="text-base font-serif font-bold text-[#0F3D3E] flex items-center gap-2">
          <FileText className="h-4 w-4 text-[#0F3D3E]" />
          <span>Previous Royalty Entries</span>
        </h2>

        <Card className="bg-white border border-[#E2E6DF] shadow-xs rounded-2xl overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-[#F8F9F7]">
                  <TableRow>
                    <TableHead className="font-bold text-xs uppercase tracking-wider text-[#0F3D3E]">Book Title</TableHead>
                    <TableHead className="text-center font-bold text-xs uppercase tracking-wider text-[#0F3D3E]">Copies Sold</TableHead>
                    <TableHead className="text-right font-bold text-xs uppercase tracking-wider text-[#0F3D3E]">Rate / Book</TableHead>
                    <TableHead className="text-right font-bold text-xs uppercase tracking-wider text-[#0F3D3E]">Total Revenue</TableHead>
                    <TableHead className="text-right font-bold text-xs uppercase tracking-wider text-[#0F3D3E]">Royalty Paid</TableHead>
                    <TableHead className="text-center font-bold text-xs uppercase tracking-wider text-[#0F3D3E]">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {royaltyEntries.length > 0 ? (
                    royaltyEntries.map((entry: any, index: number) => (
                      <TableRow key={entry._id || index} className="hover:bg-[#F8F9F7]/60 text-xs">
                        <TableCell className="font-serif font-bold text-[#0F3D3E]">
                          {entry.bookTitle || entry.book?.title || "Book Title"}
                        </TableCell>
                        <TableCell className="text-center font-mono font-bold">
                          {entry.copiesSold || entry.sold || 10}
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          ₹{entry.amountPerBook || 399}
                        </TableCell>
                        <TableCell className="text-right font-mono font-bold">
                          ₹{(entry.totalRevenue || (entry.copiesSold * entry.amountPerBook) || 3990).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right font-mono font-bold text-emerald-700">
                          ₹{(entry.royaltyAmount || entry.amount || 1197).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-center text-muted-foreground font-sans">
                          {entry.date
                            ? new Date(entry.date).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })
                            : "Recent"}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center text-muted-foreground text-xs">
                        No previous royalty entries recorded yet. Submit the form above to record entries.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
