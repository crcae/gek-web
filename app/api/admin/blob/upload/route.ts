import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/db';

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        // Exigir sesión de administrador activa
        const session = await getServerSession(authOptions);
        if (!session) {
          throw new Error('No autorizado. Debes iniciar sesión como administrador.');
        }
        // Solo rutas esperadas por el panel (sin traversal)
        if (!/^(media|videos)\/[^/]+$/.test(pathname) || pathname.includes('..')) {
          throw new Error('Ruta de archivo no permitida.');
        }

        return {
          allowedContentTypes: [
            'video/mp4',
            'video/webm',
            'video/quicktime',
            'image/jpeg',
            'image/png',
            'image/webp',
            'image/gif',
            'image/svg+xml',
            'application/pdf',
          ],
          maximumSizeInBytes: 100 * 1024 * 1024, // 100 MB máximo
          tokenPayload: JSON.stringify({
            userEmail: session.user?.email || 'admin',
          }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // Registrar en base de datos ImagenSitio
        try {
          const parts = blob.pathname.split('/');
          const seccion = parts.length > 1 ? parts[0] : 'media';
          const filename = blob.pathname;
          const nombre = parts[parts.length - 1] || 'archivo';

          await prisma.imagenSitio.create({
            data: {
              seccion,
              nombre,
              filename,
              url: blob.url,
            },
          });
        } catch (dbErr) {
          console.error('Error guardando ImagenSitio en onUploadCompleted:', dbErr);
        }
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 },
    );
  }
}
