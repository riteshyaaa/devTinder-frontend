import { useEffect } from "react";
import useRequests from "../hooks/useRequests";
import { ListSkeleton, ErrorState, EmptyState } from "./Shimmer";
import Avatar from "./Avatar";

const Requests = () => {
  const { requests, loading, error, getRequests, reviewRequest, retry } = useRequests();

  useEffect(() => {
    getRequests();
  }, []);

  if (loading && !requests) {
    return <ListSkeleton count={3} />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={retry} />;
  }

  if (!requests || requests.length === 0) {
    return (
      <EmptyState
        icon="📬"
        title="No pending requests"
        description="When other developers send you a connection request, you'll see them listed here ready for your review."
        action={{ label: "Explore Developers", onClick: () => (window.location.href = "/") }}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-300 text-xs font-mono font-semibold mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-pulse" />
          Pending Approvals
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Connection Requests
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          You have {requests.length} pending developer connection request{requests.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Requests list */}
      <div className="space-y-3.5">
        {requests.map((request) => {
          const { firstName, lastName, age, gender, photoUrl, about, skills, _id } =
            request.fromUserId || {};

          return (
            <div
              className="group relative rounded-2xl bg-brand-surface/80 hover:bg-brand-surface border border-white/5 hover:border-violet-500/30 p-4 sm:p-5 transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 backdrop-blur-md shadow-lg shadow-black/20"
              key={request._id}
            >
              <div className="flex items-start sm:items-center gap-4 min-w-0">
                <Avatar
                  firstName={firstName}
                  lastName={lastName}
                  photoUrl={photoUrl}
                  size="lg"
                />

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base text-white truncate">
                      {firstName} {lastName}
                    </h3>
                  </div>
                  {age && gender && (
                    <p className="text-xs text-slate-400 mt-0.5">
                      {age} • {gender}
                    </p>
                  )}
                  {about && (
                    <p className="text-xs text-slate-300 line-clamp-2 mt-1.5 leading-relaxed">
                      {about}
                    </p>
                  )}
                  {skills && skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                      {skills.slice(0, 5).map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-white/5 text-slate-300 border border-white/10"
                        >
                          {skill}
                        </span>
                      ))}
                      {skills.length > 5 && (
                        <span className="px-1.5 py-0.5 rounded-md text-[10px] font-mono text-slate-400 bg-white/5">
                          +{skills.length - 5}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-center pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5 w-full sm:w-auto justify-end">
                <button
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-rose-500/20 text-rose-300 hover:text-rose-200 border border-rose-500/30 text-xs font-semibold transition-all flex items-center gap-1.5"
                  onClick={() => reviewRequest("rejected", request._id)}
                  aria-label={`Reject connection request from ${firstName}`}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span>Ignore</span>
                </button>
                <button
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/30 transition-all flex items-center gap-1.5"
                  onClick={() => reviewRequest("accepted", request._id)}
                  aria-label={`Accept connection request from ${firstName}`}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  <span>Accept</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Requests;
