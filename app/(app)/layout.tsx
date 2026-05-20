import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { Sidebar } from '@/components/Sidebar'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user) redirect('/login')
  if (session.user.role === 'ADMIN') redirect('/admin/dashboard')

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#F7F8FC' }}>
      <Sidebar userName={session.user.name || ''} userEmail={session.user.email || ''} />
      <main className="flex-1 ml-64 p-8 min-h-screen">
        {children}
      </main>
    </div>
  )
}
