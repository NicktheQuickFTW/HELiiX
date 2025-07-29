import { Metadata } from 'next';
import { Meta } from '@/components/modules';
import { baseURL, meta } from '@/resources/once-ui.config';
import { Dashboard1 } from '@/components/ui';

export const metadata: Metadata = Meta.generate({
  title: meta.dashboard.title,
  description: meta.dashboard.description,
  baseURL,
  path: '/dashboard',
  keywords: ['Big 12', 'Athletics', 'Operations', 'Dashboard'],
  robots: { index: false, follow: false },
});

export default function DashboardPage() {
  return <Dashboard1 />;
}
