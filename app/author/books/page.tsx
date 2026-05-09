"use client";

import { useState } from "react";
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

const books = [
  {
    id: 1,
    title: "The Art of Programming",
    cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=100&h=150&fit=crop",
    category: "Technology",
    publishDate: "2023-06-15",
    price: 499,
    sales: 234,
    revenue: 116766,
    views: 12500,
    rating: 4.5,
    reviews: 89,
    status: "Published",
  },
  {
    id: 2,
    title: "Business Strategy 101",
    cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=100&h=150&fit=crop",
    category: "Business",
    publishDate: "2023-09-20",
    price: 399,
    sales: 189,
    revenue: 75411,
    views: 9800,
    rating: 4.2,
    reviews: 67,
    status: "Published",
  },
  {
    id: 3,
    title: "Creative Writing Masterclass",
    cover: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=100&h=150&fit=crop",
    category: "Literature",
    publishDate: "2023-11-10",
    price: 349,
    sales: 156,
    revenue: 54444,
    views: 7200,
    rating: 4.8,
    reviews: 45,
    status: "Published",
  },
  {
    id: 4,
    title: "Finance for Everyone",
    cover: "https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?w=100&h=150&fit=crop",
    category: "Finance",
    publishDate: "2024-01-05",
    price: 549,
    sales: 78,
    revenue: 42822,
    views: 4500,
    rating: 4.0,
    reviews: 23,
    status: "Published",
  },
  {
    id: 5,
    title: "Marketing Essentials",
    cover: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=100&h=150&fit=crop",
    category: "Business",
    publishDate: "2024-01-15",
    price: 449,
    sales: 45,
    revenue: 20205,
    views: 2100,
    rating: 4.3,
    reviews: 12,
    status: "Published",
  },
];

export default function AuthorBooksPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalSales = books.reduce((sum, book) => sum + book.sales, 0);
  const totalRevenue = books.reduce((sum, book) => sum + book.revenue, 0);
  const avgRating =
    books.reduce((sum, book) => sum + book.rating, 0) / books.length;

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
                    key={book.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={book.cover}
                          alt={book.title}
                          className="h-12 w-9 rounded object-cover"
                        />
                        <div>
                          <p className="font-medium">{book.title}</p>
                          <p className="text-sm text-muted-foreground">
                            Published {new Date(book.publishDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{book.category}</Badge>
                    </TableCell>
                    <TableCell>₹{book.price}</TableCell>
                    <TableCell>{book.sales}</TableCell>
                    <TableCell className="font-semibold text-emerald-600">
                      ₹{book.revenue.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        <span>{book.rating}</span>
                        <span className="text-muted-foreground">
                          ({book.reviews})
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
                            <Link href={`/books/${book.id}`}>
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
