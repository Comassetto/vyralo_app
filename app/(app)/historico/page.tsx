import { redirect } from 'next/navigation'
import Link from 'next/link'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export default async function HistoricoPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const generations = await prisma.generation.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
  })

  const redeLabels: Record<string, string> = {
    instagram: 'Instagram', linkedin: 'LinkedIn', tiktok: 'TikTok',
    twitter: 'Twitter/X', facebook: 'Facebook', pinterest: 'Pinterest',
  }

  const estiloLabels: Record<string, string> = {
    moderno: 'Moderno', clean: 'Clean', dark: 'Dark',
    premium: 'Premium', colorido: 'Colorido', minimalista: 'Minimalista',
  }

  const estiloColors: Record<string, string> = {
    moderno: '#1A1F36', clean: '#E8EAF0', dark: '#000000',
    premium: '#1C1C1C', colorido: '#FF6B6B', minimalista: '#FAFAFA',
  }

  const estiloAccents: Record<string, string> = {
    moderno: '#00E5FF', clean: '#7B2FFF', dark: '#00E5FF',
    premium: '#D4AF37', colorido: '#FFE66D', minimalista: '#111111',
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: '#1A1F36' }}>Histórico</h1>
          <p className="text-gray-500 mt-1">Todos os seus carrosséis gerados</p>
        </div>
        <Link
          href="/gerar"
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white"
          style={{ background: 'linear-gradient(135deg, #7B2FFF 0%, #00E5FF 100%)' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          Criar novo
        </Link>
      </div>

      {generations.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border" style={{ borderColor: '#E8EAF0' }}>
          <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center mb-4" style={{
            background: 'linear-gradient(135deg, rgba(123,47,255,0.1), rgba(0,229,255,0.1))',
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#7B2FFF" strokeWidth="1.5">
              <path d="M3 3h18v4H3zM3 10h18v4H3zM3 17h18v4H3z"/>
            </svg>
          </div>
          <h3 className="font-semibold mb-1" style={{ color: '#1A1F36' }}>Nenhum carrossel ainda</h3>
          <p className="text-sm text-gray-400 mb-4">Crie seu primeiro carrossel agora!</p>
          <Link
            href="/gerar"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white"
            style={{ background: 'linear-gradient(135deg, #7B2FFF 0%, #00E5FF 100%)' }}
          >
            Criar carrossel
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {generations.map(gen => (
            <div key={gen.id} className="bg-white rounded-xl border p-5 flex items-center gap-5 hover:shadow-sm transition-shadow" style={{ borderColor: '#E8EAF0' }}>
              {/* Preview de cor do estilo */}
              <div className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center" style={{
                backgroundColor: estiloColors[gen.estilo] || '#1A1F36',
                boxShadow: `inset -4px 0 0 ${estiloAccents[gen.estilo] || '#00E5FF'}`,
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" opacity="0.7">
                  <rect x="3" y="3" width="8" height="8" rx="1"/>
                  <rect x="13" y="3" width="8" height="8" rx="1"/>
                  <rect x="3" y="13" width="8" height="8" rx="1"/>
                  <rect x="13" y="13" width="8" height="8" rx="1"/>
                </svg>
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate" style={{ color: '#1A1F36' }}>{gen.tema}</p>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#F7F8FC', color: '#6B7280' }}>
                    {redeLabels[gen.rede] || gen.rede}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#F7F8FC', color: '#6B7280' }}>
                    {estiloLabels[gen.estilo] || gen.estilo}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#F7F8FC', color: '#6B7280' }}>
                    {gen.numSlides} slides
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(gen.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <Link
                  href={`/gerar/resultado/${gen.id}`}
                  className="text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors"
                  style={{ borderColor: '#E8EAF0', color: '#6B7280' }}
                >
                  Ver slides
                </Link>
                <Link
                  href={`/gerar?regenerar=${gen.id}`}
                  className="text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors"
                  style={{ borderColor: '#E8EAF0', color: '#7B2FFF' }}
                >
                  Regenerar
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
