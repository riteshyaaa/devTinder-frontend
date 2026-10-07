import { motion } from "framer-motion";

const sampleProjects = [
  {
    id: "p1",
    title: "OpenTelemetry Distributed Tracing Agent",
    category: "DevOps & Cloud Native",
    description: "Building an ultra-lightweight eBPF based observability kernel collector in C and Go with a React dashboard.",
    roles: ["eBPF / Kernel Developer", "Frontend React Specialist"],
    stack: ["Go", "C", "eBPF", "React", "GraphQL", "TailwindCSS"],
    applicants: 6,
    openPositions: 2,
    lead: {
      name: "Taras V.",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
    },
  },
  {
    id: "p2",
    title: "Vector Neural Search Engine for Codebases",
    category: "AI & Developer Tools",
    description: "Semantic AST parsing and embedding vector search for multi-language monolithic code repositories.",
    roles: ["Python LLM Engineer", "TypeScript SDK Lead"],
    stack: ["Python", "FastAPI", "Qdrant", "Rust", "Tree-sitter"],
    applicants: 12,
    openPositions: 1,
    lead: {
      name: "Amina K.",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150",
    },
  },
];

const ProjectShowcase = () => {
  return (
    <div className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-white/5">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left: Info */}
        <div className="lg:col-span-5 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-mono font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            Collaborative Projects
          </div>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Assemble dream squads for your next big build.
          </h3>
          <p className="text-slate-300 text-base leading-relaxed">
            Have a startup concept or open-source idea? Post it on the DevTinder Project Board. Define the open engineering positions you need, review developer applications, and kick off development.
          </p>

          <div className="space-y-3 pt-2">
            {[
              "Granular project listings with tech stack tags and role openings",
              "One-click application workflow with developer profile attachments",
              "Organized project workspaces with member management",
            ].map((feature, i) => (
              <div key={i} className="flex items-start gap-3 text-sm text-slate-300">
                <div className="w-5 h-5 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                  ✓
                </div>
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Project Cards Grid */}
        <div className="lg:col-span-7 space-y-4">
          {sampleProjects.map((project) => (
            <div
              key={project.id}
              className="rounded-2xl bg-brand-surface border border-white/10 p-6 hover:border-amber-500/40 transition-all duration-300 shadow-xl shadow-amber-950/20"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-mono font-semibold">
                  {project.category}
                </span>
                <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  {project.openPositions} open {project.openPositions > 1 ? "roles" : "role"}
                </span>
              </div>

              <h4 className="text-lg font-bold text-white mb-2">{project.title}</h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                {project.description}
              </p>

              {/* Roles required */}
              <div className="mb-4">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Looking For:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {project.roles.map((role) => (
                    <span
                      key={role}
                      className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-xs font-medium text-slate-200"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </div>

              {/* Tech Stack */}
              <div className="flex flex-wrap gap-1.5 mb-5">
                {project.stack.map((t) => (
                  <span
                    key={t}
                    className="px-2 py-0.5 rounded bg-violet-500/10 text-violet-300 text-[11px] font-mono"
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* Footer row */}
              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img
                    src={project.lead.avatar}
                    alt={project.lead.name}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <span className="text-xs text-slate-400">Led by {project.lead.name}</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400 font-mono">
                    {project.applicants} applicants
                  </span>
                  <button className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-semibold border border-amber-500/40 transition-colors">
                    Apply to Join
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectShowcase;
