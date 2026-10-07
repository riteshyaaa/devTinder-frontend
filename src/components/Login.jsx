import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import useAuth from "../hooks/useAuth";
import Logo from "./ui/Logo";
import {
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  validateFirstName,
  validateLastName,
} from "../utils/validators";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const { user, isAuthInitialized, login, signUp, loading, error, clearError } =
    useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/feed";

  // If already authenticated and session initialized, redirect to target page
  useEffect(() => {
    if (isAuthInitialized && user) {
      navigate(from, { replace: true });
    }
  }, [isAuthInitialized, user, navigate, from]);

  // Auto-dismiss authentication error notification after 3 seconds
  useEffect(() => {
    if (!error) return;
    const timer = setTimeout(() => {
      clearError();
    }, 3000);
    return () => clearTimeout(timer);
  }, [error, clearError]);

  const validateLoginForm = () => {
    const errors = {};
    const emailErr = validateEmail(email);
    const passErr = validatePassword(password);
    if (emailErr) errors.email = emailErr;
    if (passErr) errors.password = passErr;
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateSignUpForm = () => {
    const errors = {};
    const firstErr = validateFirstName(firstName);
    const lastErr = validateLastName(lastName);
    const emailErr = validateEmail(email);
    const passErr = validatePassword(password);
    const confirmErr = validateConfirmPassword(password, confirmPassword);
    if (firstErr) errors.firstName = firstErr;
    if (lastErr) errors.lastName = lastErr;
    if (emailErr) errors.email = emailErr;
    if (passErr) errors.password = passErr;
    if (confirmErr) errors.confirmPassword = confirmErr;
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    clearError();
    if (isLogin) {
      if (!validateLoginForm()) return;
      login(email, password);
    } else {
      if (!validateSignUpForm()) return;
      signUp({ firstName, lastName, email, password });
    }
  };

  const toggleMode = (mode) => {
    if (mode === isLogin) return;
    setIsLogin(mode);
    setFieldErrors({});
    clearError();
  };

  // Clear field error on change
  const handleFieldChange = (setter, field) => (e) => {
    setter(e.target.value);
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Radiant Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-violet-600/15 via-purple-600/10 to-cyan-500/15 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Card Container */}
        <div className="rounded-3xl bg-brand-surface/90 border border-white/10 backdrop-blur-xl p-8 sm:p-10 shadow-2xl shadow-violet-950/40">
          {/* Header Brand */}
          <div className="flex flex-col items-center text-center mb-8">
            <Logo size="lg" showText={false} />
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-4 tracking-tight">
              {isLogin ? "Welcome back, developer" : "Join the DevTinder network"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1.5">
              {isLogin
                ? "Sign in to access your connections, project feeds, and chats"
                : "Create your verified profile and start pair-programming"}
            </p>
          </div>

          {/* Segmented Mode Selector */}
          <div className="grid grid-cols-2 p-1 bg-white/5 border border-white/10 rounded-2xl mb-8 relative">
            <button
              type="button"
              onClick={() => toggleMode(true)}
              className={`py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all relative z-10 ${
                isLogin
                  ? "text-white shadow-md shadow-violet-900/30"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {isLogin && (
                <motion.div
                  layoutId="auth-tab"
                  className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl -z-10"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              Log In
            </button>
            <button
              type="button"
              onClick={() => toggleMode(false)}
              className={`py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all relative z-10 ${
                !isLogin
                  ? "text-white shadow-md shadow-violet-900/30"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {!isLogin && (
                <motion.div
                  layoutId="auth-tab"
                  className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl -z-10"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              Sign Up
            </button>
          </div>

          {/* Authentication Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <AnimatePresence mode="popLayout">
              {!isLogin && (
                <motion.div
                  key="signup-names"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                >
                  {/* First Name */}
                  <div>
                    <label
                      className="block text-xs font-semibold text-slate-300 mb-1.5"
                      htmlFor="firstName"
                    >
                      First Name
                    </label>
                    <div className="relative">
                      <input
                        id="firstName"
                        type="text"
                        value={firstName}
                        className={`w-full px-4 py-2.5 rounded-xl bg-white/5 border ${
                          fieldErrors.firstName
                            ? "border-rose-500 focus:border-rose-500"
                            : "border-white/10 focus:border-violet-500"
                        } text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-500 transition-colors`}
                        onChange={handleFieldChange(setFirstName, "firstName")}
                        placeholder="Ada"
                        aria-invalid={!!fieldErrors.firstName}
                        aria-describedby={
                          fieldErrors.firstName ? "firstName-error" : undefined
                        }
                      />
                    </div>
                    {fieldErrors.firstName && (
                      <p
                        id="firstName-error"
                        className="text-rose-400 text-xs mt-1"
                      >
                        {fieldErrors.firstName}
                      </p>
                    )}
                  </div>

                  {/* Last Name */}
                  <div>
                    <label
                      className="block text-xs font-semibold text-slate-300 mb-1.5"
                      htmlFor="lastName"
                    >
                      Last Name
                    </label>
                    <div className="relative">
                      <input
                        id="lastName"
                        type="text"
                        value={lastName}
                        className={`w-full px-4 py-2.5 rounded-xl bg-white/5 border ${
                          fieldErrors.lastName
                            ? "border-rose-500 focus:border-rose-500"
                            : "border-white/10 focus:border-violet-500"
                        } text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-500 transition-colors`}
                        onChange={handleFieldChange(setLastName, "lastName")}
                        placeholder="Lovelace"
                        aria-invalid={!!fieldErrors.lastName}
                        aria-describedby={
                          fieldErrors.lastName ? "lastName-error" : undefined
                        }
                      />
                    </div>
                    {fieldErrors.lastName && (
                      <p
                        id="lastName-error"
                        className="text-rose-400 text-xs mt-1"
                      >
                        {fieldErrors.lastName}
                      </p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email Field */}
            <div>
              <label
                className="block text-xs font-semibold text-slate-300 mb-1.5"
                htmlFor="email"
              >
                Developer Email
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 text-slate-400 pointer-events-none">
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
                      d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                    />
                  </svg>
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border ${
                    fieldErrors.email
                      ? "border-rose-500 focus:border-rose-500"
                      : "border-white/10 focus:border-violet-500"
                  } text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-500 transition-colors`}
                  onChange={handleFieldChange(setEmail, "email")}
                  placeholder="developer@domain.com"
                  autoComplete="email"
                  aria-invalid={!!fieldErrors.email}
                  aria-describedby={
                    fieldErrors.email ? "email-error" : undefined
                  }
                />
              </div>
              {fieldErrors.email && (
                <p id="email-error" className="text-rose-400 text-xs mt-1">
                  {fieldErrors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                className="block text-xs font-semibold text-slate-300 mb-1.5"
                htmlFor="password"
              >
                Password
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 text-slate-400 pointer-events-none">
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
                      d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                    />
                  </svg>
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  className={`w-full pl-10 pr-10 py-2.5 rounded-xl bg-white/5 border ${
                    fieldErrors.password
                      ? "border-rose-500 focus:border-rose-500"
                      : "border-white/10 focus:border-violet-500"
                  } text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-500 transition-colors`}
                  onChange={handleFieldChange(setPassword, "password")}
                  placeholder="At least 6 characters"
                  autoComplete={isLogin ? "current-password" : "new-password"}
                  aria-invalid={!!fieldErrors.password}
                  aria-describedby={
                    fieldErrors.password ? "password-error" : undefined
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-slate-400 hover:text-white transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
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
                        d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                      />
                    </svg>
                  ) : (
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
                        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  )}
                </button>
              </div>
              {fieldErrors.password && (
                <p id="password-error" className="text-rose-400 text-xs mt-1">
                  {fieldErrors.password}
                </p>
              )}
            </div>

            {/* Confirm Password Field (Sign Up Only) */}
            <AnimatePresence mode="popLayout">
              {!isLogin && (
                <motion.div
                  key="confirm-password"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <label
                    className="block text-xs font-semibold text-slate-300 mb-1.5"
                    htmlFor="confirmPassword"
                  >
                    Confirm Password
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3.5 text-slate-400 pointer-events-none">
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
                          d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                        />
                      </svg>
                    </div>
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      className={`w-full pl-10 pr-10 py-2.5 rounded-xl bg-white/5 border ${
                        fieldErrors.confirmPassword
                          ? "border-rose-500 focus:border-rose-500"
                          : "border-white/10 focus:border-violet-500"
                      } text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-500 transition-colors`}
                      onChange={handleFieldChange(
                        setConfirmPassword,
                        "confirmPassword"
                      )}
                      placeholder="Re-enter your password"
                      autoComplete="new-password"
                      aria-invalid={!!fieldErrors.confirmPassword}
                      aria-describedby={
                        fieldErrors.confirmPassword
                          ? "confirmPassword-error"
                          : undefined
                      }
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 text-slate-400 hover:text-white transition-colors"
                      aria-label={
                        showConfirmPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showConfirmPassword ? (
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
                            d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                          />
                        </svg>
                      ) : (
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
                            d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                  {fieldErrors.confirmPassword && (
                    <p
                      id="confirmPassword-error"
                      className="text-rose-400 text-xs mt-1"
                    >
                      {fieldErrors.confirmPassword}
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error Banner (Auto-dismissed after 3s) */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center justify-between gap-2 shadow-lg shadow-rose-950/20"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <svg
                      className="w-4 h-4 flex-shrink-0 text-rose-400"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                      />
                    </svg>
                    <span className="font-medium">{error}</span>
                  </div>
                  <button
                    type="button"
                    onClick={clearError}
                    className="text-rose-400/60 hover:text-rose-300 p-0.5 rounded transition-colors flex-shrink-0"
                    aria-label="Dismiss notification"
                  >
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-violet-600/30 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : isLogin ? (
                  "Log In to Workspace"
                ) : (
                  "Create Developer Account"
                )}
              </button>
            </div>
          </form>

          {/* Footer Note */}
          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="text-xs text-slate-400">
              {isLogin ? "Don't have a profile yet? " : "Already registered? "}
              <button
                type="button"
                onClick={() => toggleMode(!isLogin)}
                className="text-violet-400 hover:text-violet-300 font-semibold underline underline-offset-2 transition-colors"
              >
                {isLogin ? "Sign up free" : "Log in here"}
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
