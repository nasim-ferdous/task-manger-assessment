import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

// If '@prisma/client' still shows an error,
// restart your VS Code TS Server (Ctrl+Shift+P -> "Restart TS Server")

const prisma = new PrismaClient();

async function main() {
  const saltRounds = 10;
  const hashedAdminPassword = await bcrypt.hash('password123', saltRounds);
  const hashedUserPassword = await bcrypt.hash('password123', saltRounds);

  // Admin Seed
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: hashedAdminPassword,
      role: 'ADMIN',
    },
  });

  // User Seed
  await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      password: hashedUserPassword,
      role: 'USER',
    },
  });

  console.log('✅ Seed successful: admin@example.com / user@example.com');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
