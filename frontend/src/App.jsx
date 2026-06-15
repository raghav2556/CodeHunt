import { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import AuthScreen from "./components/Authscreen";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import MainPanel from "./components/MainPanel";
import Profile from "./components/Profile";
import { useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -20 },
};

const ACHIEVEMENT_LABELS = {
  first:   { title: "First Blood",       icon: "🩸" },
  level3:  { title: "Apprentice Hunter", icon: "🏹" },
  streak3: { title: "Streak Starter",    icon: "🔥" },
  stage1:  { title: "Stage Conqueror",   icon: "👑" },
};

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const isDashboard = location.pathname === "/dashboard";

  // ─── AUTH ────────────────────────────────────────────────────────────────────
const [user, setUser] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const [authData, setAuthData] = useState({ username: "", email: "", password: "" });
   const [authMessage, setAuthMessage] = useState("");
const [authMessageType, setAuthMessageType] = useState("error");

  // ─── MAIN STATE ──────────────────────────────────────────────────────────────
  const [codeMap, setCodeMap] = useState({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [hint, setHint] = useState("");
  const [xp, setXp] = useState(0);
  const [xpGain, setXpGain] = useState(0);
  const prevXpRef = useRef(0);
  const saveTimeout = useRef(null);
  const [level, setLevel] = useState(1);
  const prevLevelRef = useRef(level);
  const [levelUp, setLevelUp] = useState(false);
  const [progress, setProgress] = useState({});
  const [showSuccessActions, setShowSuccessActions] = useState(false);
  const [streak, setStreak] = useState(0);
  const username = localStorage.getItem("username");
  const [otpVerified, setOtpVerified] = useState(false);
 

  const [currentTopicIndex, setCurrentTopicIndex] = useState(0);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [currentView, setCurrentView] = useState("topic");
  const [stageCompleted, setStageCompleted] = useState(false);
  const [achievements, setAchievements] = useState([]);
  const [newAchievement, setNewAchievement] = useState(null);
  const [course, setCourse] = useState(null);

  useEffect(() => {
  const checkAuth = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/me",
        {
          credentials: "include",
        }
      );

      if (res.status === 401) {
  setUser(null);
  return;
}

      const data = await res.json();

      setUser(data);

      localStorage.setItem(
        "username",
        data.username
      );

    } catch (err) {
      console.log(err);
    }
  };

  checkAuth();
}, []);

  const topics = course || [];
const topic = topics?.[currentTopicIndex] || null;
const problem = topic?.problems?.[currentProblemIndex] || null;
const currentStage = currentTopicIndex;
const currentStageName = topic?.topicName || "";
const key = `${currentTopicIndex}-${currentProblemIndex}`;

  // ─── LOAD PROGRESS ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (!user) return;

    const loadProgress = async () => {
      try {
        const progressRes = await fetch("http://localhost:5000/load-progress", {
         credentials: "include",
        });
        const progressData = await progressRes.json();
        setProgress(progressData.progress || {});
        setXp(progressData.xp ?? 0);
        setLevel(progressData.level ?? 1);
        setStreak(progressData.streak ?? 0);
        setAchievements(progressData.achievements || []);

        const codeRes = await fetch("http://localhost:5000/load-code", {
          credentials: "include",
        });
        const codeData = await codeRes.json();
        setCodeMap(codeData.codeMap || {});
      } catch {
        console.log("Failed to load user data");
      }
    };

    loadProgress();
  }, [user]);

  // Reset UI when changing problem
  useEffect(() => {
    setShowSuccessActions(false);
    setResult(null);
    setHint("");
  }, [currentTopicIndex, currentProblemIndex]);

  useEffect(() => {
    setStageCompleted(false);
    setCurrentProblemIndex(0);
  }, [currentTopicIndex]);

  useEffect(() => {
    if (level > prevLevelRef.current) {
      setLevelUp(true);
      setTimeout(() => setLevelUp(false), 1500);
      checkAchievements();
    }
    prevLevelRef.current = level;
  }, [level]);

  useEffect(() => {
    if (xp > prevXpRef.current) {
      const gained = xp - prevXpRef.current;
      setXpGain(gained);
      setTimeout(() => setXpGain(0), 1200);
    }
    prevXpRef.current = xp;
  }, [xp]);

  useEffect(() => {
    const loadCourse = async () => {
      const res = await fetch("http://localhost:5000/course/cpp");
      const data = await res.json();
      setCourse(data.topics);
    };
    loadCourse();
  }, []);

  // ─── AUTH HANDLER ────────────────────────────────────────────────────────────
  const handleAuth = async () => {
    const payload = {
  ...authData,
  username: authData.username.trim(),
  email: authData.email.trim().toLowerCase(),
  password: authData.password
};

  const endpoint =
    isLogin ? "login" : "signup";

  try {

    const response = await fetch(
      `http://localhost:5000/${endpoint}`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify(payload),
      }
    );

    const data = await response.json();

    if (response.ok && isLogin && data.username) {

      localStorage.setItem(
        "username",
        data.username
      );

      setUser(data);

      navigate("/dashboard");

      return;
    }

    if (response.ok && !isLogin) {

      setAuthMessageType("success");

      setAuthMessage(
        "Account created successfully. Please login."
      );

      setIsLogin(true);

      return;
    }

    setAuthMessageType("error");

    setAuthMessage(
      data.message || "Something went wrong"
    );

  } catch {

    setAuthMessageType("error");

    setAuthMessage(
      "Server not reachable"
    );

  }
};

const logout = async () => {

  await fetch(
    "http://localhost:5000/logout",
    {
      method: "POST",
      credentials: "include"
    }
  );

  localStorage.removeItem("username");

  setUser(null);

  setAuthData({
    username: "",
    email: "",
    password: ""
  });

  setAuthMessage("");

  setIsLogin(true);

  setCurrentTopicIndex(0);
  setCurrentProblemIndex(0);
  setCurrentView("topic");
};

  // ─── NOT LOGGED IN ───────────────────────────────────────────────────────────
 if (!user) {
  return (
    <AuthScreen
  isLogin={isLogin}
  setIsLogin={setIsLogin}
  authData={authData}
  setAuthData={setAuthData}
  handleAuth={handleAuth}
  authMessage={authMessage}
  authMessageType={authMessageType}
  setAuthMessage={setAuthMessage}
  setAuthMessageType={setAuthMessageType}
  otpVerified={otpVerified}
  setOtpVerified={setOtpVerified}

/>
  );
}

  // ─── LOADING SCREEN (course not yet fetched) ─────────────────────────────────
  if (user && !course) {
    return (
      <div
        className="h-screen flex flex-col items-center justify-center relative overflow-hidden"
        style={{ background: "var(--void)" }}
      >
        <div className="absolute inset-0 bg-dot-grid opacity-30 pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 flex flex-col items-center gap-6"
        >
          {/* Pulsing ring */}
          <div className="relative w-16 h-16">
            <div
              className="absolute inset-0 rounded-full animate-pulse-ring"
              style={{
                border: "2px solid var(--neon-40)",
              }}
            />
            <div
              className="absolute inset-2 rounded-full"
              style={{
                border: "2px solid var(--neon)",
                boxShadow: "0 0 16px var(--neon-glow)",
              }}
            />
            <div
              className="absolute inset-0 flex items-center justify-center font-hud text-lg"
              style={{ color: "var(--neon)" }}
            >
              ◆
            </div>
          </div>

          <div className="text-center">
            <p
              className="font-hud text-[0.65rem] tracking-[0.28em] mb-1"
              style={{ color: "var(--neon)" }}
            >
              CODEHUNT
            </p>
            <p className="font-mono text-[0.6rem] text-[var(--text-muted)] tracking-widest">
              LOADING MISSION DATA
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              >
                ...
              </motion.span>
            </p>
          </div>

          {/* Skeleton cards */}
          <div className="w-80 space-y-3 mt-4">
            {[100, 80, 60].map((w, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.12 }}
                className="rounded-xl h-10"
                style={{
                  width: `${w}%`,
                  background:
                    "linear-gradient(90deg, var(--card) 25%, var(--elevated) 50%, var(--card) 75%)",
                  backgroundSize: "200% 100%",
                  animation: `shimmer 1.6s infinite ${i * 0.2}s`,
                  border: "1px solid var(--border)",
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    );
  }


  const defaultTemplate = `#include <bits/stdc++.h>
using namespace std;

int main() {
    



    return 0;
}`;

  const code = codeMap[key] || defaultTemplate;

  // ─── ACHIEVEMENT CHECK ───────────────────────────────────────────────────────
  async function checkAchievements(updatedProgress = progress) {
    const unlocked = [];

    if (Object.keys(updatedProgress).length >= 1 && !achievements.includes("first")) {
      unlocked.push("first");
    }
    if (level >= 3 && !achievements.includes("level3")) {
      unlocked.push("level3");
    }
    if (streak >= 3 && !achievements.includes("streak3")) {
      unlocked.push("streak3");
    }

    const totalProblems = topic?.problems?.length || 0;
    const solvedCount =
      topic?.problems?.filter((_, i) => updatedProgress[`${currentTopicIndex}-${i}`]).length || 0;

    if (totalProblems > 0 && solvedCount === totalProblems && !achievements.includes("stage1")) {
      unlocked.push("stage1");
    }

    if (unlocked.length > 0) {
      const updated = [...achievements, ...unlocked];

      await fetch("http://localhost:5000/save-achievements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ achievements: updated }),
      });

      setAchievements(updated);
      setNewAchievement(unlocked[0]);
      setTimeout(() => setNewAchievement(null), 3000);
    }
  }

  // ─── RUN CODE ────────────────────────────────────────────────────────────────
  const runCode = async () => {
    if (!problem?.testCases) return;

    setLoading(true);
    setResult(null);
    setHint("");

    try {
      const response = await fetch("http://localhost:5000/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          code,
          testCases: problem.testCases,
          problemKey: `${currentTopicIndex}-${currentProblemIndex}`,
        }),
      });

      const data = await response.json();

      if (data.error) {
        setResult([{ input: "", expected: "", output: data.error, passed: false }]);
        setLoading(false);
        return;
      }

      if (data.results) {
        setResult(data.results);
        window.dispatchEvent(new Event("submissionUpdated"));

        const allPassed = data.results.every(r => r.passed);
        const key = `${currentTopicIndex}-${currentProblemIndex}`;

        if (allPassed) {
          setShowSuccessActions(true);

          if (!progress[key]) {
            const saveResponse = await fetch("http://localhost:5000/save-progress", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
              body: JSON.stringify({ problemKey: key, xpEarned: problem.xp }),
            });

            if (saveResponse.ok) {
              const saveData = await saveResponse.json();
              setProgress(saveData.progress || {});
              setXp(saveData.xp ?? 0);
              setLevel(saveData.level ?? 1);
              setStreak(saveData.streak ?? 0);
              checkAchievements(saveData.progress || {});
            }

            const totalProblems = topic.problems.length;
            const solvedCount = topic.problems.filter((_, i) =>
              progress[`${currentTopicIndex}-${i}`] || i === currentProblemIndex
            ).length;

            if (solvedCount === totalProblems) {
              setStageCompleted(true);
            }
          }
        }
      }
    } catch {
      setResult([{ input: "", expected: "", output: "Server error", passed: false }]);
    }

    setLoading(false);
  };

  // ─── GET HINT ────────────────────────────────────────────────────────────────
  const getHint = async () => {
    const failedTest = result?.find(t => !t.passed);
    const mode = failedTest ? "debug" : "start";

    try {
      const response = await fetch("http://localhost:5000/hint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ code, problem, failedTest, mode }),
      });
      const data = await response.json();
      setHint(data.hint);
    } catch {
      setHint("Hint service unavailable.");
    }
  };

  // ─── RENDER ───────────────────────────────────────────────────────────────────
  return (
    <div
      className="h-screen flex flex-col overflow-hidden"
      style={{ background: "var(--void)", color: "var(--text)" }}
    >
      <Navbar
        level={level || 1}
        xp={xp || 0}
        streak={streak || 0}
        stage={isDashboard ? undefined : currentStage || 0}
        stageName={isDashboard ? "" : currentStageName || ""}
        logout={logout}
        levelUp={levelUp}
        username={username}
      />

      <div className="flex flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>

            {/* Dashboard */}
            <Route
              path="/dashboard"
              element={
                <motion.div
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.25 }}
                  className="flex-1 overflow-auto"
                >
                  <Dashboard
                    progress={progress}
                    username={username}
                    xp={xp}
                    level={level}
                    streak={streak}
                    course={course}
                  />
                </motion.div>
              }
            />

            {/* Main course view */}
            <Route
              path="/"
              element={
                <motion.div
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.25 }}
                  className="flex flex-1 overflow-hidden"
                >
                  <Sidebar
                    topics={topics}
                    progress={progress}
                    setCurrentTopicIndex={setCurrentTopicIndex}
                    setCurrentView={setCurrentView}
                  />
                  <MainPanel
                    topic={topic}
                    problem={problem}
                    currentView={currentView}
                    setCurrentView={setCurrentView}
                    code={code}
                    setCode={(value) => {
                      setCodeMap(prev => ({ ...prev, [key]: value }));

                      if (saveTimeout.current) clearTimeout(saveTimeout.current);

                      saveTimeout.current = setTimeout(() => {
                        fetch("http://localhost:5000/save-code", {
                                method: "POST",
                                credentials: "include",
                                headers: {
                                   "Content-Type": "application/json",
                                },
                               body: JSON.stringify({
                               problemKey: key,
                               code: value,
                               }),
                           });
                      }, 2000);
                    }}
                    runCode={runCode}
                    loading={loading}
                    result={result}
                    hint={hint}
                    getHint={getHint}
                    showSuccessActions={showSuccessActions}
                    setCurrentProblemIndex={setCurrentProblemIndex}
                    currentProblemIndex={currentProblemIndex}
                    stageCompleted={stageCompleted}
                    xpGain={xpGain}
                    progress={progress}
                    currentTopicIndex={currentTopicIndex}
                  />
                </motion.div>
              }
            />

            {/* Profile */}
            <Route
              path="/profile"
              element={
                <motion.div
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.25 }}
                  className="flex-1 overflow-y-auto"
                >
                  <Profile
                    level={level}
                    xp={xp}
                    streak={streak}
                    progress={progress}
                    achievements={achievements}
                    course={course}
                  />
                </motion.div>
              }
            />
          </Routes>
        </AnimatePresence>
      </div>

      {/* ─── Achievement toast ─── */}
      <AnimatePresence>
        {newAchievement && (() => {
          const ach = ACHIEVEMENT_LABELS[newAchievement];
          return (
            <motion.div
              key={newAchievement}
              initial={{ opacity: 0, x: 80, scale: 0.92 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 80, scale: 0.92 }}
              transition={{ type: "spring", stiffness: 280, damping: 22 }}
              className="fixed top-20 right-5 z-50 rounded-xl px-5 py-4 min-w-[220px]"
              style={{
                background: "var(--card)",
                border: "1px solid var(--neon-40)",
                boxShadow: "0 0 30px var(--neon-10), 0 8px 32px rgba(0,0,0,0.5)",
              }}
            >
              {/* Top accent line */}
              <div
                className="absolute top-0 left-0 right-0 h-0.5 rounded-t-xl"
                style={{ background: "linear-gradient(90deg, var(--neon), transparent)" }}
              />
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                  style={{ background: "var(--neon-10)", border: "1px solid var(--border-mid)" }}
                >
                  {ach?.icon || "🏆"}
                </div>
                <div>
                  <p className="font-hud text-[0.55rem] tracking-[0.2em] text-[var(--neon)] mb-0.5">
                    ACHIEVEMENT UNLOCKED
                  </p>
                  <p className="font-title text-sm text-[var(--text)]">
                    {ach?.title || newAchievement}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })()}
      </AnimatePresence>

      {/* ─── Footer ─── */}
      <footer
        className="shrink-0 flex items-center justify-center h-7"
        style={{
          borderTop: "1px solid var(--border)",
          background: "rgba(4,11,20,0.95)",
        }}
      >
        <p className="font-hud text-[0.5rem] tracking-[0.22em] text-[var(--text-muted)]">
          © 2026 CODEHUNT — HUNT KNOWLEDGE · LEVEL UP · MASTER C++
        </p>
      </footer>
    </div>
  );
}

