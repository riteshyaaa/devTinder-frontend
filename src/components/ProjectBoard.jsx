import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { fetchProjects, createProject, applyToProject, getErrorMessage } from "../services/api";
import { Spinner, ErrorState, EmptyState } from "./Shimmer";

const ProjectBoard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    techStack: "",
    lookingFor: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [applyingTo, setApplyingTo] = useState(null);
  const user = useSelector((state) => state.user);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetchProjects();
      setProjects(res.data?.data || res.data || []);
    } catch (err) {
      if (err.response?.status !== 401) {
        setError(getErrorMessage(err));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    setSubmitting(true);
    try {
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        techStack: formData.techStack
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        lookingFor: formData.lookingFor.trim(),
      };
      const res = await createProject(payload);
      const newProject = res.data?.data || res.data;
      setProjects((prev) => [newProject, ...prev]);
      setFormData({ title: "", description: "", techStack: "", lookingFor: "" });
      setShowForm(false);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleApply = async (projectId) => {
    setApplyingTo(projectId);
    try {
      await applyToProject(projectId);
      setProjects((prev) =>
        prev.map((p) =>
          p._id === projectId
            ? { ...p, applicants: [...(p.applicants || []), user._id] }
            : p
        )
      );
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setApplyingTo(null);
    }
  };

  if (loading) return <Spinner text="Loading projects..." />;
  if (error) return <ErrorState message={error} onRetry={loadProjects} />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-mono font-semibold mb-2">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
            Collaborative Projects
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Project Board
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Post project ideas and find collaborators to build together
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`px-4 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 shrink-0 ${
            showForm
              ? "bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300"
              : "bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-md shadow-indigo-600/30"
          }`}
        >
          {showForm ? (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>Cancel</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              <span>Post Project</span>
            </>
          )}
        </button>
      </div>

      {/* Create Project Form - Glass Modal */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl bg-brand-surface/80 backdrop-blur-xl border border-white/10 p-5 sm:p-6 mb-6 space-y-4 shadow-xl"
        >
          <h3 className="text-base font-bold text-white mb-1">Create New Project</h3>
          <p className="text-xs text-slate-400 mb-4">Share your idea and attract collaborators</p>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300" htmlFor="project-title">
              Project Title <span className="text-rose-400">*</span>
            </label>
            <input
              id="project-title"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Real-time Collaborative Code Editor"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300" htmlFor="project-desc">
              Description
            </label>
            <textarea
              id="project-desc"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe what you're building, the current stage, and your vision..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors resize-none"
              rows={3}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300" htmlFor="project-tech">
              Tech Stack <span className="text-xs text-slate-500">(comma separated)</span>
            </label>
            <input
              id="project-tech"
              type="text"
              value={formData.techStack}
              onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
              placeholder="React, Node.js, Socket.IO, MongoDB"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300" htmlFor="project-looking">
              Looking for
            </label>
            <input
              id="project-looking"
              type="text"
              value={formData.lookingFor}
              onChange={(e) => setFormData({ ...formData, lookingFor: e.target.value })}
              placeholder="e.g. Backend developer, UI/UX designer, DevOps engineer"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={submitting || !formData.title.trim()}
            className="w-full px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:from-slate-700 disabled:to-slate-700 text-white text-sm font-semibold shadow-md shadow-indigo-600/30 disabled:shadow-none transition-all flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Posting...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
                <span>Post Project</span>
              </>
            )}
          </button>
        </form>
      )}

      {/* Projects List */}
      {projects.length === 0 ? (
        <EmptyState
          icon="📋"
          title="No projects yet"
          description="Be the first to post a project idea and find collaborators!"
          action={{ label: "Post a Project", onClick: () => setShowForm(true) }}
        />
      ) : (
        <div className="space-y-4">
          {projects.map((project) => {
            const hasApplied = project.applicants?.some(
              (app) => (app?._id || app)?.toString() === user?._id?.toString()
            );
            const isOwner =
              (project.userId?._id || project.userId)?.toString() === user?._id?.toString() ||
              (project.owner?._id || project.owner)?.toString() === user?._id?.toString();
            return (
              <div
                key={project._id || project.id}
                className="group relative rounded-2xl bg-brand-surface/70 hover:bg-brand-surface/95 border border-white/5 hover:border-indigo-500/30 p-5 transition-all duration-200 backdrop-blur-md shadow-lg shadow-black/20"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-3 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
                        <svg className="w-5 h-5 text-indigo-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-base text-white group-hover:text-violet-300 transition-colors">
                          {project.title}
                        </h3>
                        {project.owner && (
                          <p className="text-xs text-slate-400 mt-0.5">
                            by {project.owner.firstName} {project.owner.lastName}
                          </p>
                        )}
                      </div>
                      {isOwner && (
                        <span className="px-2 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[10px] font-medium">
                          Your Project
                        </span>
                      )}
                    </div>

                    {project.description && (
                      <p className="text-sm text-slate-300 leading-relaxed mt-2">
                        {project.description}
                      </p>
                    )}

                    {project.techStack?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {project.techStack.map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-indigo-500/10 text-indigo-300 border border-indigo-500/20"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}

                    {project.lookingFor && (
                      <div className="flex items-start gap-2 mt-3 px-3 py-2 rounded-lg bg-white/5 border border-white/5">
                        <svg className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                        </svg>
                        <div className="flex-1">
                          <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-0.5">
                            Looking for
                          </p>
                          <p className="text-xs text-slate-300">{project.lookingFor}</p>
                        </div>
                      </div>
                    )}

                    {project.applicants?.length > 0 && (
                      <div className="flex items-center gap-1.5 mt-3">
                        <svg className="w-3.5 h-3.5 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 9a3 3 0 100-6 3 3 0 000 6zM6 8a2 2 0 11-4 0 2 2 0 014 0zM1.49 15.326a.78.78 0 01-.358-.442 3 3 0 014.308-3.516 6.484 6.484 0 00-1.905 3.959c-.023.222-.014.442.025.654a4.97 4.97 0 01-2.07-.655zM16.44 15.98a4.97 4.97 0 002.07-.654.78.78 0 00.357-.442 3 3 0 00-4.308-3.517 6.484 6.484 0 011.907 3.96 2.32 2.32 0 01-.026.654zM18 8a2 2 0 11-4 0 2 2 0 014 0zM5.304 16.19a.844.844 0 01-.277-.71 5 5 0 019.947 0 .843.843 0 01-.277.71A6.975 6.975 0 0110 18a6.974 6.974 0 01-4.696-1.81z" />
                        </svg>
                        <span className="text-xs text-slate-400">
                          {project.applicants.length} developer{project.applicants.length > 1 ? "s" : ""} interested
                        </span>
                      </div>
                    )}
                  </div>

                  {!isOwner && (
                    <button
                      onClick={() => handleApply(project._id)}
                      disabled={hasApplied || applyingTo === project._id}
                      className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 shrink-0 ${
                        hasApplied
                          ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 cursor-default"
                          : "bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-md shadow-indigo-600/30"
                      }`}
                    >
                      {applyingTo === project._id ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Applying...</span>
                        </>
                      ) : hasApplied ? (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                          <span>Applied</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>I'm Interested</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProjectBoard;
