import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Admin
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@vyralo.com'
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@12345'

  const adminExists = await prisma.user.findUnique({ where: { email: adminEmail } })
  if (!adminExists) {
    await prisma.user.create({
      data: {
        name: 'Administrador',
        email: adminEmail,
        password: await bcrypt.hash(adminPassword, 12),
        role: 'ADMIN',
        credits: 0,
      },
    })
    console.log('✅ Admin criado:', adminEmail)
  } else {
    console.log('ℹ️  Admin já existe:', adminEmail)
  }

  // Cliente de teste
  const clienteEmail = 'cliente@vyralo.com'
  const clienteExists = await prisma.user.findUnique({ where: { email: clienteEmail } })
  if (!clienteExists) {
    await prisma.user.create({
      data: {
        name: 'Maria Silva',
        email: clienteEmail,
        password: await bcrypt.hash('Cliente@123', 12),
        role: 'CLIENT',
        plan: 'PRO',
        credits: 200,
      },
    })
    console.log('✅ Cliente de teste criado:', clienteEmail)
  } else {
    console.log('ℹ️  Cliente já existe:', clienteEmail)
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
