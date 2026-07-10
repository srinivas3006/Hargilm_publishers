import { Metadata } from 'next';

type Props = {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
};

const getAuthorData = async (id: string) => {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://harglimpublish-backend.onrender.com/api';
    const res = await fetch(`${API_URL}/authors/${id}`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data || data;
  } catch (error) {
    return null;
  }
};

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  const author = await getAuthorData(id);
  
  if (!author) return {};
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://harglim.com';

  const title = `${author.name} | Author Profile`;
  const description = author.bio || `Read books by ${author.name} on Harglim Publishers.`;

  return {
    title,
    description: description.substring(0, 160),
    alternates: {
      canonical: `${APP_URL}/authors/${id}`,
    },
    openGraph: {
      title,
      description: description.substring(0, 160),
      images: author.profileImage ? [author.profileImage] : [],
      url: `${APP_URL}/authors/${id}`,
    },
  };
}

export default async function AuthorLayout({ children, params }: Props) {
  const resolvedParams = await params;
  const author = await getAuthorData(resolvedParams.id);
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://harglim.com';

  if (!author) return <>{children}</>;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: author.name,
    image: author.profileImage,
    description: author.bio,
    url: `${APP_URL}/authors/${resolvedParams.id}`,
  };

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
        name: 'Authors',
        item: `${APP_URL}/authors`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: author.name,
        item: `${APP_URL}/authors/${resolvedParams.id}`,
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }} />
      {children}
    </>
  );
}
