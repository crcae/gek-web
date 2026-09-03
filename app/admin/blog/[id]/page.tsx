import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { BlogEditor } from '@/components/admin/BlogEditor';

export default async function EditarBlogPostPage({ params }: { params: { id: string } }) {
  const post = await prisma.blogPost.findUnique({
    where: { id: params.id },
  });

  if (!post) {
    notFound();
  }

  let parsedBlocks = [];
  try {
    parsedBlocks = JSON.parse(post.contenido_es);
  } catch {
    parsedBlocks = [{ type: 'paragraph', content: post.contenido_es }];
  }

  return (
    <BlogEditor
      isNew={false}
      initialData={{
        ...post,
        titulo_en: post.titulo_en || '',
        titulo_de: post.titulo_de || '',
        resumen_es: post.resumen_es || '',
        resumen_en: post.resumen_en || '',
        resumen_de: post.resumen_de || '',
        portadaUrl: post.portadaUrl || '',
        autor: post.autor || '',
        autorCargo: post.autorCargo || '',
        autorAvatar: post.autorAvatar || '',
        contenido_es: parsedBlocks,
      }}
    />
  );
}
