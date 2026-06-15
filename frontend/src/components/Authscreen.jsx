import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiEye, FiEyeOff } from "react-icons/fi";

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

export default function AuthScreen({ isLogin, setIsLogin, authData, setAuthData, handleAuth, authMessage,
  authMessageType, setAuthMessage, setAuthMessageType, otpVerified, setOtpVerified
 }) {


  useEffect(() => {

  if (isLogin) {

    setOtp("");
    setOtpSent(false);
    setOtpVerified(false);
    setResendTimer(0);

  }

}, [isLogin]);

   const [otp, setOtp] = useState("");
const [otpSent, setOtpSent] = useState(false);
const [resendTimer, setResendTimer] = useState(0);
const [showPassword, setShowPassword] = useState(false);

useEffect(() => {

  if (resendTimer <= 0) return;

  const interval = setInterval(() => {
    setResendTimer((prev) => prev - 1);
  }, 1000);

  return () => clearInterval(interval);

}, [resendTimer]);

//Send OTP
const sendOtp = async () => {
  const username = authData.username.trim();
const email = authData.email.trim().toLowerCase();
const password = authData.password;

   if (authData.username.trim().length < 3) {

    setAuthMessageType("error");

    setAuthMessage(
      "Username must be at least 3 characters"
    );

    return;
  }

  if (authData.username.length > 30) {

    setAuthMessageType("error");

    setAuthMessage(
      "Username cannot exceed 30 characters"
    );

    return;
  }

  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(authData.email)) {

    setAuthMessageType("error");

    setAuthMessage(
      "Please enter a valid email address"
    );

    return;
  }

  if (authData.password.length < 8) {

    setAuthMessageType("error");

    setAuthMessage(
      "Password must be at least 8 characters"
    );

    return;
  }

  if (authData.password.length > 64) {

    setAuthMessageType("error");

    setAuthMessage(
      "Password cannot exceed 64 characters"
    );

    return;
  }

  try {

    const response = await fetch(
      "http://localhost:5000/send-otp",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
  username,
  email,
  password
})
      }
    );

    const data = await response.json();

    setAuthMessageType(
      response.ok ? "success" : "error"
    );

    setAuthMessage(data.message);

    if (response.ok) {

  setOtpSent(true);

  setOtp("");

  setOtpVerified(false);

  setResendTimer(60);

}

  } catch {

    setAuthMessageType("error");

    setAuthMessage(
      "Failed to send OTP"
    );

  }

};

//Verify OTP
const verifyOtp = async () => {
  const email = authData.email.trim().toLowerCase();
const cleanOtp = otp.trim();

  try {

    const response = await fetch(
      "http://localhost:5000/verify-otp",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
  email,
  otp: cleanOtp
})
      }
    );

    const data = await response.json();

    setAuthMessageType(
      response.ok ? "success" : "error"
    );

    setAuthMessage(data.message);

    if (response.ok) {
      setOtpVerified(true);
    }

  } catch {

    setAuthMessageType("error");

    setAuthMessage(
      "OTP verification failed"
    );

  }

};

//Validate and Submit
  const validateAndSubmit = () => {

  if (!isLogin) {

    if (authData.username.trim().length < 3) {

      setAuthMessageType("error");

      setAuthMessage(
        "Username must be at least 3 characters"
      );

      return;
    }

    if (authData.username.length > 30) {

      setAuthMessageType("error");

      setAuthMessage(
        "Username cannot exceed 30 characters"
      );

      return;
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(authData.email)) {

      setAuthMessageType("error");

      setAuthMessage(
        "Please enter a valid email address"
      );

      return;
    }

    if (authData.password.length < 8) {

      setAuthMessageType("error");

      setAuthMessage(
        "Password must be at least 8 characters"
      );

      return;
    }

    if (authData.password.length > 64) {

      setAuthMessageType("error");

      setAuthMessage(
        "Password cannot exceed 64 characters"
      );

      return;
    }
  }

  if (!isLogin && !otpVerified) {

  setAuthMessageType("error");

  setAuthMessage(
    "Please verify your email first"
  );

  return;
}

  handleAuth();
};
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
                onClick={() => {

  setAuthMessage("");

  setOtp("");
  setOtpSent(false);
  setOtpVerified(false);
  setResendTimer(0);
  setShowPassword(false);

  setAuthData({
    username: "",
    email: "",
    password: ""
  });

  setIsLogin(i === 0);

}}
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
                    onChange={e => {
  setAuthMessage("");
  setAuthData({
    ...authData,
    username: e.target.value
  });
}}
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
                  onChange={e => {
  setAuthMessage("");
  setAuthData({
    ...authData,
    email: e.target.value
  });
  setOtp("");
setOtpSent(false);
setOtpVerified(false);
setResendTimer(0);
}}
                  className={inputClass("email")}
                />
              </div>

              <div className="relative">
  <input
    type={showPassword ? "text" : "password"}
    placeholder="••••••••••"
    value={authData.password}
    onFocus={() => setFocused("password")}
    onBlur={() => setFocused(null)}
    onChange={e => {
      setAuthMessage("");
      setAuthData({
        ...authData,
        password: e.target.value
      });
    }}
    onKeyDown={e =>
      e.key === "Enter" && validateAndSubmit()
    }
    className={`${inputClass("password")} pr-12`}
  />

  <button
    type="button"
    onClick={() => setShowPassword(prev => !prev)}
    className="
      absolute
      right-4
      top-1/2
      -translate-y-1/2
      text-[var(--text-muted)]
      hover:text-[var(--neon)]
      transition-colors
    "
  >
    {showPassword ? (
      <FiEyeOff size={18} />
    ) : (
      <FiEye size={18} />
    )}
  </button>
</div>
              {!isLogin && (
  <div className="space-y-3">

    {!otpSent ? (

      <motion.button
        onClick={sendOtp}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        className="btn-primary w-full py-3 rounded-xl text-xs"
      >
        ✉ SEND OTP
      </motion.button>

    ) : (

      <>
        <input
          type="text"
          placeholder="Enter verification code"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className={inputClass("otp")}
          maxLength={6}
        />

        <div className="flex gap-3">

          <motion.button
            onClick={verifyOtp}
            disabled={otpVerified}
            whileHover={{ scale: otpVerified ? 1 : 1.02 }}
            whileTap={{ scale: otpVerified ? 1 : 0.97 }}
            className={`
              flex-1
              py-3
              rounded-xl
              text-xs
              font-hud
              transition-all
              ${
                otpVerified
                  ? "bg-green-500/20 text-green-300 border border-green-500/30"
                  : "btn-primary"
              }
            `}
          >
            {otpVerified ? "✓ VERIFIED" : "✓ VERIFY"}
          </motion.button>

          <motion.button
            onClick={sendOtp}
            disabled={resendTimer > 0 || otpVerified}
            whileHover={{
              scale:
                resendTimer > 0 || otpVerified
                  ? 1
                  : 1.02
            }}
            whileTap={{
              scale:
                resendTimer > 0 || otpVerified
                  ? 1
                  : 0.97
            }}
            className="
              px-4
              rounded-xl
              border
              border-[rgba(0,212,255,0.25)]
              bg-[rgba(0,212,255,0.05)]
              text-[var(--cyan)]
              text-xs
              font-hud
              disabled:opacity-50
              disabled:cursor-not-allowed
            "
          >
            {otpVerified
              ? "DONE"
              : resendTimer > 0
                ? `${resendTimer}s`
                : "RESEND"}
          </motion.button>

        </div>
      </>

    )}

  </div>
)}
             <AnimatePresence>
  {authMessage && (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className={`
        rounded-xl
        px-4
        py-3
        border
        ${
          authMessageType === "success"
            ? "border-green-500/30 bg-green-500/10"
            : "border-red-500/30 bg-red-500/10"
        }
      `}
    >
      <p
        className={`
          text-xs
          font-mono
          tracking-wide
          ${
            authMessageType === "success"
              ? "text-green-300"
              : "text-red-300"
          }
        `}
      >
        {authMessageType === "success"
          ? "✓"
          : "⚠"}{" "}
        {authMessage}
      </p>
    </motion.div>
  )}
</AnimatePresence>

              {/* Submit */}
              <motion.button
                onClick={validateAndSubmit}
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
           onClick={() => {

  setAuthMessage("");

  setOtp("");
  setOtpSent(false);
  setOtpVerified(false);
  setResendTimer(0);
  setShowPassword(false);

  setAuthData({
    username: "",
    email: "",
    password: ""
  });

  setIsLogin(!isLogin);

}}
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