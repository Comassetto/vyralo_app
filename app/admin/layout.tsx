import { auth } from '@/lib/auth'
import { AdminSidebar } from '@/components/AdminSidebar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  const isAdmin = session?.user?.role === 'ADMIN'

  if (!isAdmin) {
    // Renderiza sem sidebar (página de login)
    return <>{children}</>
  }

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#F7F8FC' }}>
      <AdminSidebar userName={session!.user.name || 'Admin'} />
      <main className="flex-1 ml-64 p-8 min-h-screen">
        {children}
      </main>
    </div>
  )
}
