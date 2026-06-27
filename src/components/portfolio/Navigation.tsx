'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
] as const;

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('about');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 50);
      const maxScroll = Math.max(document.body.scrollHeight - window.innerHeight, 1);
      setScrollProgress(Math.min(scrollY / 500, 1));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const sectionIds = NAV_LINKS.map((l) => l.href.replace('#', ''));
    const observers: IntersectionObserver[] = [];
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        (entries) => { entries.forEach((e) => { if (e.isIntersecting) setActiveSection(id); }); },
        { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const scrollToSection = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const el = document.getElementById(href.replace('#', ''));
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setMobileMenuOpen(false);
  }, []);

  const bgOpacity = 0.3 + scrollProgress * 0.5;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'border-b border-white/10' : 'border-b border-white/5'}`}
        style={{ backdropFilter: `blur(${16 + scrollProgress * 12}px)`, WebkitBackdropFilter: `blur(${16 + scrollProgress * 12}px)` }}
      >
        <div className="absolute inset-0 transition-colors duration-500" style={{ backgroundColor: `rgba(0,0,0,${bgOpacity})` }} />
        <nav className="relative mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-orange-500 text-sm font-bold text-orange-400 hover:bg-orange-500 hover:text-white transition-colors">AS</span>
            <span className="hidden text-lg font-semibold tracking-tight text-white sm:inline-block">
              Akanksha<span className="text-orange-400">.</span>
            </span>
          </a>
          <ul className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => {
              const sectionId = link.href.replace('#', '');
              const isActive = activeSection === sectionId;
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => scrollToSection(e, link.href)}
                    className={`group relative px-4 py-2 text-sm font-medium transition-colors duration-300 ${isActive ? 'text-orange-400' : 'text-gray-400 hover:text-orange-400'}`}
                  >
                    {link.label}
                    <span className={`absolute bottom-0 left-1/2 h-[2px] -translate-x-1/2 bg-orange-500 transition-all duration-300 ${isActive ? 'w-[60%]' : 'w-0 group-hover:w-[60%]'}`} />
                  </a>
                </li>
              );
            })}
          </ul>
          <div className="flex items-center gap-4">
            <a href="#contact" onClick={(e) => scrollToSection(e, '#contact')} className="hidden rounded-full bg-orange-500 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 hover:bg-orange-400 hover:shadow-orange-500/40 transition-all duration-300 md:inline-flex">
              Hire Me
            </a>
            <button
              className="relative z-50 flex h-10 w-10 items-center justify-center rounded-lg text-white hover:text-orange-400 transition-colors md:hidden cursor-pointer"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>
      </header>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-black/95 backdrop-blur-xl md:hidden">
          <div className="pointer-events-none absolute top-1/4 right-1/4 h-64 w-64 rounded-full bg-orange-500/10 blur-3xl" />
          <nav className="flex flex-col items-center gap-6">
            {NAV_LINKS.map((link) => {
              const sectionId = link.href.replace('#', '');
              const isActive = activeSection === sectionId;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => scrollToSection(e, link.href)}
                  className={`relative text-3xl font-semibold tracking-wide transition-colors duration-300 ${isActive ? 'text-orange-400' : 'text-gray-300 hover:text-orange-400'}`}
                >
                  {link.label}
                </a>
              );
            })}
            <a
              href="#contact"
              onClick={(e) => scrollToSection(e, '#contact')}
              className="mt-6 rounded-full bg-orange-500 px-8 py-3 text-lg font-semibold text-white shadow-lg shadow-orange-500/25 hover:bg-orange-400 transition-all duration-300"
            >
              Hire Me
            </a>
          </nav>
        </div>
      )}
    </>
  );
}
