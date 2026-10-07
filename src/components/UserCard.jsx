import { useState } from "react";

/**
 * UserCard - Developer profile card for static previews and lists.
 */
const UserCard = ({ user, onSwipe }) => {
  const { firstName, lastName, age, about, gender, photoUrl, skills, _id } = user;
  const [actionLoading, setActionLoading] = useState("");

  const handleSendRequest = async (status) => {
    if (!onSwipe) return;
    setActionLoading(status);
    await onSwipe(status, _id);
    setActionLoading("");
  };

  return (
    <div className="w-full max-w-sm rounded-3xl bg-brand-surface border border-white/10 shadow-xl shadow-violet-950/20 overflow-hidden flex flex-col">
      <div className="relative h-60 w-full overflow-hidden bg-slate-900">
        <img
          src={photoUrl}
          alt={`${firstName} ${lastName}`}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=60";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-surface via-transparent to-black/30 pointer-events-none" />

        <div className="absolute bottom-3 left-4 right-4 z-10 pointer-events-none">
          <div className="flex items-baseline gap-2">
            <h2 className="text-xl font-bold text-white tracking-tight">
              {firstName} {lastName}
            </h2>
            {age && <span className="text-slate-300 font-mono text-xs">{age}</span>}
          </div>
          {gender && <span className="text-[11px] text-slate-400">{gender}</span>}
        </div>
      </div>

      <div className="p-5 flex flex-col gap-3 flex-1">
        {about && (
          <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
            {about}
          </p>
        )}

        {/* Skill Badges */}
        {skills && skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-1">
            {skills.slice(0, 6).map((skill) => (
              <span
                key={skill}
                className="px-2 py-0.5 rounded-lg text-[11px] font-mono font-medium bg-white/5 text-slate-200 border border-white/10"
              >
                {skill}
              </span>
            ))}
            {skills.length > 6 && (
              <span className="px-1.5 py-0.5 rounded-lg text-[10px] font-mono text-slate-400 bg-white/5 border border-white/5">
                +{skills.length - 6}
              </span>
            )}
          </div>
        )}

        {/* Action buttons */}
        {onSwipe && _id && (
          <div className="flex items-center justify-center gap-3 mt-4 pt-3 border-t border-white/5">
            <button
              className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-rose-500/20 text-rose-300 hover:text-rose-200 border border-rose-500/30 text-xs font-semibold transition-all disabled:opacity-40"
              onClick={() => handleSendRequest("ignored")}
              disabled={!!actionLoading}
              aria-label={`Pass on ${firstName}`}
            >
              {actionLoading === "ignored" ? (
                <span className="w-3.5 h-3.5 border-2 border-rose-300/30 border-t-rose-300 rounded-full animate-spin inline-block" />
              ) : (
                "Pass"
              )}
            </button>
            <button
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/30 transition-all disabled:opacity-40"
              onClick={() => handleSendRequest("interested")}
              disabled={!!actionLoading}
              aria-label={`Connect with ${firstName}`}
            >
              {actionLoading === "interested" ? (
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" />
              ) : (
                "Connect"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserCard;
