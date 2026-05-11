import { prisma } from '@/lib/db';
import { MensajesTable } from '@/components/admin/MensajesTable';

export default async function MensajesAdmin() {
  const mensajes = await prisma.mensajeContacto.findMany({
    orderBy: { createdAt: 'desc' },
  });

  const noLeidos = mensajes.filter((m) => !m.leido).length;

  return (
    <div className="p-4 sm:p-8">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-800">Mensajes de Contacto</h1>
          {noLeidos > 0 && (
            <span className="bg-red-500 text-white text-sm font-semibold px-2.5 py-0.5 rounded-full">
              {noLeidos} sin leer
            </span>
          )}
        </div>
        <p className="text-gray-500 text-sm mt-1">{mensajes.length} mensajes recibidos en total</p>
      </div>

      <MensajesTable mensajes={mensajes.map(m => ({
        ...m,
        createdAt: m.createdAt.toISOString(),
      }))} />
    </div>
  );
}
