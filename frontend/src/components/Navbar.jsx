import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const RANKS = [
  { minLevel: 1,  name: "RECRUIT",  icon: "⬡", color: "text-[var(--text-muted)]" },
  { minLevel: 3,  name: "HUNTER",   icon: "◈", color: "text-[var(--neon)]" },
  { minLevel: 7,  name: "WARRIOR",  icon: "◉", color: "text-[var(--cyan)]" },
  { minLevel: 15, name: "ELITE",    icon: "◆", color: "text-[var(--purple)]" },
  { minLevel: 25, name: "LEGEND",   icon: "★", color: "text-[var(--amber)]" },
];

function getRank(level) {
  return [...RANKS].reverse().find(r => level >= r.minLevel) || RANKS[0];
}

export default function Navbar({ level, xp, streak, stage, stageName, logout, levelUp, username }) {
  const navigate = useNavigate();
  const location = useLocation();
  const hideStage = location.pathname === "/profile" || location.pathname === "/dashboard";
  const safeXp = xp ?? 0;
  const xpProgress = safeXp % 100;
  const rank = getRank(level);

  return (
    <header
      className="relative flex items-center justify-between px-5 h-14 shrink-0 z-50"
      style={{
        background: "linear-gradient(180deg, rgba(4,11,20,0.98) 0%, rgba(7,18,36,0.98) 100%)",
        borderBottom: "1px solid var(--border)",
        boxShadow: "0 1px 0 var(--neon-10), 0 4px 24px rgba(0,0,0,0.6)"
      }}
    >
      <div className="scanlines opacity-30" />

      {/* ─── LEFT: Brand ─── */}
      <div className="flex items-center gap-3 z-10">
        <img src="/logo1.png" alt="CodeHunt" className="h-9 object-contain animate-flicker" />
      </div>

      {/* ─── CENTER: Stage ─── */}
      <div className="absolute left-1/2 -translate-x-1/2 z-10">
        <AnimatePresence mode="wait">
          {hideStage ? (
            <motion.div
              key="user"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              className="flex items-center gap-2"
            >
              <span className="font-hud text-xs text-[var(--text-muted)] tracking-widest">
                ◈ {username}
              </span>
            </motion.div>
          ) : (
            <motion.div
              key="stage"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              className="flex items-center gap-2"
            >
              <span className="badge badge-neon">STAGE {stage + 1}</span>
              <span className="text-[var(--border-mid)] text-sm">›</span>
              <span className="font-title text-sm text-[var(--text)] truncate max-w-[200px]">
                {stageName}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ─── RIGHT: Stats ─── */}
      <div className="flex items-center gap-3 z-10">

        {/* Level + Rank + XP */}
        <div className="flex items-center gap-2.5">

          {/* Level badge */}
          <AnimatePresence>
            {levelUp && (
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                className="absolute left-1/2 -translate-x-1/2 top-14 z-50
                badge badge-neon animate-level-flash text-xs px-3 py-1 shadow-[0_0_20px_var(--neon-40)]"
              >
                ▲ LEVEL UP!
              </motion.div>
            )}
          </AnimatePresence>

          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center font-hud text-sm font-bold"
            style={{
              background: "var(--amber-10)",
              border: "1px solid rgba(255,184,0,0.35)",
              color: "var(--amber)",
              boxShadow: levelUp ? "0 0 16px rgba(255,184,0,0.7)" : "none",
              transition: "box-shadow 0.3s"
            }}
          >
            {level}
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5">
              <span className={`font-hud text-[0.55rem] tracking-widest ${rank.color}`}>
                {rank.icon} {rank.name}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-28 h-1.5 prog-track">
                <motion.div
                  className="prog-fill prog-fill-amber h-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${xpProgress}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
              <span className="font-mono text-[0.55rem] text-[var(--text-muted)]">
                {xpProgress}
              </span>
            </div>
          </div>
        </div>

        {/* Streak */}
        <div
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg"
          style={{ background: "rgba(255,120,0,0.08)", border: "1px solid rgba(255,120,0,0.2)" }}
        >
          <motion.span
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-sm leading-none"
          >
            🔥
          </motion.span>
          <span className="font-hud text-xs text-orange-400">{streak}</span>
        </div>

        {/* Divider */}
        <div className="w-px h-6" style={{ background: "var(--border)" }} />

        {/* Profile btn */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/profile")}
          className="btn-ghost px-3 py-1.5 rounded-lg font-hud text-xs"
        >
          PROFILE
        </motion.button>

        {/* Logout */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={logout}
          className="btn-danger px-3 py-1.5 rounded-lg font-hud text-xs"
        >
          EXIT
        </motion.button>
      </div>
    </header>
  );
}