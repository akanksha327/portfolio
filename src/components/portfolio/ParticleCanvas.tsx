'use client';

import { useRef, useEffect } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  opacity: number;
  baseOpacity: number;
  glowRadius: number;
  isGlow: boolean;
}

const PARTICLE_COUNT = 80;
const CONNECTION_DISTANCE = 120;
const MOUSE_INFLUENCE_RADIUS = 150;
const MOUSE_PUSH_STRENGTH = 0.8;

const COLORS = [
  { r: 249, g: 115, b: 22 },  // #f97316 orange
  { r: 251, g: 146, b: 60 },  // #fb923c light orange
  { r: 251, g: 191, b: 36 },  // #fbbf24 amber
  { r: 255, g: 255, b: 255 }, // #ffffff white
];

function createParticle(canvasWidth: number, canvasHeight: number, spawnAtBottom = false): Particle {
  const colorData = COLORS[Math.floor(Math.random() * COLORS.length)];
  const isGlow = Math.random() < 0.15;
  const opacity = 0.2 + Math.random() * 0.6;

  return {
    x: Math.random() * canvasWidth,
    y: spawnAtBottom
      ? canvasHeight + Math.random() * 40
      : Math.random() * canvasHeight,
    vx: (Math.random() - 0.5) * 0.3,
    vy: -(0.15 + Math.random() * 0.4),
    radius: isGlow ? 2 + Math.random() * 2.5 : 0.8 + Math.random() * 1.5,
    color: `rgba(${colorData.r}, ${colorData.g}, ${colorData.b}, `,
    opacity,
    baseOpacity: opacity,
    glowRadius: isGlow ? 8 + Math.random() * 12 : 0,
    isGlow,
  };
}

export default function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animationId = 0;
    let width = window.innerWidth;
    let height = window.innerHeight;
    const mouse = { x: -1000, y: -1000 };

    // Initialize canvas size
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
      }
    };

    resize();

    // Initialize particles
    const particles: Particle[] = Array.from({ length: PARTICLE_COUNT }, () =>
      createParticle(width, height, false)
    );

    // Main animation loop
    function draw() {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Mouse interaction — push particles away
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < MOUSE_INFLUENCE_RADIUS && dist > 0) {
          const force = (1 - dist / MOUSE_INFLUENCE_RADIUS) * MOUSE_PUSH_STRENGTH;
          const angle = Math.atan2(dy, dx);
          p.vx += Math.cos(angle) * force;
          p.vy += Math.sin(angle) * force;
        }

        // Apply drift velocity with damping
        p.x += p.vx;
        p.y += p.vy;

        // Dampen horizontal velocity
        p.vx *= 0.98;

        // Slowly restore upward drift
        p.vy += (-(0.15 + Math.random() * 0.01) - p.vy) * 0.002;

        // Fade out as particle rises
        const fadeZone = height * 0.15;
        if (p.y < fadeZone) {
          p.opacity = p.baseOpacity * (p.y / fadeZone);
        }

        // Respawn if off-screen top or fully faded
        if (p.y < -20 || p.opacity <= 0.01) {
          particles[i] = createParticle(width, height, true);
          continue;
        }

        // Wrap horizontally
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        // Draw glow effect for larger particles
        if (p.isGlow && p.glowRadius > 0) {
          const gradient = ctx.createRadialGradient(
            p.x, p.y, 0,
            p.x, p.y, p.glowRadius
          );
          gradient.addColorStop(0, `${p.color}${p.opacity * 0.3})`);
          gradient.addColorStop(1, `${p.color}0)`);
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.glowRadius, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();
        }

        // Draw particle dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.opacity})`;
        ctx.fill();
      }

      // Draw connection lines (constellation effect)
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const ddx = a.x - b.x;
          const ddy = a.y - b.y;
          const distance = Math.sqrt(ddx * ddx + ddy * ddy);

          if (distance < CONNECTION_DISTANCE) {
            const lineOpacity = (1 - distance / CONNECTION_DISTANCE) * 0.15;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(249, 115, 22, ${lineOpacity})`;
            ctx.stroke();
          }
        }
      }

      animationId = requestAnimationFrame(draw);
    }

    // Start animation
    animationId = requestAnimationFrame(draw);

    // Event listeners
    const handleResize = () => {
      resize();
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  );
}
