export default function Loading() {
  return (
    <div className="min-h-screen bg-brand-white">
      {/* PageHero skeleton */}
      <div className="h-[40vh] bg-brand-navy animate-pulse" />
      
      {/* Contenido skeleton */}
      <div className="max-w-7xl mx-auto px-6 py-20 space-y-16">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="w-full md:w-1/2 space-y-4">
            <div className="h-8 bg-brand-gray/20 rounded w-1/3 animate-pulse" />
            <div className="h-1 bg-brand-green w-16 animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 bg-brand-gray/10 rounded w-full animate-pulse" />
              <div className="h-4 bg-brand-gray/10 rounded w-full animate-pulse" />
              <div className="h-4 bg-brand-gray/10 rounded w-2/3 animate-pulse" />
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <div className="aspect-video bg-brand-gray/10 rounded animate-pulse" />
          </div>
        </div>
        
        <div className="space-y-8">
          <div className="h-8 bg-brand-gray/20 rounded w-48 mx-auto animate-pulse" />
          <div className="h-64 bg-brand-gray/5 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}
