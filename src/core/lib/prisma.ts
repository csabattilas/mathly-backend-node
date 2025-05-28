import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
prisma
  .$connect()
  .then(() => {
    console.log('Database connected successfully')
  })
  .catch((error: Error) => {
    console.error('Database connection error:', error)
    process.exit(1)
  })

process.on('SIGINT', async () => {
  await prisma.$disconnect()
  console.log('Database disconnected')
  process.exit(0)
})

export default prisma
