import { motion } from "framer-motion";

const steps = [
  {
    step: "01",
    tag: "Profile Creation",
    title: "Build Your Developer DNA",
    description:
      "Craft your engineering identity. Showcase your core tech stack, GitHub repositories, experience level, and preferred collaboration mode.",
    badge: "1 Minute Setup",
    highlight: "Smart Tech Tags",
  },
  {
    step: "02",
    tag: "Matchmaking Engine",
    title: "Discover Complementary Peers",
    description:
      "Our matching algorithm pairs you with developers possessing complementary skills — pair frontend specialists with backend architects or finding seasoned mentors.",
    badge: "AI Compatibility",
    highlight: "Filter by Stack & Timezone",
  },
  {
    step: "03",
    tag: "Real-time Workspace",
    title: "Pair Program & Ship Projects",
    description:
      "Collaborate instantly in Socket.IO chat rooms with syntax highlighting or start low-latency WebRTC video sessions with native screen sharing.",
    badge: "Zero Latency",
    highlight: "Live Code Highlighting",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-20 md:py-28 relative bg-brand-surface/40 border-y border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2">
            Seamless Workflow
          </h2>
          <h3 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            How DevTinder powers developer connection
          </h3>
          <p className="mt-4 text-base sm:text-lg text-slate-300">
            From discovering like-minded engineers to shipping code together in three intuitive steps.
          </p>
        </div>

        {/* Steps Grid with Line Connectors */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((item, index) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="relative rounded-2xl bg-brand-card/90 border border-white/10 p-8 flex flex-col justify-between overflow-hidden group hover:border-violet-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-violet-950/30"
            >
              {/* Step indicator watermark */}
              <span className="absolute -top-4 -right-4 text-7xl font-mono font-black text-white/5 pointer-events-none group-hover:text-violet-500/10 transition-colors">
                {item.step}
              </span>

              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 text-white font-mono font-bold flex items-center justify-center text-sm shadow-md">
                    {item.step}
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-mono font-medium">
                    {item.badge}
                  </span>
                </div>

                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {item.tag}
                </span>
                <h4 className="text-xl font-bold text-white mt-1 mb-3">
                  {item.title}
                </h4>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-white/5 flex items-center gap-2 text-xs font-mono text-cyan-300">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <span>{item.highlight}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
