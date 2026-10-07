import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { getSocket } from "../utils/socket";
import {
  addNotification,
  incrementUnreadMessages,
  resetUnreadMessages,
} from "../utils/notificationSlice";

/**
 * useNotifications — connects to Socket.IO and listens for real-time events.
 * Dispatches notifications to Redux store and manages toast display queue + global incoming video calls.
 *
 * Socket events handled:
 * - newMatch: Mutual interest detected
 * - newRequest: Connection request received
 * - newMessageNotification: Chat message when user is NOT in that chat
 * - someoneInterested: Someone swiped right on you
 * - systemNotification: Platform announcements
 * - incomingCall: Peer-to-peer video call request
 * - callEnded: Video call terminated by remote peer
 *
 * Returns: { toasts, dismissToast, incomingCall, setIncomingCall, dismissIncomingCall }
 */
const useNotifications = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const location = useLocation();
  const [toasts, setToasts] = useState([]);
  const [incomingCall, setIncomingCall] = useState(null);

  // Track which chat is currently open to suppress redundant notifications
  const currentChatId = location.pathname.startsWith("/chat/")
    ? location.pathname.split("/chat/")[1]
    : null;

  const showToast = useCallback((toast) => {
    const id = Date.now().toString() + Math.random().toString(36).slice(2);
    const newToast = { ...toast, id };
    setToasts((prev) => [...prev.slice(-4), newToast]); // Max 5 toasts visible

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const dismissIncomingCall = useCallback(() => {
    setIncomingCall(null);
  }, []);

  useEffect(() => {
    if (!user?._id) return;

    const socket = getSocket();

    // Register user for notifications
    socket.emit("registerUser");

    // --- NEW MATCH ---
    const handleMatch = ({ matchedUser }) => {
      dispatch(
        addNotification({
          type: "match",
          title: "It's a Match! 🎉",
          message: `You and ${matchedUser?.firstName || "someone"} liked each other!`,
          fromUser: matchedUser || null,
        })
      );
      showToast({
        type: "match",
        title: "It's a Match! 🎉",
        message: `You and ${matchedUser?.firstName} liked each other!`,
        photo: matchedUser?.photoUrl,
      });
    };

    // --- NEW CONNECTION REQUEST ---
    const handleRequest = ({ fromUser }) => {
      dispatch(
        addNotification({
          type: "request",
          title: "New Connection Request",
          message: `${fromUser?.firstName || "Someone"} wants to connect with you`,
          fromUser: fromUser || null,
        })
      );
      showToast({
        type: "request",
        title: "New Request",
        message: `${fromUser?.firstName} wants to connect`,
        photo: fromUser?.photoUrl,
      });
    };

    // --- NEW MESSAGE (only if not in that chat) ---
    const handleMessage = ({ fromUser, text }) => {
      if (currentChatId !== fromUser?._id) {
        dispatch(incrementUnreadMessages());
        dispatch(
          addNotification({
            type: "message",
            title: `Message from ${fromUser?.firstName || "Someone"}`,
            message: text?.slice(0, 60) || "New message",
            fromUser: fromUser || null,
          })
        );
        showToast({
          type: "message",
          title: fromUser?.firstName || "New Message",
          message: text?.slice(0, 50) || "Sent you a message",
          photo: fromUser?.photoUrl,
        });
      }
    };

    // --- SOMEONE INTERESTED ---
    const handleInterest = ({ fromUser }) => {
      dispatch(
        addNotification({
          type: "interest",
          title: "Someone's Interested! 👀",
          message: `${fromUser?.firstName || "A developer"} is interested in you`,
          fromUser: fromUser || null,
        })
      );
      showToast({
        type: "interest",
        title: "Someone likes you!",
        message: `${fromUser?.firstName || "A developer"} is interested`,
        photo: fromUser?.photoUrl,
      });
    };

    // --- SYSTEM ---
    const handleSystem = ({ title, message }) => {
      dispatch(
        addNotification({
          type: "system",
          title: title || "DevTinder",
          message: message || "",
          fromUser: null,
        })
      );
      showToast({ type: "system", title, message });
    };

    // --- INCOMING CALL ---
    const handleIncomingCall = (callData) => {
      if (callData?.fromUserId) {
        setIncomingCall(callData);
      }
    };

    // --- CALL ENDED / CANCELLED ---
    const handleCallEnded = ({ fromUserId }) => {
      setIncomingCall((prev) => (prev?.fromUserId === fromUserId ? null : prev));
    };

    socket.on("newMatch", handleMatch);
    socket.on("newRequest", handleRequest);
    socket.on("newMessageNotification", handleMessage);
    socket.on("someoneInterested", handleInterest);
    socket.on("systemNotification", handleSystem);
    socket.on("incomingCall", handleIncomingCall);
    socket.on("callEnded", handleCallEnded);

    return () => {
      socket.off("newMatch", handleMatch);
      socket.off("newRequest", handleRequest);
      socket.off("newMessageNotification", handleMessage);
      socket.off("someoneInterested", handleInterest);
      socket.off("systemNotification", handleSystem);
      socket.off("incomingCall", handleIncomingCall);
      socket.off("callEnded", handleCallEnded);
    };
  }, [user?._id, currentChatId, dispatch, showToast]);

  // Reset unread messages when entering a chat
  useEffect(() => {
    if (currentChatId) {
      dispatch(resetUnreadMessages());
    }
  }, [currentChatId, dispatch]);

  return { toasts, dismissToast, incomingCall, setIncomingCall, dismissIncomingCall };
};

export default useNotifications;
