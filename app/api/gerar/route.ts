import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { gerarCarrossel, calcularCreditos } from '@/lib/claude'

const schema = z.object({
  tema: z.string().min(3).max(200),
  descricao: z.string().min(10).max(1000),
  rede: z.enum(['instagram', 'linkedin', 'tiktok', 'twitter', 'facebook', 'pinterest']),
  estilo: z.enum(['moderno', 'clean', 'dark', 'premium', 'colorido', 'minimalista']),
  tom: z.enum(['educativo', 'profissional', 'provocativo', 'emocional', 'descontraido']),
  idioma: z.enum(['portugues', 'ingles', 'espanhol', 'frances', 'italiano', 'alemao']),
  numSlides: z.number().int().min(3).max(12),
  formato: z.enum(['quadrado', 'retrato']),
})

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 })
    }

    const body = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Dados inválidos.', details: parsed.error.flatten() }, { status: 400 })
    }

    const { tema, descricao, rede, estilo, tom, idioma, numSlides, formato } = parsed.data

    const user = await prisma.user.findUnique({ where: { id: session.user.id } })
    if (!user) return NextResponse.json({ error: 'Usuário não encontrado.' }, { status: 404 })
    if (!user.active) return NextResponse.json({ error: 'Conta pausada. Entre em contato com o suporte.' }, { status: 403 })

    const creditsNeeded = calcularCreditos(numSlides)
    if (user.credits < creditsNeeded) {
      return NextResponse.json({
        error: `Créditos insuficientes. Você precisa de ${creditsNeeded} crédito(s) mas tem apenas ${user.credits}.`,
      }, { status: 402 })
    }

    // Rate limiting: máximo 10 gerações por hora
    const umaHoraAtras = new Date(Date.now() - 60 * 60 * 1000)
    const geracoesRecentes = await prisma.generation.count({
      where: { userId: user.id, createdAt: { gte: umaHoraAtras } },
    })
    if (geracoesRecentes >= 10) {
      return NextResponse.json({ error: 'Limite de 10 gerações por hora atingido. Tente novamente em breve.' }, { status: 429 })
    }

    const result = await gerarCarrossel({ tema, descricao, rede, estilo, tom, idioma, numSlides })

    const [generation] = await prisma.$transaction([
      prisma.generation.create({
        data: {
          userId: user.id,
          tema,
          descricao,
          rede,
          estilo,
          tom,
          idioma,
          numSlides,
          formato,
          creditsUsed: creditsNeeded,
          slides: JSON.stringify(result.slides),
          legenda: result.legenda,
        },
      }),
      prisma.user.update({
        where: { id: user.id },
        data: { credits: { decrement: creditsNeeded } },
      }),
    ])

    return NextResponse.json({ id: generation.id, slides: result.slides, legenda: result.legenda })
  } catch (error: any) {
    console.error('Erro ao gerar carrossel:', error)
    if (error?.message?.includes('JSON')) {
      return NextResponse.json({ error: 'Erro ao processar resposta da IA. Tente novamente.' }, { status: 500 })
    }
    return NextResponse.json({ error: 'Erro interno ao gerar carrossel.' }, { status: 500 })
  }
}
