import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import fs from 'fs';
import path from 'path';

export async function CapitalHumano() {
  const t = await getTranslations('quienes');

  let fotos: string[] = [];
  try {
    const folder = path.join(process.cwd(), 'public/images/zacatecas');
    if (fs.existsSync(folder)) {
      fotos = fs.readdirSync(folder)
        .filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f))
        .map(f => `/images/zacatecas/${f}`);
    }
  } catch {}

  const numeros = [
    { val: '+120', label: t('cap_colaboradores') },
    { val: '+50',  label: t('cap_historia') },
    { val: '3',    label: t('cap_generaciones') },
    { val: '100%', label: t('cap_compromiso') },
  ];

  return (
    <section className="w-full bg-brand-green py-16 md:py-20 px-4 sm:px-6 relative overflow-hidden">
      <div
        className="absolute right-[-80px] bottom-[-80px] w-[320px] h-[320px] bg-no-repeat bg-contain pointer-events-none opacity-[0.08]"
        style={{ backgroundImage: 'url(/images/isotipo/isotipo-claro.png)' }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-white/70 block mb-3">
            {t('cap_eyebrow')}
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            {t('cap_titulo')}
          </h2>
          <div className="w-[60px] h-[3px] bg-white/40 mx-auto" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {numeros.map((n) => (
            <div key={n.label} className="text-center">
              <div className="font-display text-4xl md:text-5xl font-bold text-white mb-1">{n.val}</div>
              <div className="font-body text-sm text-white/70 uppercase tracking-wider">{n.label}</div>
            </div>
          ))}
        </div>

        {fotos.length >= 4 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {fotos.slice(0, 8).map((src, i) => (
              <div
                key={i}
                className={`relative overflow-hidden rounded-lg ${i === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}
                style={{ aspectRatio: i === 0 ? '1/1' : '4/3' }}
              >
                <Image
                  src={src}
                  alt={t('cap_eyebrow')}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 50vw, 25vw"
                  quality={75}
                />
                <div className="absolute inset-0 bg-brand-navy/20" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="rounded-lg bg-white/10 border border-white/20 flex items-center justify-center"
                style={{ aspectRatio: '4/3' }}
              >
                <span className="text-white/30 text-xs font-body">{t('cap_foto')} {i + 1}</span>
              </div>
            ))}
          </div>
        )}

        <p className="text-center font-lora italic text-white/80 text-lg mt-10 max-w-2xl mx-auto">
          &ldquo;{t('cap_quote')}&rdquo;
        </p>
      </div>
    </section>
  );
}
