import { motion } from "framer-motion";

const VideoShowcase = () => {
  return (
    <div className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-white/5">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left: Info */}
        <div className="lg:col-span-5 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-300 text-xs font-mono font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-pink-400" />
            PeerJS &amp; WebRTC
          </div>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Peer-to-peer video with native screen sharing.
          </h3>
          <p className="text-slate-300 text-base leading-relaxed">
            Jump into zero-install pair programming calls. Debug tricky edge cases together, walk through pull requests, and review architecture blueprints with high-definition audio and video.
          </p>

          <div className="space-y-3 pt-2">
            {[
              "Direct P2P WebRTC media streaming with ultra-low latency",
              "One-click screen sharing with dynamic RTCRtpSender track replacement",
              "Integrated audio level indicators and floating glass controls",
            ].map((feature, i) => (
              <div key={i} className="flex items-start gap-3 text-sm text-slate-300">
                <div className="w-5 h-5 rounded-full bg-pink-500/10 text-pink-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                  ✓
                </div>
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: WebRTC Video UI Mockup */}
        <div className="lg:col-span-7">
          <div className="relative rounded-3xl bg-brand-surface border border-white/10 overflow-hidden shadow-2xl shadow-pink-950/30 p-3 sm:p-4">
            {/* Main Video Viewport (Remote Peer) */}
            <div className="relative h-72 sm:h-96 rounded-2xl overflow-hidden bg-slate-950 flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800"
                alt="Remote developer on video"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />

              {/* Top Call Bar */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-xs text-white">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-semibold">Elena Rostova</span>
                  <span className="text-slate-400 font-mono">| 14:22</span>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-pink-500/20 backdrop-blur-md border border-pink-500/40 text-pink-300 text-xs font-mono font-semibold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-pink-400" />
                  WebRTC P2P HD
                </div>
              </div>

              {/* Bottom Video Pip (Local User) */}
              <div className="absolute bottom-4 right-4 w-28 sm:w-36 h-20 sm:h-24 rounded-xl overflow-hidden ring-2 ring-violet-500/60 shadow-xl bg-slate-900">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300"
                  alt="You"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-1 left-2 text-[10px] text-white font-semibold bg-black/60 px-1 rounded">You</span>
              </div>

              {/* Screen Share Active Toast */}
              <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-xs text-cyan-300 font-mono">
                <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0H3" />
                </svg>
                <span>Screen Sharing Active</span>
              </div>
            </div>

            {/* Bottom Glass Control Bar */}
            <div className="mt-3 py-2 px-4 rounded-xl bg-brand-card/90 border border-white/10 flex items-center justify-center gap-3 sm:gap-4">
              <button className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                </svg>
              </button>

              <button className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </button>

              <button className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center justify-center transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0H3" />
                </svg>
              </button>

              <button className="px-5 h-10 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-lg shadow-rose-600/30 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>End Call</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoShowcase;
