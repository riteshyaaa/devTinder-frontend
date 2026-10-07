import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateProfile, getErrorMessage } from "../services/api";
import { addUser } from "../utils/userSlice";
import { validatePhotoUrl, validateAbout } from "../utils/validators";
import Logo from "./ui/Logo";

const STEPS = [
  { key: "welcome", title: "Welcome to DevTinder", subtitle: "Build your developer profile in under 2 minutes" },
  { key: "photo", title: "Add a Profile Photo", subtitle: "A photo increases connection response rates by 3x" },
  { key: "about", title: "Engineering Bio", subtitle: "Highlight your focus, interests, and collaboration goals" },
  { key: "skills", title: "Core Tech Stack", subtitle: "Select up to 10 technologies you work with" },
  { key: "done", title: "Profile Ready", subtitle: "Your developer profile is primed for matchmaking" },
];

const SKILL_OPTIONS = [
  "JavaScript", "TypeScript", "React", "Next.js", "Vue", "Angular",
  "Node.js", "Express", "Python", "FastAPI", "Go", "Rust",
  "C++", "C#", "Java", "Docker", "Kubernetes", "AWS",
  "MongoDB", "PostgreSQL", "GraphQL", "Redis", "Tailwind CSS", "Git",
];

const Onboarding = () => {
  const [step, setStep] = useState(0);
  const [photoUrl, setPhotoUrl] = useState("");
  const [about, setAbout] = useState("");
  const [skills, setSkills] = useState([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const currentStep = STEPS[step];
  const totalSteps = STEPS.length;
  const progress = ((step + 1) / totalSteps) * 100;

  const nextStep = () => {
    if (step < totalSteps - 1) {
      setError("");
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 0) {
      setError("");
      setStep(step - 1);
    }
  };

  const handleSkillToggle = (skill) => {
    setSkills((prev) =>
      prev.includes(skill)
        ? prev.filter((s) => s !== skill)
        : prev.length < 10
        ? [...prev, skill]
        : prev
    );
  };

  const handleFinish = async () => {
    setSaving(true);
    setError("");
    try {
      const profileData = {};
      if (photoUrl.trim()) profileData.photoUrl = photoUrl.trim();
      if (about.trim()) profileData.about = about.trim();
      if (skills.length > 0) profileData.skills = skills;

      // Only update if user provided something
      if (Object.keys(profileData).length > 0) {
        const res = await updateProfile(profileData);
        dispatch(addUser(res.data.data));
      }
      navigate("/");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoNext = () => {
    if (photoUrl.trim()) {
      const err = validatePhotoUrl(photoUrl);
      if (err) {
        setError(err);
        return;
      }
    }
    nextStep();
  };

  const handleAboutNext = () => {
    if (about.trim()) {
      const err = validateAbout(about);
      if (err) {
        setError(err);
        return;
      }
    }
    nextStep();
  };

  const slideVariants = {
    enter: { x: 40, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: -40, opacity: 0 },
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-brand-dark relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[500px] bg-gradient-to-tr from-violet-600/10 via-cyan-500/10 to-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-xl relative z-10">
        <div className="rounded-3xl bg-brand-surface border border-white/10 p-6 sm:p-10 shadow-2xl shadow-violet-950/40 backdrop-blur-xl">
          {/* Header Step Pills */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Logo size="sm" showText={false} />
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">
                  Onboarding Progress
                </span>
              </div>
              <span className="text-xs font-mono text-cyan-400 font-bold">
                Step {step + 1} of {totalSteps}
              </span>
            </div>

            {/* Step Node Indicators */}
            <div className="flex items-center gap-2">
              {STEPS.map((s, idx) => (
                <div
                  key={s.key}
                  className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                    idx <= step
                      ? "bg-gradient-to-r from-violet-500 to-cyan-400 shadow-sm shadow-violet-500/50"
                      : "bg-white/10"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Step Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep.key}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25 }}
              className="min-h-[300px] flex flex-col"
            >
              {/* Step 0: Welcome */}
              {step === 0 && (
                <div className="flex flex-col items-center justify-center flex-1 text-center py-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-violet-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-600/30 mb-6">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
                    </svg>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">{currentStep.title}</h2>
                  <p className="text-slate-300 text-sm mt-2 max-w-md leading-relaxed">
                    Set up your engineering identity so complementary developers, pair-programming partners, and co-founders can find you.
                  </p>
                  <div className="mt-8">
                    <button
                      onClick={nextStep}
                      className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-violet-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
                    >
                      <span>Get Started</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}

              {/* Step 1: Photo URL */}
              {step === 1 && (
                <div className="flex flex-col flex-1">
                  <div className="text-center mb-6">
                    <h2 className="text-xl font-bold text-white">{currentStep.title}</h2>
                    <p className="text-xs text-slate-400 mt-1">{currentStep.subtitle}</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5" htmlFor="onboard-photo">
                        Image URL
                      </label>
                      <input
                        id="onboard-photo"
                        type="url"
                        value={photoUrl}
                        onChange={(e) => {
                          setPhotoUrl(e.target.value);
                          setError("");
                        }}
                        placeholder="https://images.unsplash.com/photo-..."
                        className={`w-full px-4 py-2.5 rounded-xl bg-white/5 border ${
                          error ? "border-rose-500" : "border-white/10 focus:border-violet-500"
                        } text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-500 transition-colors`}
                      />
                      {error && <p className="text-rose-400 text-xs mt-1">{error}</p>}
                    </div>

                    {/* Preview */}
                    {photoUrl && !error && (
                      <div className="flex justify-center pt-2">
                        <div className="w-24 h-24 rounded-2xl overflow-hidden ring-2 ring-violet-500/60 shadow-lg bg-slate-900">
                          <img
                            src={photoUrl}
                            alt="Profile preview"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = "none";
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-auto pt-8 border-t border-white/5">
                    <button onClick={prevStep} className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors">
                      &larr; Back
                    </button>
                    <div className="flex gap-2">
                      <button onClick={nextStep} className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors">
                        Skip
                      </button>
                      <button
                        onClick={handlePhotoNext}
                        className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs transition-colors shadow-md shadow-violet-600/30"
                      >
                        Continue &rarr;
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: About */}
              {step === 2 && (
                <div className="flex flex-col flex-1">
                  <div className="text-center mb-6">
                    <h2 className="text-xl font-bold text-white">{currentStep.title}</h2>
                    <p className="text-xs text-slate-400 mt-1">{currentStep.subtitle}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <label className="font-semibold text-slate-300" htmlFor="onboard-about">
                        About You
                      </label>
                      <span className="text-slate-500 font-mono">{about.length}/300</span>
                    </div>
                    <textarea
                      id="onboard-about"
                      value={about}
                      maxLength={300}
                      onChange={(e) => {
                        setAbout(e.target.value);
                        setError("");
                      }}
                      placeholder="Passionate full-stack developer focusing on distributed systems and React performance. Seeking collaborators for open-source developer tooling..."
                      className={`w-full h-28 px-4 py-3 rounded-xl bg-white/5 border ${
                        error ? "border-rose-500" : "border-white/10 focus:border-violet-500"
                      } text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-500 transition-colors resize-none`}
                    />
                    {error && <p className="text-rose-400 text-xs mt-1">{error}</p>}
                  </div>

                  <div className="flex items-center justify-between mt-auto pt-8 border-t border-white/5">
                    <button onClick={prevStep} className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors">
                      &larr; Back
                    </button>
                    <div className="flex gap-2">
                      <button onClick={nextStep} className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors">
                        Skip
                      </button>
                      <button
                        onClick={handleAboutNext}
                        className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs transition-colors shadow-md shadow-violet-600/30"
                      >
                        Continue &rarr;
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Skills */}
              {step === 3 && (
                <div className="flex flex-col flex-1">
                  <div className="text-center mb-6">
                    <h2 className="text-xl font-bold text-white">{currentStep.title}</h2>
                    <p className="text-xs text-slate-400 mt-1">
                      {currentStep.subtitle} <span className="text-cyan-400 font-mono font-bold">({skills.length}/10 selected)</span>
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 justify-center max-h-52 overflow-y-auto p-2 bg-black/20 rounded-2xl border border-white/5">
                    {SKILL_OPTIONS.map((skill) => {
                      const isSelected = skills.includes(skill);
                      return (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => handleSkillToggle(skill)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all ${
                            isSelected
                              ? "bg-violet-600 text-white shadow-md shadow-violet-600/30 border border-violet-400/40"
                              : "bg-white/5 text-slate-300 border border-white/10 hover:border-white/20 hover:text-white"
                          }`}
                          aria-pressed={isSelected}
                          aria-label={`${skill} ${isSelected ? "selected" : "not selected"}`}
                        >
                          {skill} {isSelected && "✓"}
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-between mt-auto pt-8 border-t border-white/5">
                    <button onClick={prevStep} className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors">
                      &larr; Back
                    </button>
                    <div className="flex gap-2">
                      <button onClick={nextStep} className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors">
                        Skip
                      </button>
                      <button
                        onClick={nextStep}
                        className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs transition-colors shadow-md shadow-violet-600/30"
                      >
                        Continue &rarr;
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Done */}
              {step === 4 && (
                <div className="flex flex-col items-center justify-center flex-1 text-center py-4">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/20 mb-4">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-white">{currentStep.title}</h2>
                  <p className="text-slate-400 text-xs mt-1 max-w-sm">
                    Your developer profile is primed and ready. Jump into the feed to discover matches.
                  </p>

                  {/* Summary Card */}
                  <div className="text-xs text-left w-full max-w-sm space-y-2 bg-white/5 border border-white/10 rounded-2xl p-4 mt-5">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-mono">Avatar:</span>
                      <span className="font-semibold text-slate-200">{photoUrl ? "Custom Photo Added" : "Default Generated"}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-mono">Bio:</span>
                      <span className="font-semibold text-slate-200">{about ? `${about.length} characters` : "Skipped"}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-mono">Tech Stack:</span>
                      <span className="font-semibold text-cyan-300 font-mono">{skills.length > 0 ? `${skills.length} skills selected` : "None selected"}</span>
                    </div>
                  </div>

                  {error && (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs mt-4">
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-3 mt-6">
                    <button onClick={prevStep} className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors">
                      &larr; Back
                    </button>
                    <button
                      onClick={handleFinish}
                      disabled={saving}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                      {saving ? (
                        <>
                          <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Saving Profile...</span>
                        </>
                      ) : (
                        <span>Start Discovering Developers</span>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
