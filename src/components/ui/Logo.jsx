import { motion } from "framer-motion";

/**
 * DevTinder Brand Logo
 * Features a custom geometric "D + Connection" vector mark
 * representing developer nodes connecting through code brackets.
 *
 * @param {string} size - "sm" (24px), "md" (32px), "lg" (44px), "xl" (64px)
 * @param {boolean} showText - Whether to show the "DevTinder" logotype
 * @param {string} className - Optional wrapper styling
 * @param {boolean} animated - Optional subtle pulsing ambient glow
 */
const Logo = ({
  size = "md",
  showText = true,
  className = "",
  animated = false,
}) => {
  const sizeMap = {
    sm: { icon: 26, text: "text-lg", badge: "text-[9px] px-1" },
    md: { icon: 34, text: "text-xl", badge: "text-[10px] px-1.5" },
    lg: { icon: 44, text: "text-2xl", badge: "text-xs px-2" },
    xl: { icon: 60, text: "text-4xl", badge: "text-sm px-2.5" },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  const iconVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.05, rotate: 2 },
  };

  return (
    <div
      className={`inline-flex items-center gap-2.5 select-none ${className}`}
      aria-label="DevTinder brand logo"
    >
      <motion.div
        className="relative flex items-center justify-center flex-shrink-0"
        variants={animated ? iconVariants : undefined}
        initial="initial"
        whileHover={animated ? "hover" : undefined}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        {/* Ambient background glow */}
        <div
          className="absolute inset-0 rounded-xl bg-gradient-to-tr from-violet-600 via-fuchsia-600 to-cyan-400 opacity-40 blur-md pointer-events-none"
          aria-hidden="true"
        />

        {/* Custom "D + Connection" Vector Mark */}
        <svg
          width={currentSize.icon}
          height={currentSize.icon}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10 drop-shadow-md"
        >
          <defs>
            <linearGradient
              id="devtinder-d-gradient"
              x1="4"
              y1="4"
              x2="44"
              y2="44"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#7C3AED" />
              <stop offset="45%" stopColor="#8B5CF6" />
              <stop offset="80%" stopColor="#2563EB" />
              <stop offset="100%" stopColor="#06B6D4" />
            </linearGradient>
            <linearGradient
              id="devtinder-node-gradient"
              x1="0"
              y1="0"
              x2="10"
              y2="10"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#06B6D4" />
              <stop offset="100%" stopColor="#38BDF8" />
            </linearGradient>
          </defs>

          {/* Background rounded container */}
          <rect
            x="3"
            y="3"
            width="42"
            height="42"
            rx="12"
            fill="#0B1020"
            stroke="url(#devtinder-d-gradient)"
            strokeWidth="1.5"
          />

          {/* D Outer Backbone & Arc */}
          <path
            d="M14 12H24C31.1797 12 37 17.3726 37 24C37 30.6274 31.1797 36 24 36H14V12Z"
            stroke="url(#devtinder-d-gradient)"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Internal pairing brackets & connection vector */}
          <path
            d="M20 20L16 24L20 28"
            stroke="#38BDF8"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M24 24H30"
            stroke="#EC4899"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeDasharray="2 2"
          />

          {/* Developer Connection Nodes */}
          <circle cx="16" cy="24" r="2.2" fill="#38BDF8" />
          <circle cx="30" cy="24" r="2.5" fill="#EC4899" />
          <circle
            cx="30"
            cy="24"
            r="4.5"
            stroke="#EC4899"
            strokeWidth="1"
            opacity="0.6"
          />
        </svg>
      </motion.div>

      {showText && (
        <div className="flex items-center gap-1.5 font-bold tracking-tight">
          <span
            className={`${currentSize.text} bg-gradient-to-r from-slate-100 via-slate-200 to-slate-400 bg-clip-text text-transparent`}
          >
            Dev
          </span>
          <span
            className={`${currentSize.text} bg-gradient-to-r from-violet-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent font-extrabold`}
          >
            Tinder
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;
