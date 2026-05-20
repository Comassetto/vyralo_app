import { redirect } from 'next/navigation'
import Link from 'next/link'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { CreditCounter } from '@/components/CreditCounter'

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      generations: {
        orderBy: { createdAt: 'desc' },
        take: 3,
      },
    },
  })

  if (!user) redirect('/login')

  // Verificar reset mensal de créditos
  const agora = new Date()
  const ultimoReset = new Date(user.creditsResetAt)
  if (
    agora.getMonth() !== ultimoReset.getMonth() ||
    agora.getFullYear() !== ultimoReset.getFullYear()
  ) {
    const creditosPorPlano: Record<string, number> = { STARTER: 60, PRO: 200, AGENCIA: 700 }
    await prisma.user.update({
      where: { id: user.id },
      data: {
        credits: creditosPorPlano[user.plan] || 60,
        creditsResetAt: agora,
      },
    })
  }

  const totalGeracoes = await prisma.generation.count({ where: { userId: user.id } })
  const inicioMes = new Date(agora.getFullYear(), agora.getMonth(), 1)
  const geracoesMes = await prisma.generation.count({
    where: { userId: user.id, createdAt: { gte: inicioMes } },
  })

  const redeLabels: Record<string, string> = {
    instagram: 'Instagram',
    linkedin: 'LinkedIn',
    tiktok: 'TikTok',
    twitter: 'Twitter/X',
    facebook: 'Facebook',
    pinterest: 'Pinterest',
  }

  const estiloLabels: Record<string, string> = {
    moderno: 'Moderno',
    clean: 'Clean',
    dark: 'Dark',
    premium: 'Premium',
    colorido: 'Colorido',
    minimalista: 'Minimalista',
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Saudação */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: '#1A1F36' }}>
          Olá, {user.name.split(' ')[0]}! 👋
        </h1>
        <p className="text-gray-500 mt-1">Pronto para criar conteúdo incrível hoje?</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Créditos */}
        <div className="lg:col-span-1">
          <CreditCounter credits={user.credits} plan={user.plan} />
        </div>

        {/* Stats */}
        <div className="lg:col-span-2 grid grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl border p-6" style={{ borderColor: '#E8EAF0' }}>
            <p className="text-sm text-gray-500 mb-1">Carrosséis criados</p>
            <p className="text-3xl font-bold" style={{ color: '#1A1F36' }}>{totalGeracoes}</p>
            <p className="text-xs text-gray-400 mt-1">no total</p>
          </div>
          <div className="bg-white rounded-2xl border p-6" style={{ borderColor: '#E8EAF0' }}>
            <p className="text-sm text-gray-500 mb-1">Este mês</p>
            <p className="text-3xl font-bold" style={{ color: '#1A1F36' }}>{geracoesMes}</p>
            <p className="text-xs text-gray-400 mt-1">carrosséis gerados</p>
          </div>
        </div>
      </div>

      {/* CTA Principal */}
      <div className="rounded-2xl p-8 mb-8 text-center relative overflow-hidden" style={{
        background: 'linear-gradient(135deg, #7B2FFF 0%, #00E5FF 100%)',
      }}>
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 20% 80%, white 0%, transparent 60%), radial-gradient(circle at 80% 20%, white 0%, transparent 60%)',
        }} />
        <h2 className="text-2xl font-bold text-white mb-2 relative">Criar novo carrossel</h2>
        <p className="text-white/70 mb-6 relative">Transforme sua ideia em slides profissionais em segundos</p>
        <Link
          href="/gerar"
          className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-xl font-semibold text-sm transition-transform hover:scale-105 relative"
          style={{ color: '#7B2FFF' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          Começar agora
        </Link>
      </div>

      {/* Últimas gerações */}
      {user.generations.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold" style={{ color: '#1A1F36' }}>Recentes</h2>
            <Link href="/historico" className="text-sm font-medium" style={{ color: '#7B2FFF' }}>
              Ver todos →
            </Link>
          </div>

          <div className="space-y-3">
            {user.generations.map(gen => (
              <div key={gen.id} className="bg-white rounded-xl border p-4 flex items-center justify-between" style={{ borderColor: '#E8EAF0' }}>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{
                    background: 'linear-gradient(135deg, rgba(123,47,255,0.1) 0%, rgba(0,229,255,0.1) 100%)',
                  }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7B2FFF" strokeWidth="2">
                      <rect x="3" y="3" width="8" height="8" rx="1"/>
                      <rect x="13" y="3" width="8" height="8" rx="1"/>
                      <rect x="3" y="13" width="8" height="8" rx="1"/>
                      <rect x="13" y="13" width="8" height="8" rx="1"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-sm" style={{ color: '#1A1F36' }}>{gen.tema}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {redeLabels[gen.rede] || gen.rede} · {estiloLabels[gen.estilo] || gen.estilo} · {gen.numSlides} slides
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400">
                    {new Date(gen.createdAt).toLocaleDateString('pt-BR')}
                  </span>
                  <Link
                    href={`/gerar?regenerar=${gen.id}`}
                    className="text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors hover:border-purple-300"
                    style={{ borderColor: '#E8EAF0', color: '#7B2FFF' }}
                  >
                    Regenerar
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {user.generations.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border" style={{ borderColor: '#E8EAF0' }}>
          <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center mb-4" style={{
            background: 'linear-gradient(135deg, rgba(123,47,255,0.1) 0%, rgba(0,229,255,0.1) 100%)',
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#7B2FFF" strokeWidth="1.5">
              <rect x="3" y="3" width="8" height="8" rx="1"/>
              <rect x="13" y="3" width="8" height="8" rx="1"/>
              <rect x="3" y="13" width="8" height="8" rx="1"/>
              <rect x="13" y="13" width="8" height="8" rx="1"/>
            </svg>
          </div>
          <h3 className="font-semibold mb-1" style={{ color: '#1A1F36' }}>Nenhum carrossel ainda</h3>
          <p className="text-sm text-gray-400 mb-4">Crie seu primeiro carrossel agora!</p>
          <Link
            href="/gerar"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white"
            style={{ background: 'linear-gradient(135deg, #7B2FFF 0%, #00E5FF 100%)' }}
          >
            Criar meu primeiro carrossel
          </Link>
        </div>
      )}
    </div>
  )
}
