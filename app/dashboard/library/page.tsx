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

const libraryBooks = [
  {
    id: 1,
    title: "The Art of Programming",
    author: "John Smith",
    cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=200&h=300&fit=crop",
    purchaseDate: "2024-01-15",
    format: "eBook",
    progress: 75,
    category: "Technology",
  },
  {
    id: 2,
    title: "Business Strategy 101",
    author: "Sarah Johnson",
    cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=200&h=300&fit=crop",
    purchaseDate: "2024-01-10",
    format: "Paperback",
    progress: 100,
    category: "Business",
  },
  {
    id: 3,
    title: "Creative Writing Masterclass",
    author: "Michael Brown",
    cover: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=200&h=300&fit=crop",
    purchaseDate: "2024-01-05",
    format: "eBook",
    progress: 30,
    category: "Literature",
  },
  {
    id: 4,
    title: "Finance for Beginners",
    author: "Emily Davis",
    cover: "https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?w=200&h=300&fit=crop",
    purchaseDate: "2023-12-20",
    format: "Hardcover",
    progress: 0,
    category: "Finance",
  },
  {
    id: 5,
    title: "Marketing Essentials",
    author: "David Wilson",
    cover: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=200&h=300&fit=crop",
    purchaseDate: "2023-12-15",
    format: "eBook",
    progress: 50,
    category: "Business",
  },
  {
    id: 6,
    title: "Psychology Today",
    author: "Lisa Anderson",
    cover: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=300&fit=crop",
    purchaseDate: "2023-12-10",
    format: "eBook",
    progress: 100,
    category: "Psychology",
  },
];

export default function LibraryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [formatFilter, setFormatFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

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
      {filteredBooks.length > 0 ? (
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
                    src={book.cover}
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
                          <Link href={`/books/${book.id}`}>View Details</Link>
                        </Button>
                      )}
                    </div>
                  </div>
                  <Badge className="absolute top-2 right-2">{book.format}</Badge>
                </div>
                <CardContent className="p-4">
                  <Badge variant="outline" className="mb-2">
                    {book.category}
                  </Badge>
                  <h3 className="font-semibold line-clamp-1">{book.title}</h3>
                  <p className="text-sm text-muted-foreground">{book.author}</p>
                  
                  {book.format === "eBook" && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-muted-foreground">
                          {getProgressLabel(book.progress)}
                        </span>
                        <span className="font-medium">{book.progress}%</span>
                      </div>
                      <Progress value={book.progress} className="h-2" />
                    </div>
                  )}
                  
                  <p className="text-xs text-muted-foreground mt-3">
                    Purchased on {new Date(book.purchaseDate).toLocaleDateString()}
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
