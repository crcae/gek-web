import { getTranslations } from 'next-intl/server';
import { ShieldCheck, Package, ClipboardList, Truck } from 'lucide-react';
import Image from 'next/image';

interface Props {
  imagenes?: [string, string, string, string];
}

export async function CedisProcesos({ imagenes = ['', '', '', ''] }: Props) {
  const t = await getTranslations('quienes');

  const fichas = [
    {
      titulo: t('cedis1_titulo'),
      desc: t('cedis1_desc'),
      Icono: ShieldCheck,
      bg: 'bg-[#0D2233]',
    },
    {
      titulo: t('cedis2_titulo'),
      desc: t('cedis2_desc'),
      Icono: Package,
      bg: 'bg-[#1A3A52]',
    },
    {
      titulo: t('cedis3_titulo'),
      desc: t('cedis3_desc'),
      Icono: ClipboardList,
      bg: 'bg-[#1E4A6A]',
    },
    {
      titulo: t('cedis4_titulo'),
      desc: t('cedis4_desc'),
      Icono: Truck,
      bg: 'bg-brand-navy',
    },
  ];

  return (
    <section className="w-full bg-white py-16 md:py-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-green block mb-3">
            {t('cedis_eyebrow')}
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-navy mb-4">
            {t('cedis_titulo')}
          </h2>
          <p className="font-body text-brand-navy/60 text-base max-w-2xl mx-auto mb-2">
            {t('cedis_sub')}
          </p>
          <div className="w-[60px] h-[3px] bg-brand-green mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {fichas.map((f, i) => {
            const Icono = f.Icono;
            const imgSrc = imagenes[i] || '';
            return (
              <div
                key={f.titulo}
                className={`group relative rounded-xl overflow-hidden ${f.bg} aspect-[4/3] flex flex-col items-center justify-center cursor-default`}
              >
                {/* Imagen si existe */}
                {imgSrc && (
                  <Image
                    src={imgSrc}
                    alt={f.titulo}
                    fill
                    className="object-cover opacity-60"
                    sizes="300px"
                    unoptimized
                  />
                )}

                {/* Placeholder cuando no hay imagen */}
                {!imgSrc && (
                  <>
                    <Icono className="w-12 h-12 text-white/20 mb-3 relative z-10 transition-opacity duration-300 group-hover:opacity-0" />
                    <p className="font-body text-xs text-white/40 relative z-10 transition-opacity duration-300 group-hover:opacity-0">
                      {t('cedis_proxi')}
                    </p>
                  </>
                )}

                {/* Overlay al hover */}
                <div className="absolute inset-0 bg-brand-navy/80 flex flex-col items-start justify-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                  <Icono className="w-7 h-7 text-brand-green mb-3" />
                  <h3 className="font-display text-white font-bold text-lg leading-tight mb-2">
                    {f.titulo}
                  </h3>
                  <p className="font-body text-white/70 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
