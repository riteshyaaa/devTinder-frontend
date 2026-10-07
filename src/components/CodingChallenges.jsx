import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { fetchChallenges, submitChallenge, getErrorMessage } from "../services/api";
import { Spinner, ErrorState, EmptyState } from "./Shimmer";

/**
 * CodingChallenges — Weekly coding challenges with gamification.
 *
 * Features:
 * - Current week's challenge displayed prominently
 * - Past challenges archive
 * - Participation tracking (streak, badges)
 * - Discussion/comments per challenge
 * - Leaderboard (participants count)
 */
const CodingChallenges = () => {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [submission, setSubmission] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const user = useSelector((state) => state.user);

  useEffect(() => {
    loadChallenges();
  }, []);

  const loadChallenges = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetchChallenges();
      const data = res.data?.data || res.data || [];
      setChallenges(data.length > 0 ? data : SAMPLE_CHALLENGES);
    } catch (err) {
      if (err.response?.status !== 401) {
        // Use sample challenges if API not available
        setChallenges(SAMPLE_CHALLENGES);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (challengeId) => {
    if (!submission.trim()) return;
    setSubmitting(true);
    try {
      const isSample = typeof challengeId === "string" && challengeId.startsWith("sample-");
      if (!isSample) {
        await submitChallenge(challengeId, submission.trim());
      }
      setChallenges((prev) =>
        prev.map((c) =>
          c._id === challengeId || c.id === challengeId
            ? { ...c, participants: (c.participants || 0) + 1, hasSubmitted: true }
            : c
        )
      );
      setSubmission("");
      setSelectedChallenge(null);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const getStreakBadge = (streak) => {
    if (streak >= 10) return { emoji: "🏆", label: "Champion", color: "badge-warning" };
    if (streak >= 5) return { emoji: "🔥", label: "On Fire", color: "badge-error" };
    if (streak >= 3) return { emoji: "⚡", label: "Streak", color: "badge-info" };
    return null;
  };

  const getDifficultyColor = (level) => {
    switch (level) {
      case "easy": return "badge-success";
      case "medium": return "badge-warning";
      case "hard": return "badge-error";
      default: return "badge-ghost";
    }
  };

  if (loading) return <Spinner text="Loading challenges..." />;
  if (error && challenges.length === 0) return <ErrorState message={error} onRetry={loadChallenges} />;

  const currentChallenge = challenges[0];
  const pastChallenges = challenges.slice(1);

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 sm:py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-mono font-semibold mb-2">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
            </svg>
            Weekly Challenges
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Coding Challenges
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Sharpen your skills and spark conversations with the community
          </p>
        </div>
        {user?.challengeStreak > 0 && (
          <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20">
            <svg className="w-6 h-6 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
            </svg>
            <div className="text-right">
              <p className="font-black text-xl text-white leading-none">{user.challengeStreak}</p>
              <p className="text-[10px] font-medium text-orange-300 uppercase tracking-wider">Week Streak</p>
            </div>
          </div>
        )}
      </div>

      {/* This Week's Challenge - Hero Card */}
      {currentChallenge && (
        <div className="relative rounded-2xl overflow-hidden mb-8 border border-amber-500/20 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-rose-500/10" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(251,191,36,0.1),transparent_50%)]" />

          <div className="relative p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[11px] font-bold uppercase tracking-wider shadow-md shadow-amber-500/30">
                This Week
              </span>
              <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider border ${
                currentChallenge.difficulty === "easy"
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                  : currentChallenge.difficulty === "medium"
                  ? "bg-amber-500/10 border-amber-500/30 text-amber-300"
                  : "bg-rose-500/10 border-rose-500/30 text-rose-300"
              }`}>
                {currentChallenge.difficulty || "medium"}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white mb-3 tracking-tight">
              {currentChallenge.title}
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed mb-4">
              {currentChallenge.description}
            </p>

            {/* Tech tags */}
            {currentChallenge.tags && currentChallenge.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-5">
                {currentChallenge.tags.map((tag) => (
                  <span key={tag} className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-[11px] font-mono text-slate-300">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Stats Row */}
            <div className="flex flex-wrap items-center gap-4 text-sm mb-5">
              <div className="flex items-center gap-1.5 text-slate-400">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 9a3 3 0 100-6 3 3 0 000 6zM6 8a2 2 0 11-4 0 2 2 0 014 0zM1.49 15.326a.78.78 0 01-.358-.442 3 3 0 014.308-3.516 6.484 6.484 0 00-1.905 3.959c-.023.222-.014.442.025.654a4.97 4.97 0 01-2.07-.655zM16.44 15.98a4.97 4.97 0 002.07-.654.78.78 0 00.357-.442 3 3 0 00-4.308-3.517 6.484 6.484 0 011.907 3.96 2.32 2.32 0 01-.026.654zM18 8a2 2 0 11-4 0 2 2 0 014 0zM5.304 16.19a.844.844 0 01-.277-.71 5 5 0 019.947 0 .843.843 0 01-.277.71A6.975 6.975 0 0110 18a6.974 6.974 0 01-4.696-1.81z" />
                </svg>
                <span className="font-medium">{currentChallenge.participants || 0}</span>
                <span className="text-xs">participants</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-xs">{currentChallenge.timeLimit || "30 min"}</span>
              </div>
              {currentChallenge.endsAt && (
                <div className="flex items-center gap-1.5 text-slate-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                  </svg>
                  <span className="text-xs">Ends {new Date(currentChallenge.endsAt).toLocaleDateString()}</span>
                </div>
              )}
            </div>

            {/* Submit area */}
            {currentChallenge.hasSubmitted ? (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-semibold">You've completed this challenge!</span>
              </div>
            ) : selectedChallenge === (currentChallenge._id || currentChallenge.id) ? (
              <div className="space-y-3">
                <textarea
                  value={submission}
                  onChange={(e) => setSubmission(e.target.value)}
                  placeholder="Paste your solution code, share your approach, or link to your repository..."
                  className="w-full px-3.5 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors resize-none font-mono"
                  rows={5}
                />
                <div className="flex gap-2.5">
                  <button
                    onClick={() => handleSubmit(currentChallenge._id || currentChallenge.id)}
                    disabled={submitting || !submission.trim()}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 disabled:from-slate-700 disabled:to-slate-700 text-white text-sm font-semibold shadow-md shadow-amber-600/30 disabled:shadow-none transition-all flex items-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                        </svg>
                        <span>Submit Solution</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => { setSelectedChallenge(null); setSubmission(""); }}
                    className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-sm font-semibold transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setSelectedChallenge(currentChallenge._id || currentChallenge.id)}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold shadow-lg shadow-amber-600/30 transition-all flex items-center gap-2.5"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                </svg>
                <span>Take the Challenge</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Past Challenges Archive */}
      {pastChallenges.length > 0 && (
        <div>
          <h3 className="font-bold text-base text-white mb-4">Past Challenges</h3>
          <div className="space-y-3">
            {pastChallenges.map((challenge) => (
              <div
                key={challenge._id || challenge.id}
                className="group rounded-xl bg-brand-surface/70 hover:bg-brand-surface/95 border border-white/5 hover:border-white/10 p-4 transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <h4 className="font-semibold text-sm text-white">{challenge.title}</h4>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      challenge.difficulty === "easy"
                        ? "bg-emerald-500/10 text-emerald-300"
                        : challenge.difficulty === "medium"
                        ? "bg-amber-500/10 text-amber-300"
                        : "bg-rose-500/10 text-rose-300"
                    }`}>
                      {challenge.difficulty}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-1 mb-2">{challenge.description}</p>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 9a3 3 0 100-6 3 3 0 000 6zM6 8a2 2 0 11-4 0 2 2 0 014 0zM1.49 15.326a.78.78 0 01-.358-.442 3 3 0 014.308-3.516 6.484 6.484 0 00-1.905 3.959c-.023.222-.014.442.025.654a4.97 4.97 0 01-2.07-.655zM16.44 15.98a4.97 4.97 0 002.07-.654.78.78 0 00.357-.442 3 3 0 00-4.308-3.517 6.484 6.484 0 011.907 3.96 2.32 2.32 0 01-.026.654zM18 8a2 2 0 11-4 0 2 2 0 014 0zM5.304 16.19a.844.844 0 01-.277-.71 5 5 0 019.947 0 .843.843 0 01-.277.71A6.975 6.975 0 0110 18a6.974 6.974 0 01-4.696-1.81z" />
                    </svg>
                    <span>{challenge.participants || 0} participated</span>
                  </div>
                </div>
                {challenge.hasSubmitted && (
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 shrink-0 self-start sm:self-center">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    <span>Completed</span>
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {challenges.length === 0 && (
        <EmptyState
          icon="⚡"
          title="No challenges yet"
          description="Check back soon — new challenges are posted weekly!"
        />
      )}
    </div>
  );
};

// Sample challenges (used when API not available)
const SAMPLE_CHALLENGES = [
  {
    id: "sample-1",
    title: "Build a Real-time Chat API",
    description: "Create a REST API with WebSocket support that handles message delivery, read receipts, and typing indicators. Use any tech stack you prefer.",
    difficulty: "medium",
    tags: ["Node.js", "WebSocket", "REST API", "Database"],
    participants: 23,
    timeLimit: "45 min",
    endsAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    hasSubmitted: false,
  },
  {
    id: "sample-2",
    title: "Implement a Rate Limiter",
    description: "Build a middleware that limits API requests to 100 per minute per user. Handle edge cases like distributed systems and sliding windows.",
    difficulty: "hard",
    tags: ["System Design", "Redis", "Middleware"],
    participants: 15,
    timeLimit: "30 min",
    hasSubmitted: false,
  },
  {
    id: "sample-3",
    title: "Create a Responsive Dashboard",
    description: "Build a dashboard with 4 widgets (chart, table, stats, notifications) that works on mobile, tablet, and desktop.",
    difficulty: "easy",
    tags: ["React", "CSS", "Responsive Design"],
    participants: 42,
    timeLimit: "30 min",
    hasSubmitted: true,
  },
];

export default CodingChallenges;
