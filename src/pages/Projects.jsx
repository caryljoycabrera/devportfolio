import React, { useState, useEffect, useRef } from 'react';
import { Github, ExternalLink, Linkedin, Mail, ArrowRight, Camera } from 'lucide-react';

export default function Projects() {
  const isLightMode = (() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'light';
    }
    return false;
  })();

  useEffect(() => {
    if (isLightMode) {
      document.documentElement.classList.add('light-mode');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.remove('light-mode');
      localStorage.setItem('theme', 'dark');
    }
  }, [isLightMode]);

  // Disable browser zoom (pinch/trackpad, Ctrl/Cmd zoom, gesture) and set viewport
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const viewport = document.querySelector('meta[name="viewport"]');
    const originalContent = viewport ? viewport.getAttribute('content') : null;
    let createdMeta = null;
    if (viewport) {
      viewport.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no');
    } else {
      createdMeta = document.createElement('meta');
      createdMeta.name = 'viewport';
      createdMeta.content = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no';
      document.head.appendChild(createdMeta);
    }

    const wheelHandler = (e) => {
      if (e.ctrlKey || e.metaKey) e.preventDefault();
    };
    const keyHandler = (e) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === '+' || e.key === '-' || e.key === '=' || e.key === '0')) {
        e.preventDefault();
      }
    };
    const gestureHandler = (e) => e.preventDefault();

    window.addEventListener('wheel', wheelHandler, { passive: false });
    window.addEventListener('keydown', keyHandler, { passive: false });
    window.addEventListener('gesturestart', gestureHandler);
    window.addEventListener('gesturechange', gestureHandler);

    return () => {
      if (viewport) {
        if (originalContent !== null) viewport.setAttribute('content', originalContent);
      } else if (createdMeta) {
        createdMeta.remove();
      }
      window.removeEventListener('wheel', wheelHandler);
      window.removeEventListener('keydown', keyHandler);
      window.removeEventListener('gesturestart', gestureHandler);
      window.removeEventListener('gesturechange', gestureHandler);
    };
  }, []);

  // Cursor & ripple effects
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [ripples, setRipples] = useState([]);
  const rippleIdRef = useRef(0);

  useEffect(() => {
    let lastRippleTime = 0;
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      const now = Date.now();
      if (now - lastRippleTime > 600) {
        lastRippleTime = now;
        const id = rippleIdRef.current++;
        setRipples(prev => [...prev.slice(-3), { id, x: e.clientX, y: e.clientY, startTime: now }]);
        setTimeout(() => {
          setRipples(prev => prev.filter(r => r.id !== id));
        }, 2000);
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Page fade-in
  const [pageVisible, setPageVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setPageVisible(true), 100);
  }, []);

  // Scroll animations
  const [visibleSections, setVisibleSections] = useState({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0, rootMargin: '0px 0px 0px 0px' }
    );
    const sections = document.querySelectorAll('.animate-on-scroll');
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const [activeTab, setActiveTab] = useState('Technical Solutions');

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  const sectionClass = (id) => 
    `transition-all duration-1000 ${visibleSections[id] ? 'opacity-100 translate-y-0' : 'opacity-0 sm:translate-y-8'}`;

  const projects = [
    {
      title: 'SCO Creative Optimization for Requests and Engagement System (S-CORE)',
      description: 'A centralized web-based system designed to automate service requests, approval workflows, and task monitoring with performance analytics.',
      tech: ['Node.js', 'Express', 'MongoDB', 'EJS', 'JavaScript', 'DigitalOcean'],
      type: 'Institutional Office Website',
      status: 'Completed',
      year: '2025',
      category: 'Technical Solutions',
      image: '/images/project1.png',
      link: 'https://dlsuds-core.me',
      github: 'https://github.com/caryljoycabrera/S-CORE.git'
    },
    {
      title: 'CareSync: A Mobile Solution for Elderly Medication Adherence',
      description: 'A mobile application that assists elderly individuals and their caregiversin managing their medication schedules through notification reminders, alarms, and tracking.',
      tech: ['Flutter', 'Dart', 'Firebase'],
      type: 'Mobile App',
      status: 'Completed',
      year: '2025',
      category: 'Technical Solutions',
      image: '/images/project2.png',
      link: null,
      github: 'https://github.com/carebear1919/caresync_mobileapplication.git'
    },
    {
      title: 'Caryl\'s Portfolio',
      description: 'A modern portfolio featuring custom animations, responsive design, and a showcase of skills, projects, and achievements.',
      tech: ['React', 'Tailwind CSS', 'JavaScript', 'Vercel'],
      type: 'Personal Portfolio Website',
      status: 'Completed',
      year: '2025',
      category: 'Technical Solutions',
      image: '/images/project3.png',
      link: null,
      github: 'https://github.com/caryljoycabrera/devportfolio.git'
    },
    {
      title: 'Foodpanda x Wendy\'s Mega Collaboration',
      description: 'A themed kiosk ordering system for multiple food brands, featuring menu browsing, cart management, and order checkout functionalities.',
      tech: ['Node.js', 'Express', 'EJS', 'JavaScript'],
      type: 'Online Ordering Website',
      status: 'Completed',
      year: '2025',
      category: 'Technical Solutions',
      image: '/images/project4.png',
      link: null,
      github: 'https://github.com/caryljoycabrera/Foodpanda-Wendys-Collab.git'
    },
    {
      title: 'PBB Celebrity Edition: The Big Night',
      description: 'An event registration system for reality TV show awarding event, allowing participants to register and manage their attendance seamlessly.',
      tech: ['Google Apps Script', 'Google Sheets', 'JavaScript', 'GitHub Pages'],
      type: 'Event Registration System',
      status: 'Completed',
      year: '2025',
      category: 'Technical Solutions',
      image: '/images/project5.png',
      link: 'https://caryljoycabrera.github.io/PBB-Big-Night/',
      github: 'https://github.com/caryljoycabrera/PBB-Big-Night.git'
    },
    {
      title: 'Purrfect Care',
      description: 'A comprehensive pet shelter management system facilitating animal intake, adoption processes, donation records, and announcements.',
      tech: ['ASP.NET', 'C#', 'MySQL', 'MVC Architecture'],
      type: 'Pet Shelter Services Website',
      status: 'Completed',
      year: '2024 ',
      category: 'Technical Solutions',
      image: '/images/project6.png',
      link: null,
      github: null
    },
    {
      title: 'University Scholarship System',
      description: 'A scholarship management system streamlining scholar monitoring and tuition deduction processes for the scholarship office of an institution.',
      tech: ['ASP.NET', 'C#', 'MySQL', 'MVC Architecture'],
      type: 'Scholarship Website',
      status: 'Completed',
      year: '2024',
      category: 'Technical Solutions',
      image: '/images/project7.png',
      link: null,
      github: null
    },
    {
      title: 'Go Glow Grocery Mobile App',
      description: 'A mobile app prototype for a grocery order calculator and receipt generator to assist in streamlining checkout processes, improving accuracy and efficiency for cashiers.',
      tech: ['Android Studio', 'Java'],
      type: 'Mobile App Design',
      status: 'Completed',
      year: '2024',
      category: 'Technical Solutions',
      image: '/images/project8.png',
      link: 'https://drive.google.com/file/d/1X7ukcjH0se3gr857oIqdLAgB_9SiKCJp/view?usp=sharing',
      github: 'https://github.com/caryljoycabrera/GoGlowGrowceryApp.git'
    },
    {
      title: 'Google Flights Mobile App',
      description: 'A mobile app prototype for Google Flights, focusing on user-friendly flight search, booking, seat selection, and payment features with passenger approval and list.',
      tech: ['Figma'],
      type: 'Mobile App Design',
      status: 'Completed',
      year: '2023',
      category: 'Technical Solutions',
      image: '/images/project9.png',
      link: 'https://www.figma.com/proto/G6SmUceq9KK46PYzCGMJzz/Google-Flights?node-id=2-140&p=f&t=grTawYpATDk9AJFF-1&scaling=scale-down&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=2%3A2',
      github: null
    },
    {
      title: 'Women in Tech Global Conference 2023',
      description: 'A website for the Women in Tech Global Conference 2023, providing event details, program information, registration, partners, and contact functionalities.', 
      tech: ['Wix'],
      type: 'Event Website',
      status: 'Completed',
      year: '2022',
      category: 'Technical Solutions',
      image: '/images/project10.png',
      link: 'https://girlcodenetwork.wixsite.com/witg2023',
      github: null
    },
    {
      title: 'Realest and Deepest',
      description: 'A group blog website focusing on personal development topics, featuring articles, resources, community engagement, and interactive elements.',
      tech: ['Wix'],
      type: 'Blog Website',
      status: 'Completed',
      year: '2021',
      category: 'Technical Solutions',
      image: '/images/project11.png',
      link: 'https://realestanddeepest.wixsite.com/perdev',
      github: null
    }
  ];

  const filteredProjects = projects.filter(p => p.category === activeTab);

  const projectsPerPage = 12;
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);
  const paginatedProjects = filteredProjects.slice((currentPage - 1) * projectsPerPage, currentPage * projectsPerPage);

  return (
    <div className={`min-h-screen relative overflow-x-hidden w-full transition-all duration-300 ${isLightMode ? 'bg-slate-50 text-slate-900' : 'bg-slate-950 text-slate-100'}`} style={{ userSelect: 'none' }}>
      {/* Full Home styles (font, projects section, light-mode effects) copied for parity */}
      <style>{`
        html, body {
          min-width: 100vw;
          min-height: 100vh;
          background: #0f172a !important; /* Tailwind's bg-slate-950 */
          overflow-x: hidden;
          transition: background 0.3s ease;
        }
        html.light-mode, html.light-mode body {
          background: #f8fafc !important; /* Tailwind's slate-50 */
        }
        #root {
          min-height: 100vh;
        }
        html {
          scroll-behavior: smooth;
        }
        /* Arsenica Antiqua font for section titles */
        @font-face {
          font-family: 'Arsenica Antiqua';
          src: url('/fonts/ArsenicaAntiqua.ttf') format('truetype');
          font-weight: normal;
          font-style: normal;
        }
        /* Only apply to main section titles, not all h2/h3 */
        .max-w-5xl > h1,
        .max-w-5xl > h2,
        .max-w-5xl > h3,
        .max-w-6xl > h1,
        .max-w-6xl > h2,
        .max-w-6xl > h3 {
          font-family: 'Arsenica Antiqua', serif !important;
        }
        /* Prevent text selection globally */
        html, body, #root, .unselectable, .bg-slate-950 {
          -webkit-user-select: none !important;
          -moz-user-select: none !important;
          -ms-user-select: none !important;
          user-select: none !important;
        }
        *::selection {
          background: transparent !important;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes glow {
          0%, 100% { opacity: 0.4; filter: blur(20px); }
          50% { opacity: 0.8; filter: blur(30px); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes ripple {
          0% { 
            transform: translate(-50%, -50%) scale(0);
            opacity: 1;
          }
          100% { 
            transform: translate(-50%, -50%) scale(1);
            opacity: 0;
          }
        }
        @keyframes textReveal {
          from { clip-path: inset(0 100% 0 0); }
          to { clip-path: inset(0 0% 0 0); }
        }
        @keyframes borderGlow {
          0%, 100% { border-color: rgba(236, 72, 153, 0.3); }
          50% { border-color: rgba(168, 85, 247, 0.5); }
        }
        .float { animation: float 6s ease-in-out infinite; }
        .glow { animation: glow 4s ease-in-out infinite; }
        .slide-up { animation: slideUp 0.8s ease-out forwards; }
        .fade-in { animation: fadeIn 1s ease-out forwards; }
        .shimmer-text {
          background: linear-gradient(90deg, #ec4899, #a855f7, #3b82f6, #a855f7, #ec4899);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 12s linear infinite;
        }
        .static-shimmer-text {
          background: linear-gradient(90deg, #ec4899, #a855f7, #3b82f6, #a855f7, #ec4899);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .border-glow { animation: borderGlow 3s ease-in-out infinite; }
        .stagger-1 { animation-delay: 0.1s; }
        .stagger-2 { animation-delay: 0.2s; }
        .stagger-3 { animation-delay: 0.3s; }
        .stagger-4 { animation-delay: 0.4s; }
        .stagger-5 { animation-delay: 0.5s; }
        .cursor-blink::after {
          content: '|';
          animation: blink 1s step-end infinite;
        }
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        .photo-placeholder {
          background: linear-gradient(135deg, rgba(236, 72, 153, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%);
          border: 2px dashed rgba(236, 72, 153, 0.3);
        }
        .tech-icon {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .tech-icon:hover {
          transform: translateY(-8px) scale(1.1);
          filter: drop-shadow(0 10px 20px rgba(236, 72, 153, 0.3));
        }
        .arsenica-antiqua {
          font-family: 'Arsenica Antiqua', serif !important;
        }
        
        /* Light mode styles */
        html.light-mode, html.light-mode body {
          background: #f8fafc !important; /* Tailwind's slate-50 */
        }
        html.light-mode .bg-slate-950 {
          background: #f8fafc !important;
          color: #1e293b !important;
        }
        html.light-mode .text-slate-100 {
          color: #0f172a !important;
        }
        html.light-mode .text-slate-200 {
          color: #1e293b !important;
        }
        html.light-mode .text-slate-300 {
          color: #334155 !important;
        }
        html.light-mode .text-slate-400 {
          color: #475569 !important;
        }
        html.light-mode .text-slate-500 {
          color: #64748b !important;
        }
        html.light-mode .text-slate-600 {
          color: #475569 !important;
        }
        html.light-mode .text-slate-700 {
          color: #334155 !important;
        }
        html.light-mode .bg-slate-900\\/50,
        html.light-mode .bg-slate-900\\/40 {
          background: rgba(241, 245, 249, 0.9) !important;
          border-color: #cbd5e1 !important;
        }
        html.light-mode .bg-slate-950/80 {
          background: rgba(241, 245, 249, 0.95) !important;
        }
        html.light-mode .bg-slate-900/40 {
          background: rgba(241, 245, 249, 0.7) !important;
        }
        html.light-mode .border-slate-800 {
          border-color: #cbd5e1 !important;
        }
        html.light-mode .border-slate-900 {
          border-color: #e2e8f0 !important;
        }
        html.light-mode .border-slate-700 {
          border-color: #cbd5e1 !important;
        }
        html.light-mode .bg-slate-800/50 {
          background: rgba(226, 232, 240, 0.7) !important;
        }
        html.light-mode .bg-slate-800 {
          background: #e2e8f0 !important;
        }
        html.light-mode .shimmer-text {
          background: linear-gradient(90deg, #db2777, #9333ea, #2563eb, #9333ea, #db2777);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        html.light-mode .static-shimmer-text {
          background: linear-gradient(90deg, #db2777, #9333ea, #2563eb, #9333ea, #db2777);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        html.light-mode .bg-pink-500/10,
        html.light-mode .bg-purple-500/10,
        html.light-mode .bg-blue-500/10 {
          opacity: 0.7;
        }
        /* Light mode gradient backgrounds */
        html.light-mode .from-pink-600/20,
        html.light-mode .to-purple-600/20 {
          --tw-gradient-from: rgba(219, 39, 119, 0.15);
          --tw-gradient-to: rgba(147, 51, 234, 0.15);
        }
        html.light-mode .from-pink-900/10,
        html.light-mode .via-purple-900/10,
        html.light-mode .to-blue-900/10 {
          background: linear-gradient(to right, rgba(219, 39, 119, 0.08), rgba(147, 51, 234, 0.08), rgba(37, 99, 235, 0.08)) !important;
        }
        html.light-mode .from-blue-900/20,
        html.light-mode .to-purple-900/20 {
          background: linear-gradient(to right, rgba(37, 99, 235, 0.1), rgba(147, 51, 234, 0.1)) !important;
        }
        html.light-mode .from-yellow-600/20,
        html.light-mode .to-orange-600/20 {
          background: linear-gradient(to bottom right, rgba(202, 138, 4, 0.15), rgba(234, 88, 12, 0.15)) !important;
        }
        html.light-mode .from-pink-600/10,
        html.light-mode .to-purple-600/10 {
          background: linear-gradient(to right, rgba(219, 39, 119, 0.08), rgba(147, 51, 234, 0.08)) !important;
        }
        /* Light mode photo placeholder */
        html.light-mode .photo-placeholder {
          background: linear-gradient(135deg, rgba(219, 39, 119, 0.08) 0%, rgba(147, 51, 234, 0.08) 100%);
          border-color: rgba(219, 39, 119, 0.25);
        }
        /* Light mode border glow */
        html.light-mode .border-glow {
          border-color: rgba(219, 39, 119, 0.4) !important;
        }
        /* Light mode status badges */
        html.light-mode .bg-green-500/20 {
          background: rgba(34, 197, 94, 0.15) !important;
        }
        html.light-mode .bg-yellow-500/20 {
          background: rgba(234, 179, 8, 0.15) !important;
        }
        /* Light mode footer text */
        html.light-mode .border-pink-800/30 {
          border-color: rgba(219, 39, 119, 0.2) !important;
        }
        html.light-mode .border-pink-500/20 {
          border-color: rgba(219, 39, 119, 0.25) !important;
        }
        html.light-mode .border-blue-500/20 {
          border-color: rgba(37, 99, 235, 0.25) !important;
        }
        /* Light mode social links */
        html.light-mode .bg-slate-900\\/50 {
          background: rgba(255, 255, 255, 0.5) !important;
        }
        html.light-mode .border-slate-800 {
          border-color: rgba(209, 213, 219, 1) !important;
        }
        html.light-mode .text-slate-400 {
          color: rgba(107, 114, 128, 1) !important;
        }
        /* Prevent hero name descenders from being clipped on small screens */
        /* More generous spacing for a range of small screens to avoid clipping */
        @media (max-width: 820px) {
          #hero h1.hero-name {
            padding-bottom: 0.7em !important;
            line-height: 1.18 !important;
            overflow: visible !important;
            margin-bottom: 1.05rem !important;
          }
          /* Keep the gradient span inline-block and add slight bottom padding */
          #hero h1.hero-name .shimmer-text {
            display: inline-block !important;
            padding-bottom: 0.22em !important;
          }
        }
        /* Light mode invert for dark icons */
        html.light-mode .invert {
          filter: invert(0) !important;
        }
        /* Keep white text on specific buttons */
        html.light-mode .keep-white-text {
          color: white !important;
        }
        /* Light mode project cards - Apple liquid glass design */
        html.light-mode .group.bg-slate-900\\/50.backdrop-blur {
          background: linear-gradient(135deg, rgba(241, 245, 249, 0.8) 0%, rgba(226, 232, 240, 0.6) 50%, rgba(241, 245, 249, 0.7) 100%) !important;
          backdrop-filter: blur(24px) saturate(180%) !important;
          border: 1px solid rgba(255, 255, 255, 0.2) !important;
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.08),
            0 2px 16px rgba(0, 0, 0, 0.04),
            inset 0 1px 0 rgba(255, 255, 255, 0.8),
            inset 0 -1px 0 rgba(0, 0, 0, 0.05) !important;
          position: relative !important;
        }
        html.light-mode .group.bg-slate-900\\/50.backdrop-blur::before {
          content: '' !important;
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          bottom: 0 !important;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, transparent 30%, transparent 70%, rgba(0, 0, 0, 0.02) 100%) !important;
          border-radius: inherit !important;
          pointer-events: none !important;
        }
        html.light-mode .group.bg-slate-900\\/50.backdrop-blur:hover {
          background: linear-gradient(135deg, rgba(241, 245, 249, 0.9) 0%, rgba(226, 232, 240, 0.75) 50%, rgba(241, 245, 249, 0.85) 100%) !important;
          backdrop-filter: blur(28px) saturate(200%) !important;
          border-color: rgba(236, 72, 153, 0.4) !important;
          box-shadow: 
            0 16px 48px rgba(0, 0, 0, 0.12),
            0 4px 24px rgba(0, 0, 0, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.9),
            inset 0 -1px 0 rgba(0, 0, 0, 0.03),
            0 0 0 1px rgba(236, 72, 153, 0.1) !important;
          transform: translateY(-2px) !important;
        }
        html.light-mode .group.bg-slate-900\\/50.backdrop-blur:hover::before {
          background: linear-gradient(135deg, rgba(236, 72, 153, 0.08) 0%, transparent 40%, transparent 60%, rgba(0, 0, 0, 0.01) 100%) !important;
        }
        /* Light mode quick facts cards - liquid glass effect */
        html.light-mode .bg-slate-900\\/50.backdrop-blur:not(.group) {
          background: linear-gradient(135deg, rgba(241, 245, 249, 0.75) 0%, rgba(226, 232, 240, 0.55) 50%, rgba(241, 245, 249, 0.65) 100%) !important;
          backdrop-filter: blur(20px) saturate(160%) !important;
          border: 1px solid rgba(255, 255, 255, 0.15) !important;
          box-shadow: 
            0 6px 24px rgba(0, 0, 0, 0.06),
            0 1px 8px rgba(0, 0, 0, 0.03),
            inset 0 1px 0 rgba(255, 255, 255, 0.7),
            inset 0 -1px 0 rgba(0, 0, 0, 0.04) !important;
        }
        html.light-mode .bg-slate-900\\/50.backdrop-blur:not(.group):hover {
          background: linear-gradient(135deg, rgba(241, 245, 249, 0.85) 0%, rgba(226, 232, 240, 0.7) 50%, rgba(241, 245, 249, 0.8) 100%) !important;
          backdrop-filter: blur(24px) saturate(180%) !important;
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.08),
            0 2px 12px rgba(0, 0, 0, 0.04),
            inset 0 1px 0 rgba(255, 255, 255, 0.8),
            inset 0 -1px 0 rgba(0, 0, 0, 0.03) !important;
        }
        /* Light mode photo placeholder - liquid glass effect */
        html.light-mode .photo-placeholder {
          background: linear-gradient(135deg, rgba(241, 245, 249, 0.7) 0%, rgba(226, 232, 240, 0.5) 50%, rgba(241, 245, 249, 0.6) 100%) !important;
          backdrop-filter: blur(16px) saturate(140%) !important;
          border-color: rgba(236, 72, 153, 0.4) !important;
          box-shadow: 
            0 4px 20px rgba(0, 0, 0, 0.05),
            inset 0 1px 0 rgba(255, 255, 255, 0.6),
            inset 0 -1px 0 rgba(0, 0, 0, 0.03) !important;
        }
        /* Light mode value pills/tech badges - liquid glass effect */
        html.light-mode .bg-slate-900\\/80 {
          background: linear-gradient(135deg, rgba(241, 245, 249, 0.8) 0%, rgba(226, 232, 240, 0.7) 100%) !important;
          backdrop-filter: blur(12px) saturate(120%) !important;
          border-color: rgba(255, 255, 255, 0.2) !important;
          box-shadow: 
            0 2px 12px rgba(0, 0, 0, 0.04),
            inset 0 1px 0 rgba(255, 255, 255, 0.7) !important;
        }
        html.light-mode .bg-slate-900\\/80:hover {
          background: linear-gradient(135deg, rgba(241, 245, 249, 0.9) 0%, rgba(226, 232, 240, 0.85) 100%) !important;
          backdrop-filter: blur(16px) saturate(140%) !important;
          box-shadow: 
            0 4px 16px rgba(0, 0, 0, 0.06),
            inset 0 1px 0 rgba(255, 255, 255, 0.8) !important;
        }
        /* Light mode tooltips - subtle glass effect */
        html.light-mode .bg-slate-800 {
          background: rgba(241, 245, 249, 0.95) !important;
          backdrop-filter: blur(8px) !important;
          border: 1px solid rgba(0, 0, 0, 0.1) !important;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08) !important;
        }
        /* Light mode colored text improvements */
        html.light-mode .text-pink-400 {
          color: #be185d !important; /* Darker pink for better contrast */
        }
        html.light-mode .text-purple-400 {
          color: #7c3aed !important; /* Darker purple for better contrast */
        }
        html.light-mode .text-blue-400 {
          color: #1d4ed8 !important; /* Darker blue for better contrast */
        }
        html.light-mode .text-green-400 {
          color: #15803d !important; /* Darker green for better contrast */
        }
        html.light-mode .text-yellow-400 {
          color: #ca8a04 !important; /* Darker yellow for better contrast */
        }
        /* Light mode ripple effects - more visible borders */
        html.light-mode .border-pink-400/40 {
          border-color: rgba(236, 72, 153, 0.6) !important;
        }
        html.light-mode .border-purple-400/30 {
          border-color: rgba(168, 85, 247, 0.5) !important;
        }
        html.light-mode .border-blue-400/20 {
          border-color: rgba(59, 130, 246, 0.4) !important;
        }
        /* Light mode tabs */
        html.light-mode button.bg-slate-800 {
          background: #e2e8f0 !important;
          color: #475569 !important;
          border: 1px solid #cbd5e1 !important;
        }
        html.light-mode button.bg-slate-800:hover {
          background: #cbd5e1 !important;
        }
        html.light-mode button.bg-pink-500 {
          background: #ec4899 !important;
          color: white !important;
        }
      `}</style>

      {/* Ripple effects */}
      {ripples.map(ripple => (
        <div key={ripple.id} className="fixed pointer-events-none z-0" style={{ left: ripple.x, top: ripple.y }}>
          <div className="absolute rounded-full border border-pink-400/40" style={{ width: '150px', height: '150px', animation: 'ripple 2s ease-out forwards' }} />
          <div className="absolute rounded-full border border-purple-400/30" style={{ width: '250px', height: '250px', animation: 'ripple 2s ease-out 0.15s forwards', opacity: 0 }} />
          <div className="absolute rounded-full border border-blue-400/20" style={{ width: '350px', height: '350px', animation: 'ripple 2s ease-out 0.3s forwards', opacity: 0 }} />
        </div>
      ))}

      {/* Cursor glow following mouse */}
      <div className="fixed pointer-events-none z-0 transition-opacity duration-300" style={{ left: mousePos.x, top: mousePos.y, transform: 'translate(-50%, -50%)' }}>
        <div className="absolute rounded-full" style={{ width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(236, 72, 153, 0.12) 0%, rgba(168, 85, 247, 0.06) 40%, transparent 70%)', transform: 'translate(-50%, -50%)' }} />
        <div className="absolute rounded-full" style={{ width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(59, 130, 246, 0.04) 0%, transparent 60%)', transform: 'translate(-50%, -50%)' }} />
      </div>

      <div className={`transition-opacity duration-1000 ${pageVisible ? 'opacity-100' : 'opacity-0'}`}>

      {/* Main Content */}
      <div id="projects-section" className={`pt-20 px-4 sm:px-6 pb-16 animate-on-scroll ${sectionClass('projects-section')}`}>
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center">
            All <span className="shimmer-text">Projects</span>
          </h1>
          <p className="text-slate-400 text-center mb-12 max-w-2xl mx-auto">A comprehensive showcase of my work across technical solutions, community leadership, and creative outputs.</p>

          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {['Technical Solutions', 'Community Leadership', 'Creative Outputs'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded transition-colors ${
                  activeTab === tab 
                    ? 'bg-pink-500 text-white' 
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {paginatedProjects.map((project, idx) => (
              <div key={idx} className="group bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl overflow-hidden hover:border-pink-500/30 transition-all duration-500 hover:-translate-y-2">
                <div className="photo-placeholder aspect-video flex items-center justify-center group-hover:border-pink-500/50 transition-all">
                  {project.image ? (
                    <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-slate-500">
                      <Camera size={32} className="group-hover:text-pink-400 transition-colors" />
                      <span className="text-xs">Project Screenshot</span>
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-xs px-2 py-1 rounded ${project.status === 'Completed' ? 'bg-green-500/20 text-green-400' : project.status === 'In Development' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-slate-500/20 text-slate-400'}`}>{project.status}</span>
                    <div className="flex flex-col items-end gap-1"><span className="text-xs text-slate-500">{project.type}</span><span className="text-xs text-slate-400 font-mono">{project.year}</span></div>
                  </div>

                  <h3 className="text-lg font-semibold text-slate-100 mb-2 group-hover:text-pink-400 transition-colors">{project.title}</h3>
                  <p className="text-slate-400 text-sm mb-4 leading-relaxed">{project.description}</p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.tech.map((t, i) => (
                      <span key={i} className="text-xs px-2 py-1 bg-slate-900/80 border border-slate-800 hover:border-pink-500/50 text-slate-400 rounded-full">
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    {project.link && (<a href={project.link} target="_blank" rel="noopener noreferrer" className="text-sm text-pink-400 hover:text-pink-300 flex items-center gap-1"><ExternalLink size={14} /> View</a>)}
                    {project.github && (<a href={project.github} target="_blank" rel="noopener noreferrer" className="text-sm text-slate-400 hover:text-slate-300 flex items-center gap-1"><Github size={14} /> Code</a>)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => {
                    setCurrentPage(page);
                    if (typeof window !== 'undefined') {
                      document.documentElement.scrollTop = 0;
                      document.body.scrollTop = 0;
                      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                    }
                  }}
                  className={`px-3 py-2 rounded transition-colors ${
                    currentPage === page
                      ? 'bg-pink-500 text-white'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer copied from Home.jsx for consistent contact area */}
      <footer id="contact" className={`py-16 sm:py-24 px-4 sm:px-6 border-t border-slate-900 relative animate-on-scroll ${sectionClass('contact')}`}>
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-12">
            <h2 className="text-3xl xs:text-4xl md:text-5xl font-bold mb-6">
              <span className="shimmer-text arsenica-antiqua">Let's Create Something Unforgettable</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
              I'm open to internships, freelance projects, and collaborations. 
              If you're working on something that needs <span className="text-pink-400">strategy</span>, 
              <span className="text-purple-400"> creativity</span>, and a <span className="text-blue-400">meaningful approach</span>, I'd love to be part of it.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-8 sm:mb-12">
            <a href="mailto:caryldcabrera@gmail.com" 
               className="group px-8 py-4 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 rounded-xl transition-all duration-300 font-medium text-lg shadow-lg shadow-pink-500/20 hover:shadow-pink-500/40 flex items-center gap-2 keep-white-text">
              <Mail size={20} />
              caryldcabrera@gmail.com
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          <div className="flex justify-center gap-2 sm:gap-4 mb-8 sm:mb-12">
            <a href="https://linkedin.com/in/caryljoycabrera" 
               target="_blank" 
               rel="noopener noreferrer"
               className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl hover:border-pink-500/50 hover:bg-pink-500/5 transition-all group">
              <Linkedin size={24} className="text-slate-400 group-hover:text-pink-400 transition-colors" />
            </a>
            <a href="https://github.com/caryljoycabrera" 
               target="_blank" 
               rel="noopener noreferrer"
               className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl hover:border-purple-500/50 hover:bg-purple-500/5 transition-all group">
              <Github size={24} className="text-slate-400 group-hover:text-purple-400 transition-colors" />
            </a>
          </div>

          <div className="pt-6 sm:pt-8 border-t border-slate-900">
            <p className="text-slate-600 text-sm mb-2">
              Designed with the heart. Built with React.
            </p>
            <p className="text-slate-700 text-sm">
              © {new Date().getFullYear()} Caryl Joy Cabrera
            </p>
          </div>
        </div>
      </footer>

      <style>{`@keyframes ripple { 0% { transform: translate(-50%, -50%) scale(0); opacity: 1 } 100% { transform: translate(-50%, -50%) scale(1); opacity: 0 } }`}</style>
      </div>
    </div>
  );
}
