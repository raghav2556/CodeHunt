import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import Background from "./Background";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [email,           setEmail]           = useState("");
  const [otp,             setOtp]             = useState("");
  const [password,        setPassword]        = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword,    setShowPassword]    = useState(false);
  const [otpSent,         setOtpSent]         = useState(false);
  const [message,         setMessage]         = useState("");
  const [messageType,     setMessageType]     = useState("");
  const [focused,         setFocused]         = useState(null);

  const inputBase =
    "w-full px-4 py-3 rounded-lg font-mono text-[var(--text)] placeholder-[rgba(212,237,223,0.2)] " +
    "bg-[rgba(0,0,0,0.45)] outline-none border transition-all duration-200 text-sm";

  const inputClass = (name) =>
    focused === name
      ? `${inputBase} border-[var(--neon-40)] shadow-[0_0_0_3px_rgba(0,255,135,0.08)] text-[var(--neon)]`
      : `${inputBase} border-[var(--border)]`;

  /* ─── Send OTP ─── */
  const sendOtp = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          purpose: "reset",
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setOtpSent(true);
        setMessageType("success");
        setMessage("An OTP has been sent to your registered email.");
      } else {
        setMessageType("error");
        setMessage(data.message);
      }
    } catch {
      setMessageType("error");
      setMessage("Server not reachable");
    }
  };

  /* ─── Update password ─── */
  const updatePassword = async () => {
    if (password.length < 8 || password.length > 64) {
      setMessageType("error");
      setMessage("Password must be 8–64 characters");
      return;
    }
    if (password !== confirmPassword) {
      setMessageType("error");
      setMessage("Passwords do not match");
      return;
    }

    const verifyRes = await fetch(`${import.meta.env.VITE_API_URL}/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        otp: otp.trim(),
        purpose: "reset",
      }),
    });
    const verifyData = await verifyRes.json();
    if (!verifyRes.ok) {
      setMessageType("error");
      setMessage(verifyData.message);
      return;
    }

    const resetRes = await fetch(`${import.meta.env.VITE_API_URL}/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        password,
      }),
    });
    const resetData = await resetRes.json();
    if (resetRes.ok) {
      setMessageType("success");
      setMessage("Password updated successfully");
      setTimeout(() => navigate("/"), 1500);
    } else {
      setMessageType("error");
      setMessage(resetData.message);
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[var(--void)] flex items-center justify-center px-6 py-10 relative">
      <Background />

      <div className="relative z-10 w-full max-w-md mx-auto">

        {/* ─── Logo + Header ─── */}
        <div className="text-center mb-8">
          <img
            src="/logo2.png"
            alt="CodeHunt"
            className="h-24 w-auto object-contain mx-auto mb-4 drop-shadow-[0_0_20px_rgba(0,255,135,0.25)]"
          />
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--neon)]" />
            <p className="text-[0.72rem] font-hud tracking-[0.22em] uppercase text-[var(--neon)]">
              Recovery Terminal
            </p>
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--neon)]" />
          </div>
          <p className="text-[0.58rem] tracking-[0.15em] uppercase text-[var(--text-muted)]">
            Secure Account Restoration
          </p>
        </div>

        {/* ─── Card ─── */}
        <div
          className="relative overflow-hidden rounded-3xl p-8 space-y-5 border border-[rgba(0,255,135,0.12)] bg-[rgba(2,12,27,0.82)] backdrop-blur-xl shadow-[0_0_40px_rgba(0,255,135,0.08)]"
        >
          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[var(--neon-40)] rounded-tl-3xl" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[var(--neon-40)] rounded-tr-3xl" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[var(--neon-40)] rounded-bl-3xl" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[var(--neon-40)] rounded-br-3xl" />

          <h1 className="text-center text-xl font-hud tracking-[0.18em] uppercase text-[var(--text)]">
            Password Recovery
          </h1>

          {/* Message */}
          {message && (
            <div
              className={`rounded-2xl px-5 py-4 text-sm font-mono border ${
                messageType === "success"
                  ? "bg-[rgba(0,255,135,0.08)] border-[rgba(0,255,135,0.2)] text-[var(--neon)]"
                  : "bg-[rgba(255,80,80,0.08)] border-[rgba(255,80,80,0.2)] text-red-300"
              }`}
            >
              {message}
            </div>
          )}

          {/* Email */}
          <input
            type="email"
            placeholder="Registered Email"
            value={email}
            readOnly={otpSent}
            onFocus={() => setFocused("email")}
            onBlur={() => setFocused(null)}
            onChange={e => setEmail(e.target.value)}
            className={`${inputClass("email")} ${otpSent ? "opacity-70 cursor-not-allowed" : ""}`}
          />

          {!otpSent ? (
            <button
              onClick={sendOtp}
              className="btn-primary w-full py-3.5 rounded-xl text-xs font-hud tracking-[0.18em]"
            >
              ▶ SEND OTP
            </button>
          ) : (
            <>
              {/* OTP input */}
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onFocus={() => setFocused("otp")}
                onBlur={() => setFocused(null)}
                onChange={e => setOtp(e.target.value)}
                className={inputClass("otp")}
              />

              {/* New password */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="New Passkey"
                  value={password}
                  onFocus={() => setFocused("password")}
                  onBlur={() => setFocused(null)}
                  onChange={e => setPassword(e.target.value)}
                  className={`${inputClass("password")} pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--neon)] transition-colors"
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>

              {/* Confirm password */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm Passkey"
                  value={confirmPassword}
                  onFocus={() => setFocused("confirmPassword")}
                  onBlur={() => setFocused(null)}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className={`${inputClass("confirmPassword")} pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--neon)] transition-colors"
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>

              <button
                onClick={updatePassword}
                className="btn-primary w-full py-3.5 rounded-xl text-xs font-hud tracking-[0.18em]"
              >
                ▶ UPDATE PASSWORD
              </button>
            </>
          )}

          {/* Back link */}
          <button
            onClick={() => navigate("/")}
            className="w-full text-[0.67rem] font-hud tracking-[0.15em] uppercase text-[var(--cyan)] hover:text-white transition-colors"
          >
            ← Back to Login
          </button>
        </div>

      </div>
    </div>
  );
}