export default function Loading() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="space-y-2">
        <div className="h-7 w-48 bg-white/[0.06] rounded-lg animate-pulse" />
        <div className="h-4 w-64 bg-white/[0.04] rounded-lg animate-pulse" />
      </div>

      {/* Stats grid skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-5 rounded-xl bg-white/[0.03] border border-white/[0.07] space-y-3">
            <div className="w-9 h-9 rounded-lg bg-white/[0.06] animate-pulse" />
            <div className="h-6 w-20 bg-white/[0.06] rounded animate-pulse" />
            <div className="h-4 w-28 bg-white/[0.04] rounded animate-pulse" />
          </div>
        ))}
      </div>

      {/* Content skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-5 rounded-xl bg-white/[0.03] border border-white/[0.07]">
          <div className="h-5 w-36 bg-white/[0.06] rounded animate-pulse mb-4" />
          <div className="h-48 bg-white/[0.03] rounded-lg animate-pulse" />
        </div>
        <div className="p-5 rounded-xl bg-white/[0.03] border border-white/[0.07]">
          <div className="h-5 w-32 bg-white/[0.06] rounded animate-pulse mb-4" />
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-white/[0.06] animate-pulse flex-shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3.5 bg-white/[0.06] rounded animate-pulse" />
                  <div className="h-3 w-3/4 bg-white/[0.04] rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
