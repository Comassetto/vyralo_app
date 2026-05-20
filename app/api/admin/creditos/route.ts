import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const schema = z.object({
  userId: z.string(),
  action: z.enum(['add', 'zero']),
  amount: z.number().int().min(0).optional(),
})

export async function POST(req: NextRequest) {
  const session = await auth()
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 403 })
  }

  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Dados inválidos.' }, { status: 400 })

  const { userId, action, amount = 0 } = parsed.data

  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) return NextResponse.json({ error: 'Usuário não encontrado.' }, { status: 404 })

  let newCredits = user.credits
  if (action === 'add') newCredits += amount
  if (action === 'zero') newCredits = 0

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { credits: newCredits },
  })

  return NextResponse.json({ credits: updated.credits })
}
