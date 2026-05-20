import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function AdminDashboardPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') redirect('/admin/login')

  const agora = new Date()
  const inicioMes = new Date(agora.getFullYear(), agora.getMonth(), 1)
  const inicioDia = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate())

  const [
    totalClientes,
    clientesAtivos,
    geracoesHoje,
    geracoesMes,
    clientesCreditosBaixos,
    ultimosClientes,
  ] = await Promise.all([
    prisma.user.count({ where: { role: 'CLIENT' } }),
    prisma.user.count({ where: { role: 'CLIENT', active: true } }),
    prisma.generation.count({ where: { createdAt: { gte: inicioDia } } }),
    prisma.generation.count({ where: { createdAt: { gte: inicioMes } } }),
    prisma.user.count({ where: { role: 'CLIENT', active: true, credits: { lt: 10 } } }),
    prisma.user.findMany({
      where: { role: 'CLIENT' },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { _count: { select: { generations: true } } },
    }),
  ])

  const planLabels: Record<string, string> = { STARTER: 'Starter', PRO: 'Pro', AGENCIA: 'Agência' }

  const statCards = [
    { label: 'Clientes ativos', value: clientesAtivos, sub: `de ${totalClientes} total`, color: '#7B2FFF' },
    { label: 'Gerações hoje', value: geracoesHoje, sub: 'carrosséis criados', color: '#00E5FF' },
    { label: 'Gerações este mês', value: geracoesMes, sub: 'carrosséis criados', color: '#4A90D9' },
    { label: 'Créditos baixos', value: clientesCreditosBaixos, sub: 'clientes com < 10', color: '#F59E0B' },
  ]

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: '#1A1F36' }}>Dashboard Admin</h1>
        <p className="text-gray-500 mt-1">Visão geral da plataforma Vyralo</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map(card => (
          <div key={card.label} className="bg-white rounded-2xl border p-5" style={{ borderColor: '#E8EAF0' }}>
            <p className="text-sm text-gray-500 mb-2">{card.label}</p>
            <p className="text-3xl font-bold mb-1" style={{ color: '#1A1F36' }}>{card.value}</p>
            <p className="text-xs text-gray-400">{card.sub}</p>
            <div className="mt-3 h-1 rounded-full" style={{ backgroundColor: card.color + '33' }}>
              <div className="h-1 rounded-full w-full" style={{ backgroundColor: card.color }} />
            </div>
          </div>
        ))}
      </div>

      {/* Clientes recentes */}
      <div className="bg-white rounded-2xl border" style={{ borderColor: '#E8EAF0' }}>
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: '#E8EAF0' }}>
          <h2 className="font-semibold" style={{ color: '#1A1F36' }}>Clientes recentes</h2>
          <Link href="/admin/clientes" className="text-sm font-medium" style={{ color: '#7B2FFF' }}>
            Ver todos →
          </Link>
        </div>

        <div className="divide-y" style={{ borderColor: '#E8EAF0' }}>
          {ultimosClientes.map(cliente => (
            <div key={cliente.id} className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0" style={{
                background: 'linear-gradient(135deg, #7B2FFF, #00E5FF)',
              }}>
                {cliente.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate" style={{ color: '#1A1F36' }}>{cliente.name}</p>
                <p className="text-xs text-gray-400 truncate">{cliente.email}</p>
              </div>
              <div className="flex items-center gap-3 text-xs flex-wrap justify-end">
                <span className="px-2 py-0.5 rounded-full font-medium text-white" style={{
                  background: 'linear-gradient(135deg, #7B2FFF, #00E5FF)',
                }}>
                  {planLabels[cliente.plan] || cliente.plan}
                </span>
                <span className="text-gray-400">{cliente.credits} créditos</span>
                <span className="text-gray-400">{cliente._count.generations} gerações</span>
                <span className={`px-2 py-0.5 rounded-full font-medium ${cliente.active ? 'text-green-700 bg-green-50' : 'text-red-600 bg-red-50'}`}>
                  {cliente.active ? 'Ativo' : 'Pausado'}
                </span>
                <Link href={`/admin/clientes/${cliente.id}`} className="text-purple-600 hover:underline font-medium">
                  Gerenciar
                </Link>
              </div>
            </div>
          ))}
          {ultimosClientes.length === 0 && (
            <div className="py-10 text-center text-sm text-gray-400">Nenhum cliente cadastrado ainda.</div>
          )}
        </div>
      </div>
    </div>
  )
}
