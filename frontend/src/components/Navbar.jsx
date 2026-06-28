import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const RANKS = [
  { minLevel: 1,  name: "RECRUIT",  icon: "⬡", color: "text-[var(--text-muted)]" },
  { minLevel: 3,  name: "HUNTER",   icon: "◈", color: "text-[var(--neon)]"       },
  { minLevel: 7,  name: "WARRIOR",  icon: "◉", color: "text-[var(--cyan)]"       },
  { minLevel: 15, name: "ELITE",    icon: "◆", color: "text-[var(--purple)]"     },
  { minLevel: 25, name: "LEGEND",   icon: "★", color: "text-[var(--amber)]"      },
];

function getRank(level) {
  return [...RANKS].reverse().find(r => level >= r.minLevel) || RANKS[0];
}

export default function Navbar({ level, xp, streak, stage, stageName, logout, levelUp, username }) {
  const navigate  = useNavigate();
  const location  = useLocation();
  const safeXp    = xp ?? 0;
  const xpProgress = safeXp % 100;
  const rank       = getRank(level);

  const navItems = [
    { label: "DASHBOARD", path: "/dashboard" },
    { label: "COURSE",    path: "/"          },
    { label: "PROFILE",   path: "/profile"   },
  ];

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

      {/* ─── Left: Logo ─── */}
      <div className="flex items-center z-10 shrink-0">
        <img src="/logo1.png" alt="CodeHunt" className="h-9 object-contain animate-flicker" />
      </div>

      {/* ─── Center: Navigation ─── */}
      <nav className="absolute left-1/2 -translate-x-1/2 z-10 flex items-center gap-3">

        {/* Page pills */}
        <div
          className="flex items-center gap-0.5 p-0.5 rounded-xl"
          style={{ background: "rgba(0,0,0,0.45)", border: "1px solid var(--border)" }}
        >
          {navItems.map(({ label, path }) => {
            const active = location.pathname === path;
            return (
              <motion.button
                key={path}
                onClick={() => navigate(path)}
                whileTap={{ scale: 0.96 }}
                className={`px-4 py-1.5 rounded-lg font-hud text-[0.57rem] tracking-[0.14em] transition-all duration-200 ${
                  active
                    ? "text-[#030e09]"
                    : "text-[var(--text-muted)] hover:text-[var(--text)]"
                }`}
                style={active ? {
                  background: "var(--neon)",
                  boxShadow: "0 0 14px var(--neon-40)"
                } : {}}
              >
                {label}
              </motion.button>
            );
          })}
        </div>

        {/* Stage breadcrumb — only on course page */}
        <AnimatePresence>
          {location.pathname === "/" && stageName && (
            <motion.div
              key="breadcrumb"
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -6 }}
              className="flex items-center gap-1.5 pl-3 border-l border-[var(--border)]"
            >
              <span className="font-hud text-[0.48rem] tracking-[0.12em] text-[var(--text-muted)] truncate max-w-[130px] uppercase">
                {stageName}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ─── Right: Stats + Exit ─── */}
      <div className="flex items-center gap-3 z-10">

        {/* Level Up toast */}
        <AnimatePresence>
          {levelUp && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="absolute left-1/2 -translate-x-1/2 top-14 z-50
                badge badge-neon text-xs px-3 py-1 shadow-[0_0_20px_var(--neon-40)] animate-level-flash"
            >
              ▲ LEVEL UP
            </motion.div>
          )}
        </AnimatePresence>

        {/* Level + Rank + XP bar */}
        <div className="flex items-center gap-2.5">
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

          <div className="flex flex-col gap-0.5">
            <span className={`font-hud text-[0.52rem] tracking-widest ${rank.color}`}>
              {rank.icon} {rank.name}
            </span>
            <div className="flex items-center gap-1.5">
              <div className="w-24 h-1.5 prog-track">
                <motion.div
                  className="prog-fill prog-fill-amber h-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${xpProgress}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
              <span className="font-mono text-[0.48rem] text-[var(--text-muted)]">
                {xpProgress}
              </span>
            </div>
          </div>
        </div>

        {/* Streak */}
        <div
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg"
          style={{ background: "rgba(255,120,0,0.08)", border: "1px solid rgba(255,120,0,0.2)" }}
        >
          <motion.span
            animate={{ opacity: [1, 0.6, 1] }}
            transition={{ duration: 1.8, repeat: Infinity }}
            className="font-hud text-[0.55rem] tracking-wider text-orange-400"
          >
            {streak}D
          </motion.span>
        </div>

        {/* Separator */}
        <div className="w-px h-5" style={{ background: "var(--border)" }} />

        {/* Exit */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={logout}
          className="btn-danger px-3 py-1.5 rounded-lg font-hud text-[0.57rem]"
        >
          EXIT
        </motion.button>
      </div>
    </header>
  );
}