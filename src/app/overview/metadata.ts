import { Meta } from '@/components/modules';
import { pageMetadata } from '@/app/resources/seo';

export async function generateMetadata() {
  return Meta.generate({
    ...pageMetadata.home,
    title: "Platform Overview - HELiiX",
    description: "Comprehensive overview of HELiiX Big 12 Conference operations platform features and capabilities.",
    path: "/overview",
  });
}