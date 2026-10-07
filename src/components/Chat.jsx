import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { getSocket } from "../utils/socket";
import { fetchChatHistory, getErrorMessage } from "../services/api";
import { Spinner } from "./Shimmer";
import CodeBlock from "./CodeBlock";
import VideoCall from "./VideoCall";
import IceBreakers from "./IceBreakers";
import Avatar from "./Avatar";

const EMOJI_OPTIONS = ["👍", "❤️", "😂", "🎉", "🔥", "👀", "💯", "🚀"];

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState("");
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [targetUser, setTargetUser] = useState(null);
  const [isOnline, setIsOnline] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(null); // message index or null
  const [imagePreview, setImagePreview] = useState(null);
  const socketRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const fileInputRef = useRef(null);

  const [showVideoCall, setShowVideoCall] = useState(false);

  const { targetId } = useParams();
  const user = useSelector((state) => state.user);
  const userId = user?._id;

  // Auto-scroll ONLY the chat messages container to the bottom (without jumping the page viewport)
  const scrollToBottom = useCallback(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Load chat history from backend
  useEffect(() => {
    const loadHistory = async () => {
      setLoadingHistory(true);
      try {
        const res = await fetchChatHistory(targetId);
        const history = res.data?.messages || res.data?.data?.messages || res.data || [];
        const formatted = Array.isArray(history)
          ? history.map((msg) => ({
              id: msg._id || msg.id || `${Date.now()}-${Math.random()}`,
              firstName: msg.senderId?.firstName || msg.firstName || "",
              lastName: msg.senderId?.lastName || msg.lastName || "",
              text: msg.text || msg.message || "",
              time: msg.createdAt ? new Date(msg.createdAt) : new Date(msg.time || Date.now()),
              read: msg.read || false,
              senderId: msg.senderId?._id || msg.senderId || msg.userId || "",
              reactions: msg.reactions || {},
              imageUrl: msg.imageUrl || null,
              fileUrl: msg.fileUrl || null,
              fileName: msg.fileName || null,
            }))
          : [];
        setMessages(formatted);

        if (res.data?.targetUser) {
          setTargetUser(res.data.targetUser);
        }
      } catch (err) {
        console.warn("Chat history not available:", getErrorMessage(err));
      } finally {
        setLoadingHistory(false);
      }
    };

    if (targetId) loadHistory();
  }, [targetId]);

  // Socket connection & event handlers
  useEffect(() => {
    if (!userId) return;
    const socket = getSocket();
    socketRef.current = socket;

    socket.emit("joinChat", { targetId });

    // New messages
    socket.on("messageReceived", ({ messageId, firstName, lastName, text, senderId, time, imageUrl, fileUrl, fileName }) => {
      const msgId = messageId || String(Date.now()) + "-" + Math.random().toString(36).slice(2);
      setMessages((prev) => [
        ...prev,
        {
          id: msgId,
          firstName,
          lastName,
          text: text || "",
          time: time ? new Date(time) : new Date(),
          read: true,
          senderId: senderId || "",
          reactions: {},
          imageUrl: imageUrl || null,
          fileUrl: fileUrl || null,
          fileName: fileName || null,
        },
      ]);
      socket.emit("messageRead", { targetId });
    });

    // Typing
    socket.on("userTyping", ({ firstName: typingName }) => {
      setIsTyping(true);
      setTypingUser(typingName);
    });
    socket.on("userStoppedTyping", () => {
      setIsTyping(false);
      setTypingUser("");
    });

    // Online status
    socket.on("userOnline", ({ userId: uid }) => {
      if (uid === targetId) setIsOnline(true);
    });
    socket.on("userOffline", ({ userId: uid }) => {
      if (uid === targetId) setIsOnline(false);
    });
    socket.emit("checkOnline", { targetId });
    socket.on("onlineStatus", ({ userId: uid, online }) => {
      if (uid === targetId) setIsOnline(online);
    });

    // Read receipts
    socket.on("messagesRead", ({ readBy }) => {
      if (readBy === targetId) {
        setMessages((prev) =>
          prev.map((msg) => (msg.senderId === userId ? { ...msg, read: true } : msg))
        );
      }
    });

    // Emoji reactions from other user
    socket.on("reactionReceived", ({ messageId, reactions }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId ? { ...msg, reactions: reactions || {} } : msg
        )
      );
    });

    return () => {
      socket.off("messageReceived");
      socket.off("userTyping");
      socket.off("userStoppedTyping");
      socket.off("userOnline");
      socket.off("userOffline");
      socket.off("onlineStatus");
      socket.off("messagesRead");
      socket.off("reactionReceived");
      socket.emit("leaveChat", { targetId });
    };
  }, [userId, targetId]);

  // Typing emission
  const handleTyping = useCallback(() => {
    const socket = socketRef.current;
    if (!socket) return;
    socket.emit("typing", { targetId });
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stopTyping", { targetId });
    }, 2000);
  }, [targetId]);

  // Send message
  const sendMessage = () => {
    if (!newMessage.trim() && !imagePreview) return;
    const socket = socketRef.current;
    if (!socket) return;

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    socket.emit("stopTyping", { targetId });

    socket.emit("sendMessage", {
      firstName: user?.firstName,
      lastName: user?.lastName,
      targetId,
      text: newMessage,
      imageUrl: imagePreview || null,
    });
    setNewMessage("");
    setImagePreview(null);
  };

  // Emoji reaction
  const handleReaction = (messageIndex, emoji) => {
    const msg = messages[messageIndex];
    if (!msg) return;
    const socket = socketRef.current;
    if (socket) {
      socket.emit("addReaction", {
        messageId: msg.id,
        emoji,
        targetId,
      });
    }
    // Optimistic update
    setMessages((prev) =>
      prev.map((m, i) => {
        if (i === messageIndex) {
          const reactions = { ...m.reactions };
          const existing = reactions[emoji] || [];
          if (existing.includes(userId)) {
            reactions[emoji] = existing.filter((id) => id !== userId);
            if (reactions[emoji].length === 0) delete reactions[emoji];
          } else {
            reactions[emoji] = [...existing, userId];
          }
          return { ...m, reactions };
        }
        return m;
      })
    );
    setShowEmojiPicker(null);
  };

  // Image/file handling
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // For images, create a preview
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImagePreview(ev.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      // For non-image files, send filename
      const socket = socketRef.current;
      if (socket) {
        socket.emit("sendMessage", {
          firstName: user?.firstName,
          lastName: user?.lastName,
          targetId,
          text: `📎 Shared file: ${file.name}`,
          fileName: file.name,
        });
      }
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
    handleTyping();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const isCodeSnippet = (text) => {
    return text.startsWith("```") || (text.includes("\n") && text.match(/^\s{2,}/m));
  };

  const parseCodeBlock = (text) => {
    if (text.startsWith("```")) {
      const lines = text.split("\n");
      const lang = lines[0].replace("```", "").trim() || "javascript";
      const code = lines.slice(1, lines.length - 1).join("\n").replace(/```$/, "");
      return { lang, code };
    }
    return { lang: "text", code: text };
  };

  if (loadingHistory) {
    return <Spinner text="Loading conversation..." />;
  }

  return (
    <section
      className="w-full max-w-4xl mx-auto my-6 h-[75vh] flex flex-col rounded-3xl bg-brand-surface/90 border border-white/10 shadow-2xl shadow-violet-950/40 backdrop-blur-2xl overflow-hidden"
      aria-label="Chat conversation"
    >
      {/* Chat Header */}
      <header className="p-4 border-b border-white/10 bg-white/5 flex items-center justify-between backdrop-blur-md">
        <div className="flex items-center gap-3.5">
          <Link
            to="/connections"
            className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
            aria-label="Back to connections"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </Link>
          <div className="flex items-center gap-3">
            {targetUser && (
              <Avatar
                firstName={targetUser.firstName}
                lastName={targetUser.lastName}
                photoUrl={targetUser.photoUrl}
                size="sm"
                isOnline={isOnline}
              />
            )}
            <div>
              <h1 className="text-sm sm:text-base font-bold text-white tracking-tight">
                {targetUser ? `${targetUser.firstName} ${targetUser.lastName}` : "Developer Chat"}
              </h1>
              <div className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? "bg-emerald-400 animate-pulse" : "bg-slate-500"}`} aria-hidden="true" />
                <span className="text-[11px] font-mono text-slate-400">{isOnline ? "Online Now" : "Offline"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowVideoCall(true)}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white text-xs font-semibold shadow-md shadow-violet-600/30 transition-all flex items-center gap-1.5"
            aria-label="Start video call"
            title="Start peer-to-peer video call"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
            </svg>
            <span className="hidden sm:inline">Call</span>
          </button>
        </div>
      </header>

      {/* Messages Area */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4"
        role="log"
        aria-label="Message history"
        aria-live="polite"
      >
        {messages.length === 0 && (
          <div className="mt-6 space-y-4 max-w-md mx-auto">
            <p className="text-center text-xs font-mono text-slate-400">No messages yet. Send a greeting or pick an icebreaker below!</p>
            {/* AI Ice Breakers */}
            <IceBreakers
              currentUser={user}
              matchedUser={targetUser}
              onSelect={(text) => setNewMessage(text)}
            />
          </div>
        )}

        {messages.map((msg, index) => {
          const isOwn = msg.senderId === userId || user?.firstName === msg.firstName;
          const hasReactions = msg.reactions && Object.keys(msg.reactions).length > 0;

          return (
            <div key={msg.id || index} className={`flex flex-col ${isOwn ? "items-end" : "items-start"} group relative`}>
              <div className="flex items-center gap-2 mb-1 px-1">
                <span className="text-[11px] font-semibold text-slate-400">
                  {msg.firstName}
                </span>
                {msg.time && (
                  <time className="text-[10px] font-mono text-slate-500">
                    {formatTime(msg.time)}
                  </time>
                )}
              </div>

              <div className="relative max-w-[85%] sm:max-w-md">
                <div
                  className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    isOwn
                      ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-tr-sm shadow-lg shadow-violet-900/30"
                      : "bg-white/10 border border-white/10 text-slate-100 rounded-tl-sm shadow-md"
                  }`}
                >
                  {/* Image */}
                  {msg.imageUrl && (
                    <div className="mb-2">
                      <img
                        src={msg.imageUrl}
                        alt="Shared media"
                        className="max-w-[240px] max-h-[200px] rounded-xl object-cover cursor-pointer border border-white/10"
                        onClick={() => window.open(msg.imageUrl, "_blank")}
                      />
                    </div>
                  )}

                  {/* Text content */}
                  {msg.text && (
                    isCodeSnippet(msg.text) ? (
                      <CodeBlock {...parseCodeBlock(msg.text)} />
                    ) : (
                      <span className="whitespace-pre-wrap break-words">{msg.text}</span>
                    )
                  )}
                </div>

                {/* Reaction trigger button */}
                <button
                  className="absolute -bottom-2.5 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full bg-slate-900 border border-white/10 text-xs hover:scale-110 shadow-md"
                  onClick={() => setShowEmojiPicker(showEmojiPicker === index ? null : index)}
                  aria-label="Add reaction"
                  type="button"
                >
                  😊
                </button>
              </div>

              {/* Reaction display */}
              {hasReactions && (
                <div className="flex gap-1 mt-1.5 flex-wrap">
                  {Object.entries(msg.reactions).map(([emoji, users]) => (
                    <button
                      key={emoji}
                      className={`px-2 py-0.5 rounded-full text-[11px] font-mono flex items-center gap-1 border transition-colors ${
                        users.includes(userId)
                          ? "bg-violet-600/30 text-violet-300 border-violet-500/40"
                          : "bg-white/5 text-slate-300 border-white/10"
                      }`}
                      onClick={() => handleReaction(index, emoji)}
                      aria-label={`${emoji} reaction (${users.length})`}
                      type="button"
                    >
                      <span>{emoji}</span>
                      {users.length > 1 && <span>{users.length}</span>}
                    </button>
                  ))}
                </div>
              )}

              {/* Emoji picker dropdown */}
              {showEmojiPicker === index && (
                <div className="flex gap-1.5 mt-2 bg-brand-surface border border-white/15 rounded-2xl p-1.5 shadow-2xl z-20">
                  {EMOJI_OPTIONS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      className="p-1 rounded-lg hover:bg-white/10 text-sm transition-transform hover:scale-125"
                      onClick={() => handleReaction(index, emoji)}
                      aria-label={`React with ${emoji}`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}

              {/* Read receipt for sender */}
              {isOwn && (
                <div className="text-[10px] font-mono text-slate-500 mt-1 px-1">
                  {msg.read ? "✓✓ Read" : "✓ Sent"}
                </div>
              )}
            </div>
          );
        })}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex items-center gap-2 p-2 rounded-xl bg-white/5 border border-white/5 w-fit">
            <span className="text-xs font-mono text-slate-400">{typingUser || "Peer"} is typing</span>
            <span className="flex gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce [animation-delay:0.4s]" />
            </span>
          </div>
        )}
      </div>

      {/* Image Preview (when selected) */}
      {imagePreview && (
        <div className="px-4 py-2 border-t border-white/10 bg-white/5 flex items-center gap-3">
          <div className="relative">
            <img src={imagePreview} alt="Preview" className="h-14 w-14 object-cover rounded-xl border border-white/10" />
            <button
              type="button"
              onClick={() => setImagePreview(null)}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs hover:bg-rose-500"
              aria-label="Remove image"
            >
              ✕
            </button>
          </div>
          <span className="text-xs text-slate-300">Media ready to send</span>
        </div>
      )}

      {/* Input Area */}
      <form
        className="p-3 sm:p-4 border-t border-white/10 bg-white/5 flex items-center gap-2 backdrop-blur-md"
        onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
      >
        {/* File/Image upload button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white flex items-center justify-center transition-colors shrink-0"
          aria-label="Attach file or image"
          title="Attach image or file"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
          </svg>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.pdf,.doc,.docx,.txt,.js,.ts,.py,.md"
          className="hidden"
          onChange={handleFileSelect}
        />

        <label htmlFor="chat-input" className="sr-only">Type your message</label>
        <input
          id="chat-input"
          value={newMessage}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          type="text"
          placeholder="Type message or paste code (``` for syntax)..."
          className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
          aria-label="Message input"
          autoComplete="off"
        />
        <button
          type="submit"
          className="px-4 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-violet-600/30 transition-all disabled:opacity-40 shrink-0 flex items-center gap-1.5"
          disabled={!newMessage.trim() && !imagePreview}
          aria-label="Send message"
        >
          <span>Send</span>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
          </svg>
        </button>
      </form>

      {/* Video Call Modal */}
      {showVideoCall && (
        <VideoCall
          userId={userId}
          targetId={targetId}
          targetName={targetUser ? `${targetUser.firstName} ${targetUser.lastName}` : "User"}
          isInitiator={true}
          onClose={() => setShowVideoCall(false)}
        />
      )}
    </section>
  );
};

export default Chat;
