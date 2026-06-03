import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion, AnimatePresence } from "framer-motion";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const DIFF = {
  easy:   { cls: "badge-neon",     label: "EASY" },
  medium: { cls: "badge-amber",    label: "MED"  },
  hard:   { cls: "badge-crimson",  label: "HARD" },
};
const diffBadge = (d) => DIFF[d] || { cls: "badge", label: (d || "").toUpperCase() };

const SUB_COLOR = {
  "Accepted":      "var(--neon)",
  "Wrong Answer":  "var(--crimson)",
  "Runtime Error": "var(--amber)",
  "Compile Error": "#FF7820",
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function MainPanel({
  topic,
  problem,
  currentView,
  setCurrentView,
  code,
  setCode,
  runCode,
  loading,
  result,
  hint,
  getHint,
  showSuccessActions,
  setCurrentProblemIndex,
  stageCompleted,
  xpGain,
  currentProblemIndex,
  progress,
  currentTopicIndex,
}) {
  const [isVisible, setIsVisible] = useState(true);
  const [submissions, setSubmissions] = useState([]);

  const loadSubmissions = async () => {
    const problemKey = `${currentTopicIndex}-${currentProblemIndex}`;
    const res = await fetch(`http://localhost:5000/submissions/${problemKey}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    const data = await res.json();
    setSubmissions(data);
  };

  useEffect(() => {
    setIsVisible(false);
    const t = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(t);
  }, [currentView, currentProblemIndex]);

  useEffect(() => { loadSubmissions(); }, [currentTopicIndex, currentProblemIndex]);

  useEffect(() => {
    const refresh = () => loadSubmissions();
    window.addEventListener("submissionUpdated", refresh);
    return () => window.removeEventListener("submissionUpdated", refresh);
  }, [currentTopicIndex, currentProblemIndex]);

  // ─── Loading ─────────────────────────────────────────────────────────────────
  if (!topic || !problem) {
    return (
      <div className="flex-1 flex items-center justify-center" style={{ background: "var(--void)" }}>
        <div className="text-center">
          <div
            className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin mx-auto mb-3"
            style={{ borderColor: "var(--neon)", borderTopColor: "transparent" }}
          />
          <p className="font-hud text-[0.6rem] tracking-[0.25em] text-[var(--text-muted)]">
            LOADING MISSION DATA...
          </p>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // TOPIC HOME VIEW
  // ─────────────────────────────────────────────────────────────────────────────
  if (currentView === "topic") {
    const totalProblems = topic.problems.length;
    const solvedCount = topic.problems.filter((_, i) =>
      progress?.[`${currentTopicIndex}-${i}`]
    ).length;
    const pct = totalProblems > 0 ? (solvedCount / totalProblems) * 100 : 0;

    return (
      <motion.div
        key="topic"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex-1 overflow-y-auto relative"
        style={{ background: "var(--void)" }}
      >
        <div className="absolute inset-0 bg-dot-grid opacity-25 pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto px-8 py-12">

          {/* Stage badge + title */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mb-10"
          >
            <span className="badge badge-neon mb-3 inline-block">
              STAGE {currentTopicIndex + 1}
            </span>
            <h1 className="font-title text-4xl text-[var(--text)] leading-tight mb-2">
              {topic.topicName}
            </h1>
            <p className="text-[var(--text-muted)] text-sm">Select your training mode to proceed.</p>
          </motion.div>

          {/* Progress card */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card rounded-xl p-5 mb-7"
          >
            <div className="flex justify-between items-center mb-2.5">
              <span className="font-hud text-[0.6rem] tracking-widest text-[var(--text-muted)]">
                STAGE PROGRESS
              </span>
              <span className="font-hud text-[0.65rem] text-[var(--neon)]">
                {solvedCount} / {totalProblems} SOLVED
              </span>
            </div>
            <div className="h-2 prog-track">
              <motion.div
                className="prog-fill h-full"
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.9, ease: "easeOut" }}
              />
            </div>
          </motion.div>

          {/* Action cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Notes card */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              whileHover={{ y: -3, transition: { duration: 0.18 } }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setCurrentView("notes")}
              className="card rounded-2xl p-7 cursor-pointer relative overflow-hidden card-hover"
            >
              <div
                className="absolute top-0 right-0 w-32 h-32 pointer-events-none rounded-full"
                style={{
                  background: "radial-gradient(circle, rgba(0,212,255,0.07) 0%, transparent 70%)",
                  transform: "translate(40%, -40%)",
                }}
              />
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-5"
                style={{
                  background: "var(--cyan-10)",
                  border: "1px solid rgba(0,212,255,0.25)",
                }}
              >
                📘
              </div>
              <h2 className="font-title text-xl text-[var(--text)] mb-2">Study Notes</h2>
              <p className="text-[var(--text-muted)] text-sm leading-relaxed mb-5">
                Learn concepts, syntax, and examples before tackling problems.
              </p>
              <div className="flex items-center gap-1.5" style={{ color: "var(--cyan)" }}>
                <span className="font-hud text-[0.6rem] tracking-widest">READ NOTES</span>
                <span className="text-xs">→</span>
              </div>
            </motion.div>

            {/* Problems card */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -3, transition: { duration: 0.18 } }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setCurrentView("list")}
              className="card rounded-2xl p-7 cursor-pointer relative overflow-hidden card-hover"
            >
              <div
                className="absolute top-0 right-0 w-32 h-32 pointer-events-none rounded-full"
                style={{
                  background: "radial-gradient(circle, rgba(0,255,135,0.07) 0%, transparent 70%)",
                  transform: "translate(40%, -40%)",
                }}
              />
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-5"
                style={{
                  background: "var(--neon-10)",
                  border: "1px solid var(--border-mid)",
                }}
              >
                💻
              </div>
              <h2 className="font-title text-xl text-[var(--text)] mb-2">Practice Problems</h2>
              <p className="text-[var(--text-muted)] text-sm leading-relaxed mb-5">
                Solve structured challenges, run code, earn XP.
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5" style={{ color: "var(--neon)" }}>
                  <span className="font-hud text-[0.6rem] tracking-widest">LAUNCH</span>
                  <span className="text-xs">→</span>
                </div>
                <span className="font-hud text-[0.6rem] text-[var(--neon)]">
                  {solvedCount}/{totalProblems}
                </span>
              </div>
            </motion.div>

          </div>
        </div>
      </motion.div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // NOTES VIEW
  // ─────────────────────────────────────────────────────────────────────────────
  if (currentView === "notes") {
    return (
      <motion.div
        key="notes"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex-1 overflow-y-auto"
        style={{ background: "var(--void)" }}
      >
        <div className="max-w-3xl mx-auto px-8 py-8">

          <button
            onClick={() => setCurrentView("topic")}
            className="btn-ghost px-4 py-2 rounded-lg font-hud text-xs mb-8
            inline-flex items-center gap-2"
          >
            ← BACK
          </button>

          <div className="mb-8">
            <span className="badge badge-neon mb-3 inline-block">
              STAGE {currentTopicIndex + 1} — FIELD MANUAL
            </span>
            <h1 className="font-title text-4xl mb-2" style={{ color: "var(--neon)" }}>
              {topic.topicName}
            </h1>
            <div className="divider-neon mt-4" />
          </div>

          <div className="notes-body">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ node, inline, className, children, ...props }) {
                  if (inline) {
                    return <code {...props}>{children}</code>;
                  }
                  return (
                    <pre>
                      <code className={className} {...props}>
                        {children}
                      </code>
                    </pre>
                  );
                },
              }}
            >
              {topic.notes}
            </ReactMarkdown>
          </div>

          <div className="mt-10 pt-6 border-t border-[var(--border)]">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setCurrentView("list")}
              className="btn-primary px-8 py-3 rounded-xl text-xs"
            >
              ▶ START PROBLEMS
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // PROBLEM LIST VIEW
  // ─────────────────────────────────────────────────────────────────────────────
  if (currentView === "list") {
    const totalProblems = topic.problems.length;
    const solvedCount = topic.problems.filter((_, i) =>
      progress?.[`${currentTopicIndex}-${i}`]
    ).length;

    return (
      <motion.div
        key="list"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex-1 overflow-y-auto"
        style={{ background: "var(--void)" }}
      >
        <div className="max-w-2xl mx-auto px-8 py-8">

          <button
            onClick={() => setCurrentView("topic")}
            className="btn-ghost px-4 py-2 rounded-lg font-hud text-xs mb-8
            inline-flex items-center gap-2"
          >
            ← BACK
          </button>

          {/* Header */}
          <div className="mb-6">
            <span className="badge badge-neon mb-3 inline-block">
              STAGE {currentTopicIndex + 1}
            </span>
            <h1 className="font-title text-3xl text-[var(--text)] mb-1">
              {topic.topicName}
            </h1>
            <p className="font-hud text-[0.6rem] text-[var(--text-muted)]">
              {solvedCount} / {totalProblems} MISSIONS COMPLETED
            </p>
          </div>

          {/* Problems list */}
          <div className="space-y-2">
            {topic.problems.map((prob, index) => {
              const key = `${currentTopicIndex}-${index}`;
              const prevKey = `${currentTopicIndex}-${index - 1}`;
              const isUnlocked = index === 0 || progress?.[prevKey];
              const solved = progress?.[key];
              const diff = diffBadge(prob.difficulty);

              return (
                <motion.button
                  key={index}
                  disabled={!isUnlocked}
                  onClick={() => {
                    if (isUnlocked) {
                      setCurrentProblemIndex(index);
                      setCurrentView("problem");
                    }
                  }}
                  initial={{ opacity: 0, x: -14 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={isUnlocked ? { x: 4, transition: { duration: 0.15 } } : {}}
                  whileTap={isUnlocked ? { scale: 0.99 } : {}}
                  className={`relative w-full text-left rounded-xl px-5 py-4 transition-all duration-200
                  ${isUnlocked
                    ? "card hover:border-[var(--border-mid)]"
                    : "opacity-25 cursor-not-allowed"
                  }`}
                  style={
                    solved
                      ? { borderColor: "var(--neon-40)", boxShadow: "0 0 0 1px var(--neon-20)" }
                      : {}
                  }
                >
                  {/* solved accent bar */}
                  {solved && (
                    <div
                      className="absolute inset-y-0 left-0 w-0.5 rounded-l-xl"
                      style={{ background: "var(--neon)", boxShadow: "0 0 6px var(--neon)" }}
                    />
                  )}

                  <div className="flex items-center justify-between gap-3">
                    {/* Left side */}
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className="w-7 h-7 rounded-lg flex items-center justify-center font-hud text-xs shrink-0"
                        style={{
                          background: solved ? "var(--neon-20)" : "rgba(255,255,255,0.04)",
                          border: `1px solid ${solved ? "var(--neon-40)" : "var(--border)"}`,
                          color: solved ? "var(--neon)" : "var(--text-muted)",
                        }}
                      >
                        {solved ? "✓" : index + 1}
                      </span>
                      <span className="font-title text-base text-[var(--text)] truncate">
                        {prob.title}
                      </span>
                    </div>

                    {/* Right side */}
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`badge ${diff.cls}`}>{diff.label}</span>
                      {prob.xp && (
                        <span className="badge badge-amber">{prob.xp} XP</span>
                      )}
                      {!isUnlocked && <span className="text-xs">🔒</span>}
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </motion.div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // PROBLEM / EDITOR VIEW
  // ─────────────────────────────────────────────────────────────────────────────
  const diff = diffBadge(problem.difficulty);
  const isCompileError =
    result?.length === 1 &&
    result[0].input === "" &&
    result[0].expected === "";

  return (
    <motion.div
      key={`problem-${currentProblemIndex}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.25 }}
      className="flex flex-1 overflow-hidden"
    >
      {/* ══════════════════════════════════════════════════════════
          LEFT PANEL — Problem description + results
      ══════════════════════════════════════════════════════════ */}
      <div
        className="w-1/2 flex flex-col overflow-y-auto"
        style={{ background: "var(--void)", borderRight: "1px solid var(--border)" }}
      >
        <div className="p-6 space-y-5">

          {/* Nav row */}
          <div className="flex items-center justify-between">
            <motion.button
              whileHover={{ x: -2 }}
              onClick={() => setCurrentView("list")}
              className="btn-ghost px-3 py-1.5 rounded-lg font-hud text-xs
              inline-flex items-center gap-1.5"
            >
              ← MISSIONS
            </motion.button>
            <span className="font-mono text-[0.6rem] text-[var(--text-muted)]">
              {currentProblemIndex + 1} / {topic.problems.length}
            </span>
          </div>

          {/* ── Problem card ── */}
          <div className="card rounded-xl p-5">
            <div className="flex items-start justify-between gap-3 mb-1">
              <h2 className="font-title text-[1.25rem] leading-snug text-[var(--text)]">
                {problem.title}
              </h2>
              <div className="flex items-center gap-2 shrink-0 pt-0.5">
                <span className={`badge ${diff.cls}`}>{diff.label}</span>
                {problem.xp && (
                  <span className="badge badge-amber">{problem.xp} XP</span>
                )}
              </div>
            </div>
            <div className="divider-subtle my-3" />
            <p className="text-[var(--text-muted)] text-sm leading-relaxed">
              {problem.description}
            </p>
          </div>

          {/* ── Test results ── */}
          <AnimatePresence>
            {!loading && result && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-3"
              >
                {/* Compile error */}
                {isCompileError ? (
                  <div
                    className="rounded-xl p-5"
                    style={{
                      background: "rgba(255,120,0,0.05)",
                      border: "1px solid rgba(255,120,0,0.3)",
                    }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span
                        className="badge"
                        style={{
                          background: "rgba(255,120,0,0.12)",
                          border: "1px solid rgba(255,120,0,0.4)",
                          color: "#FF7820",
                        }}
                      >
                        COMPILE ERROR
                      </span>
                    </div>
                    <pre
                      className="font-mono text-[0.7rem] overflow-x-auto whitespace-pre-wrap leading-relaxed"
                      style={{ color: "#FF7820" }}
                    >
                      {result[0].output}
                    </pre>
                  </div>
                ) : (
                  <>
                    {/* Summary pill */}
                    <div className="flex items-center gap-2">
                      <span
                        className="badge"
                        style={{
                          background: result.every(r => r.passed) ? "var(--neon-10)" : "var(--crimson-10)",
                          border: `1px solid ${result.every(r => r.passed) ? "var(--neon-40)" : "rgba(255,59,78,0.35)"}`,
                          color: result.every(r => r.passed) ? "var(--neon)" : "var(--crimson)",
                        }}
                      >
                        {result.every(r => r.passed)
                          ? `✓ ALL ${result.length} TESTS PASSED`
                          : `✗ ${result.filter(r => !r.passed).length}/${result.length} FAILED`}
                      </span>
                    </div>

                    {result.map((test, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.07 }}
                        className="rounded-xl overflow-hidden"
                        style={{
                          border: `1px solid ${test.passed ? "var(--neon-20)" : "rgba(255,59,78,0.22)"}`,
                        }}
                      >
                        {/* Header */}
                        <div
                          className="flex items-center justify-between px-4 py-2"
                          style={{
                            background: test.passed
                              ? "rgba(0,255,135,0.05)"
                              : "rgba(255,59,78,0.05)",
                          }}
                        >
                          <span className="font-hud text-[0.58rem] tracking-widest text-[var(--text-muted)]">
                            TEST CASE {i + 1}
                          </span>
                          <span
                            className="badge"
                            style={{
                              background: test.passed ? "var(--neon-10)" : "var(--crimson-10)",
                              border: `1px solid ${test.passed ? "var(--neon-40)" : "rgba(255,59,78,0.4)"}`,
                              color: test.passed ? "var(--neon)" : "var(--crimson)",
                            }}
                          >
                            {test.passed ? "✓ PASS" : "✗ FAIL"}
                          </span>
                        </div>

                        {/* Body */}
                        <div
                          className="px-4 py-3 space-y-2"
                          style={{ background: "rgba(0,0,0,0.25)" }}
                        >
                          {[
                            { label: "INPUT",    val: test.input || "—",      color: "var(--text-muted)" },
                            { label: "EXPECTED", val: test.expected,           color: "var(--neon)"       },
                            { label: "GOT",      val: test.output || "—",      color: test.passed ? "var(--neon)" : "var(--crimson)" },
                          ].map(row => (
                            <div key={row.label} className="flex items-start gap-3">
                              <span
                                className="font-hud text-[0.52rem] tracking-widest w-16 pt-0.5 shrink-0"
                                style={{ color: "var(--text-muted)" }}
                              >
                                {row.label}
                              </span>
                              <span
                                className="font-mono text-xs leading-relaxed break-all"
                                style={{ color: row.color }}
                              >
                                {row.val}
                              </span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Submission history ── */}
          {submissions.length > 0 && (
            <div className="card rounded-xl p-4">
              <p className="font-hud text-[0.55rem] tracking-[0.2em] text-[var(--neon)] mb-3">
                ◆ SUBMISSION LOG
              </p>
              <div className="space-y-1.5">
                {submissions.map((s, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between px-3 py-2 rounded-lg"
                    style={{ background: "rgba(0,0,0,0.3)" }}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ background: SUB_COLOR[s.status] || "var(--text-muted)" }}
                      />
                      <span
                        className="font-hud text-[0.6rem]"
                        style={{ color: SUB_COLOR[s.status] || "var(--text-muted)" }}
                      >
                        {s.status}
                      </span>
                    </div>
                    <span className="font-mono text-[0.55rem] text-[var(--text-muted)]">
                      {new Date(s.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Hint button ── */}
          {!loading && (!result || result.some(t => !t.passed)) && (
            <motion.button
              onClick={getHint}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="w-full py-3 rounded-xl font-hud text-xs transition-all duration-200"
              style={{
                background: "var(--purple-10)",
                border: "1px solid rgba(168,85,247,0.3)",
                color: "var(--purple)",
              }}
            >
              {!result ? "💡 REQUEST STARTING HINT" : "💡 REQUEST DEBUG HINT"}
            </motion.button>
          )}

          {/* ── Hint content ── */}
          <AnimatePresence>
            {hint && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="rounded-xl p-5"
                style={{
                  background: "var(--purple-10)",
                  border: "1px solid rgba(168,85,247,0.22)",
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="badge badge-purple">AI MENTOR</span>
                </div>
                <p className="text-[var(--text-muted)] text-sm leading-relaxed">{hint}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Success actions ── */}
          {showSuccessActions && (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex gap-3 flex-wrap"
            >
              {currentProblemIndex < topic.problems.length - 1 && (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setCurrentProblemIndex(prev => prev + 1)}
                  className="btn-primary px-6 py-2.5 rounded-xl text-xs"
                >
                  NEXT MISSION →
                </motion.button>
              )}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setCurrentView("notes")}
                className="btn-ghost px-5 py-2.5 rounded-xl font-hud text-xs"
              >
                ← NOTES
              </motion.button>
            </motion.div>
          )}

          {/* ── Stage completed ── */}
          {stageCompleted && (
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 18 }}
              className="rounded-xl p-6 text-center"
              style={{
                background: "var(--neon-10)",
                border: "1px solid var(--neon-40)",
                boxShadow: "0 0 40px var(--neon-10)",
              }}
            >
              <div className="text-4xl mb-3">🎓</div>
              <h2
                className="font-hud text-sm tracking-[0.2em] mb-2"
                style={{ color: "var(--neon)" }}
              >
                STAGE COMPLETE
              </h2>
              <p className="text-[var(--text-muted)] text-sm">
                All missions cleared. You've mastered this module.
              </p>
            </motion.div>
          )}

        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          RIGHT PANEL — Code editor
      ══════════════════════════════════════════════════════════ */}
      <div
        className="w-1/2 flex flex-col p-5"
        style={{ background: "var(--card)" }}
      >
        {/* Editor chrome bar */}
        <div
          className="flex items-center justify-between px-4 py-2 rounded-t-xl"
          style={{
            background: "rgba(0,0,0,0.5)",
            border: "1px solid var(--border)",
            borderBottom: "1px solid rgba(0,255,135,0.08)",
          }}
        >
          <div className="flex items-center gap-3">
            {/* Traffic lights */}
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full opacity-60" style={{ background: "var(--crimson)" }} />
              <div className="w-2.5 h-2.5 rounded-full opacity-60" style={{ background: "var(--amber)" }} />
              <div className="w-2.5 h-2.5 rounded-full opacity-60" style={{ background: "var(--neon)" }} />
            </div>
            <span className="font-mono text-[0.6rem] text-[var(--text-muted)]">solution.cpp</span>
          </div>
          <span className="badge badge-cyan" style={{ fontSize: "0.5rem" }}>C++17</span>
        </div>

        {/* Monaco editor */}
        <div
          className="flex-1 editor-wrap"
          style={{ borderRadius: "0 0 12px 12px", borderTop: "none", minHeight: 0 }}
        >
          <Editor
            height="100%"
            language="cpp"
            theme="vs-dark"
            value={code}
            onChange={(value) => setCode(value)}
            options={{
              fontSize: 13,
              fontFamily: "'Share Tech Mono', 'JetBrains Mono', 'Courier New', monospace",
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              padding: { top: 14, bottom: 14 },
              lineNumbersMinChars: 3,
              glyphMargin: false,
              folding: false,
            }}
          />
        </div>

        {/* Run section */}
        <div className="mt-4 flex items-center justify-between shrink-0">

          <div className="relative">
            <motion.button
              onClick={runCode}
              disabled={loading}
              whileHover={!loading ? { scale: 1.04 } : {}}
              whileTap={!loading ? { scale: 0.96 } : {}}
              className={`btn-primary px-8 py-3 rounded-xl text-xs ${
                loading ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full border-2 border-t-transparent animate-spin"
                    style={{ borderColor: "#040B14", borderTopColor: "transparent" }}
                  />
                  EXECUTING...
                </span>
              ) : (
                "▶  RUN CODE"
              )}
            </motion.button>

            {/* XP burst */}
            <AnimatePresence>
              {xpGain > 0 && (
                <motion.div
                  initial={{ opacity: 1, y: 0, scale: 1 }}
                  animate={{ opacity: 0, y: -52, scale: 1.25 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.1, ease: "easeOut" }}
                  className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1
                  pointer-events-none font-hud text-base whitespace-nowrap"
                  style={{
                    color: "var(--neon)",
                    textShadow: "0 0 14px var(--neon-glow)",
                  }}
                >
                  +{xpGain} XP
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Status indicator */}
          <AnimatePresence>
            {loading && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="font-hud text-[0.6rem] tracking-widest animate-pulse"
                style={{ color: "var(--amber)" }}
              >
                ◆ JUDGING...
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}