import { Metadata } from 'next';

interface MetaConfig {
  title: string;
  description: string;
  baseURL: string;
  path?: string;
  type?: 'website' | 'article';
  image?: string;
  author?: {
    name: string;
    url: string;
  };
  keywords?: string[];
  alternates?: {
    canonical?: string;
  };
  robots?: {
    index?: boolean;
    follow?: boolean;
  };
}

export class Meta {
  static generate(config: MetaConfig): Metadata {
    const {
      title,
      description,
      baseURL,
      path = '',
      type = 'website',
      image,
      author,
      keywords,
      alternates,
      robots
    } = config;

    const url = `${baseURL}${path}`;
    const imageUrl = image ? `${baseURL}${image}` : undefined;

    const metadata: Metadata = {
      title,
      description,
      keywords,
      authors: author ? [{ name: author.name, url: author.url }] : undefined,
      metadataBase: new URL(baseURL),
      alternates: {
        canonical: alternates?.canonical || url,
      },
      robots: robots ? {
        index: robots.index ?? true,
        follow: robots.follow ?? true,
      } : undefined,
      openGraph: {
        title,
        description,
        type,
        url,
        images: imageUrl ? [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: title,
          }
        ] : undefined,
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: imageUrl ? [imageUrl] : undefined,
      },
    };

    return metadata;
  }
}