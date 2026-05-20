import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { CarrosselViewer } from '@/components/CarrosselViewer'
import type { SlideData } from '@/lib/claude'

export default async function ResultadoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const generation = await prisma.generation.findUnique({ where: { id } })
  if (!generation || generation.userId !== session.user.id) notFound()

  const rawSlides = generation.slides
  const slides: SlideData[] = typeof rawSlides === 'string'
    ? JSON.parse(rawSlides)
    : (rawSlides as unknown as SlideData[])

  const redeLabels: Record<string, string> = {
    instagram: 'Instagram', linkedin: 'LinkedIn', tiktok: 'TikTok',
    twitter: 'Twitter/X', facebook: 'Facebook', pinterest: 'Pinterest',
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href="/gerar" className="text-sm text-gray-400 hover:text-gray-600">← Novo carrossel</Link>
          </div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: '#1A1F36' }}>
            {generation.tema}
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            {redeLabels[generation.rede] || generation.rede} · {generation.estilo} · {slides.length} slides ·{' '}
            {new Date(generation.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
          </p>
        </div>

        <Link
          href="/gerar"
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white"
          style={{ background: 'linear-gradient(135deg, #7B2FFF 0%, #00E5FF 100%)' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          Gerar novo
        </Link>
      </div>

      <CarrosselViewer
        slides={slides}
        estilo={generation.estilo}
        formato={generation.formato as 'quadrado' | 'retrato'}
        legenda={generation.legenda}
      />
    </div>
  )
}
