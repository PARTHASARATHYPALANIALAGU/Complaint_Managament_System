/**
 * SkeletonCard - Premium shimmer loading skeleton
 * Usage: <SkeletonCard lines={3} height="h-32" />
 */
export function SkeletonCard({ lines = 3, height = 'h-32', compact = false }) {
  return (
    <div className={`skeleton glass-card ${height} ${compact ? 'p-4' : 'p-6'} flex flex-col gap-3`}>
      {/* Title bar */}
      <div className="h-4 bg-white/8 rounded-lg w-3/4" />
      {lines >= 2 && <div className="h-3 bg-white/5 rounded-lg w-full" />}
      {lines >= 3 && <div className="h-3 bg-white/5 rounded-lg w-5/6" />}
      {lines >= 4 && (
        <div className="flex gap-2 mt-auto pt-2 border-t border-white/5">
          <div className="h-5 bg-white/8 rounded-full w-16" />
          <div className="h-5 bg-white/8 rounded-full w-20" />
          <div className="h-5 bg-white/8 rounded-full w-14 ml-auto" />
        </div>
      )}
    </div>
  )
}

/**
 * SkeletonStatCard - Skeleton for dashboard stat cards
 */
export function SkeletonStatCard() {
  return (
    <div className="skeleton stat-card items-center text-center">
      <div className="w-12 h-12 rounded-full bg-white/8 mx-auto" />
      <div className="h-8 bg-white/10 rounded-lg w-12 mx-auto mt-2" />
      <div className="h-3 bg-white/5 rounded-lg w-20 mx-auto" />
    </div>
  )
}

/**
 * SkeletonRow - Skeleton for table/list rows
 */
export function SkeletonRow() {
  return (
    <div className="skeleton glass-card h-24 p-5 flex items-center gap-4">
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-white/8 rounded w-2/3" />
        <div className="h-3 bg-white/5 rounded w-1/2" />
      </div>
      <div className="flex gap-2">
        <div className="h-6 w-16 bg-white/8 rounded-full" />
        <div className="h-6 w-20 bg-white/8 rounded-full" />
      </div>
      <div className="h-8 w-24 bg-white/8 rounded-lg" />
    </div>
  )
}
