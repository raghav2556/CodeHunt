import { motion } from "framer-motion";

export default function Sidebar({ topics, progress, setCurrentTopicIndex, setCurrentView }) {

  const getTopicProgress = (tIndex) => {
    const total = topics[tIndex].problems.length;
    const solved = topics[tIndex].problems.filter((_, pIndex) =>
      progress[`${tIndex}-${pIndex}`]
    ).length;
    return { solved, total };
  };

  const isTopicUnlocked = (tIndex) => {
    if (tIndex === 0) return true;
    const { solved, total } = getTopicProgress(tIndex - 1);
    return solved === total && total > 0;
  };

  const totalSolved = Object.keys(progress || {}).length;
  const totalAll = topics.reduce((s, t) => s + t.problems.length, 0);

  return (
    <aside
      className="w-[270px] shrink-0 flex flex-col overflow-y-auto"
      style={{
        background: "linear-gradient(180deg, var(--void) 0%, rgba(7,18,36,0.9) 100%)",
        borderRight: "1px solid var(--border)"
      }}
    >
      {/* Header */}
      <div className="px-4 pt-5 pb-4 shrink-0">
        <p className="font-hud text-[0.55rem] tracking-[0.22em] text-[var(--neon)] uppercase mb-2">
          ◆ LEARNING PATH
        </p>
        <div className="divider-neon" />

        {/* Overall progress */}
        <div className="mt-3 flex items-center justify-between mb-1.5">
          <span className="font-mono text-[0.6rem] text-[var(--text-muted)]">OVERALL</span>
          <span className="font-hud text-[0.6rem] text-[var(--neon)]">
            {totalSolved}/{totalAll}
          </span>
        </div>
        <div className="h-1.5 prog-track">
          <motion.div
            className="prog-fill h-full"
            initial={{ width: 0 }}
            animate={{ width: totalAll > 0 ? `${(totalSolved / totalAll) * 100}%` : "0%" }}
            transition={{ duration: 1 }}
          />
        </div>
      </div>

      {/* Stage list */}
      <div className="flex-1 px-3 pb-5 space-y-2">
        {topics.map((topic, tIndex) => {
          const { solved, total } = getTopicProgress(tIndex);
          const completed = solved === total && total > 0;
          const unlocked = isTopicUnlocked(tIndex);
          const pct = total > 0 ? Math.round((solved / total) * 100) : 0;

          return (
            <motion.button
              key={tIndex}
              disabled={!unlocked}
              onClick={() => {
                setCurrentTopicIndex(tIndex);
                setCurrentView("topic");
              }}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: tIndex * 0.04 }}
              whileHover={unlocked ? { x: 3 } : {}}
              whileTap={unlocked ? { scale: 0.98 } : {}}
              className={`relative w-full text-left rounded-xl px-4 py-3.5 transition-all duration-200
              ${unlocked
                  ? completed
                    ? "card card-active"
                    : "card hover:border-[var(--border-mid)]"
                  : "opacity-30 cursor-not-allowed"
                }`}
              style={unlocked && !completed ? {} : completed ? {} : { filter: "grayscale(0.6)" }}
            >
              {/* Completed glow bar */}
              {completed && (
                <div
                  className="absolute inset-y-0 left-0 w-0.5 rounded-l-xl"
                  style={{ background: "var(--neon)", boxShadow: "0 0 8px var(--neon)" }}
                />
              )}

              {/* Stage header */}
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className={`font-hud text-[0.55rem] tracking-[0.15em] ${
                    completed ? "text-[var(--neon)]" : unlocked ? "text-[var(--text-muted)]" : "text-[var(--text-muted)]"
                  }`}>
                    STAGE {tIndex + 1}
                  </span>
                  {completed && (
                    <span className="badge badge-neon" style={{ fontSize: "0.5rem" }}>✓ DONE</span>
                  )}
                  {!unlocked && (
                    <span className="badge" style={{
                      fontSize: "0.5rem",
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "rgba(255,255,255,0.3)"
                    }}>🔒</span>
                  )}
                </div>
                <span className={`font-hud text-[0.6rem] ${completed ? "text-[var(--neon)]" : "text-[var(--text-muted)]"}`}>
                  {pct}%
                </span>
              </div>

              {/* Topic name */}
              <p className={`font-title text-sm leading-tight mb-2.5 ${
                unlocked ? "text-[var(--text)]" : "text-[var(--text-muted)]"
              }`}>
                {topic.topicName}
              </p>

              {/* Progress bar */}
              <div className="h-1 prog-track">
                <motion.div
                  className="prog-fill h-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.8, delay: tIndex * 0.05 }}
                />
              </div>

              {/* Count */}
              <div className="mt-1.5 flex justify-between items-center">
                <span className="font-mono text-[0.55rem] text-[var(--text-muted)]">
                  {solved}/{total} solved
                </span>
                {unlocked && !completed && (
                  <span className="font-mono text-[0.55rem] text-[var(--neon)]">
                    {total - solved} left
                  </span>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
    </aside>
  );
}