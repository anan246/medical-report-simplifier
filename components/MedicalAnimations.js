"use client";

/* ── DNA Double Helix ── */
export function DNAHelix({ className = "" }) {
  const nodes = Array.from({ length: 9 }, (_, i) => i);
  return (
    <div className={`relative w-16 h-48 ${className}`} style={{ perspective: "400px" }}>
      <div className="animate-dna w-full h-full" style={{ transformStyle: "preserve-3d", position: "relative" }}>
        {nodes.map((i) => {
          const y = (i / 8) * 100;
          const angle = (i / 8) * 360;
          const rad = (angle * Math.PI) / 180;
          const x1 = 50 + 38 * Math.cos(rad);
          const x2 = 50 - 38 * Math.cos(rad);
          const z1 = 38 * Math.sin(rad);
          const z2 = -38 * Math.sin(rad);
          const opacity = 0.5 + 0.5 * Math.abs(Math.cos(rad));
          return (
            <div key={i} className="absolute w-full" style={{ top: `${y}%` }}>
              {/* Left node */}
              <div
                className="absolute w-3.5 h-3.5 rounded-full bg-emerald-400 dark:bg-emerald-500"
                style={{
                  left: `${x1}%`,
                  transform: `translateX(-50%) translateZ(${z1}px)`,
                  opacity,
                  boxShadow: `0 0 8px rgba(16,185,129,${opacity * 0.6})`,
                }}
              />
              {/* Right node */}
              <div
                className="absolute w-3.5 h-3.5 rounded-full bg-teal-400 dark:bg-teal-500"
                style={{
                  left: `${x2}%`,
                  transform: `translateX(-50%) translateZ(${z2}px)`,
                  opacity,
                  boxShadow: `0 0 8px rgba(45,212,191,${opacity * 0.6})`,
                }}
              />
              {/* Connector */}
              <div
                className="absolute h-px bg-gradient-to-r from-emerald-300/60 via-slate-300/40 to-teal-300/60"
                style={{
                  left: `${Math.min(x1, x2)}%`,
                  width: `${Math.abs(x1 - x2)}%`,
                  top: "50%",
                  opacity: opacity * 0.7,
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── ECG / Heartbeat Line ── */
export function ECGLine({ className = "" }) {
  return (
    <div className={`relative ${className}`}>
      <svg viewBox="0 0 300 80" className="w-full h-full" fill="none">
        <defs>
          <linearGradient id="ecgGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0" />
            <stop offset="30%" stopColor="#10b981" stopOpacity="0.8" />
            <stop offset="70%" stopColor="#34d399" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Grid lines */}
        {[20, 40, 60].map((y) => (
          <line key={y} x1="0" y1={y} x2="300" y2={y} stroke="#10b981" strokeOpacity="0.08" strokeWidth="1" />
        ))}
        {[50, 100, 150, 200, 250].map((x) => (
          <line key={x} x1={x} y1="0" x2={x} y2="80" stroke="#10b981" strokeOpacity="0.08" strokeWidth="1" />
        ))}
        {/* ECG path */}
        <path
          d="M0,40 L20,40 L30,40 L35,20 L40,60 L45,10 L52,65 L58,40 L80,40 L90,40 L95,20 L100,60 L105,10 L112,65 L118,40 L140,40 L150,40 L155,20 L160,60 L165,10 L172,65 L178,40 L200,40 L210,40 L215,20 L220,60 L225,10 L232,65 L238,40 L260,40 L270,40 L275,20 L280,60 L285,10 L292,65 L298,40 L300,40"
          stroke="url(#ecgGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="animate-ecg"
        />
        {/* Glowing dot at pulse peak */}
        <circle cx="45" cy="10" r="3" fill="#10b981" opacity="0.9" className="animate-heartbeat" />
      </svg>
    </div>
  );
}

/* ── Molecule / Atom ── */
export function Molecule({ className = "", color = "emerald" }) {
  const colors = {
    emerald: { nucleus: "#10b981", ring: "#34d399", glow: "rgba(16,185,129,0.3)" },
    teal:    { nucleus: "#14b8a6", ring: "#2dd4bf", glow: "rgba(20,184,166,0.3)" },
    blue:    { nucleus: "#3b82f6", ring: "#60a5fa", glow: "rgba(59,130,246,0.3)" },
  };
  const c = colors[color] || colors.emerald;

  return (
    <div className={`relative flex items-center justify-center animate-molecule ${className}`}>
      {/* Orbit rings */}
      <div className="absolute w-24 h-24 rounded-full border border-dashed opacity-20" style={{ borderColor: c.ring }} />
      <div className="absolute w-16 h-16 rounded-full border border-dashed opacity-30" style={{ borderColor: c.ring, transform: "rotate(60deg)" }} />

      {/* Orbiting electrons */}
      <div className="absolute w-24 h-24 flex items-center justify-center">
        <div className="animate-orbit absolute w-3 h-3 rounded-full" style={{ background: c.ring, boxShadow: `0 0 6px ${c.glow}` }} />
      </div>
      <div className="absolute w-16 h-16 flex items-center justify-center" style={{ transform: "rotate(60deg)" }}>
        <div className="animate-orbit2 absolute w-2.5 h-2.5 rounded-full" style={{ background: c.nucleus, boxShadow: `0 0 6px ${c.glow}` }} />
      </div>
      <div className="absolute w-20 h-20 flex items-center justify-center" style={{ transform: "rotate(120deg)" }}>
        <div className="animate-orbit3 absolute w-2 h-2 rounded-full" style={{ background: c.ring, boxShadow: `0 0 4px ${c.glow}` }} />
      </div>

      {/* Nucleus */}
      <div className="relative w-7 h-7 rounded-full flex items-center justify-center z-10"
        style={{ background: `radial-gradient(circle at 35% 35%, ${c.ring}, ${c.nucleus})`, boxShadow: `0 0 16px ${c.glow}` }}>
        <div className="w-2 h-2 rounded-full bg-white/40" />
      </div>

      {/* Pulse ring */}
      <div className="absolute w-7 h-7 rounded-full animate-ring-expand" style={{ border: `2px solid ${c.nucleus}` }} />
    </div>
  );
}

/* ── 3D Pill / Capsule ── */
export function Pill({ className = "", rotate = "-20deg", animClass = "animate-pill" }) {
  return (
    <div className={`${animClass} ${className}`} style={{ transform: `rotate(${rotate})` }}>
      <div className="relative w-14 h-6 flex rounded-full overflow-hidden shadow-lg"
        style={{ boxShadow: "0 4px 20px rgba(16,185,129,0.25), inset 0 1px 0 rgba(255,255,255,0.3)" }}>
        <div className="w-1/2 h-full bg-gradient-to-br from-emerald-400 to-emerald-600" />
        <div className="w-1/2 h-full bg-gradient-to-br from-slate-200 to-slate-400 dark:from-slate-500 dark:to-slate-700" />
        {/* Shine */}
        <div className="absolute inset-0 rounded-full" style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.35) 0%, transparent 50%)" }} />
      </div>
    </div>
  );
}

/* ── Medical Cross ── */
export function MedicalCross({ className = "", size = "w-10 h-10" }) {
  return (
    <div className={`animate-cross ${size} ${className} relative flex items-center justify-center`}>
      <div className="absolute w-full h-1/3 rounded-sm bg-gradient-to-r from-emerald-500 to-emerald-400"
        style={{ boxShadow: "0 0 12px rgba(16,185,129,0.4)" }} />
      <div className="absolute w-1/3 h-full rounded-sm bg-gradient-to-b from-emerald-500 to-emerald-400"
        style={{ boxShadow: "0 0 12px rgba(16,185,129,0.4)" }} />
    </div>
  );
}

/* ── Stethoscope SVG ── */
export function Stethoscope({ className = "" }) {
  return (
    <div className={`animate-float ${className}`}>
      <svg viewBox="0 0 80 80" className="w-full h-full" fill="none">
        <defs>
          <linearGradient id="stethoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>
        {/* Earpiece left */}
        <circle cx="20" cy="12" r="4" fill="url(#stethoGrad)" opacity="0.9" />
        {/* Earpiece right */}
        <circle cx="60" cy="12" r="4" fill="url(#stethoGrad)" opacity="0.9" />
        {/* Tubes */}
        <path d="M20,16 C20,30 18,35 25,42 C32,49 48,49 55,42 C62,35 60,30 60,16"
          stroke="url(#stethoGrad)" strokeWidth="3.5" strokeLinecap="round" fill="none" opacity="0.85" />
        {/* Chest piece tube */}
        <path d="M40,49 C40,56 40,60 40,65" stroke="url(#stethoGrad)" strokeWidth="3.5" strokeLinecap="round" opacity="0.85" />
        {/* Chest piece */}
        <circle cx="40" cy="68" r="7" fill="url(#stethoGrad)" opacity="0.9"
          style={{ filter: "drop-shadow(0 0 6px rgba(16,185,129,0.5))" }} />
        <circle cx="40" cy="68" r="4" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
      </svg>
    </div>
  );
}
