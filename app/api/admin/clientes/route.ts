import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

const schema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(6),
  plan: z.enum(['STARTER', 'PRO', 'AGENCIA']),
  credits: z.number().int().min(0),
})

async function checkAdmin() {
  const session = await auth()
  return session?.user?.role === 'ADMIN'
}

export async function GET() {
  if (!(await checkAdmin())) return NextResponse.json({ error: 'Não autorizado.' }, { status: 403 })

  const clientes = await prisma.user.findMany({
    where: { role: 'CLIENT' },
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { generations: true } } },
  })

  return NextResponse.json(clientes)
}

export async function POST(req: NextRequest) {
  if (!(await checkAdmin())) return NextResponse.json({ error: 'Não autorizado.' }, { status: 403 })

  try {
    const body = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ error: 'Dados inválidos.' }, { status: 400 })

    const { name, email, password, plan, credits } = parsed.data

    const exists = await prisma.user.findUnique({ where: { email } })
    if (exists) return NextResponse.json({ error: 'Email já cadastrado.' }, { status: 409 })

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, plan: plan as any, credits, role: 'CLIENT' },
    })

    return NextResponse.json({ id: user.id }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Erro interno.' }, { status: 500 })
  }
}
