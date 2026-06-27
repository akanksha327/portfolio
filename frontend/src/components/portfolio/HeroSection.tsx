'use client';

import { ChevronDown } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';

// ─── Animation Frame Player ───────────────────────────────────────────────────

const TOTAL_FRAMES = 60;
const FRAME_INTERVAL_MS = 83;

function getFramePath(frameIndex: number): string {
  const frameNum = String(frameIndex).padStart(3, '0');
  return `/animation-frames/ezgif-frame-${frameNum}.jpg`;
}

function AnimationFramePlayer() {
  const [currentFrame, setCurrentFrame] = useState(1);

  useEffect(() => {
    const images: HTMLImageElement[] = [];
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = getFramePath(i);
      images.push(img);
    }
    return () => {
      images.forEach((img) => { img.src = ''; });
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFrame((prev) => (prev + 1 > TOTAL_FRAMES ? 1 : prev + 1));
    }, FRAME_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none">
      <div
        className="relative w-[500px] h-[500px] sm:w-[600px] sm:h-[600px] md:w-[750px] md:h-[750px] lg:w-[900px] lg:h-[900px]"
        style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}
      >
        {/* Bright glow ring behind the frame */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(249,115,22,0.35) 0%, rgba(234,88,12,0.15) 40%, transparent 70%)',
            filter: 'blur(30px)',
          }}
        />
        {/* Animation frame image */}
        <img
          src={getFramePath(currentFrame)}
          alt=""
          className="w-full h-full object-contain"
          style={{
            opacity: 0.7,
            filter: 'contrast(1.2) saturate(1.3) brightness(1.1)',
            animation: 'heroFloat 12s ease-in-out infinite',
          }}
          draggable={false}
        />
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at center, rgba(249,115,22,0.15) 0%, transparent 60%)' }}
        />
      </div>
      {/* Outer ambient light halo */}
      <div
        className="absolute w-[600px] h-[600px] sm:w-[700px] sm:h-[700px] md:w-[850px] md:h-[850px]"
        style={{
          background: 'radial-gradient(circle, rgba(249,115,22,0.2) 0%, rgba(234,88,12,0.08) 40%, transparent 65%)',
          filter: 'blur(40px)',
          animation: 'heroFloat2 6s ease-in-out infinite',
        }}
      />
    </div>
  );
}

// ─── Scroll Indicator ──────────────────────────────────────────────────────────

function ScrollIndicator() {
  const handleClick = useCallback(() => {
    const el = document.getElementById('about');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <div
      className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer z-10"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label="Scroll to explore"
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleClick(); }}
    >
      <div style={{ animation: 'scrollBounce 1.8s ease-in-out infinite' }}>
        <ChevronDown className="w-6 h-6 text-orange-400/60" />
      </div>
      <span className="text-xs tracking-[0.25em] uppercase text-gray-400 font-light">
        Scroll to Explore
      </span>
    </div>
  );
}

// ─── Ambient Particles (CSS-only) ─────────────────────────────────────────────

function AmbientParticles() {
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 1.5,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 8 + 6,
    delay: Math.random() * 5,
    opacity: Math.random() * 0.6 + 0.2,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[2]">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
            background: `radial-gradient(circle, rgba(249,115,22,${p.opacity}) 0%, rgba(249,115,22,0) 70%)`,
            boxShadow: `0 0 ${p.size * 3}px rgba(249,115,22,${p.opacity * 0.5})`,
            animation: `particleFloat ${p.duration}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

// ─── Floating Shapes (CSS-only) ────────────────────────────────────────────────

function FloatingShapes() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]">
      {/* Wireframe cube */}
      <div className="absolute top-[15%] right-[10%] w-16 h-16 md:w-24 md:h-24 border border-orange-500/20 rounded-lg"
        style={{ animation: 'cubeRotate 20s linear infinite', perspective: '200px' }}
      />
      {/* Ring */}
      <div className="absolute top-[40%] left-[5%] w-20 h-20 md:w-32 md:h-32 rounded-full border border-orange-500/10"
        style={{ animation: 'ringFloat 12s ease-in-out infinite' }}
      />
      {/* Small diamond */}
      <div className="absolute top-[25%] left-[20%] w-6 h-6 md:w-10 md:h-10 border border-amber-500/15"
        style={{ animation: 'diamondFloat 8s ease-in-out infinite', transform: 'rotate(45deg)' }}
      />
      {/* Circle glow */}
      <div className="absolute bottom-[15%] right-[15%] w-8 h-8 md:w-14 md:h-14 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(249,115,22,0.15) 0%, transparent 70%)',
          border: '1px solid rgba(249,115,22,0.1)',
          animation: 'particleFloat 10s ease-in-out 2s infinite',
        }}
      />
    </div>
  );
}

// ─── Main Hero Section ─────────────────────────────────────────────────────────

export default function HeroSection() {
  const loaded = true;

  return (
    <section
      id="hero"
      className="relative w-full h-screen min-h-[700px] flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `
          radial-gradient(circle at 50% 50%, rgba(249, 115, 22, 0.05) 0%, transparent 60%),
          radial-gradient(rgba(249, 115, 22, 0.05) 1.5px, transparent 1.5px)
        `,
        backgroundSize: '100% 100%, 30px 30px',
      }}
    >
      {/* Premium Film Grain Noise */}
      <div 
        className="absolute inset-0 opacity-[0.02] pointer-events-none z-[1]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Modern Floating Glow Blobs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-orange-500/[0.04] blur-[130px] pointer-events-none z-[2]" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-amber-500/[0.03] blur-[110px] pointer-events-none z-[2]" />
      <div className="absolute top-1/3 right-1/3 w-[600px] h-[600px] rounded-full bg-purple-500/[0.02] blur-[150px] pointer-events-none z-[2]" />

      {/* Vignette overlay */}
      <div
        className="absolute inset-0 z-[3] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.85) 100%)' }}
      />

      {/* Top/bottom edge glow lines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/20 to-transparent z-10" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/10 to-transparent z-10" />

      {/* Main Content - VISIBLE by default */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4 text-center select-none animate-fade-in">
        {/* AKANKSHA */}
        <div className="relative" style={{ transition: 'opacity 1s ease, transform 1s ease', opacity: loaded ? 1 : 0, transform: loaded ? 'translateY(0)' : 'translateY(20px)' }}>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
            <span className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white/[0.02] tracking-[0.2em] select-none">
              AKANKSHA
            </span>
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-[0.2em] bg-clip-text text-transparent bg-gradient-to-b from-white via-neutral-100 to-neutral-400 drop-shadow-[0_0_15px_rgba(255,255,255,0.05)]">
            AKANKSHA
          </h1>
        </div>

        {/* SAHU */}
        <div className="relative mt-2" style={{ transition: 'opacity 1s ease 0.2s, transform 1s ease 0.2s', opacity: loaded ? 1 : 0, transform: loaded ? 'translateY(0)' : 'translateY(20px)' }}>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
            <span className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-orange-500/[0.04] blur-xl tracking-[0.3em] select-none">
              SAHU
            </span>
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-amber-500 to-orange-600 tracking-[0.3em] drop-shadow-[0_10px_30px_rgba(249,115,22,0.25)]">
            SAHU
          </h1>
        </div>

        {/* Divider */}
        <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-orange-500/50 to-transparent my-6 relative"
          style={{ transition: 'transform 1.2s ease 0.5s', transform: loaded ? 'scaleX(1)' : 'scaleX(0)' }}
        >
          <div className="absolute inset-0 bg-orange-400 blur-sm opacity-30" />
        </div>

        {/* Subtitle */}
        <p
          className="text-xs sm:text-sm md:text-base text-orange-400/80 font-mono tracking-[0.4em] uppercase"
          style={{ transition: 'opacity 0.8s ease 0.8s', opacity: loaded ? 1 : 0 }}
        >
          {"// Full-Stack Developer"}
        </p>

        {/* Tagline */}
        <p
          className="text-xs sm:text-sm text-gray-400 font-light tracking-wide mt-3 max-w-md"
          style={{ transition: 'opacity 0.8s ease 1s', opacity: loaded ? 1 : 0 }}
        >
          Crafting Digital Experiences with Code &amp; Creativity
        </p>

        {/* CTA Buttons */}
        <div className="flex gap-4 mt-8" style={{ transition: 'opacity 0.8s ease 1.2s', opacity: loaded ? 1 : 0 }}>
          <button
            className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium tracking-wider uppercase rounded-sm transition-all duration-300 shadow-[0_0_25px_rgba(249,115,22,0.4)] hover:shadow-[0_0_35px_rgba(249,115,22,0.6)] cursor-pointer"
            onClick={() => { const el = document.getElementById('projects'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }}
          >
            View My Work
          </button>
          <button
            className="px-6 py-2.5 border border-gray-600 hover:border-orange-500/60 text-gray-300 hover:text-orange-400 text-sm font-medium tracking-wider uppercase rounded-sm transition-all duration-300 cursor-pointer"
            onClick={() => { const el = document.getElementById('contact'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }}
          >
            Get in Touch
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{ transition: 'opacity 1s ease 2s', opacity: loaded ? 1 : 0 }}>
        <ScrollIndicator />
      </div>
    </section>
  );
}
