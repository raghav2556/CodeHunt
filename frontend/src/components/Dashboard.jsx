import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Background from "./Background";

/* Stat card — no emoji, just label + value */
function StatReadout({ label, value, color, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="card rounded-xl p-4 text-center relative overflow-hidden"
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at 50% 110%, ${color}14 0%, transparent 65%)` }}
      />

      <div className="font-hud text-[0.48rem] tracking-[0.22em] text-[var(--text-muted)] uppercase mb-2">
        {label}
      </div>

      <div
        className="font-hud text-[1.65rem] font-bold leading-none relative z-10"
        style={{ color }}
      >
        {value}
      </div>
    </motion.div>
  );
}

export default function Dashboard({ progress, username, xp, level, streak, course }) {
  const navigate   = useNavigate();
  const hasStarted = Object.keys(progress || {}).length > 0;

  const totalProblems   = course?.reduce((s, t) => s + t.problems.length, 0) || 0;
  const solvedProblems  = Object.keys(progress || {}).length;
  const completionPct   = totalProblems > 0 ? Math.floor((solvedProblems / totalProblems) * 100) : 0;
  const stagesCompleted = (course || []).filter((topic, tIndex) =>
    topic.problems.every((_, pIndex) => progress?.[`${tIndex}-${pIndex}`])
  ).length;

  const stats = [
    { label: "Level",  value: level,         color: "var(--amber)", delay: 0.1  },
    { label: "XP",     value: xp,            color: "var(--cyan)",  delay: 0.15 },
    { label: "Streak", value: `${streak}D`,  color: "#FF7820",      delay: 0.2  },
    { label: "Solved", value: solvedProblems, color: "var(--neon)",  delay: 0.25 },
  ];

  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden" style={{ background: "var(--void)" }}>
      <div className="relative min-h-full">
        <Background />

        <div className="relative z-10 max-w-3xl mx-auto px-6 py-12">

          {/* ─── Hero ─── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.h1
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="font-title text-gradient-neon mb-3"
            style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)", lineHeight: 1.1 }}
          >
            CODEHUNT
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="text-xl text-[var(--text)] mb-1"
          >
            Welcome back,{" "}
            <span
              className="text-[var(--neon)] font-bold"
              style={{ textShadow: "0 0 12px var(--neon-40)" }}
            >
              {username}
            </span>
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="font-hud text-[0.62rem] tracking-[0.2em] text-[var(--text-muted)] uppercase"
          >
            Hunt Knowledge · Level Up · Master C++
          </motion.p>
        </motion.div>

        {/* ─── Stat grid ─── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {stats.map(s => <StatReadout key={s.label} {...s} />)}
        </div>

        {/* ─── Course card ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="card rounded-2xl p-8 relative overflow-hidden card-hover"
        >
          {/* Ambient glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at 80% 20%, rgba(0,255,135,0.04) 0%, transparent 65%)" }}
          />

          {/* Active tag */}
          <div className="absolute top-0 right-0">
            <div
              className="px-3 py-1 font-hud text-[0.5rem] text-[var(--void)] rounded-bl-xl rounded-tr-2xl"
              style={{ background: "var(--neon)" }}
            >
              ACTIVE
            </div>
          </div>

          <div className="flex items-start gap-4 mb-6">
            {/* Code bracket icon — no emoji */}
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 font-mono text-xl font-bold"
              style={{
                background: "var(--neon-10)",
                border: "1px solid var(--border-mid)",
                color: "var(--neon)"
              }}
            >
              {"</>"}
            </div>
            <div>
              <p className="font-hud text-[0.5rem] tracking-[0.2em] text-[var(--neon)] mb-1">
                MISSION DOSSIER
              </p>
              <h3 className="font-title text-2xl text-[var(--text)]">C++ MASTERY</h3>
            </div>
          </div>

          <p className="text-[var(--text-muted)] text-sm leading-relaxed mb-6">
            A structured path to learn C++ from fundamentals to advanced problem solving
            through stages, challenges, XP and AI-powered hints.
          </p>

          {/* Progress block */}
          <div
            className="mb-6 p-4 rounded-xl"
            style={{ background: "rgba(0,0,0,0.3)", border: "1px solid var(--border)" }}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-hud text-[0.55rem] tracking-widest text-[var(--text-muted)]">
                COMPLETION
              </span>
              <span className="font-hud text-[0.65rem] text-[var(--neon)]">
                {solvedProblems}/{totalProblems} · {completionPct}%
              </span>
            </div>
            <div className="h-2.5 prog-track">
              <motion.div
                className="prog-fill h-full"
                initial={{ width: 0 }}
                animate={{ width: `${completionPct}%` }}
                transition={{ duration: 1.2, delay: 0.5 }}
              />
            </div>
            <div className="flex justify-between mt-2">
              <span className="font-mono text-[0.5rem] text-[var(--text-muted)]">
                {stagesCompleted}/{(course || []).length} stages
              </span>
              <span className="font-mono text-[0.5rem] text-[var(--neon)]">
                {100 - completionPct}% remaining
              </span>
            </div>
          </div>

          <motion.button
            onClick={() => navigate("/")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="btn-primary w-full py-4 rounded-xl text-xs"
          >
            {hasStarted ? "▶ RESUME MISSION" : "▶ BEGIN MISSION"}
          </motion.button>
        </motion.div>

        </div>
      </div>
    </div>
  );
}