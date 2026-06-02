import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { AdminShell } from '@/components/admin/AdminShell';
import { prisma } from '@/lib/db';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <div className={inter.className}>{children}</div>;
  }

  const unreadCount = await prisma.lead.count({
    where: { leido: false },
  });

  return (
    <div className={inter.className}>
      <AdminShell
        userName={session.user?.email ?? 'Admin'}
        unreadCount={unreadCount}
      >
        {children}
      </AdminShell>
    </div>
  );
}
