import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://harglim.com';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/author/', '/dashboard/', '/checkout/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
