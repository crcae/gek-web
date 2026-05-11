export default function Loading() {
  return (
    <div className="min-h-screen bg-brand-white">
      <div className="h-[40vh] bg-brand-navy animate-pulse" />
      <div className="max-w-3xl mx-auto px-6 py-20 space-y-8">
        <div className="h-10 bg-brand-gray/20 rounded w-1/2 mx-auto animate-pulse" />
        <div className="space-y-6">
          <div className="h-12 bg-brand-gray/10 rounded w-full animate-pulse" />
          <div className="h-12 bg-brand-gray/10 rounded w-full animate-pulse" />
          <div className="h-32 bg-brand-gray/10 rounded w-full animate-pulse" />
          <div className="h-12 bg-brand-green/20 rounded w-full animate-pulse" />
        </div>
      </div>
    </div>
  );
}
