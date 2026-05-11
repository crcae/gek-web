import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import { NoticiaForm } from '@/components/admin/NoticiaForm';

export default async function EditarNoticia({ params }: { params: { id: string } }) {
  const noticia = await prisma.noticia.findUnique({ where: { id: params.id } });
  if (!noticia) notFound();

  return (
    <div className="p-4 sm:p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Editar Noticia de LinkedIn</h1>
      <p className="text-gray-500 text-sm mb-8 truncate max-w-md">{noticia.titulo_es}</p>
      <NoticiaForm
        noticiaId={noticia.id}
        initialData={{
          titulo_es: noticia.titulo_es,
          linkedinEmbedUrl: noticia.linkedinEmbedUrl,
          publicada: noticia.publicada,
        }}
      />
    </div>
  );
}
