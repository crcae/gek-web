import { NoticiaForm } from '@/components/admin/NoticiaForm';

export default function NuevaNoticias() {
  return (
    <div className="p-4 sm:p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Nueva Noticia de LinkedIn</h1>
      <p className="text-gray-500 text-sm mb-8">Agrega el embed de un post publicado en tu página corporativa de LinkedIn.</p>
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8">
        <NoticiaForm />
      </div>
    </div>
  );
}
