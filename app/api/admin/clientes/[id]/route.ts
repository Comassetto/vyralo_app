import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

async function checkAdmin() {
  const session = await auth()
  return session?.user?.role === 'ADMIN'
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await checkAdmin())) return NextResponse.json({ error: 'Não autorizado.' }, { status: 403 })
  const { id } = await params
  const cliente = await prisma.user.findUnique({
    where: { id },
    include: { _count: { select: { generations: true } }, generations: { orderBy: { createdAt: 'desc' } } },
  })
  if (!cliente) return NextResponse.json({ error: 'Não encontrado.' }, { status: 404 })
  return NextResponse.json(cliente)
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await checkAdmin())) return NextResponse.json({ error: 'Não autorizado.' }, { status: 403 })

  const { id } = await params
  const body = await req.json()

  const allowed: Record<string, any> = {}
  if (typeof body.active === 'boolean') allowed.active = body.active
  if (body.name) allowed.name = body.name
  if (body.email) allowed.email = body.email
  if (['STARTER', 'PRO', 'AGENCIA'].includes(body.plan)) allowed.plan = body.plan

  const user = await prisma.user.update({ where: { id }, data: allowed })
  return NextResponse.json(user)
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await checkAdmin())) return NextResponse.json({ error: 'Não autorizado.' }, { status: 403 })

  const { id } = await params
  await prisma.user.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
