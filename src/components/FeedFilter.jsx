import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";

const SKILL_OPTIONS = [
  "JavaScript", "TypeScript", "React", "Next.js", "Vue", "Angular", "Svelte",
  "Node.js", "Express", "Python", "FastAPI", "Django", "Go", "Rust",
  "Java", "Spring Boot", "C++", "C#", "Docker", "Kubernetes", "AWS", "GCP",
  "MongoDB", "PostgreSQL", "MySQL", "Redis", "GraphQL", "REST API",
  "Tailwind CSS", "Git", "CI/CD", "Linux", "Machine Learning", "React Native"
];

const EXPERIENCE_LEVELS = [
  { value: "", label: "Any Experience Level" },
  { value: "junior", label: "Junior (0-2 yrs)" },
  { value: "mid", label: "Mid-Level (2-5 yrs)" },
  { value: "senior", label: "Senior (5-10 yrs)" },
  { value: "lead", label: "Lead / Architect (10+ yrs)" },
];

/**
 * FeedFilter - Smart matching & filtering panel.
 *
 * "Smart Match" mode: prioritizes developers with complementary skills.
 */
const FeedFilter = ({ filters, onFiltersChange, onReset }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);
  const [debounceTimer, setDebounceTimer] = useState(null);
  const [skillSearch, setSkillSearch] = useState("");
  const user = useSelector((state) => state.user);

  const debouncedUpdate = useCallback(
    (newFilters) => {
      if (debounceTimer) clearTimeout(debounceTimer);
      const timer = setTimeout(() => {
        onFiltersChange(newFilters);
      }, 400);
      setDebounceTimer(timer);
    },
    [onFiltersChange, debounceTimer]
  );

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  useEffect(() => {
    return () => {
      if (debounceTimer) clearTimeout(debounceTimer);
    };
  }, [debounceTimer]);

  const handleSkillToggle = (skill) => {
    const newSkills = localFilters.skills?.includes(skill)
      ? localFilters.skills.filter((s) => s !== skill)
      : [...(localFilters.skills || []), skill];
    const newFilters = { ...localFilters, skills: newSkills };
    setLocalFilters(newFilters);
    debouncedUpdate(newFilters);
  };

  const handleExperienceChange = (e) => {
    const newFilters = { ...localFilters, experienceLevel: e.target.value };
    setLocalFilters(newFilters);
    debouncedUpdate(newFilters);
  };

  const handleLocationChange = (e) => {
    const newFilters = { ...localFilters, location: e.target.value };
    setLocalFilters(newFilters);
    debouncedUpdate(newFilters);
  };

  const handleSmartMatchToggle = () => {
    const newFilters = { ...localFilters, smartMatch: !localFilters.smartMatch };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleReset = () => {
    const emptyFilters = { skills: [], experienceLevel: "", location: "", smartMatch: false };
    setLocalFilters(emptyFilters);
    setSkillSearch("");
    onReset();
  };

  const activeFilterCount =
    (localFilters.skills?.length || 0) +
    (localFilters.experienceLevel ? 1 : 0) +
    (localFilters.location ? 1 : 0) +
    (localFilters.smartMatch ? 1 : 0);

  const filteredSkills = SKILL_OPTIONS.filter(
    (s) =>
      s.toLowerCase().includes(skillSearch.toLowerCase()) &&
      !localFilters.skills?.includes(s)
  );

  return (
    <div className="w-full max-w-xl mx-auto px-4 mb-4">
      {/* Action Bar */}
      <div className="flex items-center justify-between gap-3 bg-brand-surface/80 border border-white/10 backdrop-blur-md rounded-2xl p-2.5">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
            isOpen || activeFilterCount > 0
              ? "bg-violet-600/20 text-violet-300 border border-violet-500/30"
              : "bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5"
          }`}
          aria-expanded={isOpen}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
          </svg>
          <span>Discovery Filters</span>
          {activeFilterCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-violet-600 text-white font-mono text-[10px] flex items-center justify-center font-bold">
              {activeFilterCount}
            </span>
          )}
        </button>

        {/* Smart Match Quick Toggle */}
        <button
          onClick={handleSmartMatchToggle}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
            localFilters.smartMatch
              ? "bg-gradient-to-r from-violet-600 to-cyan-600 text-white shadow-md shadow-violet-600/30"
              : "bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5"
          }`}
          aria-pressed={localFilters.smartMatch}
          title="Smart Match prioritizes developers with complementary skill profiles"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
          </svg>
          <span>Smart Match</span>
          {localFilters.smartMatch && (
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 animate-pulse" />
          )}
        </button>
      </div>

      {/* Expanded Filter Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="rounded-2xl bg-brand-surface border border-white/10 p-5 mt-2.5 space-y-4 shadow-xl shadow-violet-950/30 backdrop-blur-xl">
              {/* Location Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5" htmlFor="filter-loc">
                  Location or Region
                </label>
                <input
                  id="filter-loc"
                  type="text"
                  value={localFilters.location || ""}
                  onChange={handleLocationChange}
                  placeholder="e.g. San Francisco, Remote, London, India..."
                  className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                />
              </div>

              {/* Experience Level Dropdown */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5" htmlFor="filter-exp">
                  Experience Tier
                </label>
                <select
                  id="filter-exp"
                  value={localFilters.experienceLevel || ""}
                  onChange={handleExperienceChange}
                  className="w-full px-3.5 py-2 rounded-xl bg-brand-dark border border-white/10 text-xs text-white focus:outline-none focus:border-violet-500"
                >
                  {EXPERIENCE_LEVELS.map((level) => (
                    <option key={level.value} value={level.value} className="bg-brand-dark text-white">
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Skills Filter */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-slate-300">Target Tech Stack</span>
                  {localFilters.skills?.length > 0 && (
                    <span className="text-[10px] font-mono text-cyan-400">
                      {localFilters.skills.length} selected
                    </span>
                  )}
                </div>

                {/* Selected skills pills */}
                {localFilters.skills?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-2.5">
                    {localFilters.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-mono font-medium bg-violet-600/30 text-violet-300 border border-violet-500/40 flex items-center gap-1.5 cursor-pointer hover:bg-rose-500/20 hover:text-rose-300 hover:border-rose-500/40 transition-colors"
                        onClick={() => handleSkillToggle(skill)}
                        role="button"
                        aria-label={`Remove ${skill} filter`}
                      >
                        <span>{skill}</span>
                        <span className="text-xs">✕</span>
                      </span>
                    ))}
                  </div>
                )}

                {/* Skill search */}
                <input
                  type="text"
                  value={skillSearch}
                  onChange={(e) => setSkillSearch(e.target.value)}
                  placeholder="Type to find technologies..."
                  className="w-full px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 mb-2"
                />

                {/* Available skill suggestions */}
                <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-1 bg-black/20 rounded-xl border border-white/5">
                  {filteredSkills.slice(0, 20).map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => handleSkillToggle(skill)}
                      className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-white/5 hover:bg-violet-600 hover:text-white text-slate-300 border border-white/10 transition-colors"
                    >
                      + {skill}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reset Action */}
              {activeFilterCount > 0 && (
                <div className="pt-2 border-t border-white/5 flex justify-end">
                  <button
                    onClick={handleReset}
                    className="text-xs font-mono text-rose-400 hover:text-rose-300 transition-colors"
                  >
                    Reset all filters
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FeedFilter;
