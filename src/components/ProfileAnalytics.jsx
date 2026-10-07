import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { fetchProfileAnalytics, getErrorMessage } from "../services/api";
import { Spinner, ErrorState } from "./Shimmer";

/**
 * ProfileAnalytics — Dashboard showing profile performance metrics.
 *
 * Metrics:
 * - Profile views this week/month
 * - "Interested" received (people who swiped right on you)
 * - Match rate (mutual interest / total interested)
 * - Response rate (messages replied / messages received)
 * - Profile completeness score
 * - Activity streak
 * - Comparison to last week
 */
const ProfileAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [timeRange, setTimeRange] = useState("week"); // week | month | all
  const user = useSelector((state) => state.user);

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetchProfileAnalytics(timeRange);
      setAnalytics(res.data?.data || res.data || null);
    } catch (err) {
      if (err.response?.status !== 401) {
        // Use sample data if API not available
        setAnalytics(SAMPLE_ANALYTICS);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spinner text="Loading analytics..." />;
  if (error && !analytics) return <ErrorState message={error} onRetry={loadAnalytics} />;

  const data = analytics || SAMPLE_ANALYTICS;

  const getTrendIcon = (change) => {
    if (change > 0) return { icon: "↑", color: "text-emerald-400", label: `+${change}%` };
    if (change < 0) return { icon: "↓", color: "text-rose-400", label: `${change}%` };
    return { icon: "→", color: "text-slate-500", label: "0%" };
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-mono font-semibold mb-2">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
              <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
            </svg>
            Analytics Preview
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Profile Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Live metrics are unavailable — here is a demo preview of your typical performance
          </p>
        </div>
        {/* Time Range Toggle */}
        <div className="join">
          {["week", "month", "all"].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`join-item px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all ${
                timeRange === range
                  ? "bg-violet-600 text-white shadow-md shadow-violet-600/30"
                  : "bg-white/5 text-slate-400 hover:text-white border border-white/10"
              }`}
            >
              {range === "week" ? "7 Days" : range === "month" ? "30 Days" : "All Time"}
            </button>
          ))}
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4 mb-8">
        {[
          { label: "Profile Views", value: data.profileViews, change: data.viewsChange, icon: "👁️" },
          { label: "Interested", value: data.interestedCount, change: data.interestedChange, icon: "❤️" },
          { label: "Matches", value: data.matchCount, change: data.matchChange, icon: "🎉" },
          { label: "Response Rate", value: `${data.responseRate}%`, change: data.responseChange, icon: "💬" },
        ].map((stat, i) => {
          const trend = getTrendIcon(stat.change);
          return (
            <motion.div
              key={stat.label}
              className="rounded-2xl bg-brand-surface/80 border border-white/5 hover:border-violet-500/30 p-4 text-center backdrop-blur-md transition-all duration-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20 border border-violet-500/20 flex items-center justify-center text-lg mx-auto">
                {stat.icon}
              </div>
              <p className="text-2xl font-black text-white mt-2.5">{stat.value}</p>
              <p className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mt-1">{stat.label}</p>
              <p className={`text-[10px] mt-2 font-bold flex items-center justify-center gap-1 ${trend.color}`}>
                <span>{trend.icon}</span>
                <span>{trend.label} vs last period</span>
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Detailed Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4.5 sm:gap-6 mb-6">
        {/* Match Rate */}
        <div className="rounded-2xl bg-brand-surface/80 backdrop-blur-xl border border-white/10 p-5 shadow-lg shadow-black/20">
          <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center">
              <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18zm0 0a8.949 8.949 0 004.951-1.488A3.987 3.987 0 0013.5 16.5h-3a3.987 3.987 0 00-3.451 2.012A8.948 8.948 0 0012 21z" />
              </svg>
            </div>
            <span className="text-white">Match Rate</span>
          </h3>
          <div className="flex items-end gap-3">
            <span className="text-4xl font-bold text-white">{data.matchRate}%</span>
            <span className="text-sm text-slate-400 mb-1">
              of your interests led to matches
            </span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-white/10 overflow-hidden mt-3">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-teal-500 transition-all duration-500"
              style={{ width: `${data.matchRate}%` }}
            />
          </div>
          <p className="text-xs text-slate-400 mt-1.5">
            {data.matchRate >= 30 ? (
              <span className="text-emerald-400 flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                </svg>
                Above average!
              </span>
            ) : data.matchRate >= 15 ? (
              <span className="flex items-center gap-1">
                <svg className="w-3 h-3 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                </svg>
                Solid performance
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <svg className="w-3 h-3 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12.5a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
                Tip: Complete your profile to boost matches
              </span>
            )}
          </p>
        </div>

        {/* Activity Streak */}
        <div className="rounded-2xl bg-brand-surface/80 backdrop-blur-xl border border-white/10 p-5 shadow-lg shadow-black/20">
          <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-orange-500/20 to-rose-500/20 border border-orange-500/30 flex items-center justify-center">
              <svg className="w-4 h-4 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-white">Activity Streak</span>
          </h3>
          <div className="flex items-end gap-3">
            <span className="text-4xl font-bold text-white">{data.streak}</span>
            <span className="text-sm text-slate-400 mb-1">days active</span>
          </div>
          <div className="flex gap-1.5 mt-3">
            {data.weekActivity?.map((active, i) => (
              <div
                key={i}
                className={`w-full h-2.5 rounded-full transition-all ${
                  active ? "bg-gradient-to-t from-violet-600 to-violet-400" : "bg-white/10"
                }`}
                title={`${["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]}: ${
                  active ? "Active" : "Inactive"
                }`}
                aria-label={`${["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]}: ${
                  active ? "Active" : "Inactive"
                }`}
              />
            ))}
          </div>
          <div className="flex justify-between text-[10px] text-slate-500 mt-2">
            <span>Mon</span><span>Sun</span>
          </div>
        </div>

        {/* Top Skills People Like */}
        <div className="rounded-2xl bg-brand-surface/80 backdrop-blur-xl border border-white/10 p-5 shadow-lg shadow-black/20">
          <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500/20 to-sky-500/20 border border-cyan-500/30 flex items-center justify-center">
              <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
              </svg>
            </div>
            <span className="text-white">Skills That Attract</span>
          </h3>
          <p className="text-xs text-slate-400 mb-3">
            Skills on your profile that get the most interest
          </p>
          <div className="space-y-2.5">
            {(data.topSkills || []).map((skill) => (
              <div key={skill.name} className="flex items-center gap-2.5">
                <span className="px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-300 text-[10px] font-mono border border-cyan-500/20">
                  {skill.name}
                </span>
                <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-sky-400 transition-all duration-500"
                    style={{ width: `${skill.percentage}%` }}
                  />
                </div>
                <span className="text-xs text-slate-400 w-9 text-right">{skill.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tips to Improve */}
        <div className="rounded-2xl bg-brand-surface/80 backdrop-blur-xl border border-white/10 p-5 shadow-lg shadow-black/20">
          <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500/20 to-yellow-500/20 border border-amber-500/30 flex items-center justify-center">
              <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12.5a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-white">Tips to Improve</span>
          </h3>
          <ul className="space-y-2">
            {(data.tips || DEFAULT_TIPS).map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="text-violet-400 mt-0.5 shrink-0">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                  </svg>
                </span>
                <span className="text-slate-300">{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Profile Visibility Score — Demo Preview */}
      <div className="rounded-2xl bg-gradient-to-r from-violet-500/15 to-indigo-500/15 border border-violet-500/20 p-6 sm:p-8 mt-6 text-center backdrop-blur-md shadow-lg shadow-violet-600/10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/20 border border-violet-500/30 text-violet-300 text-xs font-mono font-semibold mb-3">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
            <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
          </svg>
          Demo Analytics Preview
        </div>
        <h3 className="font-bold text-lg text-white mb-4">Your Visibility Score</h3>
        <div className="flex justify-center items-baseline gap-2 mb-3">
          <span className="text-6xl sm:text-7xl font-black text-violet-300 leading-none">{data.visibilityScore || 72}</span>
          <span className="text-xl text-violet-400">/100</span>
        </div>
        <p className="text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
          This score reflects how often your profile appears in others' feeds.
          Complete your profile, stay active, and respond to messages to increase it.
          <br />
          <span className="text-xs text-violet-400 mt-2 block">Live metrics unavailable — displaying representative sample data.</span>
        </p>
      </div>
    </div>
  );
};

const DEFAULT_TIPS = [
  "Add more skills to your profile — profiles with 5+ skills get 3x more views",
  "Upload a clear profile photo — it increases matches by 40%",
  "Write a compelling 'Currently Building' one-liner",
  "Connect your GitHub to showcase your work",
  "Be active daily to maintain your visibility streak",
];

const SAMPLE_ANALYTICS = {
  profileViews: 47,
  viewsChange: 12,
  interestedCount: 12,
  interestedChange: 8,
  matchCount: 5,
  matchChange: 25,
  responseRate: 80,
  responseChange: 5,
  matchRate: 42,
  streak: 7,
  weekActivity: [true, true, true, false, true, true, true],
  visibilityScore: 72,
  topSkills: [
    { name: "React", percentage: 85 },
    { name: "Node.js", percentage: 70 },
    { name: "TypeScript", percentage: 55 },
    { name: "AWS", percentage: 40 },
  ],
  tips: DEFAULT_TIPS,
};

export default ProfileAnalytics;
