"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/api";
import { ArrowLeft, Save, Upload, User, UserPlus, Globe, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import toast from "react-hot-toast";

type AuthorType = "existing" | "new" | "external";

export default function AddBookPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTitle = searchParams.get("title") || "";
  const initialAuthor = searchParams.get("author") || "";

  const [loading, setLoading] = useState(false);
  const [fetchingAuthors, setFetchingAuthors] = useState(true);
  const [fetchingCategories, setFetchingCategories] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Author Selection State
  const [authorType, setAuthorType] = useState<AuthorType>("existing");
  const [authorsList, setAuthorsList] = useState<any[]>([]);
  const [selectedAuthorId, setSelectedAuthorId] = useState<string>("");
  const [selectedAuthorName, setSelectedAuthorName] = useState<string>("");

  // Categories State
  const [categoriesList, setCategoriesList] = useState<any[]>([]);

  // New Author State
  const [newAuthorName, setNewAuthorName] = useState<string>("");
  const [newAuthorEmail, setNewAuthorEmail] = useState<string>("");
  const [newAuthorBio, setNewAuthorBio] = useState<string>("");

  // External Author State
  const [externalAuthorName, setExternalAuthorName] = useState<string>(initialAuthor);

  // Book Metadata State
  const [formData, setFormData] = useState({
    title: initialTitle,
    description: "",
    category: "",
    price: "",
    discountPrice: "",
    stock: "10",
    isbn: "",
    status: "published",
    format: "paperback",
    pages: "250",
    isFeatured: false,
    isBestseller: false,
    isNewRelease: false,
    royaltyPercentage: "30",
  });

  // Fetch Categories list
  useEffect(() => {
    const loadCategories = async () => {
      setFetchingCategories(true);
      try {
        const { data } = await api.get("/categories").catch(() => api.get("/admin/categories"));
        const items = data?.data?.categories || data?.data || data || [];
        const arr = Array.isArray(items) ? items : [];
        setCategoriesList(arr);
        if (arr.length > 0) {
          const firstCat = arr[0];
          setFormData((prev) => ({ ...prev, category: firstCat._id || firstCat.id || firstCat.name }));
        }
      } catch (err) {
        console.warn("Failed to load categories:", err);
      } finally {
        setFetchingCategories(false);
      }
    };
    loadCategories();
  }, []);

  // Fetch Existing Authors list
  useEffect(() => {
    const loadAuthors = async () => {
      setFetchingAuthors(true);
      try {
        const { data } = await api.get("/authors").catch(() => api.get("/admin/users"));
        const items = data?.data?.authors || data?.data || data || [];
        const arr = Array.isArray(items) ? items : [];
        setAuthorsList(arr);
        if (arr.length > 0) {
          const first = arr[0];
          setSelectedAuthorId(first._id || first.id);
          setSelectedAuthorName(first.name || "Demo Author");
        }
      } catch (err) {
        console.warn("Failed to load authors:", err);
      } finally {
        setFetchingAuthors(false);
      }
    };
    loadAuthors();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Please enter a book title.");
      return;
    }

    if (!formData.description.trim()) {
      toast.error("Please enter a book description.");
      return;
    }

    if (!formData.category) {
      toast.error("Please select a book category.");
      return;
    }

    if (!formData.price || Number(formData.price) <= 0) {
      toast.error("Please enter a valid price (MRP).");
      return;
    }

    // 1. TRANSFORMATION LOGIC (FRONTEND SIDE)
    let finalAuthorId: string | null = null;
    let finalAuthorName: string = "";

    if (authorType === "existing") {
      if (!selectedAuthorId) {
        toast.error("Please select an existing author from the dropdown.");
        return;
      }
      const found = authorsList.find(
        (a) => (a._id || a.id) === selectedAuthorId
      );
      finalAuthorId = selectedAuthorId;
      finalAuthorName = found?.name || selectedAuthorName || "Demo Author";
    } else if (authorType === "new") {
      if (!newAuthorName.trim()) {
        toast.error("Please enter the new author's name.");
        return;
      }
      finalAuthorId = null;
      finalAuthorName = newAuthorName.trim();
    } else if (authorType === "external") {
      if (!externalAuthorName.trim()) {
        toast.error("Please enter the external author's name.");
        return;
      }
      finalAuthorId = null;
      finalAuthorName = externalAuthorName.trim();
    }

    setLoading(true);

    try {
      // 2. IMAGE UPLOAD HANDLING (IF COVER IMAGE FILE ATTACHED)
      let coverImageUrl: string | undefined = undefined;
      if (imageFile) {
        try {
          const uploadFormData = new FormData();
          uploadFormData.append("image", imageFile);
          uploadFormData.append("coverImage", imageFile);

          const uploadRes = await api.post("/uploads/image", uploadFormData, {
            headers: { "Content-Type": "multipart/form-data" },
          }).catch(() => api.post("/uploads/publishing-image", uploadFormData, {
            headers: { "Content-Type": "multipart/form-data" },
          }));

          coverImageUrl = uploadRes?.data?.data?.url || uploadRes?.data?.url || uploadRes?.data?.data?.coverImage;
        } catch (uploadErr) {
          console.warn("Image upload failed, proceeding with catalog creation:", uploadErr);
        }
      }

      // 3. CONSTRUCT STRICT JSON PAYLOAD FOR BACKEND SPECIFICATIONS
      const isObjectId = finalAuthorId && /^[0-9a-fA-F]{24}$/.test(finalAuthorId);
      const numericPrice = Number(formData.price) || 0;

      const jsonPayload: Record<string, any> = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        mrp: numericPrice,
        price: numericPrice, // Legacy compatibility alias matching mrp
        discountPrice: formData.discountPrice ? Number(formData.discountPrice) : undefined,
        stock: Number(formData.stock) || 0,
        isbn: formData.isbn.trim() || undefined,
        status: formData.status === "Active" ? "published" : formData.status,
        format: formData.format || "paperback",
        pages: formData.pages ? Number(formData.pages) : 250,
        isFeatured: Boolean(formData.isFeatured),
        isBestseller: Boolean(formData.isBestseller),
        isNewRelease: Boolean(formData.isNewRelease),
        royaltyPercentage: formData.royaltyPercentage ? Number(formData.royaltyPercentage) : 30,
      };

      if (coverImageUrl) {
        jsonPayload.coverImage = coverImageUrl;
      }

      if (isObjectId) {
        jsonPayload.author = finalAuthorId;
      }

      // Submit JSON payload to /api/admin/books
      const res = await api.post("/admin/books", jsonPayload);
      
      if (res.data?.success || res.status === 201 || res.status === 200) {
        toast.success("Book created and published successfully to catalog! 📚");
        router.push("/admin/books");
      } else {
        throw new Error(res.data?.message || "Backend catalog creation failed.");
      }
    } catch (err: any) {
      console.error("Failed to create book:", err);
      const errMsg = err?.response?.data?.message || err?.message || "An error occurred while publishing the book to the backend catalog.";
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto text-[#0F3D3E] font-sans">
      
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/books">
            <ArrowLeft className="h-5 w-5 text-[#0F3D3E]" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-serif font-bold lg:text-3xl text-[#0F3D3E]">
            Add New Book
          </h1>
          <p className="text-sm text-[#5C6E6E] mt-0.5">
            Add a new publication entry with flexible author selection
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* ------------------------------------------------------------------ */}
        {/* 1. AUTHOR SELECTION SECTION */}
        {/* ------------------------------------------------------------------ */}
        <Card className="bg-white border border-[#E2E6DF] shadow-xs rounded-2xl overflow-hidden">
          <CardHeader className="p-6 bg-[#F8F9F7] border-b border-[#E2E6DF]">
            <CardTitle className="font-serif font-bold text-lg text-[#0F3D3E] flex items-center gap-2">
              <User className="h-5 w-5 text-[#D4AF37]" />
              <span>Author Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            
            {/* Author Type Radio Selector */}
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-[#0F3D3E]">
                Select Author Type *
              </Label>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                <button
                  type="button"
                  onClick={() => setAuthorType("existing")}
                  className={`flex items-center space-x-3 p-4 rounded-xl border-2 text-left transition-all cursor-pointer select-none ${
                    authorType === "existing"
                      ? "border-[#0F3D3E] bg-[#0F3D3E]/5 shadow-xs"
                      : "border-[#E2E6DF] bg-[#F8F9F7] hover:bg-white hover:border-[#0F3D3E]/40"
                  }`}
                >
                  <div
                    className={`h-4 w-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      authorType === "existing" ? "border-[#0F3D3E]" : "border-[#5C6E6E]"
                    }`}
                  >
                    {authorType === "existing" && <div className="h-2 w-2 rounded-full bg-[#0F3D3E]" />}
                  </div>
                  <span className="font-serif font-bold text-xs text-[#0F3D3E]">
                    Existing Author
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setAuthorType("new")}
                  className={`flex items-center space-x-3 p-4 rounded-xl border-2 text-left transition-all cursor-pointer select-none ${
                    authorType === "new"
                      ? "border-[#0F3D3E] bg-[#0F3D3E]/5 shadow-xs"
                      : "border-[#E2E6DF] bg-[#F8F9F7] hover:bg-white hover:border-[#0F3D3E]/40"
                  }`}
                >
                  <div
                    className={`h-4 w-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      authorType === "new" ? "border-[#0F3D3E]" : "border-[#5C6E6E]"
                    }`}
                  >
                    {authorType === "new" && <div className="h-2 w-2 rounded-full bg-[#0F3D3E]" />}
                  </div>
                  <span className="font-serif font-bold text-xs text-[#0F3D3E]">
                    New Author
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setAuthorType("external")}
                  className={`flex items-center space-x-3 p-4 rounded-xl border-2 text-left transition-all cursor-pointer select-none ${
                    authorType === "external"
                      ? "border-[#0F3D3E] bg-[#0F3D3E]/5 shadow-xs"
                      : "border-[#E2E6DF] bg-[#F8F9F7] hover:bg-white hover:border-[#0F3D3E]/40"
                  }`}
                >
                  <div
                    className={`h-4 w-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      authorType === "external" ? "border-[#0F3D3E]" : "border-[#5C6E6E]"
                    }`}
                  >
                    {authorType === "external" && <div className="h-2 w-2 rounded-full bg-[#0F3D3E]" />}
                  </div>
                  <span className="font-serif font-bold text-xs text-[#0F3D3E]">
                    External Author
                  </span>
                </button>
              </div>
            </div>

            {/* Dynamic Input Views Based on Selection */}
            {authorType === "existing" && (
              <div className="space-y-2 pt-2">
                <Label htmlFor="existingAuthorSelect" className="text-xs font-bold uppercase tracking-wider text-[#0F3D3E]">
                  Select Registered Author *
                </Label>
                <Select
                  value={selectedAuthorId}
                  onValueChange={(val) => {
                    setSelectedAuthorId(val);
                    const found = authorsList.find((a) => (a._id || a.id) === val);
                    if (found) setSelectedAuthorName(found.name || "");
                  }}
                >
                  <SelectTrigger className="w-full bg-[#F8F9F7] border-[#E2E6DF] rounded-xl h-11 text-xs font-serif font-bold">
                    <SelectValue placeholder={fetchingAuthors ? "Loading authors..." : "Choose an author..."} />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-[#E2E6DF]">
                    {authorsList.map((a) => (
                      <SelectItem key={a._id || a.id} value={a._id || a.id} className="text-xs">
                        {a.name} ({a.email || "Registered Author"})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {authorType === "new" && (
              <div className="space-y-4 pt-2 border-t border-[#E2E6DF]">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="newAuthorName" className="text-xs font-bold uppercase tracking-wider text-[#0F3D3E]">
                      Author Name *
                    </Label>
                    <Input
                      id="newAuthorName"
                      placeholder="e.g. Dr. A.P. Sharma"
                      value={newAuthorName}
                      onChange={(e) => setNewAuthorName(e.target.value)}
                      className="bg-[#F8F9F7] border-[#E2E6DF] rounded-xl text-xs font-bold"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="newAuthorEmail" className="text-xs font-bold uppercase tracking-wider text-[#0F3D3E]">
                      Author Email (Optional)
                    </Label>
                    <Input
                      id="newAuthorEmail"
                      type="email"
                      placeholder="author@example.com"
                      value={newAuthorEmail}
                      onChange={(e) => setNewAuthorEmail(e.target.value)}
                      className="bg-[#F8F9F7] border-[#E2E6DF] rounded-xl text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="newAuthorBio" className="text-xs font-bold uppercase tracking-wider text-[#0F3D3E]">
                    Author Biography (Optional)
                  </Label>
                  <Textarea
                    id="newAuthorBio"
                    rows={3}
                    placeholder="Short summary of author's credentials..."
                    value={newAuthorBio}
                    onChange={(e) => setNewAuthorBio(e.target.value)}
                    className="bg-[#F8F9F7] border-[#E2E6DF] rounded-xl text-xs"
                  />
                </div>
              </div>
            )}

            {authorType === "external" && (
              <div className="space-y-2 pt-2 border-t border-[#E2E6DF]">
                <Label htmlFor="externalAuthorName" className="text-xs font-bold uppercase tracking-wider text-[#0F3D3E]">
                  External / Guest Author Name *
                </Label>
                <Input
                  id="externalAuthorName"
                  placeholder="e.g. Leo Tolstoy"
                  value={externalAuthorName}
                  onChange={(e) => setExternalAuthorName(e.target.value)}
                  className="bg-[#F8F9F7] border-[#E2E6DF] rounded-xl text-xs font-bold"
                  required
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* ------------------------------------------------------------------ */}
        {/* 2. BOOK METADATA & DETAILS */}
        {/* ------------------------------------------------------------------ */}
        <Card className="bg-white border border-[#E2E6DF] shadow-xs rounded-2xl overflow-hidden">
          <CardHeader className="p-6 bg-[#F8F9F7] border-b border-[#E2E6DF]">
            <CardTitle className="font-serif font-bold text-lg text-[#0F3D3E]">
              Book Details & Pricing
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            
            <div className="space-y-2">
              <Label htmlFor="title" className="text-xs font-bold uppercase tracking-wider text-[#0F3D3E]">
                Book Title *
              </Label>
              <Input
                id="title"
                name="title"
                required
                placeholder="e.g. The Art of Modern Leadership"
                value={formData.title}
                onChange={handleInputChange}
                className="bg-[#F8F9F7] border-[#E2E6DF] rounded-xl text-xs font-bold"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-xs font-bold uppercase tracking-wider text-[#0F3D3E]">
                Description *
              </Label>
              <Textarea
                id="description"
                name="description"
                required
                rows={4}
                placeholder="Write a compelling description for the book catalog..."
                value={formData.description}
                onChange={handleInputChange}
                className="bg-[#F8F9F7] border-[#E2E6DF] rounded-xl text-xs"
              />
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="category" className="text-xs font-bold uppercase tracking-wider text-[#0F3D3E]">
                  Category *
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(val) => setFormData((prev) => ({ ...prev, category: val }))}
                >
                  <SelectTrigger className="bg-[#F8F9F7] border-[#E2E6DF] rounded-xl text-xs font-bold">
                    <SelectValue placeholder={fetchingCategories ? "Loading categories..." : "Select Category"} />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-[#E2E6DF]">
                    {categoriesList.length > 0 ? (
                      categoriesList.map((cat: any) => (
                        <SelectItem key={cat._id || cat.id || cat.name} value={cat._id || cat.id || cat.name}>
                          {cat.name}
                        </SelectItem>
                      ))
                    ) : (
                      <>
                        <SelectItem value="Fiction">Fiction</SelectItem>
                        <SelectItem value="Non-Fiction">Non-Fiction</SelectItem>
                        <SelectItem value="Business & Leadership">Business & Leadership</SelectItem>
                        <SelectItem value="Technology">Technology</SelectItem>
                        <SelectItem value="Self Help">Self Help</SelectItem>
                        <SelectItem value="Children">Children</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="isbn" className="text-xs font-bold uppercase tracking-wider text-[#0F3D3E]">
                  ISBN
                </Label>
                <Input
                  id="isbn"
                  name="isbn"
                  placeholder="e.g. 978-3-16-148410-0"
                  value={formData.isbn}
                  onChange={handleInputChange}
                  className="bg-[#F8F9F7] border-[#E2E6DF] rounded-xl text-xs font-mono"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status" className="text-xs font-bold uppercase tracking-wider text-[#0F3D3E]">
                  Status
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(val) => setFormData((prev) => ({ ...prev, status: val }))}
                >
                  <SelectTrigger className="bg-[#F8F9F7] border-[#E2E6DF] rounded-xl text-xs font-bold">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-[#E2E6DF]">
                    <SelectItem value="published">Published (Active)</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="price" className="text-xs font-bold uppercase tracking-wider text-[#0F3D3E]">
                  Price (₹) *
                </Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  required
                  placeholder="e.g. 499"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="bg-[#F8F9F7] border-[#E2E6DF] rounded-xl text-xs font-mono font-bold"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="discountPrice" className="text-xs font-bold uppercase tracking-wider text-[#0F3D3E]">
                  Discount Price (₹)
                </Label>
                <Input
                  id="discountPrice"
                  name="discountPrice"
                  type="number"
                  min="0"
                  placeholder="e.g. 399"
                  value={formData.discountPrice}
                  onChange={handleInputChange}
                  className="bg-[#F8F9F7] border-[#E2E6DF] rounded-xl text-xs font-mono font-bold text-[#D4AF37]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock" className="text-xs font-bold uppercase tracking-wider text-[#0F3D3E]">
                  Initial Stock *
                </Label>
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  min="0"
                  required
                  value={formData.stock}
                  onChange={handleInputChange}
                  className="bg-[#F8F9F7] border-[#E2E6DF] rounded-xl text-xs font-mono font-bold"
                />
              </div>
            </div>

            <div className="space-y-4 border border-[#E2E6DF] rounded-2xl p-5 bg-[#F8F9F7]">
              <h3 className="font-serif font-bold text-sm text-[#0F3D3E]">
                Display & Marketing Flags
              </h3>
              <div className="grid gap-6 md:grid-cols-3">
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="isFeatured" className="flex flex-col space-y-1 cursor-pointer">
                    <span className="font-bold text-xs">Feature on Home</span>
                    <span className="font-normal text-[11px] text-[#5C6E6E]">Show in hero carousel</span>
                  </Label>
                  <Switch
                    id="isFeatured"
                    checked={formData.isFeatured}
                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isFeatured: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="isBestseller" className="flex flex-col space-y-1 cursor-pointer">
                    <span className="font-bold text-xs text-[#D4AF37]">Bestseller</span>
                    <span className="font-normal text-[11px] text-[#5C6E6E]">Add bestseller badge</span>
                  </Label>
                  <Switch
                    id="isBestseller"
                    checked={formData.isBestseller}
                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isBestseller: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="isNewRelease" className="flex flex-col space-y-1 cursor-pointer">
                    <span className="font-bold text-xs text-emerald-700">New Release</span>
                    <span className="font-normal text-[11px] text-[#5C6E6E]">Add new release badge</span>
                  </Label>
                  <Switch
                    id="isNewRelease"
                    checked={formData.isNewRelease}
                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isNewRelease: checked }))}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-[#0F3D3E]">
                Cover Image (Upload)
              </Label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[#E2E6DF] rounded-2xl cursor-pointer bg-[#F8F9F7] hover:bg-[#F0F2ED] transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-[#5C6E6E]" />
                    <p className="mb-1 text-xs text-[#5C6E6E]">
                      <span className="font-bold text-[#0F3D3E]">Click to upload cover image</span> or drag and drop
                    </p>
                    <p className="text-[11px] text-[#5C6E6E]">
                      {imageFile ? imageFile.name : "JPG, PNG, WebP image formats"}
                    </p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto bg-[#0F3D3E] hover:bg-[#174C4D] text-[#D4AF37] border border-[#D4AF37]/50 font-serif font-bold h-12 px-8 rounded-xl shadow-xs gap-2 text-xs"
              >
                {loading ? (
                  "Publishing Book..."
                ) : (
                  <>
                    <Save className="w-4 h-4 text-[#D4AF37]" />
                    Save & Publish Book
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
