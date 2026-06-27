'use client';

import { useRef, useState, useEffect } from 'react';
import { Award, GraduationCap, Sparkles, BookOpen, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const timelineData = [
  {
    id: 1, type: 'certification', badge: 'CERTIFICATION',
    title: 'Meta Front-End Developer Professional Certificate',
    organization: 'Coursera', period: '2024',
    icon: <Award className="h-5 w-5" />,
    bullets: ['Completed structured training in HTML, CSS, and advanced JavaScript', 'Built interactive and responsive UIs using React.js', 'Following industry-standard best practices'],
  },
  {
    id: 2, type: 'education', badge: 'EDUCATION',
    title: 'B.Tech Computer Science & Engineering',
    organization: 'GLA University, Mathura', period: '2023 – 2027',
    icon: <GraduationCap className="h-5 w-5" />,
    bullets: ['Expected Graduation: June 2027', 'GPA: 6.88/10', 'Relevant Coursework: DSA, Operating Systems, DBMS, Front-End Web Dev'],
  },
  {
    id: 3, type: 'info', badge: 'INTERESTS & SKILLS',
    title: 'Additional Strengths',
    organization: 'Continuous Learning & Exploration', period: 'Ongoing',
    icon: <Sparkles className="h-5 w-5" />,
    bullets: ['Strong interest in web performance optimization and human-AI interaction', 'Comfortable with hackathon-style rapid prototyping', 'Familiar with Agile methodologies and technical documentation'],
  },
];

function TimelineContent({ entry }: { entry: typeof timelineData[0] }) {
  const isInfo = entry.type === 'info';
  return (
    <div className={`group relative rounded-2xl border p-5 backdrop-blur-sm transition-all duration-300 hover:shadow-[0_0_25px_rgba(249,115,22,0.15)] ${isInfo ? 'bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent border-amber-500/20 hover:border-amber-400/30' : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/[0.07]'}`}>
      <div className="mb-3 flex items-center gap-2">
        <span className={`flex h-7 w-7 items-center justify-center rounded-lg ${isInfo ? 'bg-amber-500/15 text-amber-400' : 'bg-orange-500/15 text-orange-400'}`}>{entry.icon}</span>
        <Badge className={`text-[10px] font-semibold tracking-widest uppercase px-2.5 py-0.5 rounded-full border-0 ${isInfo ? 'bg-amber-500/15 text-amber-300' : 'bg-orange-500/15 text-orange-300'}`}>{entry.badge}</Badge>
      </div>
      <h3 className="text-base font-bold text-white leading-snug mb-1">{entry.title}</h3>
      <p className={`text-sm font-medium mb-0.5 ${isInfo ? 'text-amber-400' : 'text-orange-400'}`}>{entry.organization}</p>
      <p className="text-xs text-gray-400 mb-3 font-medium tracking-wide">{entry.period}</p>
      <div className={`mb-3 h-px w-full ${isInfo ? 'bg-gradient-to-r from-amber-500/30 via-amber-500/10 to-transparent' : 'bg-gradient-to-r from-white/10 via-white/5 to-transparent'}`} />
      <ul className="space-y-2.5">
        {entry.bullets.map((bullet, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm text-gray-300 leading-relaxed">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500/70" />
            {bullet}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ExperienceSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="experience" ref={sectionRef} className="relative w-full py-24 md:py-32 overflow-hidden">
      {/* Background ambient */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/4 left-0 h-64 w-64 rounded-full bg-orange-500/[0.03] blur-[100px]" />
        <div className="absolute bottom-1/4 right-0 h-64 w-64 rounded-full bg-amber-500/[0.03] blur-[100px]" />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-amber-500"
            style={{
              width: Math.random() * 3 + 1,
              height: Math.random() * 3 + 1,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.4 + 0.1,
              animation: `particleFloat ${Math.random() * 7 + 5}s ease-in-out ${Math.random() * 5}s infinite`,
            }}
          />
        ))}
      </div>

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div
          className="mb-16 md:mb-20 text-center"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.8s ease-out',
          }}
        >
          <span className="inline-block text-xs font-semibold tracking-[0.25em] uppercase text-orange-400/70 mb-3">My Journey</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-white via-white to-gray-400 bg-clip-text text-transparent">EXPERIENCE </span>
            <span className="text-gray-400">&</span>
            <span className="bg-gradient-to-r from-orange-400 via-orange-400 to-amber-400 bg-clip-text text-transparent"> EDUCATION</span>
          </h2>
          <div className="mt-5 mx-auto h-[2px] w-24 bg-gradient-to-r from-transparent via-orange-500 to-transparent" />
        </div>

        {/* Timeline */}
        <div className="relative">
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 -translate-x-1/2">
            <div
              className="h-full w-[2px] origin-top bg-gradient-to-b from-orange-500/60 via-orange-400/30 to-transparent"
              style={{
                transform: visible ? 'scaleY(1)' : 'scaleY(0)',
                transition: 'transform 1.2s ease-out',
                boxShadow: '0 0 8px rgba(249,115,22,0.3)',
              }}
            />
          </div>
          <div className="md:hidden absolute left-[14px] top-0 bottom-0">
            <div
              className="h-full w-[2px] origin-top bg-gradient-to-b from-orange-500/60 via-orange-400/30 to-transparent"
              style={{
                transform: visible ? 'scaleY(1)' : 'scaleY(0)',
                transition: 'transform 1.2s ease-out',
                boxShadow: '0 0 8px rgba(249,115,22,0.3)',
              }}
            />
          </div>

          <div className="space-y-10 md:space-y-14">
            {timelineData.map((entry, index) => {
              const isEven = index % 2 === 0;
              const isInfo = entry.type === 'info';
              const startX = isEven ? -50 : 50;

              return (
                <div key={entry.id} className="relative flex w-full items-start md:items-center">
                  {/* Timeline dot */}
                  <div className="absolute left-[7px] md:left-1/2 top-0 z-10 -translate-x-1/2">
                    <div className="relative flex h-4 w-4 items-center justify-center">
                      <span className="absolute inset-0 rounded-full bg-orange-500/40" style={{ animation: visible ? 'glowPulse 2s ease-in-out infinite' : 'none' }} />
                      <span className={`relative z-10 flex h-3 w-3 items-center justify-center rounded-full ${isInfo ? 'bg-gradient-to-br from-amber-400 to-orange-500 shadow-amber-500/50 shadow-lg' : 'bg-gradient-to-br from-orange-400 to-orange-600 shadow-orange-500/50 shadow-lg'}`}>
                        <span className="h-1 w-1 rounded-full bg-white" />
                      </span>
                    </div>
                  </div>

                  {/* Connector line */}
                  {index < timelineData.length - 1 && (
                    <div className="absolute left-[14px] md:left-1/2 top-4 -translate-x-1/2 origin-top w-[2px] h-[calc(100%+1rem)] bg-gradient-to-b from-orange-500/60 via-orange-400/40 to-transparent" />
                  )}

                  {/* Desktop: alternating sides */}
                  <div className="hidden md:flex md:w-1/2 pr-8 justify-end">
                    {isEven && (
                      <div className="w-full max-w-md" style={{
                        opacity: visible ? 1 : 0,
                        transform: visible ? 'translateX(0) translateY(0)' : `translateX(${startX}px) translateY(-30px)`,
                        transition: `all 0.7s ease-out ${0.2 + index * 0.2}s`,
                      }}>
                        <TimelineContent entry={entry} />
                      </div>
                    )}
                  </div>
                  <div className="hidden md:flex md:w-1/2 pl-8 justify-start">
                    {!isEven && (
                      <div className="w-full max-w-md" style={{
                        opacity: visible ? 1 : 0,
                        transform: visible ? 'translateX(0) translateY(0)' : `translateX(${startX}px) translateY(-30px)`,
                        transition: `all 0.7s ease-out ${0.2 + index * 0.2}s`,
                      }}>
                        <TimelineContent entry={entry} />
                      </div>
                    )}
                  </div>

                  {/* Mobile: always right */}
                  <div className="flex md:hidden pl-10 w-full">
                    <div className="w-full" style={{
                      opacity: visible ? 1 : 0,
                      transform: visible ? 'translateY(0)' : 'translateY(20px)',
                      transition: `all 0.6s ease-out ${0.2 + index * 0.15}s`,
                    }}>
                      <TimelineContent entry={entry} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-16 md:mt-20 flex items-center justify-center gap-3" style={{ opacity: visible ? 1 : 0, transition: 'opacity 1s ease 0.5s' }}>
          <BookOpen className="h-4 w-4 text-gray-400" />
          <span className="text-xs text-gray-400 tracking-wider">Always learning, always growing</span>
          <Zap className="h-4 w-4 text-gray-400" />
        </div>
      </div>
    </section>
  );
}
