// src/pages/Home.js
import React, { useState, useEffect, useRef } from 'react';
import { Github, Linkedin, Mail, ExternalLink, ChevronDown, Code, Sparkles, Heart, Zap, Trophy, Star, ArrowRight, Quote, Camera, GraduationCap, Lightbulb } from 'lucide-react';
import { Phone } from 'lucide-react';

export default function Home() {
    // Light mode state with localStorage persistence
    const [isLightMode, setIsLightMode] = useState(() => {
      if (typeof window !== 'undefined') {
        return localStorage.getItem('theme') === 'light';
      }
      return false;
    });

    // Apply theme on mount and when it changes
    useEffect(() => {
      if (isLightMode) {
        document.documentElement.classList.add('light-mode');
        localStorage.setItem('theme', 'light');
      } else {
        document.documentElement.classList.remove('light-mode');
        localStorage.setItem('theme', 'dark');
      }
    }, [isLightMode]);

    // Scroll to top on page load
    useEffect(() => {
      window.scrollTo(0, 0);
    }, []);
    // Header icons with individual spacing (add 'spacing' property)
    const headerLinks = [
      {
        href: null, // We'll use onClick for smooth scroll
        label: 'Home',
        icon: (
          <img src="/logo.svg" alt="Logo" className="w-9 h-9 hover:scale-110 transition-transform" />
        ),
        external: false,
        spacing: 'mr-2', // Example: right margin
        onClick: (e) => {
          e.preventDefault();
          const hero = document.getElementById('hero');
          if (hero) {
            hero.scrollIntoView({ behavior: 'smooth' });
          }
        }
      },
      {
        href: 'https://linkedin.com/in/caryljoycabrera',
        label: 'LinkedIn',
        icon: <Linkedin size={22} className="text-slate-400 hover:text-pink-400 transition-colors" />, 
        external: true,
        spacing: 'mr-3' // Example: horizontal margin
      },
      {
        href: 'mailto:caryldcabrera@gmail.com',
        label: 'Email',
        icon: <Mail size={22} className="text-slate-400 hover:text-pink-400 transition-colors" />, 
        external: false,
        spacing: 'mr-2' // Example: left margin
      },
      {
        href: null,
        label: 'Toggle Light Mode',
        icon: <Lightbulb size={22} className={`transition-colors ${isLightMode ? 'text-yellow-400 fill-yellow-400' : 'text-slate-400 hover:text-yellow-400'}`} />,
        external: false,
        spacing: '',
        onClick: (e) => {
          e.preventDefault();
          setIsLightMode(prev => !prev);
        }
      }
    ];
  const [visibleSections, setVisibleSections] = useState({});
  const [heroTextVisible, setHeroTextVisible] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [ripples, setRipples] = useState([]);
  const particlesRef = useRef([]);
  const rippleIdRef = useRef(0);
  
  const tagline = "I build with intention.";

  // Generate stable particle positions on mount (increased to 24 dots)
  useEffect(() => {
    // Create a more scattered and balanced grid of particles
    const rows = 4;
    const cols = 6;
    const total = rows * cols;
    const xSpacing = 100 / cols;
    const ySpacing = 100 / rows;
    particlesRef.current = Array.from({ length: total }).map((_, i) => {
      const row = Math.floor(i / cols);
      const col = i % cols;
      // Edge-to-edge scatter, no margins
      const baseX = col * xSpacing + Math.random() * xSpacing;
      const baseY = row * ySpacing + Math.random() * ySpacing;
      return {
        id: i,
        baseX,
        baseY,
        color: ['#ec4899', '#a855f7', '#3b82f6'][i % 3],
        delay: i * 0.15,
        duration: 7 + (i % 3) * 2
      };
    });
  }, []);

  // Typing effect for tagline
  useEffect(() => {
    setHeroTextVisible(true);
    let index = 0;
    const timer = setInterval(() => {
      if (index <= tagline.length) {
        setTypedText(tagline.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 80);
    return () => clearInterval(timer);
  }, []);

  // Intersection observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    document.querySelectorAll('section[id]').forEach((section) => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  // Cursor tracking with ripple creation (no smoothing)
  useEffect(() => {
    let lastRippleTime = 0;
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      // Create ripple every 600ms while moving
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

  // Tech stack with logo URLs (ordered and expanded)
  const techStack = [
    { name: 'JavaScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
    { name: 'TypeScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' },
    { name: 'React', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
    { name: 'Node.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' },
    { name: 'Express', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg', invert: true },
    { name: 'MongoDB', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg' },
    { name: 'ASP.NET', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dotnetcore/dotnetcore-original.svg' },
    { name: 'Java', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg' },
    { name: 'Python', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
    { name: 'C#', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg' },
    { name: 'PHP', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg' },
    { name: 'Dart', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dart/dart-original.svg' },
    { name: 'Flutter', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg' },
    { name: 'MySQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg' },
    { name: 'HTML', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg' },
    { name: 'CSS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg' },
    { name: 'Sass', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sass/sass-original.svg' },
    { name: 'Visual Studio Code', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg' },
    { name: 'Visual Studio', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/visualstudio/visualstudio-plain.svg' },
    { name: 'Figma', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg' },
    { name: 'Android Studio', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/androidstudio/androidstudio-original.svg' },
    { name: 'Apache NetBeans', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/netbeans/netbeans-original.svg' },
    { name: 'GitHub', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg', invert: true },
    { name: 'Google Apps Script', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg' }
  ];

  const projects = [
    {
      title: 'SCO Creative Optimization for Requests and Engagement System (S-CORE)',
      description: 'A centralized web-based system designed to automate service requests, approval workflows, and task monitoring with performance analytics.',
      tech: ['Node.js', 'Express', 'MongoDB', 'EJS'],
      type: 'Institutional Office Website',
      status: 'Completed',
      image: '/images/project1.png',
      link: 'https://dlsuds-core.me',
      github: null,
    },
    {
      title: 'Project Name Here',
      description: 'Brief description of what this project does and the problem it solves.',
      tech: ['React', 'Node.js', 'MongoDB'],
      type: 'Web Application',
      status: 'In Development',
      image: null,
      link: null,
    },
    {
      title: 'Caryl\'s Portfolio',
      description: 'A modern portfolio featuring custom animations, responsive design, and a showcase of projects, skills, and achievements.',
      tech: ['React', 'Tailwind CSS', 'JavaScript'],
      type: 'Personal Portfolio Website',
      status: 'Completed',
      image: '/images/project3.png',
      link: 'https://carylcabrera.vercel.app'
    },
    {
      title: 'Google Flights Mobile App',
      description: 'A mobile app prototype for Google Flights, focusing on user-friendly flight search, booking, seat selection, and payment features with passenger approval and list.',
      tech: ['Figma'],
      type: 'Mobile App Design',
      status: 'Completed',
      image: '/images/project6.png',
      link: 'https://www.figma.com/proto/G6SmUceq9KK46PYzCGMJzz/Google-Flights?node-id=2-140&p=f&t=grTawYpATDk9AJFF-1&scaling=scale-down&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=2%3A2'
    }
  ];

  const awards = [
    {
      title: 'Lider ng Taon',
      event: 'Luntiang Parangal',
      year: '2025',
      description: 'Recognized for exceptional leadership in student council'
    },
    {
      title: 'Opisyal ng Taon',
      event: 'Luntiang Parangal',
      year: '2025',
      description: 'Awarded for outstanding performance as student officer'
    },
    {
      title: 'Best Project Head',
      event: 'Council of Student Organizations Awarding',
      year: '2025',
      description: 'Led successful institutional events and initiatives'
    },
    {
      title: 'Outstanding Monitoring Executive Board',
      event: 'Council of Student Organizations Awarding',
      year: '2025',
      description: 'Excelled in oversight and support of student organizations'
    },
  ];

  const education = {
    degree: 'Bachelor of Science in Information Technology',
    specialization: 'Web Development',
    university: 'De La Salle University – Dasmariñas',
    graduation: 'June 2026',
    gpa: '3.89/4.00',
    honors: ['Consistent Dean\'s Lister', 'Academic Scholarship', 'Municipality Scholarship', 'District Scholarship', 'Student Financial Aid Grant'],
    achievement: 'Developed an online request approval and management system adopted by Strategic Communications Office'
  };

  const certifications = [
    {
      title: 'IT Specialist – Databases',
      org: 'Certiport',
      year: '2024',
      icon: '🗄️'
    },
    {
      title: 'Introduction to Cybersecurity',
      org: 'Cisco Networking Academy',
      year: '2024',
      icon: '🔐'
    },
    {
      title: 'TOEIC Global English (C2 Equivalent)',
      org: 'CEFR',
      year: '2024',
      icon: '🌐'
    },
    {
      title: 'PCAP: Programming Essentials in Python',
      org: 'OpenEDG',
      year: '2023',
      icon: '🐍'
    }
  ];

  const workExperience = [
    {
      role: 'Virtual Assistant',
      company: 'Freelance (Local & International Clients)',
      type: 'Part-Time | Hourly & Project-Based | Remote',
      period: '2022-2025',
      description: 'Delivered project management, content creation, and tutoring services, driving client performance and revenue growth through community engagement strategies'
    },
    {
      role: 'Student Assistant',
      company: 'Scholarship Duty',
      type: 'Fixed Hours | On-Site',
      period: '2022-2024',
      description: 'Provided secretarial and technical support, enhancing office operations through efficient data management and communication'
    },
    {
      role: 'Administrative Analyst',
      company: 'HVAC Company',
      type: 'Part-Time | Hybrid',
      period: '2022-2023',
      description: 'Executed administrative and marketing tasks, enhancing operational efficiency through strategic planning, record-keeping, and customer service'
    }
  ];

  const values = [
    { word: 'Passionate', description: 'Every decision serves a purpose' },
    { word: 'Persevering', description: 'Difficulties are opportunities' },
    { word: 'Genuine', description: 'True to my voice and values' },
  ];

  // Animation helper
  const sectionClass = (id) => 
    `transition-all duration-1000 ${visibleSections[id] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`;

  return (
    <>
      {/* Unique minimalist header */}
      <header className="fixed top-0 left-0 w-full z-30 flex justify-end px-4 md:px-8 py-2 md:py-4 pointer-events-none">
        <nav className={`flex items-center rounded-full shadow-lg px-2 md:px-4 py-1 md:py-2 pointer-events-auto ${isLightMode ? 'bg-slate-100/90 shadow-slate-300' : 'bg-slate-950/80'}`} style={{ maxWidth: 340 }}>
          {headerLinks.map((link, idx) => {
            const commonProps = {
              key: idx,
              'aria-label': link.label,
              className: `hover:scale-110 active:scale-95 transition-transform ${link.spacing || ''}`,
              style: { display: 'flex', alignItems: 'center' },
              onClick: link.onClick || undefined
            };
            if (link.href) {
              return (
                <a
                  {...commonProps}
                  href={link.href}
                  target={link.external ? '_blank' : undefined}
                  rel={link.external ? 'noopener noreferrer' : undefined}
                >
                  {link.icon}
                </a>
              );
            } else {
              return (
                <a
                  {...commonProps}
                  href="#"
                >
                  {link.icon}
                </a>
              );
            }
          })}
        </nav>
      </header>
      <div className={`min-h-screen relative overflow-hidden w-full transition-colors duration-300 ${isLightMode ? 'bg-slate-50 text-slate-900' : 'bg-slate-950 text-slate-100'}`} style={{ userSelect: 'none' }}>
      {/* Custom CSS for animations and full-viewport background */}
      <style>{`
        html, body {
          min-width: 100vw;
          min-height: 100vh;
          width: 100vw;
          height: 100vh;
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
        .max-w-5xl > h3 {
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
        html.light-mode .bg-slate-900\\/80 {
          background: rgba(241, 245, 249, 0.9) !important;
          border-color: #cbd5e1 !important;
        }
        html.light-mode .bg-slate-950\\/80 {
          background: rgba(241, 245, 249, 0.95) !important;
        }
        html.light-mode .bg-slate-900\\/40 {
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
        html.light-mode .bg-slate-800\\/50 {
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
        html.light-mode .bg-pink-500\\/10,
        html.light-mode .bg-purple-500\\/10,
        html.light-mode .bg-blue-500\\/10 {
          opacity: 0.7;
        }
        /* Light mode gradient backgrounds */
        html.light-mode .from-pink-600\\/20,
        html.light-mode .to-purple-600\\/20 {
          --tw-gradient-from: rgba(219, 39, 119, 0.15);
          --tw-gradient-to: rgba(147, 51, 234, 0.15);
        }
        html.light-mode .from-pink-900\\/10,
        html.light-mode .via-purple-900\\/10,
        html.light-mode .to-blue-900\\/10 {
          background: linear-gradient(to right, rgba(219, 39, 119, 0.08), rgba(147, 51, 234, 0.08), rgba(37, 99, 235, 0.08)) !important;
        }
        html.light-mode .from-blue-900\\/20,
        html.light-mode .to-purple-900\\/20 {
          background: linear-gradient(to right, rgba(37, 99, 235, 0.1), rgba(147, 51, 234, 0.1)) !important;
        }
        html.light-mode .from-yellow-600\\/20,
        html.light-mode .to-orange-600\\/20 {
          background: linear-gradient(to bottom right, rgba(202, 138, 4, 0.15), rgba(234, 88, 12, 0.15)) !important;
        }
        html.light-mode .from-pink-600\\/10,
        html.light-mode .to-purple-600\\/10 {
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
        html.light-mode .bg-green-500\\/20 {
          background: rgba(34, 197, 94, 0.15) !important;
        }
        html.light-mode .bg-yellow-500\\/20 {
          background: rgba(234, 179, 8, 0.15) !important;
        }
        /* Light mode footer text */
        html.light-mode .border-pink-800\\/30 {
          border-color: rgba(219, 39, 119, 0.2) !important;
        }
        html.light-mode .border-pink-500\\/20 {
          border-color: rgba(219, 39, 119, 0.25) !important;
        }
        html.light-mode .border-blue-500\\/20 {
          border-color: rgba(37, 99, 235, 0.25) !important;
        }
        /* Light mode invert for dark icons */
        html.light-mode .invert {
          filter: invert(0) !important;
        }
        /* Keep white text on specific buttons */
        html.light-mode .keep-white-text {
          color: white !important;
        }
      `}</style>

      {/* Ripple effects */}
      {ripples.map(ripple => (
        <div
          key={ripple.id}
          className="fixed pointer-events-none z-0"
          style={{
            left: ripple.x,
            top: ripple.y,
          }}
        >
          {/* First ripple ring */}
          <div 
            className="absolute rounded-full border border-pink-400/40"
            style={{
              width: '150px',
              height: '150px',
              animation: 'ripple 2s ease-out forwards',
            }}
          />
          {/* Second ripple ring - delayed */}
          <div 
            className="absolute rounded-full border border-purple-400/30"
            style={{
              width: '250px',
              height: '250px',
              animation: 'ripple 2s ease-out 0.15s forwards',
              opacity: 0,
            }}
          />
          {/* Third ripple ring - more delayed */}
          <div 
            className="absolute rounded-full border border-blue-400/20"
            style={{
              width: '350px',
              height: '350px',
              animation: 'ripple 2s ease-out 0.3s forwards',
              opacity: 0,
            }}
          />
        </div>
      ))}

      {/* Smooth cursor glow that follows mouse */}
      <div 
        className="fixed pointer-events-none z-0 transition-opacity duration-300"
        style={{
          left: mousePos.x,
          top: mousePos.y,
          transform: 'translate(-50%, -50%)'
        }}
      >
        {/* Inner glow */}
        <div 
          className="absolute rounded-full"
          style={{
            width: '300px',
            height: '300px',
            background: 'radial-gradient(circle, rgba(236, 72, 153, 0.15) 0%, rgba(168, 85, 247, 0.08) 40%, transparent 70%)',
            transform: 'translate(-50%, -50%)'
          }}
        />
        {/* Outer subtle ring */}
        <div 
          className="absolute rounded-full"
          style={{
            width: '500px',
            height: '500px',
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.05) 0%, transparent 60%)',
            transform: 'translate(-50%, -50%)'
          }}
        />
      </div>

      {/* Ambient background orbs */}
      {/* Ambient background orbs - always cover viewport */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ minWidth: '100vw', minHeight: '100vh', zIndex: 0 }}>
        <div 
          className="absolute w-96 h-96 bg-pink-500/10 rounded-full blur-3xl glow"
          style={{ top: '10%', left: '10%' }}
        />
        <div 
          className="absolute w-80 h-80 bg-purple-500/10 rounded-full blur-3xl glow"
          style={{ top: '50%', right: '10%', animationDelay: '2s' }}
        />
        <div 
          className="absolute w-72 h-72 bg-blue-500/10 rounded-full blur-3xl glow"
          style={{ bottom: '10%', left: '30%', animationDelay: '4s' }}
        />
      </div>

      {/* Floating particles with subtle cursor influence */}
      <div className="fixed inset-0 pointer-events-none opacity-40">
        {particlesRef.current.map((particle) => {
          // Calculate subtle offset based on cursor distance
          const centerX = (typeof window !== 'undefined' ? window.innerWidth : 1000) * (particle.baseX / 100);
          const centerY = (typeof window !== 'undefined' ? window.innerHeight : 800) * (particle.baseY / 100);
          const dx = mousePos.x - centerX;
          const dy = mousePos.y - centerY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const maxInfluence = 150; // Max distance for influence
          const influence = Math.max(0, 1 - distance / maxInfluence) * 8; // Max 8px movement
          const offsetX = distance > 0 ? (dx / distance) * influence : 0;
          const offsetY = distance > 0 ? (dy / distance) * influence : 0;
          
          return (
            <div
              key={particle.id}
              className="absolute w-1.5 h-1.5 rounded-full"
              style={{
                left: `${particle.baseX}%`,
                top: `${particle.baseY}%`,
                background: particle.color,
                boxShadow: `0 0 6px ${particle.color}`,
                transform: `translate(${offsetX}px, ${offsetY}px)`,
                transition: 'transform 0.3s ease-out',
                animation: `float ${particle.duration}s ease-in-out infinite`,
                animationDelay: `${particle.delay}s`
              }}
            />
          );
        })}
      </div>

      {/* Hero Section */}
      <section id="hero" className="min-h-screen flex items-center justify-center relative px-4 sm:px-6 py-16 sm:py-20">
        <div className="max-w-5xl w-full mx-auto">
          {/* Location tag */}
          <div className={`mb-6 opacity-0 ${heroTextVisible ? 'slide-up stagger-1' : ''}`}>
            <span className="text-pink-400/80 text-sm font-mono tracking-widest">// Cavite, Philippines</span>
          </div>
          
          {/* Main name with gradient */}
          <h1
            className={`text-5xl xs:text-6xl sm:text-7xl md:text-8xl font-bold mb-6 opacity-0 ${heroTextVisible ? 'slide-up stagger-2' : ''}`}
            style={{ lineHeight: 1, paddingBottom: '0.15em', overflow: 'visible' }}
          >
            <span className="shimmer-text" style={{ lineHeight: 1, display: 'inline-block' }}>
              Caryl Joy
            </span>
            <br />
            <span className="text-slate-200">Cabrera</span>
          </h1>
          
          {/* Typing effect tagline */}
          <div className={`text-lg xs:text-xl sm:text-2xl md:text-3xl font-light text-slate-400 mb-4 h-10 opacity-0 ${heroTextVisible ? 'slide-up stagger-3' : ''}`}> 
            <span className="cursor-blink">{typedText}</span>
          </div>

          {/* Description with personality */}
          <div className={`text-base sm:text-lg md:text-xl text-slate-400 mb-8 max-w-2xl leading-relaxed opacity-0 ${heroTextVisible ? 'slide-up stagger-4' : ''}`}> 
            Fourth-year IT student{' '}
            <span className="text-pink-400 font-medium">driven by craft</span> with thoughtful execution.
            <br />
            <span className="text-purple-400">Inquisitive.</span>{' '}
            <span className="text-blue-400">Proactive.</span>{' '}
            <span className="text-pink-400">Lionhearted.</span>
          </div>

          {/* Value pills */}
          <div className={`flex flex-wrap gap-2 sm:gap-3 mb-8 sm:mb-10 opacity-0 ${heroTextVisible ? 'slide-up stagger-5' : ''}`}> 
            {values.map((v, i) => (
              <div key={i} className="group relative">
                <span className="px-4 py-2 bg-slate-900/80 border border-slate-800 hover:border-pink-500/50 rounded-full text-sm text-slate-300 transition-all duration-300 cursor-default">
                  {v.word}
                </span>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-slate-800 rounded text-xs text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  {v.description}
                </div>
              </div>
            ))}
          </div>

          {/* CTA buttons */}
          <div className={`w-full opacity-0 mb-6 sm:mb-8 ${heroTextVisible ? 'slide-up' : ''}`} style={{ animationDelay: '0.6s' }}>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-2 sm:mb-0 w-full">
              <a href="mailto:caryldcabrera@gmail.com" 
                 className="group px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 rounded-lg transition-all duration-300 font-medium flex items-center gap-2 shadow-lg shadow-pink-500/20 hover:shadow-pink-500/40 w-full sm:w-auto keep-white-text">
                <Mail size={18} />
                Tell me your story
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </a>
              <div className="flex flex-row gap-2 w-full sm:w-auto">
                <a href="https://linkedin.com/in/caryljoycabrera" 
                   target="_blank"
                   rel="noopener noreferrer"
                   className="px-6 py-3 border border-slate-700 hover:border-pink-500 rounded-lg transition-all duration-300 font-medium flex items-center gap-2 hover:bg-pink-500/5 w-1/2 sm:w-auto">
                  <Linkedin size={18} />
                  LinkedIn
                </a>
                <a href="https://github.com/caryljoycabrera" 
                   target="_blank"
                   rel="noopener noreferrer"
                   className="px-6 py-3 border border-slate-700 hover:border-purple-500 rounded-lg transition-all duration-300 font-medium flex items-center gap-2 hover:bg-purple-500/5 w-1/2 sm:w-auto">
                  <Github size={18} />
                  GitHub
                </a>
              </div>
            </div>
          </div>

          {/* Quick stats */}
          <div className={`flex flex-wrap gap-4 sm:gap-6 text-xs sm:text-sm text-slate-500 opacity-0 ${heroTextVisible ? 'fade-in' : ''}`} style={{ animationDelay: '0.8s' }}>
            <div className="flex items-center gap-2 hover:text-pink-400 transition-colors">
              <Sparkles size={16} className="text-pink-400" />
              <span>Freelancer</span>
            </div>
            <div className="flex items-center gap-2 hover:text-purple-400 transition-colors">
              <Heart size={16} className="text-purple-400" />
              <span>Scholar</span>
            </div>
            <div className="flex items-center gap-2 hover:text-blue-400 transition-colors">
              <Trophy size={16} className="text-blue-400" />
              <span>Student Leader</span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-4 sm:bottom-10 left-1/2 -translate-x-1/2">
          <ChevronDown className="text-pink-400/60 animate-bounce" size={32} />
        </div>
      </section>

      {/* About Section with Photo Placeholder */}
      <section id="about" className="py-16 sm:py-24 px-4 sm:px-6 relative">
        <div className={`max-w-5xl mx-auto ${sectionClass('about')}`}> 
          <h2 className="text-4xl font-bold mb-12 flex items-center gap-3">
            <span className="text-pink-400 font-mono text-lg">01.</span>
            <span>Who I Am</span>
            <div className="flex-1 h-px bg-gradient-to-r from-slate-800 to-transparent ml-4" />
          </h2>
          {/* About content only, no photo */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-center">
            {/* Photo placeholder (centered) */}
            <div className="flex justify-center items-center mb-6 md:mb-0 md:col-span-1">
              <div className="w-56 h-72 xs:w-64 xs:h-80 sm:w-80 sm:h-96 md:w-96 md:h-[28rem] rounded-2xl photo-placeholder flex items-center justify-center border-2 border-dashed border-pink-400/30 bg-slate-900/40 relative overflow-hidden mx-auto">
                <img 
                  src="/images/photo.png" 
                  alt="Caryl Joy Cabrera" 
                  className="w-full h-full object-cover max-w-[350px] max-h-[500px] xs:max-w-[400px] xs:max-h-[540px] sm:max-w-[480px] sm:max-h-[600px] md:max-w-[540px] md:max-h-[700px] mx-auto" 
                  style={{ aspectRatio: '3/4' }}
                />
              </div>
            </div>
            {/* About content (center/right) */}
            <div className="md:col-span-2 space-y-4 text-slate-300 leading-relaxed">
              <p className="text-lg">
                I'm finishing my Bachelor's degree in IT at <span className="text-pink-400">De La Salle University – Dasmariñas</span>, 
                specializing in web development. But that title doesn't capture it all.
              </p>
              <p>
                I develop outputs that make an impact. Led student groups that delivered results.
                Balanced freelance work with academics and extra-curricular activities while being a <span className="text-purple-400 font-semibold">Student Assistant</span> and <span className="text-purple-400 font-semibold">Class Representative</span>.
                My work is a reflection of my commitment.
              </p>
              {/* Quick facts grid (below about content) */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-6">
                <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-4 hover:border-pink-500/30 transition-all">
                  <span className="text-slate-500 text-xs uppercase tracking-wider">Education</span>
                  <p className="text-slate-200 font-medium">BSIT - Web Dev</p>
                </div>
                <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-4 hover:border-purple-500/30 transition-all">
                  <span className="text-slate-500 text-xs uppercase tracking-wider">Graduation</span>
                  <p className="text-slate-200 font-medium">June 2026</p>
                </div>
                <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-4 hover:border-blue-500/30 transition-all">
                  <span className="text-slate-500 text-xs uppercase tracking-wider">English Level</span>
                  <p className="text-slate-200 font-medium">C2 (TOEIC)</p>
                </div>
                <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-4 hover:border-blue-500/30 transition-all">
                  <span className="text-slate-500 text-xs uppercase tracking-wider">Availability</span>
                  <p className="text-blue-400 font-medium">Open to opportunities</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Section with Logos */}
      <section id="skills" className="py-16 sm:py-24 px-4 sm:px-6 relative">
        <div className={`max-w-5xl mx-auto ${sectionClass('skills')}`}> 
          <h2 className="text-4xl font-bold mb-4 flex items-center gap-3">
            <span className="text-pink-400 font-mono text-lg">02.</span>
            <span>What I Work With</span>
            <div className="flex-1 h-px bg-gradient-to-r from-slate-800 to-transparent ml-4" />
          </h2>
          <p className="text-slate-400 mb-12 max-w-2xl">
            Tools and technologies I've worked with across projects.
          </p>

          {/* Tech icons grid */}
          <div className="grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3 sm:gap-4 mb-8 sm:mb-12">
            {techStack.map((tech, idx) => (
              <div 
                key={idx} 
                className="tech-icon group relative flex flex-col items-center gap-2 p-4 bg-slate-900/50 border border-slate-800 rounded-xl hover:border-pink-500/30 cursor-default"
              >
                <img 
                  src={tech.icon} 
                  alt={tech.name}
                  className={`w-10 h-10 ${tech.invert ? 'invert' : ''}`}
                />
                <span className="text-xs text-slate-400 group-hover:text-slate-200 transition-colors text-center">
                  {tech.name}
                </span>
              </div>
            ))}
          </div>

          {/* Category breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="p-6 bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl hover:border-pink-500/30 transition-all">
              <h3 className="text-pink-400 font-semibold mb-3 flex items-center gap-2">
                <Code size={18} />
                Development Philosophy
              </h3>
              <div className="flex flex-wrap gap-2">
                {['OOP', 'MVC Architecture', 'REST APIs', 'CRUD', 'Agile', 'SDLC', 'Clean Code', 'Version Control'].map(item => (
                  <span key={item} className="px-3 py-1 bg-slate-800/50 text-slate-300 rounded-full text-sm">
                    {item}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="p-6 bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl hover:border-purple-500/30 transition-all">
              <h3 className="text-purple-400 font-semibold mb-3 flex items-center gap-2">
                <Sparkles size={18} />
                Beyond the Code
              </h3>
              <div className="flex flex-wrap gap-2">
                {['UI/UX Design', 'Technical Writing', 'Project Management', 'Team Leadership', 'Client Communication', 'Stakeholder Coordination', 'Cross-Functional Collaboration', 'Events, Logistics, and Marketing'].map(item => (
                  <span key={item} className="px-3 py-1 bg-slate-800/50 text-slate-300 rounded-full text-sm">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section id="education" className="py-16 sm:py-24 px-4 sm:px-6 relative">
        <div className={`max-w-5xl mx-auto ${sectionClass('education')}`}> 
          <h2 className="text-4xl font-bold mb-12 flex items-center gap-3">
            <span className="text-pink-400 font-mono text-lg">03.</span>
            <span>Education</span>
            <div className="flex-1 h-px bg-gradient-to-r from-slate-800 to-transparent ml-4" />
          </h2>

          <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-8 hover:border-purple-500/30 transition-all duration-300">
            <div className="flex flex-col md:flex-row items-start gap-4 md:gap-6 mb-6">
              <div className="p-4 bg-gradient-to-br from-pink-600/20 to-purple-600/20 rounded-xl border-glow">
                <GraduationCap className="text-pink-400" size={40} />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-slate-100 mb-2">{education.degree}</h3>
                <p className="text-lg text-purple-400 mb-1">with Specialization in {education.specialization}</p>
                <p className="text-slate-400">{education.university}</p>
              </div>
              <div className="text-left md:text-right">
                <p className="text-2xl font-bold text-pink-400">GPA: {education.gpa}</p>
                <p className="text-slate-500 text-sm">Expected {education.graduation}</p>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wider">Honors & Scholarships</h4>
              <div className="flex flex-wrap gap-2">
                {education.honors.map((honor, idx) => (
                  <span key={idx} className="px-4 py-2 bg-gradient-to-r from-pink-600/10 to-purple-600/10 text-slate-300 rounded-lg text-sm border border-pink-500/20 hover:border-pink-500/40 transition-colors">
                    <Star className="inline w-3 h-3 mr-1.5 text-yellow-400" />
                    {honor}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-xl border border-blue-500/20">
              <p className="text-slate-300 leading-relaxed">
                <span className="text-blue-400 font-semibold">Key Achievement: </span>
                {education.achievement}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-16 sm:py-24 px-4 sm:px-6 relative">
        <div className={`max-w-5xl mx-auto ${sectionClass('projects')}`}> 
          <h2 className="text-4xl font-bold mb-4 flex items-center gap-3">
            <span className="text-pink-400 font-mono text-lg">04.</span>
            <span>What I've Built</span>
            <div className="flex-1 h-px bg-gradient-to-r from-slate-800 to-transparent ml-4" />
          </h2>
          <p className="text-slate-400 mb-12 max-w-2xl">
            From deployed systems to personal experiments, these are projects that challenged me and taught me something new.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {projects.map((project, idx) => (
              <div 
                key={idx} 
                className="group bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl overflow-hidden hover:border-pink-500/30 transition-all duration-500 hover:-translate-y-2"
              >
                {/* Project image placeholder */}
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
                    <span className={`text-xs px-2 py-1 rounded ${
                      project.status === 'Completed' ? 'bg-green-500/20 text-green-400' :
                      project.status === 'In Development' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-slate-500/20 text-slate-400'
                    }`}>
                      {project.status}
                    </span>
                    <span className="text-xs text-slate-500">{project.type}</span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-slate-100 mb-2 group-hover:text-pink-400 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-slate-400 text-sm mb-4 leading-relaxed">
                    {project.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.tech.map((t, i) => (
                      <span key={i} className="text-xs px-2 py-1 bg-slate-800/50 text-slate-400 rounded">
                        {t}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex gap-3">
                    {project.link && (
                      <a href={project.link} target="_blank" rel="noopener noreferrer" 
                         className="text-sm text-pink-400 hover:text-pink-300 flex items-center gap-1">
                        <ExternalLink size={14} /> Live
                      </a>
                    )}
                    {project.github && (
                      <a href={project.github} target="_blank" rel="noopener noreferrer"
                         className="text-sm text-slate-400 hover:text-slate-300 flex items-center gap-1">
                        <Github size={14} /> Code
                      </a>
                    )}
                    {!project.link && !project.github && (
                      <span className="text-sm text-slate-500 italic">Details coming soon</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* More projects teaser */}
          <div className="mt-10 text-center">
            <p className="text-slate-500 mb-4">More projects in the works...</p>
          </div>
        </div>
      </section>

      {/* Certifications Section */}
      <section id="certifications" className="py-16 sm:py-24 px-4 sm:px-6 relative">
        <div className={`max-w-5xl mx-auto ${sectionClass('certifications')}`}> 
          <h2 className="text-4xl font-bold mb-12 flex items-center gap-3">
            <span className="text-pink-400 font-mono text-lg">05.</span>
            <span>Certifications</span>
            <div className="flex-1 h-px bg-gradient-to-r from-slate-800 to-transparent ml-4" />
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {certifications.map((cert, idx) => (
              <div key={idx} className="group bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6 hover:border-blue-500/30 transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">{cert.icon}</div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-lg font-semibold text-slate-100 group-hover:text-blue-400 transition-colors">{cert.title}</h3>
                      <span className="text-blue-400 font-mono text-sm">{cert.year}</span>
                    </div>
                    <p className="text-slate-400 text-sm">{cert.org}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* More certifications teaser */}
          <div className="mt-10 text-center">
            <p className="text-slate-500 mb-4">New certifications to be added soon...</p>
          </div>
        </div>
      </section>

      {/* Awards Section */}
      <section id="awards" className="py-16 sm:py-24 px-4 sm:px-6 relative">
        <div className={`max-w-5xl mx-auto ${sectionClass('awards')}`}> 
          <h2 className="text-4xl font-bold mb-4 flex items-center gap-3">
            <span className="text-pink-400 font-mono text-lg">06.</span>
            <span>Awards and Recognition</span>
            <div className="flex-1 h-px bg-gradient-to-r from-slate-800 to-transparent ml-4" />
          </h2>
          <p className="text-slate-400 mb-12 max-w-2xl">
            Leadership isn't a title, it's a responsibility. These moments reminded me why I do what I do.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {awards.map((award, idx) => (
              <div 
                key={idx}
                className="group relative bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6 hover:border-yellow-500/30 transition-all duration-300 overflow-hidden"
              >
                {/* Subtle gold accent */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-yellow-500/10 to-transparent rounded-bl-full" />
                
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gradient-to-br from-yellow-600/20 to-orange-600/20 rounded-xl">
                    <Trophy className="text-yellow-400" size={24} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-lg font-semibold text-slate-100 group-hover:text-yellow-400 transition-colors">
                        {award.title}
                      </h3>
                      <span className="text-yellow-400 font-mono text-sm">{award.year}</span>
                    </div>
                    <p className="text-slate-400 text-sm mb-2">{award.event}</p>
                    <p className="text-slate-500 text-sm">{award.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Moments to Remember - Photo Placeholders */}
          <div className="mt-12">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {[1,2,3,4].map((num) => (
                <div key={num} className="aspect-[3/4] bg-slate-900/50 border-2 border-dashed border-pink-400/30 rounded-2xl flex items-center justify-center relative overflow-hidden">
                  <img src={`/images/moment${num}.jpg`} alt={`Photo ${num}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Work Experience Section */}
      <section id="experience" className="py-16 sm:py-24 px-4 sm:px-6 relative">
        <div className={`max-w-5xl mx-auto ${sectionClass('experience')}`}> 
          <h2 className="text-4xl font-bold mb-12 flex items-center gap-3">
            <span className="text-pink-400 font-mono text-lg">07.</span>
            <span>Experience</span>
            <div className="flex-1 h-px bg-gradient-to-r from-slate-800 to-transparent ml-4" />
          </h2>

          {/* Timeline style experience */}
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-pink-500 via-purple-500 to-blue-500 hidden md:block" />
            
            <div className="space-y-6 sm:space-y-8">
              {workExperience.map((exp, idx) => (
                <div key={idx} className="relative md:pl-20">
                  {/* Timeline dot */}
                  <div className="absolute left-6 w-4 h-4 bg-pink-500 rounded-full border-4 border-slate-950 hidden md:block" style={{ top: '28px' }} />
                  
                  <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6 hover:border-purple-500/30 transition-all duration-300">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                      <div>
                        <h3 className="text-xl font-semibold text-slate-100">{exp.role}</h3>
                        <p className="text-purple-400">{exp.company}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-slate-800/50 text-slate-400 rounded-full text-xs">{exp.type}</span>
                        <span className="text-pink-400 font-mono text-sm whitespace-nowrap">{exp.period}</span>
                      </div>
                    </div>
                    <p className="text-slate-400 leading-relaxed">{exp.description}</p>
                  </div>
                </div>
              ))}
            </div>
            {/* More experiences teaser */}
            <div className="mt-10 text-center">
              <p className="text-slate-500 mb-4">Actively seeking on-the-job training (OJT) opportunities!</p>
            </div>
          </div>

          {/* Leadership highlight */}
          <div className="mt-8 sm:mt-12 p-4 sm:p-6 bg-gradient-to-r from-pink-900/10 via-purple-900/10 to-blue-900/10 border border-pink-800/30 rounded-xl">
            <h3 className="text-lg font-semibold mb-4 text-pink-400 flex items-center gap-2">
              <Zap size={20} />
              Leadership Experience
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-3">
                <p className="text-slate-300 flex items-start gap-2">
                  <span className="text-pink-400 mt-1.5">▸</span>
                  College Student Government Vice Governor
                </p>
                <p className="text-slate-300 flex items-start gap-2">
                  <span className="text-pink-400 mt-1.5">▸</span>
                  Council of Student Organizations Associate Executive Director
                </p>
              </div>
              <div className="space-y-3">
                <p className="text-slate-300 flex items-start gap-2">
                  <span className="text-purple-400 mt-1.5">▸</span>
                  Spearheaded events, programs, and legislations
                </p>
                <p className="text-slate-300 flex items-start gap-2">
                  <span className="text-purple-400 mt-1.5">▸</span>
                  Secured partnerships and sponsorships
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact / Footer Section */}
      <footer id="contact" className="py-16 sm:py-24 px-4 sm:px-6 border-t border-slate-900 relative">
        <div className="max-w-4xl mx-auto text-center">
          {/* Personal closing statement */}
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
          
          {/* Contact buttons */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-8 sm:mb-12">
            <a href="mailto:caryldcabrera@gmail.com" 
               className="group px-8 py-4 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 rounded-xl transition-all duration-300 font-medium text-lg shadow-lg shadow-pink-500/20 hover:shadow-pink-500/40 flex items-center gap-2 keep-white-text">
              <Mail size={20} />
              caryldcabrera@gmail.com
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          {/* Social links */}
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

          {/* Footer note */}
          <div className="pt-6 sm:pt-8 border-t border-slate-900">
            <p className="text-slate-600 text-sm mb-2">
              Designed with the heart.
            </p>
            <p className="text-slate-700 text-sm">
              © {new Date().getFullYear()} Caryl Joy Cabrera
            </p>
          </div>
        </div>
      </footer>
      </div>
    </>
  );
}