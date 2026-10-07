import { useEffect, useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

/**
 * MatchModal - "It's a Match!" celebration screen.
 *
 * Features:
 * - Animated particle confetti (color palette matching brand tokens)
 * - Radiant backdrop glow with glass container
 * - Avatar slide-in animation with ring glows
 * - Interconnected developer node icon
 * - Shared skills display as conversational kickstarters
 * - "Start Conversation" CTA and "Keep Exploring" dismiss
 * - Escape key support & mobile haptics
 */
const MatchModal = ({ show, matchedUser, currentUser, onClose }) => {
  const [confetti, setConfetti] = useState([]);

  useEffect(() => {
    if (show) {
      if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100, 50, 200]);
      }

      const colors = ["#7C3AED", "#06B6D4", "#EC4899", "#10B981", "#8B5CF6", "#38BDF8"];
      const particles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 0.6,
        duration: 2.2 + Math.random() * 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 6 + Math.random() * 8,
        drift: (Math.random() - 0.5) * 70,
      }));
      setConfetti(particles);
    } else {
      setConfetti([]);
    }
  }, [show]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape" && show) {
        onClose();
      }
    },
    [show, onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [show]);

  const sharedSkills = useMemo(() => {
    if (!matchedUser?.skills || !currentUser?.skills) return [];
    return currentUser.skills.filter((skill) =>
      matchedUser.skills.includes(skill)
    );
  }, [matchedUser?.skills, currentUser?.skills]);

  if (!matchedUser || !currentUser) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/80 backdrop-blur-xl"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Confetti Particles */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
            {confetti.map((particle) => (
              <motion.div
                key={particle.id}
                className="absolute top-0 rounded-full"
                style={{
                  left: `${particle.x}%`,
                  width: particle.size,
                  height: particle.size,
                  backgroundColor: particle.color,
                }}
                initial={{ y: -20, opacity: 1, scale: 1 }}
                animate={{
                  y: "100vh",
                  x: particle.drift,
                  opacity: 0,
                  rotate: 540,
                  scale: 0.4,
                }}
                transition={{
                  duration: particle.duration,
                  delay: particle.delay,
                  ease: "easeIn",
                }}
              />
            ))}
          </div>

          {/* Modal Container */}
          <motion.div
            className="relative bg-brand-surface/95 border border-white/10 rounded-3xl p-6 sm:p-8 max-w-md w-full text-center shadow-2xl shadow-violet-950/60 overflow-hidden backdrop-blur-2xl"
            initial={{ scale: 0.85, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.85, y: 30, opacity: 0 }}
            transition={{ type: "spring", stiffness: 350, damping: 24 }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Mutual Developer Match!"
          >
            {/* Ambient Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-gradient-to-r from-violet-600/30 via-pink-600/30 to-cyan-500/30 rounded-full blur-[60px] pointer-events-none" />

            <div className="relative z-10">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-300 text-xs font-mono font-semibold mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-pulse" />
                Mutual Developer Connection
              </div>

              {/* Title */}
              <motion.h2
                className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight mb-2"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.15 }}
              >
                It&apos;s a{" "}
                <span className="bg-gradient-to-r from-violet-400 via-pink-400 to-cyan-300 bg-clip-text text-transparent">
                  Pair Match!
                </span>
              </motion.h2>

              <p className="text-xs sm:text-sm text-slate-300 max-w-xs mx-auto mb-6">
                You and <strong className="text-white">{matchedUser.firstName}</strong> both expressed interest in collaborating.
              </p>

              {/* Avatars */}
              <div className="flex justify-center items-center gap-4 mb-6">
                <motion.div
                  initial={{ x: -40, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden ring-2 ring-violet-500/80 shadow-xl shadow-violet-500/20 bg-slate-900"
                >
                  <img
                    src={currentUser.photoUrl}
                    alt={currentUser.firstName}
                    className="w-full h-full object-cover"
                  />
                </motion.div>

                {/* Connection Node Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, delay: 0.35 }}
                  className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-violet-600/30 shrink-0"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </motion.div>

                <motion.div
                  initial={{ x: 40, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden ring-2 ring-cyan-500/80 shadow-xl shadow-cyan-500/20 bg-slate-900"
                >
                  <img
                    src={matchedUser.photoUrl}
                    alt={matchedUser.firstName}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              </div>

              {/* Shared Tech Stack */}
              {sharedSkills.length > 0 && (
                <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 mb-6 text-left">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold mb-2">
                    Shared Tech Stack
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {sharedSkills.slice(0, 6).map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-0.5 rounded-lg text-[11px] font-mono font-medium bg-violet-500/20 text-violet-300 border border-violet-500/30"
                      >
                        {skill}
                      </span>
                    ))}
                    {sharedSkills.length > 6 && (
                      <span className="px-1.5 py-0.5 rounded-lg text-[10px] font-mono text-slate-400 bg-white/5">
                        +{sharedSkills.length - 6} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-2.5">
                <Link
                  to={`/chat/${matchedUser._id}`}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-violet-600/30 transition-all flex items-center justify-center gap-2"
                  onClick={onClose}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a.75.75 0 01-.84-.84c.068-.535.176-1.144.305-1.745A7.95 7.95 0 013 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                  </svg>
                  <span>Start Live Chat</span>
                </Link>

                <button
                  onClick={onClose}
                  className="w-full py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                >
                  Keep Exploring Developers
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MatchModal;
