import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { ClienteActions } from '@/components/ClienteActions'

export default async function ClientePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const cliente = await prisma.user.findUnique({
    where: { id },
    include: {
      generations: {
        orderBy: { createdAt: 'desc' },
        take: 20,
      },
      _count: { select: { generations: true } },
    },
  })

  if (!cliente || cliente.role !== 'CLIENT') notFound()

  const planLabels: Record<string, string> = { STARTER: 'Starter', PRO: 'Pro', AGENCIA: 'Agência' }
  const planCredits: Record<string, number> = { STARTER: 60, PRO: 200, AGENCIA: 700 }

  const redeLabels: Record<string, string> = {
    instagram: 'Instagram', linkedin: 'LinkedIn', tiktok: 'TikTok',
    twitter: 'Twitter/X', facebook: 'Facebook', pinterest: 'Pinterest',
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/admin/clientes" className="text-sm text-gray-400 hover:text-gray-600">← Clientes</Link>
        <span className="text-gray-300">/</span>
        <span className="text-sm font-medium" style={{ color: '#1A1F36' }}>{cliente.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Info do cliente */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-2xl border p-6" style={{ borderColor: '#E8EAF0' }}>
            <div className="text-center mb-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold text-white mx-auto mb-3" style={{
                background: 'linear-gradient(135deg, #7B2FFF, #00E5FF)',
              }}>
                {cliente.name.charAt(0).toUpperCase()}
              </div>
              <h2 className="font-bold text-lg" style={{ color: '#1A1F36' }}>{cliente.name}</h2>
              <p className="text-gray-400 text-sm">{cliente.email}</p>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center py-2 border-b" style={{ borderColor: '#F0F0F5' }}>
                <span className="text-gray-500">Plano</span>
                <span className="font-semibold px-2 py-0.5 rounded-full text-white text-xs" style={{
                  background: 'linear-gradient(135deg, #7B2FFF, #00E5FF)',
                }}>
                  {planLabels[cliente.plan] || cliente.plan}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b" style={{ borderColor: '#F0F0F5' }}>
                <span className="text-gray-500">Créditos</span>
                <span className={`font-bold ${cliente.credits < 10 ? 'text-amber-500' : ''}`} style={cliente.credits >= 10 ? { color: '#1A1F36' } : {}}>
                  {cliente.credits} / {planCredits[cliente.plan] || 60}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b" style={{ borderColor: '#F0F0F5' }}>
                <span className="text-gray-500">Gerações</span>
                <span className="font-semibold" style={{ color: '#1A1F36' }}>{cliente._count.generations}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b" style={{ borderColor: '#F0F0F5' }}>
                <span className="text-gray-500">Status</span>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${cliente.active ? 'text-green-700 bg-green-50 border border-green-200' : 'text-red-600 bg-red-50 border border-red-200'}`}>
                  {cliente.active ? 'Ativo' : 'Pausado'}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-500">Cadastro</span>
                <span className="text-xs text-gray-500">
                  {new Date(cliente.createdAt).toLocaleDateString('pt-BR')}
                </span>
              </div>
            </div>
          </div>

          {/* Ações do cliente */}
          <ClienteActions cliente={{
            id: cliente.id,
            name: cliente.name,
            email: cliente.email,
            plan: cliente.plan,
            credits: cliente.credits,
            active: cliente.active,
          }} />
        </div>

        {/* Histórico de gerações */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border" style={{ borderColor: '#E8EAF0' }}>
            <div className="p-5 border-b" style={{ borderColor: '#E8EAF0' }}>
              <h3 className="font-semibold" style={{ color: '#1A1F36' }}>
                Histórico de gerações ({cliente._count.generations})
              </h3>
            </div>
            <div className="divide-y" style={{ borderColor: '#F0F0F5' }}>
              {cliente.generations.map(gen => (
                <div key={gen.id} className="px-5 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium" style={{ color: '#1A1F36' }}>{gen.tema}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {redeLabels[gen.rede] || gen.rede} · {gen.estilo} · {gen.numSlides} slides · {gen.creditsUsed} crédito{gen.creditsUsed > 1 ? 's' : ''}
                      </p>
                    </div>
                    <span className="text-xs text-gray-400 flex-shrink-0 ml-4">
                      {new Date(gen.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                    </span>
                  </div>
                </div>
              ))}
              {cliente.generations.length === 0 && (
                <div className="py-10 text-center text-sm text-gray-400">
                  Nenhuma geração ainda.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
