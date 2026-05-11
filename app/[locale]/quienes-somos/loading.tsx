export default function Loading() {
  return (
    <div className="min-h-screen bg-brand-white">
      <div className="h-[40vh] bg-brand-navy animate-pulse" />
      <div className="max-w-7xl mx-auto px-6 py-20 space-y-12">
        <div className="flex flex-col md:flex-row gap-12">
          <div className="w-full md:w-1/2 space-y-6">
            <div className="h-10 bg-brand-gray/20 rounded w-3/4 animate-pulse" />
            <div className="h-1 bg-brand-green w-20 animate-pulse" />
            <div className="space-y-3">
              <div className="h-4 bg-brand-gray/10 rounded w-full animate-pulse" />
              <div className="h-4 bg-brand-gray/10 rounded w-full animate-pulse" />
              <div className="h-4 bg-brand-gray/10 rounded w-5/6 animate-pulse" />
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <div className="aspect-video bg-brand-gray/10 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
