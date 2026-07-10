import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://harglim.com'; // Fallback to production URL if env is missing
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://harglimpublish-backend.onrender.com/api';

  try {
    // Fetch all books, categories, and authors for the sitemap
    const [booksRes, categoriesRes, authorsRes] = await Promise.all([
      fetch(`${API_URL}/books?limit=1000`, { next: { revalidate: 3600 } }).catch(() => null),
      fetch(`${API_URL}/categories?limit=100`, { next: { revalidate: 3600 } }).catch(() => null),
      fetch(`${API_URL}/authors?limit=1000`, { next: { revalidate: 3600 } }).catch(() => null)
    ]);

    const booksData = booksRes && booksRes.ok ? await booksRes.json() : { data: [] };
    const categoriesData = categoriesRes && categoriesRes.ok ? await categoriesRes.json() : { data: [] };
    const authorsData = authorsRes && authorsRes.ok ? await authorsRes.json() : { data: [] };

    const books = Array.isArray(booksData?.data) ? booksData.data : (Array.isArray(booksData) ? booksData : []);
    const categories = Array.isArray(categoriesData?.data) ? categoriesData.data : (Array.isArray(categoriesData) ? categoriesData : []);
    const authors = Array.isArray(authorsData?.data) ? authorsData.data : (Array.isArray(authorsData) ? authorsData : []);

    const sitemapEntries: MetadataRoute.Sitemap = [
      { url: `${baseUrl}`, lastModified: new Date() },
      { url: `${baseUrl}/about`, lastModified: new Date() },
      { url: `${baseUrl}/contact`, lastModified: new Date() },
      { url: `${baseUrl}/publish`, lastModified: new Date() },
      { url: `${baseUrl}/books`, lastModified: new Date() },
      { url: `${baseUrl}/authors`, lastModified: new Date() },
      { url: `${baseUrl}/categories`, lastModified: new Date() },
    ];

    // Add books
    books.forEach((book: any) => {
      if (book.slug || book._id) {
        sitemapEntries.push({
          url: `${baseUrl}/books/${book.slug || book._id}`,
          lastModified: new Date(book.updatedAt || new Date()),
        });
      }
    });

    // Add categories
    categories.forEach((cat: any) => {
      if (cat.slug || cat.name) {
        const slug = cat.slug || cat.name.toLowerCase().replace(/ /g, '-');
        sitemapEntries.push({
          url: `${baseUrl}/categories/${slug}`,
          lastModified: new Date(cat.updatedAt || new Date()),
        });
      }
    });

    // Add authors
    authors.forEach((author: any) => {
      if (author._id) {
        sitemapEntries.push({
          url: `${baseUrl}/authors/${author._id}`,
          lastModified: new Date(author.updatedAt || new Date()),
        });
      }
    });

    return sitemapEntries;
  } catch (error) {
    // Fallback static sitemap if backend is down
    return [
      { url: `${baseUrl}`, lastModified: new Date() },
      { url: `${baseUrl}/books`, lastModified: new Date() },
    ];
  }
}
