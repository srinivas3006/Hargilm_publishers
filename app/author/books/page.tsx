"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  BookOpen,
  Eye,
  Star,
  TrendingUp,
  Edit,
  MoreVertical,
  Search,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import api from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";
import type { Book } from "@/types";

export default function AuthorBooksPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [books, setBooks] = useState<any[]>([]);
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        if (!user) return;
        const { data } = await api.get('/books', { params: { author: user._id || user.id } });
        // The backend might return data directly or nested in data.data
        const fetchedBooks = data.data || data || [];
        setBooks(Array.isArray(fetchedBooks) ? fetchedBooks : []);
      } catch (error) {
        console.error("Failed to fetch author books", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBooks();
  }, [user]);

  const filteredBooks = books.filter((book) =>
    book.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalSales = books.reduce((sum, book) => sum + (book.totalSales || 0), 0);
  const totalRevenue = books.reduce((sum, book) => sum + ((book.totalSales || 0) * (book.price || 0)), 0);
  const avgRating =
    books.length > 0 ? books.reduce((sum, book) => sum + (book.rating || 0), 0) / books.length : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold lg:text-3xl">My Books</h1>
        <p className="text-muted-foreground mt-1">
          Manage and track your published books
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{books.length}</p>
                <p className="text-sm text-muted-foreground">Total Books</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                <TrendingUp className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalSales}</p>
                <p className="text-sm text-muted-foreground">Total Sales</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                <Eye className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  ₹{totalRevenue.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                <Star className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{avgRating.toFixed(1)}</p>
                <p className="text-sm text-muted-foreground">Avg. Rating</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search books..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* Books Table */}
      <Card>
        <CardHeader>
          <CardTitle>Published Books</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Book</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Sales</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBooks.map((book, index) => (
                  <motion.tr
                    key={book._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={book.coverImage || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800"}
                          alt={book.title}
                          className="h-12 w-9 rounded object-cover"
                        />
                        <div>
                          <p className="font-medium">{book.title}</p>
                          <p className="text-sm text-muted-foreground">
                            Published {new Date(book.createdAt || Date.now()).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{typeof book.category === 'object' ? book.category.name : book.category}</Badge>
                    </TableCell>
                    <TableCell>₹{book.price}</TableCell>
                    <TableCell>{book.totalSales || 0}</TableCell>
                    <TableCell className="font-semibold text-emerald-600">
                      ₹{((book.totalSales || 0) * (book.price || 0)).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        <span>{book.rating || 0}</span>
                        <span className="text-muted-foreground">
                          ({book.totalReviews || 0})
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/books/${book.slug || book._id}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Book
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <TrendingUp className="mr-2 h-4 w-4" />
                            View Analytics
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>
          {filteredBooks.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="font-semibold text-lg">No books found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
