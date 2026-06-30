import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

/* ─── Rank ladder (mirrors Navbar exactly) ───────────── */
const RANKS = [
  { minLevel: 1,  name: "RECRUIT",  icon: "⬡", color: "var(--text-muted)" },
  { minLevel: 3,  name: "HUNTER",   icon: "◈", color: "var(--neon)"       },
  { minLevel: 7,  name: "WARRIOR",  icon: "◉", color: "var(--cyan)"       },
  { minLevel: 15, name: "ELITE",    icon: "◆", color: "var(--purple)"     },
  { minLevel: 25, name: "LEGEND",   icon: "★", color: "var(--amber)"      },
];
const getRank = (lvl) =>
  [...RANKS].reverse().find((r) => lvl >= r.minLevel) || RANKS[0];

/* ─── Stat card ──────────────────────────────────────── */
function StatCard({ label, value, icon, color, delay, sub }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="card rounded-xl p-5 relative overflow-hidden card-hover"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 100% 0%, ${color}15 0%, transparent 65%)`,
        }}
      />

      <div className="flex items-start justify-between mb-3 relative z-10">
        <span className="font-hud text-[0.52rem] tracking-[0.2em] text-[var(--text-muted)] uppercase">
          {label}
        </span>
        {/* Geometric icon — no emoji */}
        <span
          className="font-hud text-base leading-none"
          style={{ color }}
        >
          {icon}
        </span>
      </div>

      <div
        className="font-hud text-3xl font-bold relative z-10"
        style={{ color }}
      >
        {value}
      </div>

      {sub && (
        <div className="font-mono text-[0.57rem] text-[var(--text-muted)] mt-1 relative z-10">
          {sub}
        </div>
      )}
    </motion.div>
  );
}

/* ─── Achievement tile ───────────────────────────────── */
function AchievementTile({ name, desc, unlocked, accentColor, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={unlocked ? { y: -3 } : {}}
      className={`relative p-5 rounded-xl border transition-all duration-300 overflow-hidden ${
        unlocked
          ? "card achievement-glow"
          : "border-[var(--border)] bg-[rgba(0,0,0,0.25)] opacity-50"
      }`}
      style={
        unlocked
          ? { borderColor: `${accentColor}55` }
          : { filter: "grayscale(0.9)" }
      }
    >
      {/* Status ribbon */}
      {unlocked ? (
        <div className="absolute top-0 right-0">
          <div
            className="px-2.5 py-1 font-hud text-[0.48rem] text-[var(--void)] rounded-bl-lg rounded-tr-xl tracking-widest"
            style={{ background: accentColor }}
          >
            ✓ EARNED
          </div>
        </div>
      ) : (
        <div className="absolute top-0 right-0">
          <div className="px-2.5 py-1 font-hud text-[0.48rem] text-[var(--text-muted)] rounded-bl-lg rounded-tr-xl tracking-widest bg-[rgba(255,255,255,0.04)] border-l border-b border-[var(--border)]">
            ⊘ LOCKED
          </div>
        </div>
      )}

      {/* Accent dot */}
      <div
        className="w-2 h-2 rounded-full mb-3 mt-3"
        style={{ background: unlocked ? accentColor : "rgba(255,255,255,0.1)", boxShadow: unlocked ? `0 0 8px ${accentColor}` : "none" }}
      />

      <h3 className="font-title text-lg text-[var(--text)] mb-1">
        {name}
      </h3>
      <p className="font-mono text-[0.62rem] text-[var(--text-muted)] tracking-wider uppercase">
        {unlocked ? "Achievement unlocked" : desc}
      </p>
    </motion.div>
  );
}

/* ─── MAIN ───────────────────────────────────────────── */
export default function Profile({ level, xp, streak, progress, course }) {
  const navigate = useNavigate();

  /* ─── original logic preserved exactly ─── */
  const problemsSolved = Object.keys(progress || {}).length;

  const stagesCompleted = (course || []).filter((topic, tIndex) =>
    topic.problems.every((_, pIndex) => progress?.[`${tIndex}-${pIndex}`])
  ).length;

  const achievements = [
    {
      name: "First Blood",
      desc: "Solve your first problem",
      unlocked: problemsSolved >= 1,
      accentColor: "var(--crimson)"
    },
    {
      name: "Apprentice Hunter",
      desc: "Reach level 3",
      unlocked: level >= 3,
      accentColor: "var(--neon)"
    },
    {
      name: "Streak Starter",
      desc: "Maintain a 3-day streak",
      unlocked: streak >= 3,
      accentColor: "var(--amber)"
    },
    {
      name: "Stage Conqueror",
      desc: "Complete an entire stage",
      unlocked: stagesCompleted >= 1,
      accentColor: "var(--cyan)"
    },
  ];

  const rank     = getRank(level);
  const xpInLevel = (xp ?? 0) % 100;

  return (
    <div
      className="flex-1 overflow-y-auto relative"
      style={{ background: "var(--void)" }}
    >
      <div className="absolute inset-0 bg-dot-grid opacity-25 pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-8 py-10">

        {/* ─── Hero ─── */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="card rounded-2xl p-8 mb-10 relative overflow-hidden"
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at 100% 0%, rgba(0,255,135,0.06) 0%, transparent 65%)",
            }}
          />
          <div className="scanlines opacity-20" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <p className="font-hud text-[0.57rem] tracking-[0.25em] text-[var(--neon)] uppercase mb-2">
                ◆ OPERATIVE FILE ◆
              </p>
              <h1 className="font-title text-5xl text-gradient-neon mb-2">
                HUNTER PROFILE
              </h1>
              <p className="font-mono text-[0.67rem] text-[var(--text-muted)] tracking-wider uppercase">
                Track your growth · Hunt knowledge · Level up
              </p>
            </div>

            {/* Rank pill */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-4 px-6 py-4 rounded-xl"
              style={{
                background: "rgba(0,0,0,0.4)",
                border: "1px solid var(--border-mid)",
              }}
            >
              <div
                className="text-4xl"
                style={{
                  color: rank.color,
                  textShadow: `0 0 16px ${rank.color}`,
                }}
              >
                {rank.icon}
              </div>
              <div>
                <p className="font-hud text-[0.52rem] tracking-[0.2em] text-[var(--text-muted)] uppercase mb-0.5">
                  Current Rank
                </p>
                <p
                  className="font-hud text-xl font-bold tracking-widest"
                  style={{ color: rank.color }}
                >
                  {rank.name}
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* ─── Stat grid ─── */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
          <StatCard label="Level"  value={level}          icon="▲" color="var(--amber)"  delay={0.05} />
          <StatCard label="XP"     value={xp}             icon="◈" color="var(--cyan)"   delay={0.10} />
          <StatCard label="Streak" value={streak}         icon="↑" color="#FF7820"       delay={0.15} sub="days active" />
          <StatCard label="Solved" value={problemsSolved}  icon="✓" color="var(--neon)"   delay={0.20} sub="problems" />
          <StatCard label="Stages" value={stagesCompleted} icon="◆" color="var(--purple)" delay={0.25} sub="completed" />
        </div>

        {/* ─── XP Progress bar ─── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card rounded-xl p-6 mb-10 relative overflow-hidden"
        >
          <div className="flex justify-between items-center mb-3">
            <div>
              <p className="font-hud text-[0.57rem] tracking-[0.2em] text-[var(--text-muted)] uppercase mb-1">
                ◆ Progress to Next Level
              </p>
              <p className="font-title text-lg text-[var(--text)]">
                Level {level} →{" "}
                <span className="text-[var(--amber)]">Level {level + 1}</span>
              </p>
            </div>
            <div className="text-right">
              <p
                className="font-hud text-2xl font-bold"
                style={{ color: "var(--amber)" }}
              >
                {xpInLevel}
                <span className="text-[var(--text-muted)] text-sm font-normal"> / 100</span>
              </p>
              <p className="font-mono text-[0.57rem] text-[var(--text-muted)] tracking-wider">
                XP this level
              </p>
            </div>
          </div>

          <div className="h-3 prog-track">
            <motion.div
              className="prog-fill prog-fill-amber h-full"
              initial={{ width: 0 }}
              animate={{ width: `${xpInLevel}%` }}
              transition={{ duration: 1.2, delay: 0.4 }}
            />
          </div>

          <p className="font-mono text-[0.57rem] text-[var(--text-muted)] mt-2 tracking-wider">
            {100 - xpInLevel} XP needed for next level
          </p>
        </motion.div>

        {/* ─── Achievements ─── */}
        <div className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="flex items-center justify-between mb-5"
          >
            <div>
              <p className="font-hud text-[0.57rem] tracking-[0.25em] text-[var(--neon)] uppercase mb-1">
                ◆ HALL OF VALOR
              </p>
              <h2 className="font-title text-3xl text-[var(--text)]">ACHIEVEMENTS</h2>
            </div>
            <div
              className="px-3 py-1.5 rounded-lg font-hud text-[0.62rem] tracking-widest"
              style={{
                background: "var(--neon-10)",
                border: "1px solid var(--border-mid)",
                color: "var(--neon)",
              }}
            >
              {achievements.filter((a) => a.unlocked).length} / {achievements.length} EARNED
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((a, i) => (
              <AchievementTile
                key={a.name}
                name={a.name}
                desc={a.desc}
                unlocked={a.unlocked}
                accentColor={a.accentColor}
                delay={0.4 + i * 0.07}
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}