import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { fetchActivityFeed, createStory, getErrorMessage } from "../services/api";
import { Spinner, ErrorState, EmptyState } from "./Shimmer";

const ActivityFeed = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newStory, setNewStory] = useState("");
  const [posting, setPosting] = useState(false);
  const user = useSelector((state) => state.user);

  useEffect(() => {
    loadStories();
  }, []);

  const loadStories = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetchActivityFeed();
      setStories(res.data?.data || res.data || []);
    } catch (err) {
      if (err.response?.status !== 401) {
        setError(getErrorMessage(err));
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePost = async (e) => {
    e.preventDefault();
    if (!newStory.trim()) return;

    setPosting(true);
    try {
      const res = await createStory(newStory.trim());
      const story = res.data?.data || res.data || {
        _id: Date.now().toString(),
        content: newStory.trim(),
        author: {
          firstName: user.firstName,
          lastName: user.lastName,
          photoUrl: user.photoUrl,
        },
        createdAt: new Date().toISOString(),
        likes: [],
      };
      setStories((prev) => [story, ...prev]);
      setNewStory("");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setPosting(false);
    }
  };

  const formatRelativeTime = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) return <Spinner text="Loading activity..." />;
  if (error) return <ErrorState message={error} onRetry={loadStories} />;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 sm:py-8">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Activity Feed
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Share what you're building today — short updates from the community
        </p>
      </div>

      {/* Create Story Form - Glass */}
      <form
        onSubmit={handlePost}
        className="rounded-2xl bg-brand-surface/80 backdrop-blur-xl border border-white/10 p-4 sm:p-5 mb-6 shadow-xl"
      >
        <div className="flex gap-3.5">
          {user?.photoUrl && (
            <div className="w-11 h-11 rounded-full overflow-hidden flex-shrink-0 border-2 border-violet-500/30">
              <img
                src={user.photoUrl}
                alt={`${user.firstName}'s photo`}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="flex-1">
            <textarea
              value={newStory}
              onChange={(e) => setNewStory(e.target.value)}
              placeholder="What are you building today? Share a quick update..."
              className="w-full px-3.5 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors resize-none"
              rows={2}
              maxLength={500}
              aria-label="Write an activity update"
            />
            <div className="flex items-center justify-between mt-2.5">
              <span className={`text-xs font-mono ${
                newStory.length >= 500 ? "text-rose-400" : "text-slate-500"
              }`}>
                {newStory.length}/500
              </span>
              <button
                type="submit"
                disabled={!newStory.trim() || posting}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:from-slate-700 disabled:to-slate-700 text-white text-sm font-semibold shadow-md shadow-violet-600/30 disabled:shadow-none transition-all flex items-center gap-2"
              >
                {posting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Posting...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                    </svg>
                    <span>Post</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Stories List */}
      {stories.length === 0 ? (
        <EmptyState
          icon="💡"
          title="No activity yet"
          description="Be the first to share what you're building!"
        />
      ) : (
        <div className="space-y-3.5">
          {stories.map((story) => (
            <article
              key={story._id || story.id}
              className="group rounded-2xl bg-brand-surface/70 hover:bg-brand-surface/95 border border-white/5 hover:border-violet-500/20 p-4.5 transition-all duration-200 backdrop-blur-md shadow-lg shadow-black/20"
            >
              <div className="flex items-start gap-3.5">
                {story.author?.photoUrl ? (
                  <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border-2 border-violet-500/30">
                    <img
                      src={story.author.photoUrl}
                      alt={`${story.author.firstName || ""}'s photo`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500/20 to-indigo-500/20 border border-violet-500/30 flex items-center justify-center shrink-0">
                    <span className="text-sm font-bold text-violet-300">
                      {(story.author?.firstName?.[0] || "") + (story.author?.lastName?.[0] || "")}
                    </span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm text-white">
                      {story.author?.firstName} {story.author?.lastName}
                    </span>
                    <span className="text-xs text-slate-500">•</span>
                    <span className="text-xs text-slate-500">
                      {formatRelativeTime(story.createdAt)}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">
                    {story.content}
                  </p>
                  {story.likes && story.likes.length > 0 && (
                    <div className="mt-3 flex items-center gap-1.5">
                      <button className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-semibold transition-all flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                        </svg>
                        <span>{story.likes.length} {story.likes.length === 1 ? "love" : "loves"}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActivityFeed;
