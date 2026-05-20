import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'

export default async function HomePage() {
  const session = await auth()
  if (session?.user?.role === 'ADMIN') redirect('/admin/dashboard')
  if (session?.user) redirect('/dashboard')
  redirect('/login')
}
