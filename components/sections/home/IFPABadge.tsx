export function IFPABadge({ imageExists }: { imageExists: boolean }) {
  if (!imageExists) {
    return (
      <div className="w-[160px] h-[110px] mb-4 flex flex-col items-center justify-center rounded-lg border border-brand-green/30 bg-brand-green/10 gap-1">
        <span className="text-brand-green font-display font-bold text-lg leading-tight">IFPA</span>
        <span className="text-white/70 font-body text-[11px] uppercase tracking-widest">Proud Member</span>
        <span className="text-brand-green/60 font-body text-[10px]">desde 2022</span>
      </div>
    );
  }

  return (
    <div className="w-[160px] h-[110px] mb-4 relative">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/eventos/ifpa-proud-member.png"
        alt="IFPA Proud Member"
        className="w-full h-full object-contain"
      />
    </div>
  );
}
