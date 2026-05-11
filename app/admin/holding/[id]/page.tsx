import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import { UnidadForm } from '@/components/admin/UnidadForm';

export default async function EditarUnidad({ params }: { params: { id: string } }) {
  const unidad = await prisma.unidadNegocio.findUnique({ where: { id: params.id } });
  if (!unidad) notFound();

  return (
    <div className="p-4 sm:p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Editar Unidad de Negocio</h1>
      <p className="text-gray-500 text-sm mb-8">{unidad.nameEs}</p>
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 max-w-2xl">
        <UnidadForm unidad={{
          id: unidad.id,
          nameEs: unidad.nameEs,
          nameEn: unidad.nameEn ?? '',
          nameDe: unidad.nameDe ?? '',
          location: unidad.location,
          orden: unidad.orden,
          activa: unidad.activa,
        }} />
      </div>
    </div>
  );
}
