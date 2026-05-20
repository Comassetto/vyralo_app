import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json(null, { status: 401 })

  const { id } = await params
  const generation = await prisma.generation.findUnique({ where: { id } })
  if (!generation || generation.userId !== session.user.id) {
    return NextResponse.json(null, { status: 404 })
  }

  return NextResponse.json(generation)
}
