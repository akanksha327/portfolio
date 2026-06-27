'use client';

import { useMemo } from 'react';

interface EmberParticle {
  id: number;
  x: number;
  y: number;
  emberX: number;
  emberY: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

interface SparkParticle {
  id: number;
  x: number;
  y: number;
  sparkX: number;
  sparkY: number;
  size: number;
  duration: number;
  delay: number;
}

interface ShardParticle {
  id: number;
  x: number;
  y: number;
  sx: number;
  sy: number;
  sr: number;
  size: number;
  duration: number;
  delay: number;
}

// ─── Floating Ember Particles (rise upward like sparks from explosion) ───
export function EmberField({ count = 20, color = '249,115,22' }: { count?: number; color?: string }) {
  const particles = useMemo<EmberParticle[]>(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: 60 + Math.random() * 40,
      emberX: (Math.random() - 0.5) * 120,
      emberY: -(100 + Math.random() * 200),
      size: Math.random() * 4 + 1.5,
      duration: Math.random() * 6 + 4,
      delay: Math.random() * 6,
      opacity: Math.random() * 0.7 + 0.3,
    })), [count]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
            background: `radial-gradient(circle, rgba(${color},${p.opacity}) 0%, rgba(${color},0) 70%)`,
            boxShadow: `0 0 ${p.size * 2}px rgba(${color},${p.opacity * 0.4})`,
            '--ember-x': `${p.emberX}px`,
            '--ember-y': `${p.emberY}px`,
            animation: `ember ${p.duration}s ease-out ${p.delay}s infinite`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

// ─── Spark Burst (explosion sparks flying outward from a point) ───
export function SparkBurst({ count = 12, centerX = 50, centerY = 50, color = '249,115,22', active = true }: {
  count?: number; centerX?: number; centerY?: number; color?: string; active?: boolean;
}) {
  const particles = useMemo<SparkParticle[]>(() =>
    Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2 + Math.random() * 0.5;
      const distance = 60 + Math.random() * 100;
      return {
        id: i,
        x: centerX,
        y: centerY,
        sparkX: Math.cos(angle) * distance,
        sparkY: Math.sin(angle) * distance,
        size: Math.random() * 3 + 1,
        duration: Math.random() * 2 + 1.5,
        delay: Math.random() * 1.5,
      };
    }), [count, centerX, centerY]);

  if (!active) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
            background: `rgba(${color},0.9)`,
            boxShadow: `0 0 ${p.size * 3}px rgba(${color},0.6)`,
            '--spark-x': `${p.sparkX}px`,
            '--spark-y': `${p.sparkY}px`,
            animation: `sparkBurst ${p.duration}s ease-out ${p.delay}s infinite`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

// ─── Shards (flying glass fragments) ───
export function ShardField({ count = 8, color = '249,115,22', active = false }: {
  count?: number; color?: string; active?: boolean;
}) {
  const particles = useMemo<ShardParticle[]>(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      sx: (Math.random() - 0.5) * 200,
      sy: (Math.random() - 0.5) * 200,
      sr: Math.random() * 360,
      size: Math.random() * 8 + 4,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 2,
    })), [count]);

  if (!active) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-20">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute"
          style={{
            width: p.size,
            height: p.size * 0.6,
            left: `${p.x}%`,
            top: `${p.y}%`,
            background: `linear-gradient(135deg, rgba(${color},0.3), rgba(${color},0.05))`,
            border: `1px solid rgba(${color},0.2)`,
            '--sx': `${p.sx}px`,
            '--sy': `${p.sy}px`,
            '--sr': `${p.sr}deg`,
            animation: `shardFly ${p.duration}s ease-out ${p.delay}s forwards`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

// ─── Ring Pulse (expanding ring shockwave) ───
export function RingPulse({ centerX = 50, centerY = 50, active = true, color = '249,115,22' }: {
  centerX?: number; centerY?: number; active?: boolean; color?: string;
}) {
  if (!active) return null;
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[0, 0.8, 1.6].map((delay, i) => (
        <div
          key={i}
          className="absolute rounded-full border-2"
          style={{
            width: 60,
            height: 60,
            left: `${centerX}%`,
            top: `${centerY}%`,
            marginLeft: -30,
            marginTop: -30,
            borderColor: `rgba(${color},0.5)`,
            animation: `ringPulse 3s ease-out ${delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

// ─── Section scanline overlay (tech/AI feel) ───
export function ScanlineOverlay() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.03]">
      <div
        className="absolute left-0 w-full h-[2px]"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(249,115,22,0.5) 50%, transparent 100%)',
          animation: 'scanline 4s linear infinite',
        }}
      />
    </div>
  );
}

// ─── 3D Card wrapper with hover tilt ───
export function TiltCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={className}
      style={{ perspective: '800px' }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        const inner = e.currentTarget.firstElementChild as HTMLElement;
        if (inner) {
          inner.style.transform = `perspective(800px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) translateZ(10px)`;
        }
      }}
      onMouseLeave={(e) => {
        const inner = e.currentTarget.firstElementChild as HTMLElement;
        if (inner) {
          inner.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg) translateZ(0)';
          inner.style.transition = 'transform 0.5s ease-out';
          setTimeout(() => {
            if (inner) inner.style.transition = '';
          }, 500);
        }
      }}
    >
      {children}
    </div>
  );
}
