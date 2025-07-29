import type { Metadata } from 'next';
import { Meta } from '@/components/modules';
import { baseURL } from '@/resources/once-ui.config';

export const metadata: Metadata = Meta.generate({
  title: 'Dashboard - HELiiX Big 12 Operations',
  description:
    'Central operations dashboard for Big 12 Conference athletics management and analytics.',
  baseURL,
  path: '/dashboard',
  keywords: ['Big 12', 'Dashboard', 'Analytics', 'Operations', 'Athletics'],
  robots: {
    index: false,
    follow: false,
  },
});

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
