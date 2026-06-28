'use client';

import { useRef, useState, useEffect } from 'react';
import { ExternalLink, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const projects = [
  { id: 7, title: 'SmartERP SaaS Platform', tech: ['Next.js', 'React', 'TypeScript', 'Tailwind', 'Recharts'], descriptions: ['Premium SaaS ledger, inventory catalog database, and customer CRM system', 'Features state filters, stock alerts, loading skeletons, and localized theme toggling'], color: '#2563EB', colorRgb: '37, 99, 235', icon: '📊', isSmartErp: true },
  { id: 1, title: 'Color Image Enhancement Tool', tech: ['Python', 'OpenCV', 'NumPy', 'Matplotlib'], descriptions: ['Improved image quality by adjusting brightness/contrast in HSV color space', 'Optimized image processing, reducing execution time for 100+ images'], color: '#f97316', colorRgb: '249, 115, 22', icon: '🎨' },
  { id: 2, title: 'DSA Implementations', tech: ['Java'], descriptions: ['Implemented Quick Sort, Binary Search, custom linked list', 'Optimized sorting from O(n²) to O(n log n)'], color: '#ef4444', colorRgb: '239, 68, 68', icon: '⚙️' },
  { id: 3, title: 'Maze Game', tech: ['HTML', 'CSS', 'JavaScript'], descriptions: ['Interactive maze game with collision detection and progress tracking', 'Designed 50+ playable levels with increasing difficulty'], color: '#22c55e', colorRgb: '34, 197, 94', icon: '🎮' },
  { id: 4, title: 'Portfolio Website', tech: ['React', 'Node.js', 'HTML', 'CSS', 'JavaScript'], descriptions: ['Responsive, mobile-friendly portfolio showcasing 8+ projects', 'Focused on usability and cross-device compatibility'], color: '#3b82f6', colorRgb: '59, 130, 246', icon: '🌐' },
  { id: 5, title: 'E-Learning Website', tech: ['React', 'Node.js', 'Express.js', 'MongoDB', 'HTML', 'CSS', 'JS'], descriptions: ['Full-stack platform with authentication and role-based access', 'RESTful APIs for users, courses, enrollment management'], color: '#a855f7', colorRgb: '168, 85, 247', icon: '📚' },
  { id: 6, title: 'Figma UI/UX Design Project', tech: ['Figma'], descriptions: ['Restaurant reservation system prototype with user research', 'User personas, journey maps, wireframes, and high-fidelity mockups'], color: '#ec4899', colorRgb: '236, 72, 153', icon: '✏️' },
];

export default function ProjectsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [selectedProject, setSelectedProject] = useState<number | null>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { margin: '-80px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const scatterDirs = [
    { x: -100, y: 80, scale: 0.8, rotate: -6 },
    { x: 90, y: -70, scale: 0.85, rotate: 5 },
    { x: -60, y: -90, scale: 0.75, rotate: 8 },
    { x: 80, y: 60, scale: 0.8, rotate: -4 },
    { x: -90, y: 50, scale: 0.85, rotate: 7 },
    { x: 70, y: -80, scale: 0.8, rotate: -5 },
    { x: 40, y: 90, scale: 0.75, rotate: 6 },
  ];

  return (
    <section id="projects" ref={sectionRef} className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-orange-500/[0.05] blur-[140px]" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full bg-purple-500/[0.03] blur-[100px]" />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 3 + 1,
              height: Math.random() * 3 + 1,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: i % 3 === 0 ? '#fb923c' : '#f97316',
              opacity: Math.random() * 0.5 + 0.1,
              animation: `particleFloat ${Math.random() * 7 + 5}s ease-in-out ${Math.random() * 5}s infinite`,
            }}
          />
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Section Heading */}
        <div
          className="text-center mb-16"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(40px)',
            transition: 'all 0.8s ease-out',
          }}
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4">
            <span className="text-white/40 font-light mr-3">02.</span>
            <span className="bg-gradient-to-r from-orange-400 via-orange-500 to-amber-500 bg-clip-text text-transparent">PROJECTS</span>
          </h2>
          <div className="flex items-center justify-center gap-4 mt-4">
            <div className="h-[1px] w-16 bg-gradient-to-r from-transparent to-orange-500/60" />
            <p className="text-gray-400 text-sm sm:text-base tracking-widest uppercase">Things I&apos;ve Built</p>
            <div className="h-[1px] w-16 bg-gradient-to-l from-transparent to-orange-500/60" />
          </div>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
          {projects.map((project, index) => {
            const dir = scatterDirs[index];
            return (
              <div
                key={project.id}
                className="group relative"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible
                    ? 'translateY(0) scale(1) rotate(0deg)'
                    : `translateX(${dir.x}px) translateY(${dir.y}px) scale(${dir.scale}) rotate(${dir.rotate}deg)`,
                  transition: `all 0.8s ease-out ${0.1 + index * 0.12}s`,
                }}
              >
                <div
                  className={`relative rounded-2xl overflow-hidden bg-white/[0.04] backdrop-blur-xl border transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] ${selectedProject === project.id ? `ring-1 ring-[rgba(${project.colorRgb},0.5)]` : ''}`}
                  style={{ borderColor: `rgba(${project.colorRgb},0.12)` }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = `rgba(${project.colorRgb},0.5)`;
                    e.currentTarget.style.boxShadow = `0 20px 60px rgba(${project.colorRgb},0.2), 0 0 30px rgba(${project.colorRgb},0.1)`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = `rgba(${project.colorRgb},0.12)`;
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div className="h-1.5 w-full" style={{ background: `linear-gradient(90deg, ${project.color}, rgba(${project.colorRgb},0.5), ${project.color})` }} />
                  <div
                    className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                    style={{ background: `radial-gradient(ellipse at top, rgba(${project.colorRgb},0.12) 0%, transparent 60%)` }}
                  />
                  <div className="relative p-6 flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-11 h-11 rounded-xl text-lg shrink-0" style={{ background: `rgba(${project.colorRgb},0.15)`, border: `1px solid rgba(${project.colorRgb},0.25)` }}>
                        {project.icon}
                      </div>
                      <h3 className="text-lg font-bold text-white leading-tight">{project.title}</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((tech) => (
                        <span
                          key={tech}
                          className="relative inline-flex items-center px-2.5 py-1 text-[11px] font-medium tracking-wide uppercase rounded-md text-white/80 bg-white/[0.05] border border-white/[0.08] overflow-hidden transition-all duration-300 hover:text-white hover:border-white/20"
                        >
                          <span className="relative z-10">{tech}</span>
                        </span>
                      ))}
                    </div>
                    <ul className="space-y-2">
                      {project.descriptions.map((desc, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-gray-300 leading-relaxed">
                          <ChevronRight className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: project.color }} />
                          <span>{desc}</span>
                        </li>
                      ))}
                    </ul>
                    {project.isSmartErp ? (
                      <Link
                        href="/smarterp"
                        className="relative mt-2 flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg text-sm font-medium border transition-all duration-300 cursor-pointer hover:translate-x-1"
                        style={{ borderColor: `rgba(${project.colorRgb},0.3)`, color: project.color }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = `rgba(${project.colorRgb},0.1)`;
                          e.currentTarget.style.borderColor = `rgba(${project.colorRgb},0.6)`;
                          e.currentTarget.style.boxShadow = `0 0 20px rgba(${project.colorRgb},0.3), 0 0 40px rgba(${project.colorRgb},0.1)`;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.borderColor = `rgba(${project.colorRgb},0.3)`;
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Open ERP Demo
                      </Link>
                    ) : (
                      <button
                        onClick={() => setSelectedProject(project.id)}
                        className="relative mt-2 flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg text-sm font-medium border transition-all duration-300 cursor-pointer hover:translate-x-1"
                        style={{ borderColor: `rgba(${project.colorRgb},0.3)`, color: project.color }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = `rgba(${project.colorRgb},0.1)`;
                          e.currentTarget.style.borderColor = `rgba(${project.colorRgb},0.6)`;
                          e.currentTarget.style.boxShadow = `0 0 20px rgba(${project.colorRgb},0.3), 0 0 40px rgba(${project.colorRgb},0.1)`;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.borderColor = `rgba(${project.colorRgb},0.3)`;
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        View Details
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
