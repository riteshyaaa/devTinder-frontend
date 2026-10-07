import { motion } from "framer-motion";

const ChatShowcase = () => {
  return (
    <div className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-white/5">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left: Chat UI Mockup */}
        <div className="lg:col-span-7 order-2 lg:order-1">
          <div className="rounded-3xl bg-brand-surface border border-white/10 overflow-hidden shadow-2xl shadow-cyan-950/30">
            {/* Chat Room Header */}
            <div className="px-6 py-4 bg-brand-card border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-violet-500/40">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
                      alt="Elena"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 absolute bottom-0 right-0 ring-2 ring-brand-card" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    Elena Rostova
                    <span className="px-2 py-0.5 rounded-md bg-violet-500/20 text-violet-300 text-[10px] font-mono">Matched</span>
                  </h4>
                  <p className="text-xs text-emerald-400 flex items-center gap-1 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    typing code...
                  </p>
                </div>
              </div>

              {/* Call Trigger in Chat */}
              <div className="flex items-center gap-2">
                <div className="px-3 py-1.5 rounded-xl bg-violet-600/20 border border-violet-500/30 text-violet-300 text-xs font-medium flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                  <span>Start Pair Call</span>
                </div>
              </div>
            </div>

            {/* Chat Messages Body */}
            <div className="p-6 space-y-4 bg-brand-dark/50 font-sans">
              {/* Partner message */}
              <div className="flex items-start gap-3 max-w-[85%]">
                <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0 mt-1">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-1">
                  <div className="p-3.5 rounded-2xl rounded-tl-none bg-brand-card border border-white/10 text-xs sm:text-sm text-slate-200 leading-relaxed shadow-sm">
                    Hey! Saw your project on distributed caching. I just wrapped up a zero-allocation Redis pipeline in Rust. Here is the consumer logic:
                  </div>
                  <span className="text-[10px] text-slate-500 pl-1 font-mono">10:42 AM</span>
                </div>
              </div>

              {/* Code Snippet Message */}
              <div className="flex items-start gap-3 max-w-[95%]">
                <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0 mt-1">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-1 flex-1">
                  <div className="rounded-2xl rounded-tl-none bg-[#0a0f1d] border border-cyan-500/20 p-4 font-mono text-xs overflow-x-auto shadow-md">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 pb-2 mb-2 border-b border-white/5">
                      <span className="text-cyan-400 font-bold">pipeline_worker.rs</span>
                      <span className="text-slate-500">Rust 1.78</span>
                    </div>
                    <pre className="text-slate-300">
                      <code>
                        <span className="text-violet-400">pub async fn</span> <span className="text-cyan-300">consume_stream</span>(mut rx: Receiver&lt;Event&gt;) &#123;{"\n"}
                        {"  "}<span className="text-violet-400">while let</span> <span className="text-amber-300">Some</span>(event) = rx.recv().<span className="text-violet-400">await</span> &#123;{"\n"}
                        {"    "}tokio::spawn(<span className="text-violet-400">async move</span> &#123;{"\n"}
                        {"      "}process_event(&amp;event).<span className="text-violet-400">await</span>;{"\n"}
                        {"    "}&#125;);{"\n"}
                        {"  "}&#125;{"\n"}
                        &#125;
                      </code>
                    </pre>
                  </div>

                  {/* Reaction pills */}
                  <div className="flex items-center gap-1.5 pl-1 pt-1">
                    <span className="px-2 py-0.5 rounded-full bg-violet-500/20 border border-violet-500/30 text-[11px] text-violet-300 flex items-center gap-1">
                      🚀 2
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-[11px] text-cyan-300 flex items-center gap-1">
                      🔥 1
                    </span>
                  </div>
                </div>
              </div>

              {/* Your Reply */}
              <div className="flex items-start gap-3 max-w-[85%] ml-auto flex-row-reverse">
                <div className="space-y-1 text-right">
                  <div className="p-3.5 rounded-2xl rounded-tr-none bg-gradient-to-r from-violet-600 to-indigo-600 text-xs sm:text-sm text-white leading-relaxed text-left shadow-md">
                    This is super clean! Let&#39;s hop on a WebRTC video session right now and plug this into the GraphQL gateway.
                  </div>
                  <div className="flex items-center justify-end gap-1 text-[10px] text-slate-400 font-mono pr-1">
                    <span>10:44 AM</span>
                    <span className="text-cyan-400">✓✓</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Input Bar */}
            <div className="p-4 bg-brand-card border-t border-white/10 flex items-center gap-3">
              <button className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
                </svg>
              </button>
              <input
                type="text"
                readOnly
                value="Sharing the GraphQL schema now..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-slate-300 focus:outline-none"
              />
              <button className="p-2 rounded-xl bg-violet-600 text-white flex items-center justify-center shadow-md">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Feature Description */}
        <div className="lg:col-span-5 space-y-6 order-1 lg:order-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-mono font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            Real-Time Collaboration
          </div>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Chat engineered specifically for developers.
          </h3>
          <p className="text-slate-300 text-base leading-relaxed">
            Forget messy screenshots and unformatted paste dumps. DevTinder chat provides built-in syntax highlighting for 50+ languages, inline reactions, and instant pair programming call triggers.
          </p>

          <div className="space-y-4 pt-2">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <h5 className="font-semibold text-white text-sm flex items-center gap-2">
                <span className="text-violet-400 font-mono">01.</span> Syntax-Highlighted Markdown
              </h5>
              <p className="text-xs text-slate-400 mt-1">
                Share code snippets formatted with language-aware color coding and line numbers.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <h5 className="font-semibold text-white text-sm flex items-center gap-2">
                <span className="text-cyan-400 font-mono">02.</span> Low-Latency Socket Architecture
              </h5>
              <p className="text-xs text-slate-400 mt-1">
                Deterministic room hashes ensure private, end-to-end encrypted real-time delivery with typing indicators.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatShowcase;
