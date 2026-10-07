import { useEffect, useRef, useState, useCallback } from "react";
import { getSocket } from "../utils/socket";
import { motion, AnimatePresence } from "framer-motion";

const ICE_CONFIG = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
    { urls: "stun:stun2.l.google.com:19302" },
    { urls: "stun:stun3.l.google.com:19302" },
    { urls: "stun:stun4.l.google.com:19302" },
    { urls: "stun:stun.cloudflare.com:3478" },
  ],
  iceCandidatePoolSize: 10,
};

/**
 * VideoCall — Native WebRTC peer-to-peer video/audio call with screen sharing and Socket.IO signaling.
 *
 * Props:
 * - userId: current user's ID
 * - targetId: remote user's ID
 * - targetName: display name of remote user
 * - isInitiator: boolean (true if current user clicked 'Call', false if answered)
 * - initialCallId: optional existing call ID from incoming call notification
 * - onClose: callback to end/dismiss the call UI
 */
const VideoCall = ({
  userId,
  targetId,
  targetName,
  isInitiator = true,
  initialCallId = null,
  onClose,
}) => {
  const [callState, setCallState] = useState(isInitiator ? "calling" : "answering"); // calling | answering | connecting | connected | ended | idle
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [error, setError] = useState("");

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const pcRef = useRef(null);
  const localStreamRef = useRef(null);
  const remoteStreamRef = useRef(null);
  const screenStreamRef = useRef(null);
  const timerRef = useRef(null);
  const isInitiatorRef = useRef(isInitiator);
  const isEndedRef = useRef(false);
  const onCloseRef = useRef(onClose);
  const pendingCandidatesRef = useRef([]);
  const callIdRef = useRef(initialCallId || `call_${userId}_${Date.now()}`);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    isInitiatorRef.current = isInitiator;
  }, [isInitiator]);

  if (initialCallId && callIdRef.current !== initialCallId) {
    callIdRef.current = initialCallId;
  }

  // Setup local media stream with audio and video tracks
  const getLocalMedia = useCallback(async () => {
    const role = isInitiatorRef.current ? "Caller" : "Receiver";
    const callerId = isInitiatorRef.current ? userId : targetId;
    const receiverId = isInitiatorRef.current ? targetId : userId;
    const callId = callIdRef.current;

    if (localStreamRef.current) {
      if (localVideoRef.current && localVideoRef.current.srcObject !== localStreamRef.current) {
        localVideoRef.current.srcObject = localStreamRef.current;
        localVideoRef.current
          .play()
          .catch((e) => console.warn(`[${role}] Local video play notice:`, e));
      }
      return localStreamRef.current;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      localStreamRef.current = stream;

      console.log(`[${role}] ${role.toUpperCase()}_MEDIA_READY`, {
        callId,
        callerId,
        receiverId,
        tracks: stream.getTracks().map((t) => ({
          kind: t.kind,
          id: t.id,
          enabled: t.enabled,
          readyState: t.readyState,
        })),
      });

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
        localVideoRef.current
          .play()
          .catch((e) => console.warn(`[${role}] Local video play notice:`, e));
      }
      return stream;
    } catch (err) {
      console.error(`[${role}] Media permission error:`, err);
      setError("Camera/microphone access denied. Please allow permissions in your browser.");
      throw err;
    }
  }, [userId, targetId]);

  const endCall = useCallback(
    (emitSocket = true) => {
      if (isEndedRef.current) return;
      isEndedRef.current = true;

      // Stop local media tracks
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
        localStreamRef.current = null;
      }
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach((track) => track.stop());
        screenStreamRef.current = null;
      }
      if (pcRef.current) {
        try {
          pcRef.current.close();
        } catch (e) {
          console.warn("PeerConnection close notice:", e);
        }
        pcRef.current = null;
      }

      // Signal remote user via socket
      if (emitSocket) {
        try {
          const socket = getSocket();
          socket.emit("endCall", { targetId });
        } catch (e) {
          console.warn("Socket emit endCall notice:", e);
        }
      }

      setCallState("ended");
      setCallDuration(0);
      setIsScreenSharing(false);
    },
    [targetId]
  );

  // Handle native WebRTC setup and Socket.IO signaling
  useEffect(() => {
    if (!userId || !targetId) return;
    isEndedRef.current = false;
    const socket = getSocket();
    const role = isInitiator ? "Caller" : "Receiver";
    const callerId = isInitiator ? userId : targetId;
    const receiverId = isInitiator ? targetId : userId;
    const currentCallId = callIdRef.current;

    // Helper to safely add an ICE candidate
    const addCandidateSafe = async (pc, candidate) => {
      if (!candidate) return;
      try {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      } catch {
        try {
          await pc.addIceCandidate(candidate);
        } catch (e) {
          console.warn(`[${role}] Error adding ice candidate:`, e);
        }
      }
    };

    // Helper to attach remote track/stream to DOM video element
    const handleIncomingTrack = (event) => {
      const track = event.track;
      console.log(`[${role}] ${role.toUpperCase()}_REMOTE_TRACK_RECEIVED`, {
        kind: track?.kind,
        trackId: track?.id,
        callId: callIdRef.current,
        callerId,
        receiverId,
        connectionState: pcRef.current?.connectionState,
        iceConnectionState: pcRef.current?.iceConnectionState,
      });

      if (!remoteStreamRef.current) {
        remoteStreamRef.current = new MediaStream();
      }

      if (event.streams && event.streams[0]) {
        event.streams[0].getTracks().forEach((t) => {
          if (!remoteStreamRef.current.getTracks().some((existing) => existing.id === t.id)) {
            remoteStreamRef.current.addTrack(t);
          }
        });
      } else if (track) {
        if (!remoteStreamRef.current.getTracks().some((existing) => existing.id === track.id)) {
          remoteStreamRef.current.addTrack(track);
        }
      }

      console.log(`[${role}] Remote stream synced`, {
        callId: callIdRef.current,
        callerId,
        receiverId,
        tracks: remoteStreamRef.current.getTracks().map((t) => ({
          kind: t.kind,
          id: t.id,
          enabled: t.enabled,
          readyState: t.readyState,
        })),
      });

      if (remoteVideoRef.current) {
        if (remoteVideoRef.current.srcObject !== remoteStreamRef.current) {
          remoteVideoRef.current.srcObject = remoteStreamRef.current;
        }
        remoteVideoRef.current.play().catch((err) => {
          console.warn(`[${role}] Remote video play notice:`, err);
        });
      }
      setCallState("connected");
    };

    // Helper to create or get the RTCPeerConnection instance
    const getOrCreatePeerConnection = () => {
      if (pcRef.current) return pcRef.current;

      const pc = new RTCPeerConnection(ICE_CONFIG);
      pcRef.current = pc;

      // Remote track handler
      pc.ontrack = handleIncomingTrack;

      // ICE candidate handler
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          console.log(`[${role}] ${role.toUpperCase()}_ICE_SENT`, {
            candidate: event.candidate.candidate,
            callId: callIdRef.current,
            callerId,
            receiverId,
          });
          socket.emit("webrtcIceCandidate", {
            targetId,
            candidate: event.candidate,
            callId: callIdRef.current,
          });
        }
      };

      // Connection state listeners
      pc.onconnectionstatechange = () => {
        console.log(`[${role}] connectionState: ${pc.connectionState}`, {
          callId: callIdRef.current,
          callerId,
          receiverId,
          connectionState: pc.connectionState,
          iceConnectionState: pc.iceConnectionState,
        });
        if (pc.connectionState === "connected") {
          setCallState("connected");
        } else if (pc.connectionState === "failed" || pc.connectionState === "closed") {
          if (!isEndedRef.current) {
            setCallState("ended");
          }
        }
      };

      pc.oniceconnectionstatechange = () => {
        console.log(`[${role}] iceConnectionState: ${pc.iceConnectionState}`, {
          callId: callIdRef.current,
          callerId,
          receiverId,
          iceConnectionState: pc.iceConnectionState,
        });
        if (pc.iceConnectionState === "connected" || pc.iceConnectionState === "completed") {
          setCallState("connected");
        }
      };

      return pc;
    };

    // Helper to add local tracks to PeerConnection
    const addLocalTracksToPC = (pc, stream) => {
      const senders = pc.getSenders();
      stream.getTracks().forEach((track) => {
        const alreadyAdded = senders.some((s) => s.track && s.track.id === track.id);
        if (!alreadyAdded) {
          pc.addTrack(track, stream);
          console.log(`[${role}] ${role.toUpperCase()}_TRACK_ADDED`, {
            kind: track.kind,
            trackId: track.id,
            callId: callIdRef.current,
            callerId,
            receiverId,
          });
        }
      });
    };

    // CALLER: Handler when Receiver accepts the call
    const handleCallAccepted = async ({ fromUserId, callId }) => {
      if (fromUserId !== targetId) return;
      if (callId) callIdRef.current = callId;
      setCallState("connecting");

      try {
        const stream = await getLocalMedia();
        const pc = getOrCreatePeerConnection();
        addLocalTracksToPC(pc, stream);

        const offer = await pc.createOffer({
          offerToReceiveAudio: true,
          offerToReceiveVideo: true,
        });
        await pc.setLocalDescription(offer);

        console.log(`[Caller] CALLER_OFFER_CREATED`, {
          callId: callIdRef.current,
          callerId,
          receiverId,
        });

        socket.emit("webrtcOffer", {
          targetId,
          offer,
          callId: callIdRef.current,
        });

        console.log(`[Caller] CALLER_OFFER_SENT`, {
          callId: callIdRef.current,
          callerId,
          receiverId,
        });
      } catch (err) {
        console.error("[Caller] Failed to create offer:", err);
        setError("Failed to establish video connection.");
        setCallState("idle");
      }
    };

    // RECEIVER: Handler when Caller sends the WebRTC SDP offer
    const handleWebRTCOffer = async ({ fromUserId, offer, callId }) => {
      if (fromUserId !== targetId) return;
      if (callId) callIdRef.current = callId;

      console.log(`[Receiver] RECEIVER_OFFER_RECEIVED`, {
        callId: callIdRef.current,
        callerId,
        receiverId,
      });

      try {
        setCallState("connecting");
        const stream = await getLocalMedia();
        const pc = getOrCreatePeerConnection();
        addLocalTracksToPC(pc, stream);

        await pc.setRemoteDescription(new RTCSessionDescription(offer));

        // Flush any ICE candidates that arrived before the offer
        if (pendingCandidatesRef.current.length > 0) {
          for (const cand of pendingCandidatesRef.current) {
            await addCandidateSafe(pc, cand);
            console.log(`[Receiver] RECEIVER_ICE_RECEIVED`, {
              candidate: cand?.candidate,
              callId: callIdRef.current,
              callerId,
              receiverId,
            });
          }
          pendingCandidatesRef.current = [];
        }

        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        console.log(`[Receiver] RECEIVER_ANSWER_CREATED`, {
          callId: callIdRef.current,
          callerId,
          receiverId,
        });

        socket.emit("webrtcAnswer", {
          targetId,
          answer,
          callId: callIdRef.current,
        });

        console.log(`[Receiver] RECEIVER_ANSWER_SENT`, {
          callId: callIdRef.current,
          callerId,
          receiverId,
        });
      } catch (err) {
        console.error("[Receiver] Failed to handle offer and create answer:", err);
        setError("Failed to accept video stream.");
      }
    };

    // CALLER: Handler when Receiver sends the WebRTC SDP answer
    const handleWebRTCAnswer = async ({ fromUserId, answer, callId }) => {
      if (fromUserId !== targetId) return;
      if (callId) callIdRef.current = callId;

      console.log(`[Caller] CALLER_ANSWER_RECEIVED`, {
        callId: callIdRef.current,
        callerId,
        receiverId,
      });

      try {
        const pc = pcRef.current;
        if (pc) {
          await pc.setRemoteDescription(new RTCSessionDescription(answer));

          // Flush any ICE candidates that arrived before the answer
          if (pendingCandidatesRef.current.length > 0) {
            for (const cand of pendingCandidatesRef.current) {
              await addCandidateSafe(pc, cand);
              console.log(`[Caller] CALLER_ICE_RECEIVED`, {
                candidate: cand?.candidate,
                callId: callIdRef.current,
                callerId,
                receiverId,
              });
            }
            pendingCandidatesRef.current = [];
          }
        }
      } catch (err) {
        console.error("[Caller] Failed to set remote answer description:", err);
      }
    };

    // BOTH SIDES: Handler for ICE candidate exchange
    const handleWebRTCIceCandidate = async ({ fromUserId, candidate, callId }) => {
      if (fromUserId !== targetId || !candidate) return;
      if (callId) callIdRef.current = callId;

      const pc = pcRef.current;
      if (pc && pc.remoteDescription && pc.remoteDescription.type) {
        await addCandidateSafe(pc, candidate);
        console.log(`[${role}] ${role.toUpperCase()}_ICE_RECEIVED`, {
          candidate: candidate?.candidate,
          callId: callIdRef.current,
          callerId,
          receiverId,
        });
      } else {
        pendingCandidatesRef.current.push(candidate);
      }
    };

    // BOTH SIDES: Handler when remote peer ends or cancels call
    const handleCallEnded = ({ fromUserId }) => {
      if (fromUserId === targetId) {
        endCall(false);
        onCloseRef.current?.();
      }
    };

    // Register socket event listeners
    socket.on("callAccepted", handleCallAccepted);
    socket.on("webrtcOffer", handleWebRTCOffer);
    socket.on("webrtcAnswer", handleWebRTCAnswer);
    socket.on("webrtcIceCandidate", handleWebRTCIceCandidate);
    socket.on("callEnded", handleCallEnded);

    // Initial setup based on role
    const startInitialFlow = async () => {
      try {
        await getLocalMedia();
        if (isInitiatorRef.current) {
          socket.emit("startCall", {
            targetId,
            callId: currentCallId,
          });
        } else {
          socket.emit("acceptCall", {
            targetId,
            callId: currentCallId,
          });
        }
      } catch {
        // getLocalMedia errors are already logged and set in error state
      }
    };

    startInitialFlow();

    return () => {
      // Local teardown only on unmount (don't emit endCall to peer unless explicitly triggered)
      endCall(false);
      socket.off("callAccepted", handleCallAccepted);
      socket.off("webrtcOffer", handleWebRTCOffer);
      socket.off("webrtcAnswer", handleWebRTCAnswer);
      socket.off("webrtcIceCandidate", handleWebRTCIceCandidate);
      socket.off("callEnded", handleCallEnded);
    };
  }, [userId, targetId, isInitiator, getLocalMedia, endCall]);

  // Keep local and remote video elements synced with stream refs
  useEffect(() => {
    if (
      localVideoRef.current &&
      localStreamRef.current &&
      localVideoRef.current.srcObject !== localStreamRef.current
    ) {
      localVideoRef.current.srcObject = localStreamRef.current;
      localVideoRef.current.play().catch((e) => console.warn("Local play notice:", e));
    }
    if (
      remoteVideoRef.current &&
      remoteStreamRef.current &&
      remoteVideoRef.current.srcObject !== remoteStreamRef.current
    ) {
      remoteVideoRef.current.srcObject = remoteStreamRef.current;
      remoteVideoRef.current.play().catch((e) => console.warn("Remote play notice:", e));
    }
  }, [callState]);

  // Call duration timer
  useEffect(() => {
    if (callState === "connected") {
      timerRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [callState]);

  // Manual retry / restart call
  const handleStartCall = async () => {
    setError("");
    setCallState("calling");
    try {
      await getLocalMedia();
      const socket = getSocket();
      callIdRef.current = `call_${userId}_${Date.now()}`;
      socket.emit("startCall", {
        targetId,
        callId: callIdRef.current,
      });
    } catch {
      setCallState("idle");
    }
  };

  // Toggle audio mute
  const toggleMute = () => {
    const stream = localStreamRef.current;
    if (stream) {
      stream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsMuted((prev) => !prev);
    }
  };

  // Toggle camera video
  const toggleVideo = () => {
    const stream = localStreamRef.current;
    if (stream) {
      stream.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsVideoOff((prev) => !prev);
    }
  };

  // Toggle screen sharing
  const toggleScreenShare = async () => {
    if (isScreenSharing) {
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach((track) => track.stop());
        screenStreamRef.current = null;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        if (pcRef.current) {
          const videoTrack = stream.getVideoTracks()[0];
          const sender = pcRef.current
            .getSenders()
            ?.find((s) => s.track?.kind === "video");
          if (sender) sender.replaceTrack(videoTrack);
        }
      } catch (err) {
        console.error("Error restoring camera stream:", err);
      }
      setIsScreenSharing(false);
    } else {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: false,
        });
        screenStreamRef.current = screenStream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = screenStream;
        }
        const videoTrack = screenStream.getVideoTracks()[0];
        if (pcRef.current) {
          const sender = pcRef.current
            .getSenders()
            ?.find((s) => s.track?.kind === "video");
          if (sender) sender.replaceTrack(videoTrack);
        }
        videoTrack.onended = () => toggleScreenShare();
        setIsScreenSharing(true);
      } catch {
        // User cancelled display media picker
      }
    }
  };

  const formatDuration = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex flex-col"
        style={{
          background: "radial-gradient(ellipse at bottom, #1E1B4B 0%, #0B1020 50%, #050816 100%)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        role="dialog"
        aria-modal="true"
        aria-label={`Video call with ${targetName}`}
      >
        {/* Call Header */}
        <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between">
          <div className="px-4 py-2.5 rounded-2xl bg-brand-surface/80 backdrop-blur-lg border border-white/10 shadow-xl">
            <p className="font-bold text-sm text-white">{targetName}</p>
            {callState === "connected" && (
              <div className="flex items-center gap-2 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <p className="text-xs font-mono text-emerald-300">{formatDuration(callDuration)}</p>
              </div>
            )}
            {(callState === "calling" || callState === "answering" || callState === "connecting") && (
              <div className="flex items-center gap-2 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <p className="text-xs font-mono text-amber-300 animate-pulse">
                  {callState === "calling" ? "Calling..." : "Connecting audio & video..."}
                </p>
              </div>
            )}
          </div>
          <button
            onClick={() => {
              endCall(true);
              onClose();
            }}
            className="w-10 h-10 rounded-full bg-white/5 hover:bg-rose-500/20 backdrop-blur-md border border-white/10 hover:border-rose-500/30 text-white hover:text-rose-300 transition-all flex items-center justify-center"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Video Display Area */}
        <div className="flex-1 flex items-center justify-center relative overflow-hidden">
          {/* Remote Video Stream */}
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />

          {/* Placeholder when not connected */}
          {callState !== "connected" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white gap-4 bg-black/40 backdrop-blur-sm">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-violet-500/20 to-cyan-500/20 border border-violet-500/30 flex items-center justify-center backdrop-blur-md shadow-2xl">
                <svg className="w-12 h-12 text-violet-300" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </div>
              <p className="text-lg font-bold text-white tracking-tight">{targetName}</p>
              {callState === "calling" && (
                <p className="text-sm text-amber-300 animate-pulse font-medium">Calling peer...</p>
              )}
              {(callState === "answering" || callState === "connecting") && (
                <p className="text-sm text-cyan-300 animate-pulse font-medium">Connecting audio & video...</p>
              )}
              {callState === "idle" && (
                <button
                  onClick={handleStartCall}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold shadow-lg shadow-violet-600/30 transition-all flex items-center gap-2.5 mt-4"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                  Start Video Call
                </button>
              )}
              {error && (
                <div className="max-w-sm mt-3 px-4 py-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs text-center">
                  {error}
                </div>
              )}
            </div>
          )}

          {/* Local User Video (small pip in corner) */}
          <div className="absolute bottom-24 right-4 w-36 h-28 sm:w-48 sm:h-36 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 bg-slate-900/80">
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover -scale-x-100"
            />
            {isVideoOff && (
              <div className="absolute inset-0 bg-slate-900 flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M12 18.75H4.5a2.25 2.25 0 01-2.25-2.25V9m12.841 9.091L16.5 19.5m-1.409-1.409c.407-.407.659-.97.659-1.591v-9a2.25 2.25 0 00-2.25-2.25h-9c-.621 0-1.184.252-1.591.659m12.182 12.182L2.909 5.909M1.5 4.5l1.409 1.409" />
                  </svg>
                </div>
              </div>
            )}
            {/* Status badges */}
            <div className="absolute top-2 left-2 flex gap-1">
              {isMuted && (
                <span className="px-1.5 py-0.5 rounded-md bg-rose-500/90 text-white text-[10px] font-medium backdrop-blur-sm">
                  Muted
                </span>
              )}
              {isScreenSharing && (
                <span className="px-1.5 py-0.5 rounded-md bg-cyan-500/90 text-white text-[10px] font-medium backdrop-blur-sm">
                  Sharing
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Floating Glass Control Bar */}
        {callState !== "idle" && (
          <motion.div
            className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 px-5 py-3 rounded-2xl bg-brand-surface/90 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/40"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {/* Mute Button */}
            <button
              onClick={toggleMute}
              className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${
                isMuted
                  ? "bg-rose-500/90 hover:bg-rose-400 text-white shadow-lg shadow-rose-500/30"
                  : "bg-white/10 hover:bg-white/20 text-white border border-white/10"
              }`}
              aria-label={isMuted ? "Unmute" : "Mute"}
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6v4.72c0 .47.17.923.477 1.257.308.334.717.523 1.148.523h.09c.43 0 .84-.19 1.149-.523.307-.334.476-.787.476-1.257V6.75m0 0a2.25 2.25 0 10-4.5 0m4.5 0a2.25 2.25 0 00-4.5 0m0 0v4.72c0 .47-.168.923-.476 1.257a1.678 1.678 0 01-1.149.523h-.09a1.677 1.677 0 01-1.148-.523A1.678 1.678 0 012.25 11.47V6.75" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                </svg>
              )}
            </button>

            {/* Video Toggle Button */}
            <button
              onClick={toggleVideo}
              className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${
                isVideoOff
                  ? "bg-rose-500/90 hover:bg-rose-400 text-white shadow-lg shadow-rose-500/30"
                  : "bg-white/10 hover:bg-white/20 text-white border border-white/10"
              }`}
              aria-label={isVideoOff ? "Turn on camera" : "Turn off camera"}
              title={isVideoOff ? "Turn on camera" : "Turn off camera"}
            >
              {isVideoOff ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M12 18.75H4.5a2.25 2.25 0 01-2.25-2.25V9m12.841 9.091L16.5 19.5m-1.409-1.409c.407-.407.659-.97.659-1.591v-9a2.25 2.25 0 00-2.25-2.25h-9c-.621 0-1.184.252-1.591.659m12.182 12.182L2.909 5.909M1.5 4.5l1.409 1.409" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                </svg>
              )}
            </button>

            {/* Screen Share Button */}
            <button
              onClick={toggleScreenShare}
              className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${
                isScreenSharing
                  ? "bg-cyan-500/90 hover:bg-cyan-400 text-white shadow-lg shadow-cyan-500/30"
                  : "bg-white/10 hover:bg-white/20 text-white border border-white/10"
              }`}
              aria-label={isScreenSharing ? "Stop sharing" : "Share screen"}
              title={isScreenSharing ? "Stop sharing" : "Share screen"}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
              </svg>
            </button>

            {/* Divider */}
            <div className="w-px h-8 bg-white/10" />

            {/* End Call Button */}
            <button
              onClick={() => {
                endCall(true);
                onClose();
              }}
              className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white shadow-lg shadow-rose-600/40 transition-all flex items-center justify-center"
              aria-label="End call"
              title="End call"
            >
              <svg className="w-6 h-6 rotate-[135deg]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
            </button>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default VideoCall;
