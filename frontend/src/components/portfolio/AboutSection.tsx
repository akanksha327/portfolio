'use client';

import { useRef, useState, useEffect } from 'react';
import { Code2, Palette, Zap, Sparkles, MapPin, Mail, Phone, ExternalLink } from 'lucide-react';

const highlightCards = [
  { icon: Code2, title: 'Full-Stack Development', description: 'Building end-to-end web solutions with React.js, Next.js on the front-end and Node.js, Express.js on the back-end.' },
  { icon: Palette, title: 'UI/UX Design', description: 'Hands-on experience with Figma for UI prototyping, crafting intuitive interfaces with a keen eye for modern design.' },
  { icon: Zap, title: 'Performance Optimization', description: 'Focused on delivering fast, scalable web applications through performance-first architecture and clean engineering.' },
  { icon: Sparkles, title: 'Clean Code Advocate', description: 'Passionate about writing readable, maintainable code with strong foundations in Data Structures and Algorithms.' },
];

export default function AboutSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { margin: '-80px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="about" className="py-20 md:py-28 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-orange-500/[0.04] blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-orange-500/[0.03] blur-[100px]" />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-orange-500"
            style={{
              width: Math.random() * 3 + 1,
              height: Math.random() * 3 + 1,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5 + 0.1,
              animation: `particleFloat ${Math.random() * 8 + 6}s ease-in-out ${Math.random() * 5}s infinite`,
            }}
          />
        ))}
      </div>

      <div ref={sectionRef} className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Section Heading */}
        <div
          className="mb-16"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(40px)',
            transition: 'all 0.8s ease-out',
          }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
            ABOUT <span className="relative inline-block">ME
              <span className="absolute -bottom-2 left-0 h-1 w-full rounded-full bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500" style={{
                transition: 'width 1s ease-out 0.4s',
                width: visible ? '100%' : '0',
              }} />
            </span>
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12 lg:gap-16 text-center lg:text-left">
          {/* Left Column - Avatar */}
          <div
            className="flex-shrink-0 w-full lg:w-auto flex flex-col items-center"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateX(0)' : 'translateX(-60px)',
              transition: 'all 0.8s ease-out 0.2s',
            }}
          >
            <div className="relative w-40 h-40 sm:w-48 sm:h-48 mb-6" style={{ animation: visible ? 'heroFloat 8s ease-in-out infinite' : 'none' }}>
              <div className="w-full h-full rounded-full flex items-center justify-center border-2 border-orange-500/30" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}>
                <span className="text-4xl sm:text-5xl font-bold bg-gradient-to-br from-orange-400 to-orange-600 bg-clip-text text-transparent select-none">AS</span>
              </div>
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold text-white mb-2">Akanksha Sahu</h3>
            <div className="flex items-center justify-center gap-1.5 text-gray-300 text-sm mb-4">
              <MapPin className="w-4 h-4 text-orange-500" />
              <span>Mathura, Uttar Pradesh, India</span>
            </div>
            <div className="space-y-2 mb-5 text-sm text-gray-300">
              <div className="flex items-center justify-center gap-2">
                <Mail className="w-4 h-4 text-orange-500/80" />
                <a href="mailto:akankshasahu327@gmail.com" className="hover:text-orange-400 transition-colors">akankshasahu327@gmail.com</a>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Phone className="w-4 h-4 text-orange-500/80" />
                <span>+91 8303121774</span>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
              {['LeetCode', 'GitHub', 'LinkedIn'].map((s) => (
                <span key={s} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-gray-300 hover:text-orange-400 hover:border-orange-500/40 hover:shadow-[0_4px_15px_rgba(249,115,22,0.15)] transition-all duration-300 cursor-pointer">
                  <ExternalLink className="w-3.5 h-3.5" />{s}
                </span>
              ))}
            </div>
          </div>

          {/* Right Column */}
          <div className="flex-1 w-full space-y-8">
            <div style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(50px)',
              transition: 'all 0.8s ease-out 0.4s',
            }}>
              <h4 className="text-lg font-semibold text-white mb-3">Hi there! I&apos;m a passionate Full-Stack Developer.</h4>
              <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                I&apos;m currently pursuing my B.Tech in Computer Science at{' '}
                <span className="text-orange-400 font-medium">GLA University</span> (Expected June 2027, GPA 6.88/10).
                I specialize in building modern, scalable web applications using{' '}
                <span className="text-orange-400 font-medium">React.js</span> and{' '}
                <span className="text-orange-400 font-medium">Next.js</span> on the front-end,
                with solid back-end experience in{' '}
                <span className="text-orange-400 font-medium">Node.js</span> and{' '}
                <span className="text-orange-400 font-medium">Express.js</span>.
                I hold a{' '}
                <span className="text-orange-400 font-medium">Meta Front-End Developer Professional Certificate</span>{' '}
                from Coursera.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" style={{ perspective: '1200px' }}>
              {highlightCards.map((card, index) => {
                const Icon = card.icon;
                const directions = [
                  { x: -60, y: 40, r: -8 },
                  { x: 60, y: -30, r: 6 },
                  { x: -40, y: -50, r: 10 },
                  { x: 50, y: 30, r: -5 },
                ];
                const dir = directions[index];
                return (
                  <div
                    key={card.title}
                    className="group p-4 sm:p-5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/[0.08] hover:border-orange-500/30 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_rgba(249,115,22,0.15)] transition-all duration-500"
                    style={{
                      opacity: visible ? 1 : 0,
                      transform: visible
                        ? 'translateY(0) rotate(0deg) scale(1)'
                        : `translateX(${dir.x}px) translateY(${dir.y}px) rotate(${dir.r}deg) scale(0.85)`,
                      transition: `all 0.7s ease-out ${0.5 + index * 0.15}s`,
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center group-hover:bg-orange-500/20 group-hover:shadow-[0_0_15px_rgba(249,115,22,0.2)] transition-all duration-300">
                        <Icon className="w-5 h-5 text-orange-400" />
                      </div>
                      <div>
                        <h5 className="font-semibold text-white text-sm mb-1">{card.title}</h5>
                        <p className="text-gray-300 text-xs leading-relaxed">{card.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
