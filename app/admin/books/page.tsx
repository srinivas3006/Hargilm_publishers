"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Star,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import toast from "react-hot-toast";

const booksData = [
  {
    id: 1,
    title: "The Art of Programming",
    author: "John Smith",
    category: "Technology",
    price: 499,
    stock: 125,
    sales: 234,
    rating: 4.5,
    status: "Active",
    cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=60&h=80&fit=crop",
  },
  {
    id: 2,
    title: "Business Strategy 101",
    author: "Sarah Johnson",
    category: "Business",
    price: 399,
    stock: 89,
    sales: 189,
    rating: 4.2,
    status: "Active",
    cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=60&h=80&fit=crop",
  },
  {
    id: 3,
    title: "Creative Writing Masterclass",
    author: "Michael Brown",
    category: "Literature",
    price: 349,
    stock: 0,
    sales: 156,
    rating: 4.8,
    status: "Out of Stock",
    cover: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=60&h=80&fit=crop",
  },
  {
    id: 4,
    title: "Finance for Everyone",
    author: "Emily Davis",
    category: "Finance",
    price: 549,
    stock: 45,
    sales: 78,
    rating: 4.0,
    status: "Active",
    cover: "https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?w=60&h=80&fit=crop",
  },
  {
    id: 5,
    title: "Marketing Essentials",
    author: "David Wilson",
    category: "Business",
    price: 449,
    stock: 67,
    sales: 45,
    rating: 4.3,
    status: "Active",
    cover: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=60&h=80&fit=crop",
  },
  {
    id: 6,
    title: "Psychology Today",
    author: "Lisa Anderson",
    category: "Psychology",
    price: 399,
    stock: 12,
    sales: 92,
    rating: 4.6,
    status: "Low Stock",
    cover: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=80&fit=crop",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Active":
      return "bg-emerald-500/10 text-emerald-600";
    case "Out of Stock":
      return "bg-red-500/10 text-red-600";
    case "Low Stock":
      return "bg-amber-500/10 text-amber-600";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export default function AdminBooksPage() {
  const [books, setBooks] = useState(booksData);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const categories = Array.from(new Set(booksData.map((b) => b.category)));

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || book.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || book.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleDelete = (id: number) => {
    setBooks(books.filter((b) => b.id !== id));
    toast.success("Book deleted successfully");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold lg:text-3xl">Books</h1>
          <p className="text-muted-foreground mt-1">
            Manage your book inventory
          </p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/admin/books/new">
            <Plus className="h-4 w-4" />
            Add New Book
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold">{books.length}</p>
            <p className="text-sm text-muted-foreground">Total Books</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold">
              {books.filter((b) => b.status === "Active").length}
            </p>
            <p className="text-sm text-muted-foreground">Active</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold">
              {books.filter((b) => b.status === "Out of Stock").length}
            </p>
            <p className="text-sm text-muted-foreground">Out of Stock</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold">
              {books.filter((b) => b.status === "Low Stock").length}
            </p>
            <p className="text-sm text-muted-foreground">Low Stock</p>
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
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                <SelectItem value="Low Stock">Low Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Books Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Book</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Stock</TableHead>
                  <TableHead className="text-right">Sales</TableHead>
                  <TableHead className="text-center">Rating</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBooks.map((book, index) => (
                  <motion.tr
                    key={book.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
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
                            {book.author}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{book.category}</Badge>
                    </TableCell>
                    <TableCell className="text-right">₹{book.price}</TableCell>
                    <TableCell className="text-right">{book.stock}</TableCell>
                    <TableCell className="text-right">{book.sales}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        {book.rating}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(book.status)}>
                        {book.status}
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
                          <DropdownMenuItem asChild>
                            <Link href={`/books/${book.id}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem
                                className="text-destructive"
                                onSelect={(e) => e.preventDefault()}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Book?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will
                                  permanently delete the book from the catalog.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  onClick={() => handleDelete(book.id)}
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
