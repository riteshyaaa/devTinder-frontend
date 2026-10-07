import { motion } from "framer-motion";

const ChallengesShowcase = () => {
  return (
    <div className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-white/5">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left: Info */}
        <div className="lg:col-span-5 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-mono font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Skill Benchmark Arena
          </div>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Solve challenges. Earn streaks. Climb the leaderboard.
          </h3>
          <p className="text-slate-300 text-base leading-relaxed">
            Level up your algorithmic and architectural skills. Compete in weekly engineering challenges, test your solutions against real edge cases in our sandboxed runner, and unlock verified skill credentials.
          </p>

          <div className="space-y-3 pt-2">
            {[
              "Multi-language code execution with instant test case verification",
              "Dynamic leaderboard rankings based on execution runtime & memory",
              "Consecutive streak multipliers and profile badge rewards",
            ].map((feature, i) => (
              <div key={i} className="flex items-start gap-3 text-sm text-slate-300">
                <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                  ✓
                </div>
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Challenge Code Editor Mockup */}
        <div className="lg:col-span-7">
          <div className="rounded-3xl bg-brand-surface border border-white/10 overflow-hidden shadow-2xl shadow-emerald-950/20">
            {/* Window header */}
            <div className="px-6 py-4 bg-brand-card border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-xs font-mono text-slate-400">#42 &bull; LRU Cache Implementation</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold uppercase">
                  Medium
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold flex items-center gap-1">
                  🔥 7 Day Streak
                </span>
              </div>
            </div>

            {/* Code Body */}
            <div className="p-5 font-mono text-xs bg-[#090d16] overflow-x-auto text-slate-300">
              <div className="text-slate-500 mb-2">// Implement an O(1) time complexity LRU Cache with capacity limit</div>
              <pre className="leading-relaxed">
                <code>
                  <span className="text-violet-400">class</span> <span className="text-cyan-300">LRUCache</span> &#123;{"\n"}
                  {"  "}<span className="text-violet-400">constructor</span>(capacity) &#123;{"\n"}
                  {"    "}<span className="text-cyan-400">this</span>.capacity = capacity;{"\n"}
                  {"    "}<span className="text-cyan-400">this</span>.cache = <span className="text-violet-400">new</span> <span className="text-amber-300">Map</span>();{"\n"}
                  {"  "}&#125;{"\n\n"}
                  {"  "}<span className="text-cyan-300">get</span>(key) &#123;{"\n"}
                  {"    "}<span className="text-violet-400">if</span> (!<span className="text-cyan-400">this</span>.cache.<span className="text-cyan-300">has</span>(key)) <span className="text-violet-400">return</span> -1;{"\n"}
                  {"    "}<span className="text-violet-400">const</span> val = <span className="text-cyan-400">this</span>.cache.<span className="text-cyan-300">get</span>(key);{"\n"}
                  {"    "}<span className="text-cyan-400">this</span>.cache.<span className="text-cyan-300">delete</span>(key);{"\n"}
                  {"    "}<span className="text-cyan-400">this</span>.cache.<span className="text-cyan-300">set</span>(key, val);{"\n"}
                  {"    "}<span className="text-violet-400">return</span> val;{"\n"}
                  {"  "}&#125;{"\n"}
                  &#125;
                </code>
              </pre>
            </div>

            {/* Test Results Output Console */}
            <div className="p-4 bg-brand-card/80 border-t border-white/10">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-xs font-mono font-bold text-emerald-400">Passed all 14/14 Test Cases</span>
                </div>
                <span className="text-[11px] font-mono text-slate-400">Runtime: 68ms (Faster than 94.2%)</span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/5">
                <span className="text-xs text-slate-400 font-mono">+150 XP Earned</span>
                <button className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs font-mono shadow-lg shadow-emerald-600/30 transition-colors">
                  Submit Solution &rarr;
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengesShowcase;
