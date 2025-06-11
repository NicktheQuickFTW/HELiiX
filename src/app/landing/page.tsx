import { redirect } from 'next/navigation'

export default function LandingPage() {
  // Redirect to the overview page for authenticated users
  redirect('/overview')
}