import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSelector } from "react-redux";
import SwipeableCard from "./SwipeableCard";
import MatchModal from "./MatchModal";
import FeedFilter from "./FeedFilter";
import useFeed from "../hooks/useFeed";
import { CardSkeleton, ErrorState, EmptyState } from "./Shimmer";

const Feed = () => {
  const {
    feed,
    loading,
    error,
    filters,
    undoHistory,
    undoLoading,
    superLikesRemaining,
    boostActive,
    boostEndTime,
    getFeed,
    handleSwipe,
    handleSuperLike,
    handleBoost,
    handleUndo,
    updateFilters,
    resetFilters,
    retry,
  } = useFeed();
  const currentUser = useSelector((state) => state.user);
  const [matchedUser, setMatchedUser] = useState(null);
  const [showMatch, setShowMatch] = useState(false);
  const [boostLoading, setBoostLoading] = useState(false);
  const [superLikeError, setSuperLikeError] = useState("");

  useEffect(() => {
    getFeed();
  }, []);

  // Clear super like error after 3s
  useEffect(() => {
    if (superLikeError) {
      const t = setTimeout(() => setSuperLikeError(""), 3000);
      return () => clearTimeout(t);
    }
  }, [superLikeError]);

  const onSwipe = async (status, userId) => {
    const swipedUser = feed?.find((u) => u._id === userId);
    const result = await handleSwipe(status, userId);

    if (result.success && result.isMatch && swipedUser) {
      setMatchedUser(swipedUser);
      setShowMatch(true);
    }
  };

  const onSuperLike = async (userId) => {
    const swipedUser = feed?.find((u) => u._id === userId);
    const result = await handleSuperLike(userId);

    if (result.success && result.isMatch && swipedUser) {
      setMatchedUser(swipedUser);
      setShowMatch(true);
    } else if (!result.success) {
      setSuperLikeError(result.error);
    }
  };

  const onBoost = async () => {
    setBoostLoading(true);
    await handleBoost();
    setBoostLoading(false);
  };

  const handleCloseMatch = () => {
    setShowMatch(false);
    setMatchedUser(null);
  };

  // Format boost remaining time
  const getBoostTimeRemaining = () => {
    if (!boostEndTime) return "";
    const remaining = Math.max(0, boostEndTime - Date.now());
    const mins = Math.floor(remaining / 60000);
    return `${mins}m`;
  };

  if (loading && !feed) {
    return (
      <div className="flex flex-col items-center my-10">
        <CardSkeleton />
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={retry} />;
  }

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      {/* Filter Panel */}
      <div className="flex justify-center">
        <FeedFilter
          filters={filters}
          onFiltersChange={updateFilters}
          onReset={resetFilters}
        />
      </div>

      {/* Feed Content */}
      {!feed || feed.length <= 0 ? (
        <EmptyState
          title="No more developers in your radius"
          description="Try broadening your tech stack filters or check back shortly as new developers join."
          action={
            filters.skills?.length > 0 || filters.experienceLevel || filters.location
              ? { label: "Clear Filters", onClick: resetFilters }
              : undefined
          }
        />
      ) : (
        <div className="flex flex-col items-center my-4 min-h-[550px]">
          {/* Boost & Super Like Status Bar */}
          <div className="flex items-center gap-3 mb-4">
            {/* Boost Button */}
            <button
              onClick={onBoost}
              disabled={boostActive || boostLoading}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                boostActive
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/30"
                  : "bg-white/5 hover:bg-white/10 text-amber-300 border border-amber-500/30"
              }`}
              aria-label={boostActive ? `Boost active (${getBoostTimeRemaining()} remaining)` : "Boost your profile"}
              title="Boost your profile visibility for 30 minutes"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
              </svg>
              {boostLoading ? (
                <span className="w-3 h-3 border-2 border-amber-300/30 border-t-amber-300 rounded-full animate-spin" />
              ) : boostActive ? (
                `Boost Active (${getBoostTimeRemaining()})`
              ) : (
                "Boost Profile"
              )}
            </button>

            {/* Super Like Counter Badge */}
            <div className="px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-mono font-medium flex items-center gap-1.5">
              <span>★</span>
              <span>{superLikesRemaining} Super Like{superLikesRemaining !== 1 ? "s" : ""} left</span>
            </div>
          </div>

          {/* Super Like Error Toast */}
          <AnimatePresence>
            {superLikeError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs mb-3 max-w-sm"
              >
                {superLikeError}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Swipeable Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={feed[0]._id}
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <SwipeableCard
                user={feed[0]}
                onSwipe={onSwipe}
                onSuperLike={onSuperLike}
                superLikesRemaining={superLikesRemaining}
              />
            </motion.div>
          </AnimatePresence>

          {/* Undo Action Pill */}
          <AnimatePresence>
            {undoHistory.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-6 flex items-center gap-2 z-10"
              >
                <button
                  onClick={handleUndo}
                  disabled={undoLoading}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-amber-300 hover:text-amber-200 transition-all flex items-center gap-2 shadow-lg"
                  aria-label="Undo last swipe"
                >
                  {undoLoading ? (
                    <span className="w-3.5 h-3.5 border-2 border-amber-300/30 border-t-amber-300 rounded-full animate-spin" />
                  ) : (
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                    </svg>
                  )}
                  <span>Undo ({undoHistory[0]?.user.firstName})</span>
                </button>
                {undoHistory.length > 1 && (
                  <span className="px-2 py-1 rounded-lg bg-white/5 border border-white/5 text-[10px] font-mono text-slate-400">
                    +{undoHistory.length - 1} more
                  </span>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Match Modal */}
      <MatchModal
        show={showMatch}
        matchedUser={matchedUser}
        currentUser={currentUser}
        onClose={handleCloseMatch}
      />
    </div>
  );
};

export default Feed;
