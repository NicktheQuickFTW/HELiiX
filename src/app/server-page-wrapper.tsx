import { ReactNode } from 'react';
import { Meta } from '@/components/modules';
import { pageMetadata } from '@/app/resources/seo';

interface ServerPageWrapperProps {
  children: ReactNode;
  pageKey: keyof typeof pageMetadata;
  path: string;
  title?: string;
  description?: string;
}

export async function generateMetadata(
  pageKey: keyof typeof pageMetadata,
  path: string,
  customTitle?: string,
  customDescription?: string
) {
  const pageData = pageMetadata[pageKey];
  
  return Meta.generate({
    ...pageData,
    title: customTitle || pageData.title,
    description: customDescription || pageData.description,
    path,
  });
}

// Example usage in a server component:
// export { generateMetadata } from '@/app/server-page-wrapper';
// 
// export async function generateMetadata() {
//   return generateMetadata('dashboard', '/dashboard');
// }