import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "./Footer";
import NavBar from "./NavBar";
import ToastNotifications from "./ToastNotifications";
import IncomingCallBanner from "./IncomingCallBanner";
import VideoCall from "./VideoCall";
import useAuth from "../hooks/useAuth";
import useNotifications from "../hooks/useNotifications";
import { getSocket } from "../utils/socket";

/**
 * Body — Main app layout with animated page transitions and global notification/call layer.
 */
const Body = () => {
  const { user } = useAuth();
  const { toasts, dismissToast, incomingCall, dismissIncomingCall } =
    useNotifications();
  const [activeVideoCall, setActiveVideoCall] = useState(null);
  const location = useLocation();

  const handleAcceptIncomingCall = () => {
    if (!incomingCall) return;
    const { fromUserId, fromUser, callId } = incomingCall;
    const targetName = fromUser?.firstName
      ? `${fromUser.firstName} ${fromUser.lastName || ""}`.trim()
      : "Developer";

    setActiveVideoCall({
      targetId: fromUserId,
      targetName,
      isInitiator: false,
      callId,
    });
    dismissIncomingCall();
  };

  const handleDeclineIncomingCall = () => {
    if (!incomingCall) return;
    try {
      const socket = getSocket();
      socket.emit("endCall", { targetId: incomingCall.fromUserId });
    } catch (err) {
      console.warn("Decline call error:", err);
    }
    dismissIncomingCall();
  };

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-1 pb-8">
        {/* Animated Page Transitions */}
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />

      {/* Global Real-time Toast Notifications */}
      <ToastNotifications toasts={toasts} onDismiss={dismissToast} />

      {/* Global Incoming Video Call Banner */}
      <IncomingCallBanner
        incomingCall={incomingCall}
        onAccept={handleAcceptIncomingCall}
        onDecline={handleDeclineIncomingCall}
      />

      {/* Global Active Video Call Modal */}
      {activeVideoCall && user?._id && (
        <VideoCall
          userId={user._id}
          targetId={activeVideoCall.targetId}
          targetName={activeVideoCall.targetName}
          isInitiator={activeVideoCall.isInitiator}
          initialCallId={activeVideoCall.callId}
          onClose={() => setActiveVideoCall(null)}
        />
      )}
    </div>
  );
};

export default Body;
