import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600/15 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute top-1/2 right-1/4 w-[450px] h-[450px] bg-pink-500/10 rounded-full blur-[110px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-slate-300 mb-8 backdrop-blur-md"
          >
            <span className="flex h-2 w-2 rounded-full bg-violet-400 animate-pulse" />
            <span className="bg-gradient-to-r from-violet-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent font-semibold">
              DevTinder 2.0
            </span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-300">The Modern Developer Collaboration Ecosystem</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]"
          >
            Discover developers. <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
              Build connections.
            </span>{" "}
            <br className="hidden sm:inline" />
            Create together.
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed"
          >
            The matchmaking and real-time collaboration platform engineered for developers to pair program, build projects, and grow together.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-base shadow-lg shadow-violet-600/30 hover:shadow-violet-600/50 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <span>Get Started Free</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            <a
              href="#capabilities"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 hover:border-white/20 font-medium text-base backdrop-blur-md transition-all"
            >
              <span>Explore Capabilities</span>
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </a>
          </motion.div>

          {/* Key Metrics Strip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-14 pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto"
          >
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">10,000+</div>
              <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider">Developers Connected</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-violet-400 font-mono">94%</div>
              <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider">Match Compatibility</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400 font-mono">1,800+</div>
              <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider">Projects Launched</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-fuchsia-400 font-mono">500k+</div>
              <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider">Lines of Code Shared</div>
            </div>
          </motion.div>
        </div>

        {/* Ambient Ecosystem Visual Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 relative max-w-5xl mx-auto"
        >
          {/* Outer glow wrapper */}
          <div className="relative rounded-3xl p-1 bg-gradient-to-b from-violet-500/30 via-white/10 to-cyan-500/20 shadow-2xl shadow-violet-950/50">
            <div className="rounded-[22px] bg-brand-surface/90 backdrop-blur-2xl border border-white/10 p-4 sm:p-8 overflow-hidden">
              {/* Window Header */}
              <div className="flex items-center justify-between pb-6 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="text-xs text-slate-400 font-mono ml-2">devtinder.io/discover</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Live Match Engine
                </div>
              </div>

              {/* Showcase Grid inside mockup */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-6 items-center">
                {/* Left: Swiping Card Preview */}
                <div className="md:col-span-6 relative">
                  <div className="rounded-2xl bg-brand-card/90 border border-white/10 p-5 shadow-xl relative overflow-hidden group">
                    <div className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> 98% Match
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden ring-2 ring-violet-500/40 flex-shrink-0">
                        <img
                          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300"
                          alt="Developer avatar"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                          Elena Rostova, 26
                          <svg className="w-4 h-4 text-cyan-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                          </svg>
                        </h3>
                        <p className="text-xs text-violet-300 font-medium">Full Stack Architect &bull; 4 yrs exp</p>
                        <p className="text-xs text-slate-400 mt-1">Building distributed systems &amp; WebSockets</p>
                      </div>
                    </div>

                    {/* Skill tags */}
                    <div className="flex flex-wrap gap-1.5 mt-4">
                      {["React", "Node.js", "TypeScript", "GraphQL", "Docker"].map((skill) => (
                        <span
                          key={skill}
                          className="px-2.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-[11px] font-mono text-slate-300"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* Swipe Control Buttons */}
                    <div className="flex items-center justify-center gap-4 mt-5 pt-4 border-t border-white/5">
                      <button className="w-11 h-11 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center hover:scale-110 transition-all">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                      <button className="w-12 h-12 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-violet-600/30 hover:scale-110 transition-all">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                      </button>
                      <button className="w-11 h-11 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center hover:scale-110 transition-all">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right: Real-time Code Chat & Match Toast */}
                <div className="md:col-span-6 space-y-4">
                  {/* Floating match alert card */}
                  <motion.div
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="p-3.5 rounded-xl bg-gradient-to-r from-violet-950/60 to-brand-card/90 border border-violet-500/30 flex items-center gap-3 shadow-lg"
                  >
                    <div className="w-9 h-9 rounded-full bg-violet-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      ⚡
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-white">Mutual Match!</p>
                      <p className="text-[11px] text-slate-300 truncate">You and David matched to collaborate on Rust backend.</p>
                    </div>
                    <span className="text-[10px] text-violet-400 font-mono font-medium">Just now</span>
                  </motion.div>

                  {/* Code snippet chat message */}
                  <div className="rounded-xl bg-brand-card/80 border border-white/10 p-3.5 font-mono text-xs">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 pb-2 mb-2 border-b border-white/5">
                      <span className="text-cyan-400 font-semibold flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-cyan-400" />
                        socket.js
                      </span>
                      <span>TypeScript</span>
                    </div>
                    <div className="text-slate-300 space-y-1">
                      <p><span className="text-violet-400">const</span> <span className="text-cyan-300">peerConnection</span> = <span className="text-amber-300">new</span> <span className="text-yellow-200">Peer</span>&#40;&#41;;</p>
                      <p className="text-slate-400"><span className="text-violet-400">await</span> peerConnection.<span className="text-cyan-300">startPairSession</span>&#40;targetDev&#41;;</p>
                    </div>
                  </div>

                  {/* Project milestone pill */}
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono text-[10px]">PROJECT</span>
                      <span className="text-slate-200 font-medium">Cloud Native Observability Agent</span>
                    </div>
                    <span className="text-emerald-400 font-semibold font-mono">Open &bull; 2 devs needed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
