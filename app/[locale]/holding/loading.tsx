export default function Loading() {
  return (
    <div className="min-h-screen bg-brand-white">
      <div className="h-[40vh] bg-brand-navy animate-pulse" />
      <div className="max-w-7xl mx-auto px-6 py-20 space-y-12">
        <div className="h-8 bg-brand-gray/20 rounded w-64 mx-auto animate-pulse mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-48 bg-brand-gray/5 rounded animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}
