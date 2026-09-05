"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import api from "@/lib/api";
import { ArrowLeft, Save, Upload } from "lucide-react";
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

export default function EditBookPage() {
  const router = useRouter();
  const routeParams = useParams();
  const bookId = (routeParams?.id as string) || "";

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    authorName: "",
    description: "",
    category: "",
    price: "",
    discountPrice: "",
    stock: "0",
    isbn: "",
    status: "Active",
    isFeatured: false,
    isBestseller: false,
    isNewRelease: false,
    royaltyPercentage: "",
  });

  const [categoriesList, setCategoriesList] = useState<any[]>([]);
  const [authorsList, setAuthorsList] = useState<any[]>([]);
  const [selectedAuthorId, setSelectedAuthorId] = useState<string>("");

  useEffect(() => {
    const loadCategoriesAndAuthors = async () => {
      try {
        const [catRes, usersRes, authorsRes] = await Promise.allSettled([
          api.get("/categories").catch(() => api.get("/admin/categories")),
          api.get("/admin/users", { params: { limit: 100 } }),
          api.get("/authors", { params: { limit: 100 } }),
        ]);

        if (catRes.status === "fulfilled" && catRes.value?.data) {
          const cData = catRes.value.data;
          const items = cData?.data?.categories || cData?.data || cData || [];
          setCategoriesList(Array.isArray(items) ? items : []);
        }

        const authorsMap = new Map<string, any>();

        if (usersRes.status === "fulfilled" && usersRes.value?.data) {
          const uData = usersRes.value.data;
          const uList = uData?.data?.users || (Array.isArray(uData?.data) ? uData.data : []) || (Array.isArray(uData) ? uData : []);
          if (Array.isArray(uList)) {
            uList.forEach((u: any) => {
              const id = u._id || u.id;
              if (id) {
                authorsMap.set(String(id), {
                  _id: String(id),
                  name: u.name || u.fullName || u.email || "Registered User",
                  email: u.email || "",
                  role: u.role || "user",
                });
              }
            });
          }
        }

        if (authorsRes.status === "fulfilled" && authorsRes.value?.data) {
          const aData = authorsRes.value.data;
          const aList = aData?.data?.authors || aData?.authors || (Array.isArray(aData?.data) ? aData.data : []) || (Array.isArray(aData) ? aData : []);
          if (Array.isArray(aList)) {
            aList.forEach((a: any) => {
              const userId = a.user?._id || a.user?.id || a.userId || a._id || a.id;
              const aName = a.name || a.user?.name || a.fullName;
              if (userId && aName) {
                if (authorsMap.has(String(userId))) {
                  const existing = authorsMap.get(String(userId));
                  authorsMap.set(String(userId), { ...existing, name: aName, role: "author" });
                } else {
                  authorsMap.set(String(userId), {
                    _id: String(userId),
                    name: aName,
                    email: a.email || a.user?.email || "",
                    role: "author",
                  });
                }
              }
            });
          }
        }

        const combined = Array.from(authorsMap.values());
        combined.sort((a, b) => {
          const aIsAuthor = a.role === "author" ? 0 : 1;
          const bIsAuthor = b.role === "author" ? 0 : 1;
          if (aIsAuthor !== bIsAuthor) return aIsAuthor - bIsAuthor;
          return (a.name || "").localeCompare(b.name || "");
        });

        setAuthorsList(combined);
      } catch (err) {
        console.warn("Failed to load categories and authors:", err);
      }
    };
    loadCategoriesAndAuthors();
  }, []);

  useEffect(() => {
    if (!bookId) return;

    const fetchBook = async () => {
      setFetching(true);
      try {
        let bookData: any = null;

        // Tier 1: Try /admin/books/:id
        const res1 = await api.get(`/admin/books/${bookId}`).catch(() => null);
        if (res1?.data) {
          bookData = res1.data.data || res1.data;
        }

        // Tier 2: Try /books/:id
        if (!bookData) {
          const res2 = await api.get(`/books/${bookId}`).catch(() => null);
          if (res2?.data) {
            bookData = res2.data.data || res2.data;
          }
        }

        // Tier 3: Search list in /books
        if (!bookData) {
          const res3 = await api.get(`/books?limit=100`).catch(() => null);
          const list = res3?.data?.data?.books || res3?.data?.data || res3?.data || [];
          if (Array.isArray(list)) {
            bookData = list.find(
              (b: any) => (b._id || b.id) === bookId || b.slug === bookId
            );
          }
        }

        if (bookData) {
          const extractedAuthorId =
            typeof bookData.author === "object" && bookData.author !== null
              ? bookData.author._id || bookData.author.id || ""
              : typeof bookData.author === "string" && /^[0-9a-fA-F]{24}$/.test(bookData.author)
              ? bookData.author
              : "";

          if (extractedAuthorId) {
            setSelectedAuthorId(extractedAuthorId);
          }

          const extractedAuthorName =
            typeof bookData.author === "object" && bookData.author !== null
              ? bookData.author?.name || ""
              : bookData.authorName ||
                (typeof bookData.author === "string" && !/^[0-9a-fA-F]{24}$/.test(bookData.author)
                  ? bookData.author
                  : "");

          setFormData({
            title: bookData.title || "",
            authorName: extractedAuthorName,
            description: bookData.description || "",
            category:
              typeof bookData.category === "object"
                ? bookData.category?._id || bookData.category?.id || ""
                : bookData.category || "",
            price: (bookData.mrp || bookData.price)?.toString() || "",
            discountPrice: bookData.discountPrice?.toString() || "",
            stock: bookData.stock?.toString() || "0",
            isbn: bookData.isbn || "",
            status: bookData.status === "Active" ? "published" : (bookData.status || "published"),
            isFeatured: Boolean(bookData.isFeatured),
            isBestseller: Boolean(bookData.isBestseller),
            isNewRelease: Boolean(bookData.isNewRelease),
            royaltyPercentage: bookData.royaltyPercentage?.toString() || "",
          });
        } else {
          toast.error("Book not found in database.");
        }
      } catch (err) {
        console.error("Failed to fetch book details:", err);
        toast.error("Could not load book data.");
      } finally {
        setFetching(false);
      }
    };

    fetchBook();
  }, [bookId]);

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
    setLoading(true);

    try {
      let coverImageUrl: string | undefined = undefined;
      if (imageFile) {
        try {
          const uploadFormData = new FormData();
          uploadFormData.append("image", imageFile);

          const uploadRes = await api.post("/uploads/image", uploadFormData, {
            headers: { "Content-Type": undefined },
          }).catch(() => api.post("/uploads/publishing-image", uploadFormData, {
            headers: { "Content-Type": undefined },
          }));

          coverImageUrl = uploadRes?.data?.data?.url || uploadRes?.data?.url;
        } catch (uploadErr) {
          console.warn("Image upload warning:", uploadErr);
        }
      }

      const numericPrice = Number(formData.price) || 0;
      const statusValue = formData.status === "Active" ? "published" : formData.status;

      const jsonPayload: Record<string, any> = {
        title: formData.title.trim(),
        authorName: formData.authorName.trim(),
        description: formData.description.trim(),
        category: formData.category,
        mrp: numericPrice,
        price: numericPrice,
        discountPrice: formData.discountPrice
          ? Number(formData.discountPrice)
          : undefined,
        stock: Number(formData.stock) || 0,
        isbn: formData.isbn.trim() || undefined,
        status: statusValue,
        isFeatured: Boolean(formData.isFeatured),
        isBestseller: Boolean(formData.isBestseller),
        isNewRelease: Boolean(formData.isNewRelease),
        royaltyPercentage: formData.royaltyPercentage
          ? Number(formData.royaltyPercentage)
          : undefined,
      };

      // Ensure author user ObjectId is passed to backend
      if (selectedAuthorId && /^[0-9a-fA-F]{24}$/.test(selectedAuthorId)) {
        jsonPayload.author = selectedAuthorId;
      }

      if (coverImageUrl) {
        jsonPayload.coverImage = coverImageUrl;
      }

      await api
        .put(`/admin/books/${bookId}`, jsonPayload)
        .catch(() => api.put(`/books/${bookId}`, jsonPayload));

      toast.success("Book updated successfully!");
      router.push("/admin/books");
    } catch (err: any) {
      console.error("Failed to update book:", err);
      toast.error(err?.response?.data?.message || err?.message || "Failed to update book");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-[#0F3D3E]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto text-[#0F3D3E]">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/books">
            <ArrowLeft className="h-5 w-5 text-[#0F3D3E]" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-serif font-bold lg:text-3xl text-[#0F3D3E]">Edit Book</h1>
          <p className="text-sm text-[#5C6E6E] mt-1 font-sans">
            Update the title, author, pricing, stock, and marketing flags of the book
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="bg-white border border-[#E2E6DF] shadow-sm rounded-2xl">
          <CardHeader className="border-b border-[#E2E6DF] bg-[#F8F9F7]">
            <CardTitle className="font-serif font-bold text-lg text-[#0F3D3E]">
              Book Details & Metadata
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-xs font-bold uppercase tracking-wider text-[#0F3D3E]">
                  Book Title *
                </Label>
                <Input
                  id="title"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  className="bg-[#F8F9F7] border-[#E2E6DF] rounded-xl text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="authorSelect" className="text-xs font-bold uppercase tracking-wider text-[#0F3D3E]">
                  Author Account & Attribution *
                </Label>
                {authorsList.length > 0 && (
                  <Select
                    value={selectedAuthorId}
                    onValueChange={(val) => {
                      setSelectedAuthorId(val);
                      const found = authorsList.find((a) => (a._id || a.id) === val);
                      if (found) {
                        setFormData((prev) => ({ ...prev, authorName: found.name || "" }));
                      }
                    }}
                  >
                    <SelectTrigger className="w-full bg-[#F8F9F7] border-[#E2E6DF] rounded-xl h-10 text-xs font-serif font-bold">
                      <SelectValue placeholder="Assign author account..." />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-[#E2E6DF] max-h-64">
                      {authorsList.map((a) => (
                        <SelectItem key={a._id || a.id} value={a._id || a.id} className="text-xs py-2">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-[#0F3D3E]">{a.name}</span>
                            {a.email && <span className="text-[#5C6E6E] text-[11px]">({a.email})</span>}
                            {a.role === "author" && (
                              <span className="px-1.5 py-0.5 text-[10px] bg-emerald-500/10 text-emerald-700 rounded-md font-semibold">
                                Author
                              </span>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                <Input
                  id="authorName"
                  name="authorName"
                  required
                  placeholder="Author Display Name"
                  value={formData.authorName}
                  onChange={handleInputChange}
                  className="bg-[#F8F9F7] border-[#E2E6DF] rounded-xl text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-xs font-bold uppercase tracking-wider text-[#0F3D3E]">
                Description *
              </Label>
              <Textarea
                id="description"
                name="description"
                required
                rows={5}
                value={formData.description}
                onChange={handleInputChange}
                className="bg-[#F8F9F7] border-[#E2E6DF] rounded-xl text-sm"
              />
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="category" className="text-xs font-bold uppercase tracking-wider text-[#0F3D3E]">
                  Category *
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(val) =>
                    setFormData((prev) => ({ ...prev, category: val }))
                  }
                >
                  <SelectTrigger className="bg-[#F8F9F7] border-[#E2E6DF] rounded-xl text-sm">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-[#E2E6DF]">
                    {categoriesList.length > 0 ? (
                      categoriesList.map((cat: any) => (
                        <SelectItem key={cat._id || cat.id} value={cat._id || cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="General">General</SelectItem>
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
                  value={formData.isbn}
                  onChange={handleInputChange}
                  className="bg-[#F8F9F7] border-[#E2E6DF] rounded-xl text-sm font-mono"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status" className="text-xs font-bold uppercase tracking-wider text-[#0F3D3E]">
                  Status
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(val) =>
                    setFormData((prev) => ({ ...prev, status: val }))
                  }
                >
                  <SelectTrigger className="bg-[#F8F9F7] border-[#E2E6DF] rounded-xl text-sm font-bold">
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
                  value={formData.price}
                  onChange={handleInputChange}
                  className="bg-[#F8F9F7] border-[#E2E6DF] rounded-xl text-sm font-bold font-mono"
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
                  value={formData.discountPrice}
                  onChange={handleInputChange}
                  className="bg-[#F8F9F7] border-[#E2E6DF] rounded-xl text-sm font-bold font-mono text-[#D4AF37]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock" className="text-xs font-bold uppercase tracking-wider text-[#0F3D3E]">
                  Stock *
                </Label>
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  min="0"
                  required
                  value={formData.stock}
                  onChange={handleInputChange}
                  className="bg-[#F8F9F7] border-[#E2E6DF] rounded-xl text-sm font-bold font-mono"
                />
              </div>
            </div>

            <div className="space-y-4 border border-[#E2E6DF] rounded-2xl p-5 bg-[#F8F9F7]">
              <h3 className="font-serif font-bold text-base text-[#0F3D3E]">
                Display & Marketing Badges
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
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, isFeatured: checked }))
                    }
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
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, isBestseller: checked }))
                    }
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
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, isNewRelease: checked }))
                    }
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-[#0F3D3E]">
                Cover Image (Upload New)
              </Label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[#E2E6DF] rounded-2xl cursor-pointer bg-[#F8F9F7] hover:bg-[#F0F2ED] transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-[#5C6E6E]" />
                    <p className="mb-1 text-xs text-[#5C6E6E]">
                      <span className="font-bold text-[#0F3D3E]">Click to upload new cover</span> or drag and drop
                    </p>
                    <p className="text-[11px] text-[#5C6E6E]">
                      {imageFile ? imageFile.name : "Leave empty to retain current book cover"}
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
                className="w-full sm:w-auto bg-[#0F3D3E] hover:bg-[#174C4D] text-[#D4AF37] border border-[#D4AF37]/50 font-serif font-bold h-12 px-8 rounded-xl shadow-xs"
              >
                {loading ? (
                  "Updating Book..."
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2 text-[#D4AF37]" />
                    Update Book Details
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
