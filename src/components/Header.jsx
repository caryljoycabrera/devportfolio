import React, { useState, useEffect, useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import { Linkedin, Mail, Code, Lightbulb } from 'lucide-react';

const Header = () => {

  // Light mode state with localStorage persistence
  const [isLightMode, setIsLightMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'light';
    }
    return false;
  });

  // Apply theme before paint to avoid flash
  useLayoutEffect(() => {
    if (isLightMode) {
      document.documentElement.classList.add('light-mode');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.remove('light-mode');
      localStorage.setItem('theme', 'dark');
    }
  }, [isLightMode]);


  // Header icons with individual spacing
  const headerLinks = [
    {
      href: '/', // Link to Home page
      label: 'Home',
      icon: (
        <img src="/logo.svg" alt="Logo" className="w-9 h-9 hover:scale-110 transition-transform" />
      ),
      external: false,
      spacing: 'mr-1',
      onClick: null
    },
    {
      href: '/projects',
      label: 'Projects',
      icon: <Code size={22} className="text-slate-400 hover:text-purple-400 transition-colors" />,
      external: false,
      spacing: 'mr-3',
      onClick: null
    },
    {
      href: 'https://linkedin.com/in/caryljoycabrera',
      label: 'LinkedIn',
      icon: <Linkedin size={22} className="text-slate-400 hover:text-pink-400 transition-colors" />,
      external: true,
      spacing: 'mr-3'
    },
    {
      href: 'mailto:caryldcabrera@gmail.com',
      label: 'Email',
      icon: <Mail size={22} className="text-slate-400 hover:text-pink-400 transition-colors" />,
      external: false,
      spacing: 'mr-2'
    },
    {
      href: null,
      label: 'Toggle Light Mode',
      icon: <Lightbulb size={22} className={`transition-colors ${isLightMode ? 'text-yellow-400 fill-yellow-400' : 'text-slate-400 hover:text-yellow-400'}`} />,
      external: false,
      spacing: 'mr-1',
      onClick: (e) => {
        e.preventDefault();
        setIsLightMode(prev => !prev);
      }
    }
  ];

  

  return (
    <header className="fixed top-0 left-0 w-full z-30 flex justify-between px-4 md:px-8 py-2 md:py-4 pointer-events-none">
      {/* Small clickable name container */}
      <Link to="/" aria-label="Home" className={`flex items-center rounded-full shadow-lg px-2 md:px-4 py-1 md:py-2 pointer-events-auto ${isLightMode ? 'bg-slate-100/90 shadow-slate-300' : 'bg-slate-950/80'}`} style={{ maxWidth: 320 }}>
        <span className="text-sm xs:text-base font-semibold hover:opacity-90 transition-opacity px-2 py-1 leading-none flex gap-1">
          <span className="static-shimmer-text arsenica-antiqua align-middle">Caryl Joy</span>
          <span className="text-slate-200 arsenica-antiqua align-middle">Cabrera</span>
        </span>
      </Link>

      <nav className={`flex items-center rounded-full shadow-lg px-2 md:px-4 py-1 md:py-2 pointer-events-auto ${isLightMode ? 'bg-slate-100/90 shadow-slate-300' : 'bg-slate-950/80'}`} style={{ maxWidth: 400 }}>
        {headerLinks.map((link, idx) => {
          const commonProps = {
            key: idx,
            'aria-label': link.label,
            className: `hover:scale-110 active:scale-95 transition-transform ${link.spacing || ''}`,
            style: { display: 'flex', alignItems: 'center' },
            onClick: link.onClick || undefined
          };
          if (link.href && !link.external) {
            return (
              <Link
                {...commonProps}
                to={link.href}
              >
                {link.icon}
              </Link>
            );
          } else if (link.href && link.external) {
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
  );
};

export default Header;