import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/db';
import { del } from '@vercel/blob';

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id } = params;
    const logo = await prisma.clienteLogo.findUnique({
      where: { id },
    });

    if (logo) {
      // Delete from Vercel Blob
      try {
        await del(logo.url);
      } catch (blobErr) {
        console.error('Failed to delete blob from Vercel:', blobErr);
      }

      await prisma.clienteLogo.delete({
        where: { id },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting client logo:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
