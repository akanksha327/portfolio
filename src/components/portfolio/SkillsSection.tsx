'use client';

import { useRef, useState, useEffect } from 'react';

const skillCategories = [
  { title: 'Programming Languages', icon: '{ }', skills: ['Java', 'Python', 'JavaScript', 'C++', 'C'] },
  { title: 'Front-End Technologies', icon: '</>', skills: ['HTML', 'CSS', 'React.js', 'Next.js', 'Figma'] },
  { title: 'Back-End Technologies', icon: '[ ]', skills: ['Node.js', 'Express.js'] },
  { title: 'Backend Concepts', icon: 'API', skills: ['RESTful APIs', 'HTTP Methods', 'CRUD Operations', 'Authentication'] },
  { title: 'Developer Tools', icon: 'DEV', skills: ['Git', 'GitHub', 'VS Code', 'Firebase'] },
  { title: 'Core Strengths', icon: 'DS', skills: ['Data Structures & Algorithms', 'Problem Solving', 'Performance Optimization', 'Component-Based Architecture'] },
];

export default function SkillsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { margin: '-100px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="skills" ref={sectionRef} className="relative overflow-hidden py-24 md:py-32">
      {/* Background grid pattern */}
      <div className="pointer-events-none absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(255,165,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,165,0,0.05) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-orange-500/[0.05] blur-[150px]" />
      </div>
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <span className="select-none text-[20rem] font-bold leading-none tracking-tighter text-white/[0.04] md:text-[28rem]">{'</>'}</span>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 18 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-orange-500"
            style={{
              width: Math.random() * 3 + 1,
              height: Math.random() * 3 + 1,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.4 + 0.1,
              animation: `particleFloat ${Math.random() * 8 + 5}s ease-in-out ${Math.random() * 6}s infinite`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div
          className="mb-16 text-center md:mb-20"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(40px)',
            transition: 'all 0.8s ease-out',
          }}
        >
          <span className="mb-4 inline-block font-mono text-sm uppercase tracking-[0.3em] text-orange-400/80">{'// what I work with'}</span>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            TECHNICAL <span className="relative inline-block">
              <span className="relative z-10 text-orange-400" style={{ textShadow: '0 0 30px rgba(249,115,22,0.3)' }}>SKILLS</span>
              <span className="absolute -bottom-1 left-0 h-[2px] w-full bg-gradient-to-r from-orange-500 via-orange-400/60 to-transparent" />
            </span>
          </h2>
          <div className="mx-auto mt-6 h-px w-32 bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />
        </div>

        {/* Skill Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {skillCategories.map((category, categoryIndex) => {
            const directions = [
              { x: -80, y: 60 }, { x: 70, y: -50 }, { x: -50, y: -70 },
              { x: 60, y: 50 }, { x: -70, y: -40 }, { x: 80, y: 60 },
            ];
            const dir = directions[categoryIndex];
            return (
              <div
                key={category.title}
                className="group relative rounded-xl border border-white/[0.08] bg-white/[0.03] p-5 backdrop-blur-sm hover:bg-white/[0.06] hover:border-orange-500/30 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(249,115,22,0.15)] transition-all duration-500 md:p-6"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible
                    ? 'translateY(0) scale(1)'
                    : `translateX(${dir.x}px) translateY(${dir.y}px) scale(0.85)`,
                  transition: `all 0.7s ease-out ${0.1 + categoryIndex * 0.1}s`,
                }}
              >
                {/* Corner accents */}
                <div className="pointer-events-none absolute -top-px -left-px h-4 w-4 border-t-2 border-l-2 border-orange-500/30 rounded-tl-xl" />
                <div className="pointer-events-none absolute -top-px -right-px h-4 w-4 border-t-2 border-r-2 border-orange-500/30 rounded-tr-xl" />
                <div className="pointer-events-none absolute -bottom-px -left-px h-4 w-4 border-b-2 border-l-2 border-orange-500/30 rounded-bl-xl" />
                <div className="pointer-events-none absolute -bottom-px -right-px h-4 w-4 border-b-2 border-r-2 border-orange-500/30 rounded-br-xl" />

                <div className="mb-4 flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-500/15 border border-orange-500/20 font-mono text-xs font-bold text-orange-400 shadow-[0_0_10px_rgba(249,115,22,0.1)]">
                    {category.icon}
                  </span>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-orange-400">{category.title}</h3>
                </div>

                <div className="mb-4 h-px w-full bg-gradient-to-r from-orange-500/30 via-white/[0.08] to-transparent" />

                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill, skillIndex) => (
                    <span
                      key={skill}
                      className="inline-block rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs font-medium text-gray-300 hover:border-orange-500/40 hover:bg-orange-500/15 hover:text-orange-300 hover:scale-110 transition-all duration-200 cursor-default"
                      style={{
                        opacity: visible ? 1 : 0,
                        transform: visible ? 'scale(1)' : 'scale(0.5)',
                        transition: `all 0.4s ease-out ${0.4 + categoryIndex * 0.1 + skillIndex * 0.06}s`,
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="pointer-events-none absolute bottom-2 right-3 font-mono text-[10px] text-white/[0.08]">
                  {String(categoryIndex + 1).padStart(2, '0')}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center md:mt-20" style={{ opacity: visible ? 1 : 0, transition: 'opacity 1s ease 1.2s' }}>
          <span className="font-mono text-xs text-white/[0.15]">{'/* continuously learning & building */'}</span>
        </div>
      </div>
    </section>
  );
}
