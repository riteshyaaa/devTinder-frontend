import { useState, useEffect, useCallback } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

/**
 * SwipeableCard — Developer-centric drag-to-swipe profile card.
 *
 * Features:
 * - Drag right → "Interested" | Drag left → "Ignored"
 * - Card rotation & opacity on drag with smooth physics
 * - Animated direction labels (CONNECT / PASS)
 * - Card stack depth visual
 * - Categorized tech skill badges & GitHub metrics
 * - Mobile touch + Desktop drag support via framer-motion
 * - Button controls & keyboard shortcut support
 */
const SwipeableCard = ({ user, onSwipe, onSuperLike, superLikesRemaining }) => {
  const {
    firstName,
    lastName,
    age,
    about,
    gender,
    photoUrl,
    skills,
    experienceLevel,
    location,
    github,
    currentlyBuilding,
    availability,
    socialLinks,
    _id,
  } = user;
  const [exiting, setExiting] = useState(false);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 0, 300], [-15, 0, 15]);
  const opacity = useTransform(x, [-300, -160, 0, 160, 300], [0.5, 1, 1, 1, 0.5]);

  // Overlay label opacities
  const interestedOpacity = useTransform(x, [0, 60, 160], [0, 0.6, 1]);
  const ignoreOpacity = useTransform(x, [-160, -60, 0], [1, 0.6, 0]);

  // Background color tint during swipe
  const bgColor = useTransform(
    x,
    [-200, -100, 0, 100, 200],
    [
      "rgba(244,63,94,0.08)",
      "rgba(244,63,94,0.03)",
      "rgba(0,0,0,0)",
      "rgba(16,185,129,0.03)",
      "rgba(16,185,129,0.08)",
    ]
  );

  // Keyboard navigation: arrow keys to swipe
  const handleKeyDown = useCallback(
    (e) => {
      if (exiting) return;
      if (e.key === "ArrowRight") {
        e.preventDefault();
        handleButtonSwipe("interested");
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        handleButtonSwipe("ignored");
      }
    },
    [exiting]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const handleDragEnd = async (_, info) => {
    const threshold = 100;
    const velocity = info.velocity.x;

    if (info.offset.x > threshold || velocity > 500) {
      setExiting(true);
      await animate(x, 600, { duration: 0.25, ease: "easeOut" });
      if (onSwipe) await onSwipe("interested", _id);
    } else if (info.offset.x < -threshold || velocity < -500) {
      setExiting(true);
      await animate(x, -600, { duration: 0.25, ease: "easeOut" });
      if (onSwipe) await onSwipe("ignored", _id);
    } else {
      animate(x, 0, { type: "spring", stiffness: 600, damping: 30 });
    }
  };

  const handleButtonSwipe = async (status) => {
    if (exiting) return;
    setExiting(true);
    const targetX = status === "interested" ? 600 : -600;
    await animate(x, targetX, { duration: 0.3, ease: "easeOut" });
    if (onSwipe) await onSwipe(status, _id);
  };

  return (
    <motion.div
      className="relative flex flex-col items-center select-none rounded-3xl p-2"
      style={{ backgroundColor: bgColor }}
      transition={{ duration: 0.1 }}
    >
      {/* Card Stack Visual (subtle background depth) */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[330px] sm:w-[350px] h-[520px] bg-slate-800/40 border border-white/5 rounded-3xl opacity-20 scale-[0.92] blur-[1px] pointer-events-none" />
      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[350px] sm:w-[370px] h-[520px] bg-slate-800/60 border border-white/10 rounded-3xl opacity-40 scale-[0.96] pointer-events-none" />

      {/* Main Swipeable Card */}
      <motion.div
        className="w-[360px] sm:w-[400px] bg-brand-surface/95 border border-white/10 shadow-2xl shadow-violet-950/40 backdrop-blur-xl cursor-grab active:cursor-grabbing relative z-10 rounded-3xl overflow-hidden flex flex-col"
        style={{ x, rotate, opacity }}
        drag={exiting ? false : "x"}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.8}
        onDragEnd={handleDragEnd}
        whileTap={{ scale: 1.01 }}
        aria-label={`Profile card for ${firstName} ${lastName}. Drag right to show interest, drag left to pass.`}
        role="article"
      >
        {/* Swipe Direction Overlay Badges */}
        <motion.div
          className="absolute top-6 right-6 z-30 bg-emerald-500/90 text-white px-5 py-2 rounded-xl font-mono font-black text-sm tracking-wider border-2 border-emerald-400 rotate-12 shadow-xl shadow-emerald-500/40 flex items-center gap-1.5"
          style={{ opacity: interestedOpacity }}
          aria-hidden="true"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
          CONNECT
        </motion.div>

        <motion.div
          className="absolute top-6 left-6 z-30 bg-rose-500/90 text-white px-5 py-2 rounded-xl font-mono font-black text-sm tracking-wider border-2 border-rose-400 -rotate-12 shadow-xl shadow-rose-500/40 flex items-center gap-1.5"
          style={{ opacity: ignoreOpacity }}
          aria-hidden="true"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
          PASS
        </motion.div>

        {/* Profile Image & Badges */}
        <div className="relative h-72 w-full overflow-hidden bg-slate-900">
          <img
            src={photoUrl}
            alt={`${firstName} ${lastName}'s profile`}
            className="w-full h-full object-cover pointer-events-none"
            draggable="false"
            onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=60";
            }}
          />
          {/* Gradient Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-brand-surface via-transparent to-black/30 pointer-events-none" />

          {/* Top Indicators: Availability & Experience */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20 pointer-events-none">
            {availability && availability !== "not-available" ? (
              <span className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold tracking-wide backdrop-blur-md border ${
                availability === "open"
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                  : availability === "busy"
                  ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                  : "bg-cyan-500/20 text-cyan-300 border-cyan-500/30"
              }`}>
                ● {availability === "open" ? "Open to Pair" : availability === "busy" ? "Busy" : availability}
              </span>
            ) : <span />}

            {experienceLevel && (
              <span className="px-2.5 py-1 rounded-lg bg-black/40 text-slate-200 border border-white/10 text-[11px] font-mono font-semibold backdrop-blur-md uppercase">
                {experienceLevel}
              </span>
            )}
          </div>

          {/* Bottom Overlay Title in Hero Image */}
          <div className="absolute bottom-3 left-5 right-5 z-20 pointer-events-none">
            <div className="flex items-baseline gap-2">
              <h2 className="text-2xl font-black text-white tracking-tight drop-shadow-md">
                {firstName} {lastName}
              </h2>
              {age && <span className="text-slate-300 font-mono text-sm font-semibold">{age}</span>}
            </div>

            {location && (
              <div className="flex items-center gap-1.5 text-xs text-slate-300 mt-0.5">
                <svg className="w-3.5 h-3.5 text-cyan-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                <span className="font-medium">{location}</span>
                {gender && <span className="text-slate-400">• {gender}</span>}
              </div>
            )}
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 flex flex-col gap-3.5 flex-1 text-left">
          {/* About Bio */}
          {about && (
            <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
              {about}
            </p>
          )}

          {/* Currently Building Pill */}
          {currentlyBuilding && (
            <div className="px-3 py-2 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse shrink-0" />
              <div className="truncate">
                <span className="font-mono font-bold text-[10px] uppercase text-violet-400 mr-1.5">Building:</span>
                <span className="text-slate-200">{currentlyBuilding}</span>
              </div>
            </div>
          )}

          {/* Core Tech Stack Badges */}
          {skills && skills.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                  Tech Stack
                </span>
                <span className="text-[10px] font-mono text-cyan-400">
                  {skills.length} skills
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {skills.slice(0, 7).map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-mono font-medium bg-white/5 text-slate-200 border border-white/10 hover:border-violet-500/40 hover:bg-violet-500/10 transition-colors"
                  >
                    {skill}
                  </span>
                ))}
                {skills.length > 7 && (
                  <span className="px-2 py-1 rounded-lg text-[11px] font-mono text-slate-400 bg-white/5 border border-white/5">
                    +{skills.length - 7}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* GitHub & Social Links Bar */}
          <div className="pt-3 border-t border-white/5 flex items-center justify-between mt-auto">
            {github && github.username ? (
              <div className="flex items-center gap-2.5 text-xs text-slate-300">
                <svg className="w-4 h-4 fill-slate-300 shrink-0" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                <a
                  href={github.profileUrl || `https://github.com/${github.username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="font-mono font-semibold text-cyan-400 hover:text-cyan-300"
                >
                  @{github.username}
                </a>
                <span className="text-slate-500 font-mono">•</span>
                <span className="font-mono text-slate-400">{github.publicRepos || 0} repos</span>
                <span className="text-slate-500 font-mono">•</span>
                <span className="font-mono text-amber-400">★ {github.totalStars || 0}</span>
              </div>
            ) : (
              <span className="text-xs text-slate-500 font-mono">Developer Profile</span>
            )}

            {/* Social Icons */}
            {socialLinks && (socialLinks.linkedin || socialLinks.twitter || socialLinks.website) && (
              <div className="flex items-center gap-2">
                {socialLinks.linkedin && (
                  <a
                    href={socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-slate-400 hover:text-white transition-colors"
                    aria-label="LinkedIn"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  </a>
                )}
                {socialLinks.website && (
                  <a
                    href={socialLinks.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-slate-400 hover:text-white transition-colors"
                    aria-label="Website"
                  >
                    <svg className="w-3.5 h-3.5 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9"/></svg>
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Action Control Buttons */}
      <div className="flex items-center gap-5 mt-6 z-10">
        {/* Pass Button */}
        <button
          onClick={() => handleButtonSwipe("ignored")}
          disabled={exiting}
          className="w-14 h-14 rounded-2xl bg-brand-surface border border-rose-500/30 text-rose-400 hover:bg-rose-500 hover:text-white hover:border-rose-500 shadow-lg shadow-rose-950/40 hover:scale-105 active:scale-95 transition-all flex items-center justify-center disabled:opacity-40"
          aria-label={`Pass on ${firstName}`}
          title="Pass (Left Arrow)"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Super Like Star Button */}
        <button
          onClick={() => {
            if (onSuperLike && !exiting) {
              setExiting(true);
              onSuperLike(_id);
            }
          }}
          disabled={exiting || superLikesRemaining <= 0}
          className={`w-12 h-12 rounded-2xl border shadow-lg transition-all flex items-center justify-center ${
            superLikesRemaining > 0
              ? "bg-brand-surface border-cyan-500/30 text-cyan-400 hover:bg-cyan-500 hover:text-white hover:border-cyan-500 shadow-cyan-950/40 hover:scale-105 active:scale-95"
              : "bg-brand-surface/50 border-white/5 text-slate-600 cursor-not-allowed opacity-40"
          }`}
          aria-label={`Super Like ${firstName} (${superLikesRemaining} remaining)`}
          title={
            superLikesRemaining > 0
              ? `Super Like (${superLikesRemaining} left) — instantly notifies ${firstName}`
              : "No Super Likes remaining today"
          }
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </button>

        {/* Connect Button */}
        <button
          onClick={() => handleButtonSwipe("interested")}
          disabled={exiting}
          className="w-14 h-14 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-950/40 hover:scale-105 active:scale-95 transition-all flex items-center justify-center disabled:opacity-40"
          aria-label={`Connect with ${firstName}`}
          title="Connect (Right Arrow)"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </button>
      </div>

      {/* Keyboard Shortcut Hints */}
      <div className="mt-4 flex items-center gap-3 text-[11px] font-mono text-slate-400 z-10">
        <span className="flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300">←</kbd>
          <span>Pass</span>
        </span>
        <span className="text-slate-600">•</span>
        <span className="flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300">→</kbd>
          <span>Connect</span>
        </span>
      </div>
    </motion.div>
  );
};

export default SwipeableCard;
