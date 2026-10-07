import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const sampleDevelopers = [
  {
    name: "Alex Rivera",
    age: 27,
    title: "Rust & Distributed Systems Engineer",
    company: "Ex-Stripe",
    experience: "5 yrs exp",
    photo: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400",
    about: "Passionate about zero-cost abstractions, asynchronous runtimes, and high-throughput networking. Looking for a frontend collaborator for an open-source analytics engine.",
    skills: ["Rust", "Tokio", "WebAssembly", "PostgreSQL", "Docker", "gRPC"],
    matchScore: 99,
  },
  {
    name: "Maya Chen",
    age: 24,
    title: "Full Stack & UI/UX Specialist",
    company: "Design Systems Lead",
    experience: "3 yrs exp",
    photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400",
    about: "Obsessed with buttery smooth micro-interactions, Tailwind, and React 19 server components. Seeking a backend architect to build developer tooling.",
    skills: ["React", "Next.js", "TypeScript", "TailwindCSS", "Framer Motion", "GraphQL"],
    matchScore: 96,
  },
  {
    name: "Marcus Thorne",
    age: 29,
    title: "AI Engineer & LLM Pipeline Architect",
    company: "AI Labs",
    experience: "6 yrs exp",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    about: "Fine-tuning transformer models and vector indexing at scale. Let's team up for the next worldwide hackathon!",
    skills: ["Python", "PyTorch", "LangChain", "FastAPI", "Pinecone", "Kubernetes"],
    matchScore: 95,
  },
];

const DiscoveryShowcase = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeAction, setSwipeAction] = useState(null);

  const dev = sampleDevelopers[currentIndex % sampleDevelopers.length];

  const handleAction = (type) => {
    setSwipeAction(type);
    setTimeout(() => {
      setSwipeAction(null);
      setCurrentIndex((prev) => prev + 1);
    }, 300);
  };

  return (
    <div className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Explanation */}
        <div className="lg:col-span-6 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-mono font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
            Interactive Discovery Demo
          </div>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Swipe through developers who match your tech vision.
          </h3>
          <p className="text-slate-300 text-base leading-relaxed">
            Review detailed bios, verified GitHub skills, real-time match compatibility scores, and active collaboration interests before initiating a connection.
          </p>

          <div className="space-y-3 pt-2">
            {[
              "Multi-variable compatibility scoring based on tech stacks",
              "Swipe Right (Interested), Swipe Left (Pass), or Superlike for instant alerts",
              "Granular skill tags with categorized colors and experience badges",
            ].map((text, i) => (
              <div key={i} className="flex items-start gap-3 text-sm text-slate-300">
                <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                  ✓
                </div>
                <span>{text}</span>
              </div>
            ))}
          </div>

          <div className="pt-2 text-xs text-slate-500 font-mono">
            &larr; Try clicking the interactive actions on the card preview &rarr;
          </div>
        </div>

        {/* Right Interactive Card */}
        <div className="lg:col-span-6 flex justify-center">
          <div className="w-full max-w-md">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{
                  x: swipeAction === "interested" ? 300 : swipeAction === "pass" ? -300 : 0,
                  y: swipeAction === "superlike" ? -300 : 0,
                  opacity: 0,
                  rotate: swipeAction === "interested" ? 15 : swipeAction === "pass" ? -15 : 0,
                }}
                transition={{ duration: 0.3 }}
                className="relative rounded-3xl bg-brand-surface border border-white/10 overflow-hidden shadow-2xl shadow-violet-950/40"
              >
                {/* Swipe Overlay Badges */}
                {swipeAction === "interested" && (
                  <div className="absolute top-8 left-8 z-30 px-4 py-2 rounded-xl border-2 border-emerald-400 bg-emerald-500/20 text-emerald-300 font-black text-xl tracking-wider uppercase rotate-[-12deg] backdrop-blur-md">
                    INTERESTED
                  </div>
                )}
                {swipeAction === "pass" && (
                  <div className="absolute top-8 right-8 z-30 px-4 py-2 rounded-xl border-2 border-rose-400 bg-rose-500/20 text-rose-300 font-black text-xl tracking-wider uppercase rotate-[12deg] backdrop-blur-md">
                    PASS
                  </div>
                )}
                {swipeAction === "superlike" && (
                  <div className="absolute top-8 left-1/2 -translate-x-1/2 z-30 px-4 py-2 rounded-xl border-2 border-cyan-400 bg-cyan-500/20 text-cyan-300 font-black text-xl tracking-wider uppercase backdrop-blur-md">
                    SUPERLIKE ⚡
                  </div>
                )}

                {/* Developer Image & Banner */}
                <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-slate-900">
                  <img
                    src={dev.photo}
                    alt={dev.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-surface via-brand-surface/20 to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs font-mono text-slate-200">
                      {dev.experience}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      {dev.matchScore}% Match
                    </span>
                  </div>

                  {/* Name and headline over image bottom */}
                  <div className="absolute bottom-3 left-5 right-5">
                    <h4 className="text-2xl font-bold text-white flex items-center gap-2">
                      {dev.name}, {dev.age}
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" title="Online now" />
                    </h4>
                    <p className="text-xs text-violet-300 font-medium">{dev.title} &bull; {dev.company}</p>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 sm:p-6 space-y-4">
                  <div>
                    <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">About</h5>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {dev.about}
                    </p>
                  </div>

                  <div>
                    <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Tech Stack</h5>
                    <div className="flex flex-wrap gap-1.5">
                      {dev.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-slate-200"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Swipe Action Controls */}
                  <div className="pt-4 border-t border-white/10 flex items-center justify-center gap-5">
                    <button
                      onClick={() => handleAction("pass")}
                      className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 hover:scale-110 active:scale-95 transition-all flex items-center justify-center shadow-lg"
                      aria-label="Pass developer"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>

                    <button
                      onClick={() => handleAction("superlike")}
                      className="w-11 h-11 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20 hover:scale-110 active:scale-95 transition-all flex items-center justify-center shadow-lg"
                      aria-label="Superlike developer"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    </button>

                    <button
                      onClick={() => handleAction("interested")}
                      className="w-14 h-14 rounded-full bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white hover:scale-110 active:scale-95 transition-all flex items-center justify-center shadow-xl shadow-violet-600/30"
                      aria-label="Connect with developer"
                    >
                      <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscoveryShowcase;
