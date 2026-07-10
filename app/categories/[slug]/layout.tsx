import { Metadata } from 'next';

type Props = {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
};

const getCategoryData = async (slug: string) => {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://harglimpublish-backend.onrender.com/api';
    const res = await fetch(`${API_URL}/categories/${slug}`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data || data;
  } catch (error) {
    return null;
  }
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const category = await getCategoryData(slug);
  
  if (!category) return {};
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://harglim.com';

  const title = `${category.name} Books`;
  const description = category.description || `Explore our collection of books in the ${category.name} category at Harglim Publishers.`;

  return {
    title,
    description: description.substring(0, 160),
    alternates: {
      canonical: `${APP_URL}/categories/${slug}`,
    },
    openGraph: {
      title,
      description: description.substring(0, 160),
      url: `${APP_URL}/categories/${slug}`,
    },
  };
}

export default async function CategoryLayout({ children, params }: Props) {
  const resolvedParams = await params;
  const category = await getCategoryData(resolvedParams.slug);
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://harglim.com';

  if (!category) return <>{children}</>;

  const breadcrumbsJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: APP_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Categories',
        item: `${APP_URL}/categories`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: category.name,
        item: `${APP_URL}/categories/${resolvedParams.slug}`,
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }} />
      {children}
    </>
  );
}
