import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import useConnections from "../hooks/useConnections";
import { getSocket } from "../utils/socket";
import { ListSkeleton, ErrorState, EmptyState, ListItemSkeleton } from "./Shimmer";
import Avatar from "./Avatar";

const Connections = () => {
  const { connections, loading, error, getConnections, retry } = useConnections();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [visibleCount, setVisibleCount] = useState(10); // Infinite scroll batch size
  const [loadingMore, setLoadingMore] = useState(false);
  const sentinelRef = useRef(null);
  const searchTimeoutRef = useRef(null);
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    getConnections();
  }, []);

  // Debounced search (300ms)
  const handleSearchChange = useCallback((e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedQuery(value);
      setVisibleCount(10); // Reset pagination on new search
    }, 300);
  }, []);

  // Listen for online status updates
  useEffect(() => {
    const socket = getSocket();

    socket.on("userOnline", ({ userId }) => {
      setOnlineUsers((prev) => new Set([...prev, userId]));
    });

    socket.on("userOffline", ({ userId }) => {
      setOnlineUsers((prev) => {
        const next = new Set(prev);
        next.delete(userId);
        return next;
      });
    });

    socket.on("onlineUsers", ({ users }) => {
      setOnlineUsers(new Set(users));
    });

    if (connections?.length > 0) {
      const ids = connections.map((c) => c._id);
      socket.emit("getOnlineUsers", { userIds: ids });
    }

    return () => {
      socket.off("userOnline");
      socket.off("userOffline");
      socket.off("onlineUsers");
    };
  }, [connections]);

  // Filtered and sorted connections
  const filteredConnections = useMemo(() => {
    if (!connections) return [];

    let result = [...connections];

    if (debouncedQuery.trim()) {
      const query = debouncedQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.firstName?.toLowerCase().includes(query) ||
          c.lastName?.toLowerCase().includes(query) ||
          c.skills?.some((s) => s.toLowerCase().includes(query)) ||
          c.about?.toLowerCase().includes(query)
      );
    }

    if (sortBy === "name") {
      result.sort((a, b) => (a.firstName || "").localeCompare(b.firstName || ""));
    } else if (sortBy === "recent") {
      result.sort((a, b) => {
        const aOnline = onlineUsers.has(a._id) ? 0 : 1;
        const bOnline = onlineUsers.has(b._id) ? 0 : 1;
        if (aOnline !== bOnline) return aOnline - bOnline;
        return (a.firstName || "").localeCompare(b.firstName || "");
      });
    }

    return result;
  }, [connections, debouncedQuery, sortBy, onlineUsers]);

  // Paginated slice for infinite scroll
  const visibleConnections = useMemo(
    () => filteredConnections.slice(0, visibleCount),
    [filteredConnections, visibleCount]
  );
  const hasMore = visibleCount < filteredConnections.length;

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          setLoadingMore(true);
          // Simulate slight delay for smooth UX
          setTimeout(() => {
            setVisibleCount((prev) => prev + 10);
            setLoadingMore(false);
          }, 200);
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, loadingMore, visibleCount]);

  if (loading && !connections) {
    return <ListSkeleton count={4} />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={retry} />;
  }

  if (!connections || connections.length === 0) {
    return (
      <EmptyState
        icon="🤝"
        title="No connections yet"
        description="Start swiping to connect with other developers and build projects together!"
        action={{ label: "Discover Developers", onClick: () => (window.location.href = "/") }}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-mono font-semibold mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {onlineUsers.size} Online Now
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Developer Network
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            {connections.length} mutual developer connection{connections.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Search & Sort Controls */}
        <div className="flex flex-col sm:flex-row gap-2.5 sm:items-center">
          <div className="relative flex-1 sm:w-64">
            <svg
              className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search by name, skill, tech..."
              className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
              aria-label="Search connections"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 rounded-xl bg-brand-surface border border-white/10 text-xs text-white focus:outline-none focus:border-violet-500"
            aria-label="Sort connections"
          >
            <option value="name" className="bg-brand-dark">Sort: A-Z</option>
            <option value="recent" className="bg-brand-dark">Sort: Online First</option>
          </select>
        </div>
      </div>

      {/* Results count */}
      {debouncedQuery && (
        <p className="text-xs font-mono text-cyan-400 mb-3">
          {filteredConnections.length} result{filteredConnections.length !== 1 ? "s" : ""} found for "{debouncedQuery}"
        </p>
      )}

      {/* Connection List with Infinite Scroll */}
      {filteredConnections.length === 0 ? (
        <div className="text-center py-12 rounded-2xl bg-brand-surface/40 border border-white/5 text-slate-400">
          <p className="text-sm">No connections match &ldquo;{debouncedQuery}&rdquo;</p>
        </div>
      ) : (
        <div className="space-y-3">
          {visibleConnections.map((connection) => {
            const { firstName, lastName, age, gender, photoUrl, about, skills, _id } = connection;
            const isOnline = onlineUsers.has(_id);

            return (
              <div
                className="group relative rounded-2xl bg-brand-surface/70 hover:bg-brand-surface/95 border border-white/5 hover:border-violet-500/30 p-4 transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 backdrop-blur-md shadow-lg shadow-black/20"
                key={_id}
              >
                <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                  {/* Avatar with online indicator + initials fallback */}
                  <div className="relative shrink-0">
                    <Avatar
                      firstName={firstName}
                      lastName={lastName}
                      photoUrl={photoUrl}
                      size="md"
                      isOnline={isOnline}
                    />
                  </div>

                  {/* Info */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-white truncate group-hover:text-violet-300 transition-colors">
                        {firstName} {lastName}
                      </h3>
                      {isOnline && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          online
                        </span>
                      )}
                    </div>
                    {age && gender && (
                      <p className="text-xs text-slate-400 mt-0.5">{age} • {gender}</p>
                    )}
                    {about && (
                      <p className="text-xs text-slate-400 line-clamp-1 mt-1">{about}</p>
                    )}
                    {skills?.length > 0 && (
                      <div className="flex gap-1.5 mt-2 flex-wrap">
                        {skills.slice(0, 4).map((skill) => (
                          <span
                            key={skill}
                            className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-white/5 text-slate-300 border border-white/10"
                          >
                            {skill}
                          </span>
                        ))}
                        {skills.length > 4 && (
                          <span className="px-1.5 py-0.5 rounded-md text-[10px] font-mono text-slate-400 bg-white/5">
                            +{skills.length - 4}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Chat Button */}
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <Link to={`/chat/${_id}`}>
                    <button
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-violet-600/30 transition-all flex items-center gap-2"
                      aria-label={`Chat with ${firstName}`}
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a.75.75 0 01-.84-.84c.068-.535.176-1.144.305-1.745A7.95 7.95 0 013 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                      </svg>
                      <span>Message</span>
                    </button>
                  </Link>
                </div>
              </div>
            );
          })}

          {/* Infinite scroll sentinel + loading indicator */}
          {hasMore && (
            <div ref={sentinelRef} className="py-4">
              {loadingMore && <ListItemSkeleton />}
            </div>
          )}

          {/* End of list indicator */}
          {!hasMore && filteredConnections.length > 10 && (
            <p className="text-center text-xs font-mono text-slate-500 py-6">
              — End of developer directory —
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Connections;
