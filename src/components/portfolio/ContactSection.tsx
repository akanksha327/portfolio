'use client';

import { useRef, useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Github, Linkedin, ExternalLink, Send, Heart } from 'lucide-react';

const socialLinks = [
  { name: 'LinkedIn', href: 'https://linkedin.com/in/akanksha-sahu-b4b68b302', icon: Linkedin },
  { name: 'GitHub', href: 'https://github.com/akanksha327', icon: Github },
  { name: 'LeetCode', href: 'https://leetcode.com/u/Akanksha_sahu_28/', icon: ExternalLink },
  { name: 'Email', href: 'mailto:akankshasahu327@gmail.com', icon: Mail },
];

const contactInfo = [
  { icon: Mail, label: 'Email', value: 'akankshasahu327@gmail.com' },
  { icon: Phone, label: 'Phone', value: '+91 8303121774' },
  { icon: MapPin, label: 'Location', value: 'Mathura, Uttar Pradesh, India' },
];

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { margin: '-100px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    setIsSubmitted(false);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok || data.success === false) {
        throw new Error(data.error || 'Something went wrong. Please try again later.');
      }

      setIsSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    } catch (err: any) {
      console.error(err);
      setSubmitError(err.message || 'Failed to send message.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" ref={sectionRef} className="relative py-24 px-4 sm:px-6 lg:px-8">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-orange-500/[0.04] blur-[120px]" />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-orange-500"
            style={{
              width: Math.random() * 3 + 1,
              height: Math.random() * 3 + 1,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5 + 0.1,
              animation: `particleFloat ${Math.random() * 8 + 5}s ease-in-out ${Math.random() * 6}s infinite`,
            }}
          />
        ))}
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Heading */}
        <div
          className="text-center mb-16"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.8s ease-out',
          }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold tracking-wider text-white mb-4">
            GET IN <span className="text-orange-500">TOUCH</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent mx-auto" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Column */}
          <div
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateX(0) translateY(0)' : 'translateX(-60px) translateY(20px)',
              transition: 'all 0.8s ease-out 0.2s',
            }}
          >
            <h3 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-6">
              Let&apos;s Build Something <span className="text-orange-500">Amazing</span> Together
            </h3>
            <p className="text-gray-300 text-lg leading-relaxed mb-8">
              I&apos;m always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
            </p>
            <div className="flex items-center gap-2 mb-8">
              <div className="w-3 h-3 rounded-full bg-orange-500" style={{ animation: 'glowPulse 2s ease-in-out infinite' }} />
              <div className="w-2 h-2 rounded-full bg-orange-500/60" style={{ animation: 'glowPulse 2s ease-in-out 0.3s infinite' }} />
              <div className="w-1.5 h-1.5 rounded-full bg-orange-500/40" style={{ animation: 'glowPulse 2s ease-in-out 0.6s infinite' }} />
              <div className="h-px flex-1 bg-gradient-to-r from-orange-500/40 to-transparent" />
            </div>
            <div className="flex items-center gap-4">
              {socialLinks.map((link) => (
                <a key={link.name} href={link.href} target="_blank" rel="noopener noreferrer"
                  className="relative group hover:scale-110 transition-transform duration-300">
                  <span className="absolute -inset-1 rounded-full bg-orange-500/20 opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-300" />
                  <span className="relative flex items-center justify-center w-11 h-11 rounded-full border border-white/10 bg-white/5 text-gray-300 group-hover:text-orange-500 group-hover:border-orange-500/50 transition-colors duration-300">
                    <link.icon className="w-5 h-5" />
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Right Column - Form */}
          <div
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateX(0) translateY(0)' : 'translateX(60px) translateY(20px)',
              transition: 'all 0.8s ease-out 0.3s',
            }}
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              <input type="text" placeholder="Your Name" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-5 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-orange-500/50 focus:bg-white/[0.07] focus:ring-1 focus:ring-orange-500/20 focus:shadow-[0_0_20px_rgba(249,115,22,0.15)] transition-all duration-300" />
              <input type="email" placeholder="Your Email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-5 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-orange-500/50 focus:bg-white/[0.07] focus:ring-1 focus:ring-orange-500/20 focus:shadow-[0_0_20px_rgba(249,115,22,0.15)] transition-all duration-300" />
              <textarea placeholder="Your Message" required rows={5} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-5 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-orange-500/50 focus:bg-white/[0.07] focus:ring-1 focus:ring-orange-500/20 focus:shadow-[0_0_20px_rgba(249,115,22,0.15)] transition-all duration-300 resize-none" />
              {submitError && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                  {submitError}
                </div>
              )}
              <button type="submit" disabled={isSubmitting || isSubmitted}
                className="relative w-full py-3.5 px-8 rounded-xl bg-orange-500 text-white font-semibold text-lg transition-colors duration-300 hover:bg-orange-600 disabled:opacity-70 cursor-pointer overflow-hidden">
                <span className="absolute inset-0 rounded-xl bg-orange-500 blur-lg" style={{ animation: 'glowPulse 2s ease-in-out infinite' }} />
                <span className="relative flex items-center justify-center gap-2">
                  {isSubmitting ? (
                    <span>Sending...</span>
                  ) : isSubmitted ? (
                    <span>✓ Message Sent!</span>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <Send className="w-5 h-5" />
                    </>
                  )}
                </span>
              </button>
            </form>
          </div>
        </div>

        {/* Contact Info Cards */}
        <div style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(30px)',
          transition: 'all 0.7s ease-out 0.5s',
        }}>
          <div className="w-full h-px bg-gradient-to-r from-transparent via-orange-500/60 to-transparent mb-12" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            {contactInfo.map((info) => (
              <div key={info.label} className="flex flex-col items-center gap-2 group">
                <span className="relative flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/10 text-orange-500 group-hover:bg-orange-500/10 group-hover:border-orange-500/30 transition-all duration-300">
                  <info.icon className="w-5 h-5" />
                </span>
                <span className="text-sm font-medium text-gray-300 uppercase tracking-wider">{info.label}</span>
                <span className="text-white/80 text-sm sm:text-base">{info.value}</span>
              </div>
            ))}
          </div>
          <div className="w-full h-px bg-gradient-to-r from-transparent via-orange-500/40 to-transparent mt-12 mb-8" />
        </div>

        {/* Footer */}
        <div className="text-center pb-4" style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.8s ease 0.7s' }}>
          <p className="text-gray-400 text-sm flex items-center justify-center gap-1.5">
            &copy; 2025 — Designed &amp; Built by Akanksha Sahu <Heart className="w-3.5 h-3.5 text-orange-500 inline-block fill-orange-500" />
          </p>
        </div>
      </div>
    </section>
  );
}
