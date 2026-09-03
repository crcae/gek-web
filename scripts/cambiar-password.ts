import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const args = process.argv.slice(2);
  const email = args[0] || 'admin@grupoexportadordelcampo.com';
  const newPassword = args[1] || 'GEK2026admin!';

  if (!email || !newPassword) {
    console.log('Uso: npx ts-node scripts/cambiar-password.ts <email> <nueva_password>');
    process.exit(1);
  }

  const hash = await bcrypt.hash(newPassword, 10);

  const updated = await prisma.adminUser.upsert({
    where: { email },
    update: { password: hash },
    create: {
      email,
      password: hash,
      nombre: 'Administrador GEC',
    },
  });

  console.log(`✅ Contraseña actualizada con éxito para: ${updated.email}`);
  console.log(`🔑 Nueva contraseña: ${newPassword}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
