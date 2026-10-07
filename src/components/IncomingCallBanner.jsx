import { motion } from "framer-motion";
import Avatar from "./Avatar";

/**
 * IncomingCallBanner — Floating glassmorphic notification banner for incoming WebRTC calls.
 * Displayed globally across any page when another user initiates a video call.
 */
const IncomingCallBanner = ({ incomingCall, onAccept, onDecline }) => {
  if (!incomingCall) return null;

  const { fromUser } = incomingCall;
  const callerName = fromUser?.firstName
    ? `${fromUser.firstName} ${fromUser.lastName || ""}`.trim()
    : "Developer";

  return (
    <div className="fixed top-20 right-4 sm:right-6 z-50 max-w-sm w-full pointer-events-auto">
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="p-4 rounded-2xl bg-brand-surface/95 border border-violet-500/30 shadow-2xl shadow-violet-950/60 backdrop-blur-2xl text-white"
        role="alertdialog"
        aria-label="Incoming video call"
      >
        <div className="flex items-center gap-3.5 mb-3.5">
          <div className="relative">
            <Avatar
              firstName={fromUser?.firstName}
              lastName={fromUser?.lastName}
              photoUrl={fromUser?.photoUrl}
              size="md"
            />
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-slate-900" />
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-white truncate tracking-tight">
              {callerName}
            </h4>
            <p className="text-xs font-mono text-violet-300 flex items-center gap-1.5 mt-0.5">
              <svg
                className="w-3.5 h-3.5 text-cyan-400 animate-pulse"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z"
                />
              </svg>
              Incoming Video Call...
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 pt-1">
          <button
            type="button"
            onClick={onDecline}
            className="flex-1 py-2 px-3 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
            aria-label="Decline incoming call"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            Decline
          </button>

          <button
            type="button"
            onClick={onAccept}
            className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white text-xs font-semibold shadow-md shadow-emerald-950/40 transition-all flex items-center justify-center gap-1.5"
            aria-label="Accept incoming call"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
              />
            </svg>
            Accept Call
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default IncomingCallBanner;
