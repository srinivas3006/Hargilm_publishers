"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, Download, Eye, Search, Filter } from "lucide-react";
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
import { Progress } from "@/components/ui/progress";
import { ErrorState } from "@/components/ui/error-state";
import { useAuthStore } from "@/store/auth-store";
import { useEffect } from "react";
import api from "@/lib/api";

export default function LibraryPage() {
  const { user } = useAuthStore();
  const [libraryBooks, setLibraryBooks] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [formatFilter, setFormatFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchLibrary = async () => {
    if (!user?._id && !user?.id) return;
    const userId = user._id || user.id;
    setLoading(true);
    setError(false);
    try {
      const { data } = await api.get(`/users/${userId}/library`);
      const booksData = data.data || data;
      setLibraryBooks(Array.isArray(booksData) ? booksData : []);
    } catch (err) {
      console.error("Failed to fetch library:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLibrary();
  }, [user]);

  const categories = Array.from(new Set(libraryBooks.map((b) => b.category)));

  const filteredBooks = libraryBooks.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFormat = formatFilter === "all" || book.format === formatFilter;
    const matchesCategory = categoryFilter === "all" || book.category === categoryFilter;
    return matchesSearch && matchesFormat && matchesCategory;
  });

  const getProgressLabel = (progress: number) => {
    if (progress === 0) return "Not Started";
    if (progress === 100) return "Completed";
    return `${progress}% Read`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold lg:text-3xl">My Library</h1>
        <p className="text-muted-foreground mt-1">
          Access your purchased books anytime
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{libraryBooks.length}</p>
                <p className="text-sm text-muted-foreground">Total Books</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                <Eye className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {libraryBooks.filter((b) => b.progress === 100).length}
                </p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                <BookOpen className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {libraryBooks.filter((b) => b.progress > 0 && b.progress < 100).length}
                </p>
                <p className="text-sm text-muted-foreground">In Progress</p>
              </div>
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
                placeholder="Search books..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={formatFilter} onValueChange={setFormatFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Formats</SelectItem>
                <SelectItem value="eBook">eBook</SelectItem>
                <SelectItem value="Paperback">Paperback</SelectItem>
                <SelectItem value="Hardcover">Hardcover</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Books Grid */}
      {error ? (
        <ErrorState 
          title="Unable to load library"
          message="We couldn't fetch your library books right now. Please try again."
          onRetry={fetchLibrary}
        />
      ) : loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : filteredBooks.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredBooks.map((book, index) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="overflow-hidden group">
                <div className="relative aspect-[2/3]">
                  <img
                    src={book.coverImage || book.cover}
                    alt={book.title}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <div className="flex gap-2 w-full">
                      {book.format === "eBook" && (
                        <>
                          <Button size="sm" className="flex-1 gap-1">
                            <Eye className="h-4 w-4" />
                            Read
                          </Button>
                          <Button size="sm" variant="outline" className="gap-1">
                            <Download className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      {book.format !== "eBook" && (
                        <Button size="sm" className="flex-1" asChild>
                          <Link href={`/books/${book.slug || book.id}`}>View Details</Link>
                        </Button>
                      )}
                    </div>
                  </div>
                  <Badge className="absolute top-2 right-2">{book.format}</Badge>
                </div>
                <CardContent className="p-4">
                  <Badge variant="outline" className="mb-2">
                    {typeof book.category === 'object' ? book.category?.name : book.category}
                  </Badge>
                  <h3 className="font-semibold line-clamp-1">{book.title}</h3>
                  <p className="text-sm text-muted-foreground">{typeof book.author === 'object' ? book.author?.name : book.author}</p>
                  
                  {book.format === "eBook" && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-muted-foreground">
                          {getProgressLabel(book.progress || 0)}
                        </span>
                        <span className="font-medium">{book.progress || 0}%</span>
                      </div>
                      <Progress value={book.progress || 0} className="h-2" />
                    </div>
                  )}
                  
                  <p className="text-xs text-muted-foreground mt-3">
                    Purchased on {new Date(book.purchaseDate || book.createdAt).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="font-semibold text-lg">No books found</h3>
            <p className="text-muted-foreground text-center">
              {searchQuery || formatFilter !== "all" || categoryFilter !== "all"
                ? "Try adjusting your filters"
                : "Start building your library by purchasing books"}
            </p>
            <Button asChild className="mt-4">
              <Link href="/books">Browse Books</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
