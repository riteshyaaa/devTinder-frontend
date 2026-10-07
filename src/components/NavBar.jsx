import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { logoutUser, fetchReceivedRequests } from "../services/api";
import { removeUser } from "../utils/userSlice";
import { setUnauthenticated } from "../utils/authSlice";
import { markAllAsRead } from "../utils/notificationSlice";
import Logo from "./ui/Logo";

const NavBar = () => {
  const user = useSelector((store) => store.user);
  const requests = useSelector((store) => store.requests);
  const { unreadCount, unreadMessages, items: notifications } = useSelector(
    (store) => store.notifications
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [requestCount, setRequestCount] = useState(0);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Scroll detection for floating glass navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch request count for badge
  useEffect(() => {
    if (!user) return;
    const getCount = async () => {
      try {
        const res = await fetchReceivedRequests();
        const data = res.data?.data || res.data || [];
        setRequestCount(Array.isArray(data) ? data.length : 0);
      } catch {
        // Silently fail
      }
    };
    getCount();
  }, [user]);

  // Sync with Redux store when requests change
  useEffect(() => {
    if (requests) {
      setRequestCount(Array.isArray(requests) ? requests.length : 0);
    }
  }, [requests]);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setShowNotifDropdown(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch {
      // Logout even if request fails
    }
    dispatch(removeUser());
    dispatch(setUnauthenticated());
    navigate("/login");
  };

  const handleMarkAllRead = () => {
    dispatch(markAllAsRead());
  };

  const totalBadge = unreadCount + unreadMessages;

  const renderNotifIcon = (type) => {
    switch (type) {
      case "match":
        return (
          <div className="w-8 h-8 rounded-full bg-pink-500/10 text-pink-500 flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>
        );
      case "request":
        return (
          <div className="w-8 h-8 rounded-full bg-violet-500/10 text-violet-400 flex items-center justify-center flex-shrink-0">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
          </div>
        );
      case "message":
        return (
          <div className="w-8 h-8 rounded-full bg-cyan-500/10 text-cyan-400 flex items-center justify-center flex-shrink-0">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center flex-shrink-0">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </div>
        );
    }
  };

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m`;
    const diffHours = Math.floor(diffMs / 3600000);
    if (diffHours < 24) return `${diffHours}h`;
    return `${Math.floor(diffMs / 86400000)}d`;
  };

  const navLinks = user
    ? [
        { to: "/feed", label: "Discover", badge: null },
        {
          to: "/connections",
          label: "Connections",
          badge: unreadMessages > 0 ? unreadMessages : null,
          badgeType: "badge-primary",
        },
        {
          to: "/requests",
          label: "Requests",
          badge: requestCount > 0 ? requestCount : null,
          badgeType: "badge-secondary",
        },
        { to: "/projects", label: "Projects", badge: null },
        {
          to: "/challenges",
          label: "Challenges",
          badge: "New",
          badgeType: "badge-accent",
        },
        { to: "/activity", label: "Activity", badge: null },
      ]
    : [];

  return (
    <>
      <nav
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? "bg-base-100/80 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/20"
            : "bg-base-100/60 backdrop-blur-md border-b border-white/5"
        }`}
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand Logo */}
            <div className="flex items-center gap-6">
              <Link
                to={user ? "/feed" : "/"}
                className="group flex items-center transition-transform active:scale-95"
                aria-label="DevTinder — Go to home"
              >
                <Logo size="md" />
              </Link>

              {/* Desktop Nav Links (Authenticated) */}
              {user && (
                <div className="hidden lg:flex items-center gap-1">
                  {navLinks.map((link) => {
                    const isActive = location.pathname === link.to;
                    return (
                      <Link
                        key={link.to}
                        to={link.to}
                        className={`relative px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
                          isActive
                            ? "text-white bg-white/10 shadow-sm"
                            : "text-slate-300 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        {link.label}
                        {link.badge && (
                          <span
                            className={`badge ${
                              link.badgeType || "badge-primary"
                            } badge-xs`}
                          >
                            {link.badge}
                          </span>
                        )}
                        {isActive && (
                          <motion.div
                            layoutId="activeNavIndicator"
                            className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-violet-500 to-cyan-400 rounded-full"
                          />
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right Action Icons */}
            <div className="flex items-center gap-2">
              {user ? (
                <>
                  {/* Messages Quick Access */}
                  <Link
                    to="/connections"
                    className="btn btn-ghost btn-circle btn-sm relative text-slate-300 hover:text-white"
                    aria-label={`${unreadMessages} unread message${
                      unreadMessages > 1 ? "s" : ""
                    }`}
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.8}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                    {unreadMessages > 0 && (
                      <span className="badge badge-primary badge-xs absolute -top-1 -right-1 font-bold animate-pulse">
                        {unreadMessages > 9 ? "9+" : unreadMessages}
                      </span>
                    )}
                  </Link>

                  {/* Notification Bell Dropdown */}
                  <div className="dropdown dropdown-end">
                    <button
                      tabIndex={0}
                      className="btn btn-ghost btn-circle btn-sm relative text-slate-300 hover:text-white"
                      aria-label={`Notifications${
                        totalBadge > 0 ? ` (${totalBadge} unread)` : ""
                      }`}
                      onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.8}
                          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                        />
                      </svg>
                      {unreadCount > 0 || requestCount > 0 ? (
                        <span className="badge badge-error badge-xs absolute -top-1 -right-1 font-bold animate-pulse">
                          {unreadCount + requestCount > 9
                            ? "9+"
                            : unreadCount + requestCount}
                        </span>
                      ) : null}
                    </button>

                    {/* Notification Dropdown Panel */}
                    <div
                      tabIndex={0}
                      className="dropdown-content bg-base-200/95 backdrop-blur-xl border border-white/10 rounded-2xl z-[50] mt-3 w-80 sm:w-96 max-h-[28rem] overflow-hidden shadow-2xl shadow-black/50 flex flex-col"
                    >
                      {/* Header */}
                      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-base-300/30">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-white">
                            Notifications
                          </span>
                          {unreadCount > 0 && (
                            <span className="badge badge-primary badge-xs font-mono">
                              {unreadCount} new
                            </span>
                          )}
                        </div>
                        {unreadCount > 0 && (
                          <button
                            onClick={handleMarkAllRead}
                            className="text-xs text-violet-400 hover:text-violet-300 font-medium transition-colors"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>

                      {/* Notification List */}
                      <div className="overflow-y-auto flex-1 divide-y divide-white/5">
                        {notifications.length === 0 ? (
                          <div className="py-12 px-4 text-center">
                            <div className="w-12 h-12 mx-auto rounded-full bg-base-300/50 flex items-center justify-center text-slate-400 mb-3">
                              <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="1.5"
                                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                                />
                              </svg>
                            </div>
                            <p className="text-sm font-medium text-slate-300">
                              All caught up!
                            </p>
                            <p className="text-xs text-slate-500 mt-1">
                              No pending notifications right now.
                            </p>
                          </div>
                        ) : (
                          notifications.slice(0, 15).map((notif) => (
                            <div
                              key={notif.id || Math.random()}
                              className={`p-3.5 flex items-start gap-3 hover:bg-white/5 transition-colors cursor-pointer ${
                                !notif.read ? "bg-violet-500/5" : ""
                              }`}
                            >
                              {/* Avatar or Type Icon */}
                              {notif.fromUser?.photoUrl ? (
                                <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 ring-1 ring-white/10">
                                  <img
                                    src={notif.fromUser.photoUrl}
                                    alt=""
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              ) : (
                                renderNotifIcon(notif.type)
                              )}

                              {/* Notification Body */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-1">
                                  <p
                                    className={`text-xs ${
                                      !notif.read
                                        ? "font-semibold text-white"
                                        : "text-slate-300"
                                    }`}
                                  >
                                    {notif.title}
                                  </p>
                                  <span className="text-[10px] text-slate-500 flex-shrink-0">
                                    {formatTime(notif.createdAt)}
                                  </span>
                                </div>
                                <p className="text-xs text-slate-400 truncate mt-0.5">
                                  {notif.message}
                                </p>
                              </div>

                              {/* Unread indicator */}
                              {!notif.read && (
                                <span className="w-2 h-2 rounded-full bg-violet-400 flex-shrink-0 mt-1.5" />
                              )}
                            </div>
                          ))
                        )}
                      </div>

                      {/* Footer */}
                      <div className="px-4 py-2.5 border-t border-white/10 bg-base-300/30 flex items-center justify-between text-xs">
                        <Link
                          to="/requests"
                          className="text-violet-400 hover:text-violet-300 font-medium transition-colors"
                        >
                          View connection requests ({requestCount}) →
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* User Profile Avatar Dropdown */}
                  <div className="dropdown dropdown-end">
                    <div
                      tabIndex={0}
                      role="button"
                      className="btn btn-ghost btn-circle avatar ring-1 ring-white/10 hover:ring-violet-500/50 transition-all"
                      aria-label="Open user menu"
                    >
                      <div className="w-9 h-9 rounded-full overflow-hidden">
                        <img
                          alt={`${user.firstName || "User"}'s profile photo`}
                          src={
                            user.photoUrl ||
                            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
                          }
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    <ul
                      tabIndex={0}
                      className="menu menu-sm dropdown-content bg-base-200/95 backdrop-blur-xl border border-white/10 rounded-2xl z-[50] mt-3 w-56 p-2 shadow-2xl shadow-black/50"
                      role="menu"
                    >
                      <li className="px-3 py-2 border-b border-white/10 mb-1">
                        <div className="flex flex-col p-0 hover:bg-transparent">
                          <span className="font-semibold text-sm text-white">
                            {user.firstName} {user.lastName}
                          </span>
                          <span className="text-xs text-slate-400 truncate">
                            {user.emailId}
                          </span>
                        </div>
                      </li>
                      <li>
                        <Link
                          to="/profile"
                          className="flex items-center gap-2 py-2"
                        >
                          <svg
                            className="w-4 h-4 opacity-70"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                          My Profile
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/connections"
                          className="flex items-center justify-between py-2"
                        >
                          <span className="flex items-center gap-2">
                            <svg
                              className="w-4 h-4 opacity-70"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                              />
                            </svg>
                            Connections
                          </span>
                          {unreadMessages > 0 && (
                            <span className="badge badge-primary badge-xs">
                              {unreadMessages}
                            </span>
                          )}
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/requests"
                          className="flex items-center justify-between py-2"
                        >
                          <span className="flex items-center gap-2">
                            <svg
                              className="w-4 h-4 opacity-70"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                              />
                            </svg>
                            Requests
                          </span>
                          {requestCount > 0 && (
                            <span className="badge badge-error badge-xs">
                              {requestCount}
                            </span>
                          )}
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/analytics"
                          className="flex items-center gap-2 py-2"
                        >
                          <svg
                            className="w-4 h-4 opacity-70"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                            />
                          </svg>
                          Profile Analytics
                        </Link>
                      </li>
                      <li className="border-t border-white/10 mt-1 pt-1">
                        <button
                          onClick={handleLogout}
                          className="text-rose-400 hover:text-rose-300 flex items-center gap-2 py-2"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                          </svg>
                          Sign Out
                        </button>
                      </li>
                    </ul>
                  </div>

                  {/* Mobile Hamburger Button */}
                  <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="btn btn-ghost btn-circle btn-sm lg:hidden text-slate-300"
                    aria-label="Open mobile navigation menu"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      {mobileMenuOpen ? (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      ) : (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 6h16M4 12h16M4 18h16"
                        />
                      )}
                    </svg>
                  </button>
                </>
              ) : (
                /* Unauthenticated Actions */
                <div className="flex items-center gap-3">
                  <Link
                    to="/login"
                    className="btn btn-sm btn-ghost text-slate-300 hover:text-white font-medium"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/login"
                    className="btn btn-sm bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white border-0 shadow-md shadow-violet-500/20 font-medium px-4"
                  >
                    Join DevTinder
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {user && mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden bg-base-200/95 backdrop-blur-2xl border-b border-white/10 px-4 pt-2 pb-4 space-y-1"
            >
              {navLinks.map((link) => {
                const isActive = location.pathname === link.to;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-violet-600/20 text-violet-300 font-semibold"
                        : "text-slate-300 hover:bg-white/5"
                    }`}
                  >
                    <span>{link.label}</span>
                    {link.badge && (
                      <span
                        className={`badge ${
                          link.badgeType || "badge-primary"
                        } badge-xs`}
                      >
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
              <div className="pt-2 border-t border-white/10 flex items-center justify-between px-3">
                <Link
                  to="/profile"
                  className="text-xs text-slate-400 hover:text-white"
                >
                  View Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-xs text-rose-400 hover:text-rose-300 font-medium"
                >
                  Sign Out
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
};

export default NavBar;
