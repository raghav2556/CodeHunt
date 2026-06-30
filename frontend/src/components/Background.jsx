/**
 * Shared page background — dot grid + scanlines + ambient glow orbs.
 * This is the same treatment originally used on the AuthScreen, now
 * reused across every page so the whole app feels visually consistent.
 *
 * Render this as the first child of any `relative` (and ideally
 * `overflow-hidden` / `overflow-x-hidden`) container; it positions
 * itself with `absolute inset-0` and `pointer-events-none`, so it
 * never blocks clicks and real content just needs `relative z-10`.
 *
 * Use `compact` in narrower containers (e.g. the sidebar) so the glow
 * orbs don't read as flat color blocks.
 */
export default function Background({ compact = false }) {
  return (
    <>
      <div className="absolute inset-0 bg-dot-grid opacity-60 pointer-events-none" />
      <div className="scanlines" />
      <div
        className={`absolute top-1/3 left-1/4 ${compact ? "w-[220px] h-[220px]" : "w-[500px] h-[500px]"} rounded-full pointer-events-none`}
        style={{ background: "radial-gradient(circle, rgba(0,255,135,0.04) 0%, transparent 70%)" }}
      />
      <div
        className={`absolute bottom-1/4 right-1/3 ${compact ? "w-[180px] h-[180px]" : "w-[400px] h-[400px]"} rounded-full pointer-events-none`}
        style={{ background: "radial-gradient(circle, rgba(0,212,255,0.04) 0%, transparent 70%)" }}
      />
    </>
  );
}