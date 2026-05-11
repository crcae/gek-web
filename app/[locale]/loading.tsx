export default function Loading() {
  return (
    <div className="min-h-screen bg-brand-white">
      {/* Hero Skeleton */}
      <div className="w-full h-screen bg-brand-navy animate-pulse" />
      
      {/* Content Skeleton */}
      <div className="max-w-7xl mx-auto py-20 px-6 space-y-12">
        <div className="flex flex-col items-center">
          <div className="h-8 bg-brand-gray/20 rounded w-64 animate-pulse mb-4" />
          <div className="h-1 bg-brand-green w-20 animate-pulse" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-64 bg-brand-gray/10 rounded animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}
