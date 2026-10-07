import { useState } from "react";

/**
 * CodeBlock - renders code with sleek syntax-like styling.
 * Props:
 *   - code: the code string
 *   - lang: language identifier (for display)
 */
const CodeBlock = ({ code, lang = "javascript" }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = code;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="relative rounded-xl overflow-hidden my-2 max-w-md w-full border border-white/10 bg-slate-950/90 shadow-lg">
      {/* Header bar */}
      <div className="flex items-center justify-between bg-white/5 border-b border-white/5 px-3 py-1.5 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
          <span className="ml-2 font-mono text-[11px] text-slate-400 uppercase tracking-wider">{lang}</span>
        </div>
        <button
          onClick={handleCopy}
          className="px-2 py-0.5 rounded-md text-[11px] font-mono text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors flex items-center gap-1"
          aria-label="Copy code"
          type="button"
        >
          {copied ? (
            <>
              <svg className="w-3 h-3 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
              </svg>
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      {/* Code content */}
      <pre className="p-3.5 overflow-x-auto text-xs font-mono leading-relaxed text-violet-200 bg-transparent whitespace-pre-wrap break-all">
        <code>{code}</code>
      </pre>
    </div>
  );
};

export default CodeBlock;
