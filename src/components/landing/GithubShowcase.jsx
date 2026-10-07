import { motion } from "framer-motion";

const GithubShowcase = () => {
  return (
    <div className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-white/5">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left: Github Widget Mockup */}
        <div className="lg:col-span-7 order-2 lg:order-1">
          <div className="rounded-3xl bg-[#0d1117] border border-white/10 overflow-hidden shadow-2xl shadow-indigo-950/20">
            {/* Widget Header */}
            <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                <div>
                  <h4 className="text-white font-bold">@alex-rivera</h4>
                  <p className="text-slate-400 text-xs">Connected GitHub Profile</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-bold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                Verified
              </span>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 divide-x divide-white/5 border-b border-white/5">
              <div className="p-4 text-center">
                <div className="text-2xl font-bold text-white mb-1">42</div>
                <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Repositories</div>
              </div>
              <div className="p-4 text-center">
                <div className="text-2xl font-bold text-white mb-1">1.2k</div>
                <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Commits (Yr)</div>
              </div>
              <div className="p-4 text-center">
                <div className="text-2xl font-bold text-white mb-1">128</div>
                <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Stars Earned</div>
              </div>
            </div>

            {/* Languages Bar */}
            <div className="p-6 border-b border-white/5">
              <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Top Languages</h5>
              <div className="h-2.5 w-full rounded-full overflow-hidden flex mb-2">
                <div className="h-full bg-[#dea584]" style={{ width: '45%' }} title="Rust"></div>
                <div className="h-full bg-[#f1e05a]" style={{ width: '25%' }} title="JavaScript"></div>
                <div className="h-full bg-[#3178c6]" style={{ width: '20%' }} title="TypeScript"></div>
                <div className="h-full bg-[#384d54]" style={{ width: '10%' }} title="Dockerfile"></div>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#dea584]"></span>
                  <span className="text-slate-300">Rust 45%</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#f1e05a]"></span>
                  <span className="text-slate-300">JS 25%</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#3178c6]"></span>
                  <span className="text-slate-300">TS 20%</span>
                </div>
              </div>
            </div>

            {/* Featured Repo */}
            <div className="p-6">
              <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Pinned Repository</h5>
              <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02]">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                    </svg>
                    distributed-raft-rs
                  </div>
                  <span className="px-2 py-0.5 rounded-full border border-white/10 text-[10px] text-slate-400 font-mono">Public</span>
                </div>
                <p className="text-xs text-slate-400 mb-4 line-clamp-2">
                  A high-performance implementation of the Raft consensus algorithm built entirely in Rust using Tokio and tonic gRPC.
                </p>
                <div className="flex items-center gap-4 text-xs font-mono text-slate-500">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#dea584]"></span>
                    Rust
                  </div>
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    84
                  </div>
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    21
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Feature Description */}
        <div className="lg:col-span-5 space-y-6 order-1 lg:order-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-mono font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            Verified Developer Identity
          </div>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Proof of work powered by GitHub.
          </h3>
          <p className="text-slate-300 text-base leading-relaxed">
            Stop guessing someone's skill level. Connect your GitHub account to instantly mirror your top languages, contribution graphs, and pinned repositories for transparent matchmaking.
          </p>

          <div className="space-y-4 pt-2">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <h5 className="font-semibold text-white text-sm flex items-center gap-2">
                <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Algorithmic Trust
              </h5>
              <p className="text-xs text-slate-400 mt-1">
                Your tech stack tags are verified by analyzing the source code you've published.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <h5 className="font-semibold text-white text-sm flex items-center gap-2">
                <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
                </svg>
                Code-First Discovery
              </h5>
              <p className="text-xs text-slate-400 mt-1">
                Find partners who write clean code in your exact tooling ecosystem by exploring their open source footprint first.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GithubShowcase;
