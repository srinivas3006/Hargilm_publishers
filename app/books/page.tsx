'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, Filter, Grid, List, SlidersHorizontal, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BookCard } from '@/components/books/book-card';
import { ErrorState } from '@/components/ui/error-state';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import type { Book, Category } from '@/types';
import api from '@/lib/api';


const formats = ['Paperback', 'Hardcover', 'Ebook', 'Audiobook'];
const priceRanges = [
  { label: 'Under ₹300', min: 0, max: 300 },
  { label: '₹300 - ₹500', min: 300, max: 500 },
  { label: '₹500 - ₹800', min: 500, max: 800 },
  { label: 'Above ₹800', min: 800, max: 10000 },
];

function BooksContent() {
  const searchParams = useSearchParams();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedFormats, setSelectedFormats] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get('/categories');
        const items = data.data?.categories || data.data || data || [];
        setCategories(Array.isArray(items) ? items : []);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      setError(false);
      try {
        const params: any = {};
        
        if (searchQuery) params.q = searchQuery;
        // The backend supports category filtering (by slug or id) - we might need to adjust based on backend setup
        if (selectedCategories.length > 0) {
           params.category = selectedCategories[0]; // Currently supporting single category filter for simplicity
        }
        
        // Price Range
        if (selectedPriceRange) {
           const range = priceRanges.find(r => r.label === selectedPriceRange);
           if (range) {
             params.minPrice = range.min;
             params.maxPrice = range.max;
           }
        }

        // Sort
        if (sortBy === 'price-low') params.sort = 'price_asc';
        else if (sortBy === 'price-high') params.sort = 'price_desc';
        else if (sortBy === 'newest') params.sort = 'newest';

        const endpoint = searchQuery ? '/search' : '/books';
        const { data } = await api.get(endpoint, { params });
        
        const items = data.data?.books || data.data || data || [];
        setBooks(Array.isArray(items) ? items : []);
      } catch (err) {
        console.error("Failed to fetch books", err);
        setError(true);
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [searchQuery, sortBy, selectedCategories, selectedFormats, selectedPriceRange]);

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId]
    );
  };

  const handleFormatToggle = (format: string) => {
    setSelectedFormats((prev) =>
      prev.includes(format) ? prev.filter((f) => f !== format) : [...prev, format]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedFormats([]);
    setSelectedPriceRange(null);
    setSearchQuery('');
  };

  const hasActiveFilters = selectedCategories.length > 0 || selectedFormats.length > 0 || selectedPriceRange;

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="font-semibold text-foreground mb-3">Categories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category._id} className="flex items-center gap-2">
              <Checkbox
                id={`cat-${category._id}`}
                checked={selectedCategories.includes(category._id)}
                onCheckedChange={() => handleCategoryToggle(category._id)}
              />
              <Label htmlFor={`cat-${category._id}`} className="text-sm cursor-pointer flex-1">
                {category.name}
                <span className="text-muted-foreground ml-1">({category.bookCount})</span>
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Formats */}
      <div>
        <h3 className="font-semibold text-foreground mb-3">Format</h3>
        <div className="space-y-2">
          {formats.map((format) => (
            <div key={format} className="flex items-center gap-2">
              <Checkbox
                id={`format-${format}`}
                checked={selectedFormats.includes(format)}
                onCheckedChange={() => handleFormatToggle(format)}
              />
              <Label htmlFor={`format-${format}`} className="text-sm cursor-pointer">
                {format}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-semibold text-foreground mb-3">Price Range</h3>
        <div className="space-y-2">
          {priceRanges.map((range) => (
            <div key={range.label} className="flex items-center gap-2">
              <Checkbox
                id={`price-${range.label}`}
                checked={selectedPriceRange === range.label}
                onCheckedChange={() =>
                  setSelectedPriceRange(selectedPriceRange === range.label ? null : range.label)
                }
              />
              <Label htmlFor={`price-${range.label}`} className="text-sm cursor-pointer">
                {range.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {hasActiveFilters && (
        <Button variant="outline" className="w-full" onClick={clearFilters}>
          Clear All Filters
        </Button>
      )}
    </div>
  );

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <div className="bg-muted/30 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-2">
            Browse Books
          </h1>
          <p className="text-muted-foreground">
            Discover amazing reads from talented authors
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 bg-card p-6 rounded-lg border border-border">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-semibold text-lg text-foreground flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filters
                </h2>
                {hasActiveFilters && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Clear
                  </Button>
                )}
              </div>
              <FilterContent />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Search and Sort Bar */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search books, authors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex items-center gap-2">
                {/* Mobile Filter Button */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="lg:hidden">
                      <SlidersHorizontal className="h-4 w-4 mr-2" />
                      Filters
                      {hasActiveFilters && (
                        <span className="ml-2 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                          {selectedCategories.length + selectedFormats.length + (selectedPriceRange ? 1 : 0)}
                        </span>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left">
                    <SheetHeader>
                      <SheetTitle>Filters</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                      <FilterContent />
                    </div>
                  </SheetContent>
                </Sheet>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="bestseller">Bestsellers</SelectItem>
                    <SelectItem value="rating">Top Rated</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>

                <div className="hidden sm:flex items-center border border-border rounded-md">
                  <Button
                    variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                    size="icon"
                    onClick={() => setViewMode('grid')}
                    className="rounded-r-none"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                    size="icon"
                    onClick={() => setViewMode('list')}
                    className="rounded-l-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Active Filters Pills */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedCategories.map((catId) => {
                  const cat = categories.find((c) => c._id === catId);
                  return cat ? (
                    <span
                      key={catId}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                    >
                      {cat.name}
                      <button onClick={() => handleCategoryToggle(catId)}>
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ) : null;
                })}
                {selectedFormats.map((format) => (
                  <span
                    key={format}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                  >
                    {format}
                    <button onClick={() => handleFormatToggle(format)}>
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Results Count */}
            <p className="text-sm text-muted-foreground mb-4">
              Showing {books.length} {books.length === 1 ? 'book' : 'books'}
            </p>

            {/* Books Grid/List */}
            {loading ? (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6'
                    : 'space-y-4'
                }
              >
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    {viewMode === 'grid' ? (
                      <>
                        <div className="aspect-[2/3] bg-muted rounded-lg mb-4" />
                        <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                        <div className="h-3 bg-muted rounded w-1/2" />
                      </>
                    ) : (
                      <div className="flex gap-4 p-4 bg-muted rounded-lg">
                        <div className="w-24 h-36 bg-muted-foreground/20 rounded" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-muted-foreground/20 rounded w-3/4" />
                          <div className="h-3 bg-muted-foreground/20 rounded w-1/2" />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : error ? (
              <ErrorState 
                title="Unable to load catalog" 
                message="We encountered an issue fetching the books list. Please try again later."
                onRetry={() => {
                  setError(false);
                  setLoading(true);
                  // Since effect depends on states, we can force a re-render/fetch by 
                  // slightly altering a dependent state, or simply calling fetchBooks.
                  // Since fetchBooks is inside useEffect, we can clear and set query.
                  setSearchQuery(searchQuery);
                }}
              />
            ) : books.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-lg text-muted-foreground mb-4">No books found matching your criteria</p>
                <Button onClick={clearFilters}>Clear Filters</Button>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6'
                    : 'space-y-4'
                }
              >
                {books.map((book) => (
                  <BookCard key={book._id} book={book} variant={viewMode === 'list' ? 'horizontal' : 'default'} />
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BooksPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading books...</div>}>
      <BooksContent />
    </Suspense>
  );
}
