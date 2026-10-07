/**
 * Reusable shimmer/skeleton loading components.
 * Elevated with glassmorphism shimmer effects and gradient pulses.
 */

// Generic skeleton card with shimmer (used in Feed)
export const CardSkeleton = () => (
  <div className="rounded-2xl bg-brand-surface/50 border border-white/5 overflow-hidden shadow-lg shadow-black/20 backdrop-blur-sm">
    <div className="w-full h-64 bg-gradient-to-br from-violet-500/5 to-cyan-500/5 animate-pulse relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[shimmer_2s_infinite]" />
    </div>
    <div className="p-4 space-y-3">
      <div className="h-6 bg-gradient-to-r from-violet-500/10 via-white/5 to-cyan-500/10 rounded-xl w-3/4 animate-pulse" />
      <div className="h-4 bg-gradient-to-r from-violet-500/10 via-white/5 to-cyan-500/10 rounded-lg w-1/3 animate-pulse" />
      <div className="h-3 bg-gradient-to-r from-violet-500/10 via-white/5 to-cyan-500/10 rounded-lg w-full animate-pulse" />
      <div className="h-3 bg-gradient-to-r from-violet-500/10 via-white/5 to-cyan-500/10 rounded-lg w-5/6 animate-pulse" />
      <div className="flex gap-2 mt-4">
        <div className="h-10 bg-gradient-to-r from-violet-600/30 to-indigo-600/30 rounded-xl w-24 animate-pulse" />
        <div className="h-10 bg-gradient-to-r from-violet-600/30 to-indigo-600/30 rounded-xl w-24 animate-pulse" />
      </div>
    </div>
  </div>
);

// Skeleton row for connections/requests list
export const ListItemSkeleton = () => (
  <div className="rounded-2xl bg-brand-surface/50 border border-white/5 backdrop-blur-sm p-4 flex items-center gap-3 shadow-lg shadow-black/20 animate-pulse">
    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-violet-500/20 to-cyan-500/20 shrink-0 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[shimmer_2s_infinite]" />
    </div>
    <div className="flex-1 space-y-2">
      <div className="h-4 bg-gradient-to-r from-violet-500/15 via-white/5 to-cyan-500/15 rounded-lg w-36" />
      <div className="h-3 bg-gradient-to-r from-violet-500/10 via-white/5 to-cyan-500/10 rounded-lg w-20" />
      <div className="h-2 bg-gradient-to-r from-violet-500/10 via-white/5 to-cyan-500/10 rounded-lg w-48" />
    </div>
    <div className="w-20 h-9 bg-gradient-to-r from-violet-600/20 to-indigo-600/20 rounded-xl shrink-0" />
  </div>
);

// Multiple list skeletons with header shimmer
export const ListSkeleton = ({ count = 4 }) => (
  <div className="my-6 space-y-3">
    <div className="h-8 bg-gradient-to-r from-violet-500/15 via-white/5 to-cyan-500/15 rounded-xl w-48 mx-auto mb-6 animate-pulse relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[shimmer_2s_infinite]" />
    </div>
    {Array.from({ length: count }).map((_, i) => (
      <ListItemSkeleton key={i} />
    ))}
  </div>
);

// Full page spinner with radiant glow
export const Spinner = ({ text = "Loading..." }) => (
  <div className="flex flex-col items-center justify-center min-h-[50vh] gap-5 px-4">
    <div className="relative">
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-500/40 to-cyan-400/40 blur-xl scale-150 animate-pulse" />
      <span className="loading loading-spinner loading-lg text-violet-400 relative z-10" />
    </div>
    <p className="text-slate-300 text-sm font-medium tracking-wide">{text}</p>
  </div>
);

// Error state with modern card and SVG illustration
export const ErrorState = ({ message, onRetry }) => (
  <div className="flex flex-col items-center justify-center min-h-[40vh] gap-5 px-4">
    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-rose-500/20 to-rose-600/20 border border-rose-500/20 flex items-center justify-center">
      <svg className="w-10 h-10 text-rose-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L18.203 10.5a2.25 2.25 0 00-1.948-1.125H6.744a2.25 2.25 0 00-1.948 1.125L2.697 19.8z" />
      </svg>
    </div>
    <p className="text-rose-300 text-center text-base font-medium max-w-md leading-relaxed">
      {message}
    </p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-sm font-semibold shadow-md shadow-violet-600/30 transition-all flex items-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-.001h4.992M4.031 14.978a8.946 8.946 0 012.784-8.015 9.002 9.002 0 0110.37-.042 8.947 8.947 0 012.786 8.059 8.996 8.996 0 01-.391 2.71 8.946 8.946 0 01-2.78 8.02 8.965 8.965 0 01-10.402.177 8.926 8.926 0 01-2.847-8.02z" />
        </svg>
        Try Again
      </button>
    )}
  </div>
);

// Empty state with modern glass card and icon
export const EmptyState = ({ icon = "🔍", title, description, action }) => (
  <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4 px-4">
    <div className="w-16 h-16 rounded-2xl bg-brand-surface/80 backdrop-blur-md border border-white/10 flex items-center justify-center text-3xl shadow-xl shadow-violet-600/5">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-white tracking-tight">{title}</h3>
    {description && (
      <p className="text-slate-400 text-center text-sm max-w-sm leading-relaxed">{description}</p>
    )}
    {action && (
      <button
        onClick={action.onClick}
        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-sm font-semibold shadow-md shadow-violet-600/30 transition-all flex items-center gap-2 mt-1"
      >
        {action.label}
      </button>
    )}
  </div>
);
