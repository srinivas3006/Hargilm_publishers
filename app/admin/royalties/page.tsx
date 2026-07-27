"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { ErrorState } from "@/components/ui/error-state";
import { motion } from "framer-motion";
import { DollarSign, Search, Edit } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import toast from "react-hot-toast";

export default function AdminRoyaltiesPage() {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [newRoyalty, setNewRoyalty] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchBooks = async () => {
    setLoading(true);
    setError(false);
    try {
      const { data } = await api.get("/books");
      setBooks(data.data || data);
    } catch (err) {
      console.error("Failed to fetch admin books:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const filteredBooks = books.filter((book: any) => {
    const title = book.title || "";
    const author = book.author?.name || book.authorName || "";
    return (
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      author.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const openEditDialog = (book: any) => {
    setSelectedBook(book);
    setNewRoyalty(book.royaltyPercentage?.toString() || "30"); // Default 30% if not set
    setIsDialogOpen(true);
  };

  const handleUpdateRoyalty = async () => {
    if (!selectedBook) return;
    
    setIsUpdating(true);
    try {
      const bookId = selectedBook.id || selectedBook._id;
      // assuming PUT /admin/books/:id can handle partial updates for royaltyPercentage
      await api.put(`/admin/books/${bookId}`, {
        royaltyPercentage: Number(newRoyalty)
      });
      
      // Update local state
      setBooks(books.map(b => 
        (b.id || b._id) === bookId 
          ? { ...b, royaltyPercentage: Number(newRoyalty) } 
          : b
      ));
      
      toast.success("Royalty percentage updated successfully!");
      setIsDialogOpen(false);
    } catch (err) {
      console.error("Failed to update royalty:", err);
      toast.error("Failed to update royalty percentage.");
    } finally {
      setIsUpdating(false);
    }
  };

  if (error) {
    return (
      <ErrorState
        title="Could not load royalties"
        message="We encountered an issue fetching the books inventory. Please try again."
        onRetry={fetchBooks}
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
      <div>
        <h1 className="text-2xl font-bold lg:text-3xl">Royalties Management</h1>
        <p className="text-muted-foreground mt-1">
          Manage royalty percentages for all books
        </p>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row items-center">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by book or author..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-full"
              />
            </div>
            <div className="text-sm text-muted-foreground ml-auto">
              Total Books: {filteredBooks.length}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Book</TableHead>
                  <TableHead className="text-right">Price (₹)</TableHead>
                  <TableHead className="text-right">Sales</TableHead>
                  <TableHead className="text-right">Royalty Rate</TableHead>
                  <TableHead className="text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBooks.map((book: any, index: number) => (
                  <motion.tr
                    key={book.id || book._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={book.coverImage || book.cover || "/placeholder-book.svg"}
                          alt={book.title}
                          className="h-12 w-9 rounded object-cover bg-muted"
                        />
                        <div>
                          <p className="font-medium">{book.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {book.author?.name || book.authorName || "Unknown Author"}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">₹{book.price || 0}</TableCell>
                    <TableCell className="text-right">{book.sales || 0}</TableCell>
                    <TableCell className="text-right font-bold text-primary">
                      {book.royaltyPercentage !== undefined ? `${book.royaltyPercentage}%` : "30% (Default)"}
                    </TableCell>
                    <TableCell className="text-center">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="gap-2"
                        onClick={() => openEditDialog(book)}
                      >
                        <Edit className="h-4 w-4" />
                        Edit
                      </Button>
                    </TableCell>
                  </motion.tr>
                ))}
                
                {filteredBooks.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                      No books found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Royalty Rate</DialogTitle>
            <DialogDescription>
              Set the royalty percentage for <strong>{selectedBook?.title}</strong>. This rate applies to all future sales.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="royalty" className="text-right">
                Percentage
              </Label>
              <div className="col-span-3 relative">
                <Input
                  id="royalty"
                  type="number"
                  min="0"
                  max="100"
                  value={newRoyalty}
                  onChange={(e) => setNewRoyalty(e.target.value)}
                  className="pr-8"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  %
                </span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isUpdating}>
              Cancel
            </Button>
            <Button onClick={handleUpdateRoyalty} disabled={isUpdating}>
              {isUpdating ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
