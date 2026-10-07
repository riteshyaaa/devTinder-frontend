import { motion } from "framer-motion";

const capabilities = [
  {
    id: "discovery",
    title: "Smart Developer Discovery",
    description:
      "Filter by tech stack, experience level, and timezone. Swipe through verified developer cards with instant match calculation.",
    icon: (
      <svg className="w-6 h-6 text-violet-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
      </svg>
    ),
    badge: "Matching Engine",
    color: "from-violet-500/20 to-purple-500/5",
    border: "group-hover:border-violet-500/40",
  },
  {
    id: "chat",
    title: "Real-Time Chat & Code Sharing",
    description:
      "Rich developer messaging powered by Socket.IO with inline syntax highlighting, file attachments, and emoji reactions.",
    icon: (
      <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
      </svg>
    ),
    badge: "Socket.IO",
    color: "from-cyan-500/20 to-blue-500/5",
    border: "group-hover:border-cyan-500/40",
  },
  {
    id: "video",
    title: "P2P Video & Screen Sharing",
    description:
      "Instant pair programming video rooms over WebRTC and PeerJS with dynamic track swapping and screen casting.",
    icon: (
      <svg className="w-6 h-6 text-pink-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
      </svg>
    ),
    badge: "WebRTC",
    color: "from-pink-500/20 to-rose-500/5",
    border: "group-hover:border-pink-500/40",
  },
  {
    id: "projects",
    title: "Collaborative Project Board",
    description:
      "Post side-project concepts, list open engineering roles, and assemble high-velocity dev squads with one click.",
    icon: (
      <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
      </svg>
    ),
    badge: "Team Builder",
    color: "from-amber-500/20 to-orange-500/5",
    border: "group-hover:border-amber-500/40",
  },
  {
    id: "github",
    title: "GitHub Stats & Verified Badges",
    description:
      "Showcase top languages, commit volume, starred repositories, and verified engineering credentials effortlessly.",
    icon: (
      <svg className="w-6 h-6 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
      </svg>
    ),
    badge: "Verified Dev",
    color: "from-emerald-500/20 to-teal-500/5",
    border: "group-hover:border-emerald-500/40",
  },
  {
    id: "challenges",
    title: "Coding Challenges & Streaks",
    description:
      "Tackle algorithm problems, solve pair programming drills, and climb the developer leaderboard with your match.",
    icon: (
      <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    badge: "Competitive Drills",
    color: "from-purple-500/20 to-indigo-500/5",
    border: "group-hover:border-purple-500/40",
  },
];

const CapabilitiesGrid = () => {
  return (
    <section id="capabilities" className="py-20 md:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-xs font-bold uppercase tracking-wider text-violet-400 mb-2">
            Engineered For Collaboration
          </h2>
          <h3 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Everything you need to find, pair, and build.
          </h3>
          <p className="mt-4 text-base sm:text-lg text-slate-300">
            A complete suite of collaboration tools designed specifically for modern software engineers.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {capabilities.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`group relative rounded-2xl bg-brand-surface/80 backdrop-blur-xl border border-white/10 ${item.border} p-6 sm:p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-violet-950/40 flex flex-col justify-between`}
            >
              {/* Subtle top corner gradient */}
              <div
                className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}
              />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono font-medium text-slate-300">
                    {item.badge}
                  </span>
                </div>

                <h4 className="text-xl font-bold text-white mb-2 group-hover:text-violet-300 transition-colors">
                  {item.title}
                </h4>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="relative z-10 mt-6 pt-4 border-t border-white/5 flex items-center text-xs font-semibold text-slate-400 group-hover:text-white transition-colors">
                <span>Explore capability</span>
                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CapabilitiesGrid;
