import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* animated background node */
function Node({ x, y, size, delay }) {
  return (
    <motion.div
      className="absolute rounded-full bg-[var(--neon)]"
      style={{ left: `${x}%`, top: `${y}%`, width: size, height: size, opacity: 0 }}
      animate={{ opacity: [0, 0.6, 0], y: [0, -50, -90] }}
      transition={{ duration: 3 + Math.random() * 2, delay, repeat: Infinity, ease: "easeOut" }}
    />
  );
}

export default function AuthScreen({ isLogin, setIsLogin, authData, setAuthData, handleAuth }) {
  const [nodes] = useState(() =>
    Array.from({ length: 18 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: 40 + Math.random() * 60,
      size: 1 + Math.random() * 2.5,
      delay: Math.random() * 4,
    }))
  );

  const [focused, setFocused] = useState(null);

  const inputBase =
    "w-full px-4 py-3 rounded-lg font-mono text-[var(--text)] placeholder-[rgba(212,237,223,0.2)] " +
    "bg-[rgba(0,0,0,0.45)] outline-none border transition-all duration-200 text-sm";

  const inputClass = (name) =>
    focused === name
      ? `${inputBase} border-[var(--neon-40)] shadow-[0_0_0_3px_rgba(0,255,135,0.08)] text-[var(--neon)]`
      : `${inputBase} border-[var(--border)]`;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--void)] overflow-hidden relative select-none">

      {/* Grid */}
      <div className="absolute inset-0 bg-dot-grid opacity-60" />
      <div className="scanlines" />

      {/* Glow orbs */}
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(0,255,135,0.04) 0%, transparent 70%)" }} />
      <div className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(0,212,255,0.04) 0%, transparent 70%)" }} />

      {/* Floating nodes */}
      {nodes.map(n => <Node key={n.id} {...n} />)}

      {/* Main panel */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-md px-4"
      >
        <div className="glass rounded-2xl p-8 shadow-[0_0_80px_rgba(0,0,0,0.6)]">

          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[var(--neon-40)] rounded-tl-2xl" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[var(--neon-40)] rounded-tr-2xl" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[var(--neon-40)] rounded-bl-2xl" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[var(--neon-40)] rounded-br-2xl" />

          {/* Logo */}
          <div className="flex justify-center mb-5">
            <motion.div
              animate={{
                filter: [
                  "drop-shadow(0 0 8px rgba(0,255,135,0.5))",
                  "drop-shadow(0 0 20px rgba(0,255,135,0.9))",
                  "drop-shadow(0 0 8px rgba(0,255,135,0.5))"
                ]
              }}
              transition={{ duration: 2.5, repeat: Infinity }}
              className="animate-flicker"
            >
              <img src="/logo2.png" alt="CodeHunt" className="h-24 object-contain" />
            </motion.div>
          </div>

          {/* Tagline */}
          <div className="text-center mb-6">
            <p className="font-hud text-[0.6rem] tracking-[0.25em] text-[var(--neon-40)] uppercase mb-1">
              ◆ ACCESS TERMINAL ◆
            </p>
            <p className="font-hud text-[0.55rem] tracking-[0.18em] text-[var(--text-muted)] uppercase">
              Structured C++ Mastery Platform
            </p>
          </div>

          {/* Tab switcher */}
          <div className="flex rounded-lg bg-[rgba(0,0,0,0.4)] border border-[var(--border)] p-1 mb-6">
            {["LOGIN", "REGISTER"].map((tab, i) => (
              <motion.button
                key={tab}
                onClick={() => setIsLogin(i === 0)}
                whileTap={{ scale: 0.97 }}
                className={`flex-1 py-2 rounded-md text-xs font-hud transition-all duration-200 ${
                  isLogin === (i === 0)
                    ? "bg-[var(--neon)] text-[#020b0a] shadow-[0_0_16px_var(--neon-40)]"
                    : "text-[var(--text-muted)] hover:text-[var(--text)]"
                }`}
              >
                {tab}
              </motion.button>
              
            ))}
          </div>

          {/* Form fields */}
          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? "login" : "signup"}
              initial={{ opacity: 0, x: isLogin ? -12 : 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isLogin ? 12 : -12 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {!isLogin && (
                <div>
                  <label className="block text-[0.6rem] font-hud tracking-[0.2em] text-[var(--text-muted)] uppercase mb-1.5">
                    HANDLE
                  </label>
                  <input
                    type="text"
                    placeholder="your_callsign"
                    value={authData.username}
                    onFocus={() => setFocused("username")}
                    onBlur={() => setFocused(null)}
                    onChange={e => setAuthData({ ...authData, username: e.target.value })}
                    className={inputClass("username")}
                  />
                </div>
              )}

              <div>
                <label className="block text-[0.6rem] font-hud tracking-[0.2em] text-[var(--text-muted)] uppercase mb-1.5">
                  EMAIL
                </label>
                <input
                  type="email"
                  placeholder="operator@codehunt.io"
                  value={authData.email}
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused(null)}
                  onChange={e => setAuthData({ ...authData, email: e.target.value })}
                  className={inputClass("email")}
                />
              </div>

              <div>
                <label className="block text-[0.6rem] font-hud tracking-[0.2em] text-[var(--text-muted)] uppercase mb-1.5">
                  PASSKEY
                </label>
                <input
                  type="password"
                  placeholder="••••••••••"
                  value={authData.password}
                  onFocus={() => setFocused("password")}
                  onBlur={() => setFocused(null)}
                  onChange={e => setAuthData({ ...authData, password: e.target.value })}
                  onKeyDown={e => e.key === "Enter" && handleAuth()}
                  className={inputClass("password")}
                />
              </div>

              {/* Submit */}
              <motion.button
                onClick={handleAuth}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="btn-primary w-full py-3.5 rounded-xl text-xs mt-2"
              >
                {isLogin ? "▶ INITIATE ACCESS" : "▶ ENLIST NOW"}
              </motion.button>
            

            {/* OAuth Divider */}
<div className="mt-5 flex items-center gap-2">
  <div className="flex-1 divider-subtle" />
  <p className="text-[0.55rem] font-mono text-[var(--text-muted)] px-2 uppercase tracking-wider">
    alternative access
  </p>
  <div className="flex-1 divider-subtle" />
</div>

{/* OAuth Buttons */}
<div className="mt-4 space-y-3">

  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.97 }}
    onClick={() =>
      window.location.href =
      "http://localhost:5000/auth/google"
    }
    className="
      w-full
      py-3
      rounded-xl
      border
      border-[rgba(0,212,255,0.25)]
      bg-[rgba(0,212,255,0.05)]
      text-[var(--cyan)]
      font-hud
      text-[0.65rem]
      tracking-[0.18em]
      uppercase
      hover:bg-[rgba(0,212,255,0.08)]
      hover:border-[rgba(0,212,255,0.45)]
      transition-all
    "
  >
    ◉ Google Access
  </motion.button>
  

  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.97 }}
    onClick={() =>
      window.location.href =
      "http://localhost:5000/auth/github"
    }
    className="
      w-full
      py-3
      rounded-xl
      border
      border-[rgba(168,85,247,0.25)]
      bg-[rgba(168,85,247,0.05)]
      text-purple-300
      font-hud
      text-[0.65rem]
      tracking-[0.18em]
      uppercase
      hover:bg-[rgba(168,85,247,0.08)]
      hover:border-[rgba(168,85,247,0.45)]
      transition-all
    "
  >
    ◉ GitHub Access
  </motion.button>
</div>
</motion.div>
          </AnimatePresence>

          {/* Status line */}
          <div className="mt-5 flex items-center gap-2">
            <div className="flex-1 divider-subtle" />
            <p className="text-[0.55rem] font-mono text-[var(--text-muted)] px-2 uppercase tracking-wider">
              {isLogin ? "new recruit?" : "already enlisted?"}
            </p>
            <div className="flex-1 divider-subtle" />
          </div>
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="w-full mt-3 py-2 text-[0.65rem] font-hud text-[var(--cyan)] hover:text-[var(--neon)] 
            transition-colors tracking-widest uppercase"
          >
            {isLogin ? "Create Account →" : "← Back to Login"}
          </button>

        </div>

        <p className="text-center text-[0.55rem] font-mono text-[rgba(212,237,223,0.2)] mt-6 tracking-widest">
          © 2026 CODEHUNT — HUNT. LEVEL UP. MASTER C++.
        </p>
      </motion.div>
    </div>
  );
}