import React, { useState, useEffect, useRef } from 'react';
import { Github, ExternalLink, Linkedin, Mail, ArrowRight, Camera, X, ZoomIn, Sparkles } from 'lucide-react';

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
  const particlesRef = useRef([]);
  const [particlesLoaded, setParticlesLoaded] = useState(false);

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

  // Generate stable particle positions on mount
  useEffect(() => {
    // Create a more scattered and balanced grid of particles (half as many: 12 total)
    const rows = 3;
    const cols = 4;
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
    setParticlesLoaded(true);
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

  // Modal for full-screen image view
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalTopOffset, setModalTopOffset] = useState(0);
  const closeBtnRef = useRef(null);
  const imgRef = useRef(null);
  const [zoom, setZoom] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const savedScrollYRef = useRef(0);

  useEffect(() => {
    const measure = () => {
      const header = document.querySelector('header');
      const h = header ? Math.ceil(header.getBoundingClientRect().height) : 0;
      setModalTopOffset(h + 8);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setIsModalOpen(false);
    };
    if (isModalOpen) {
      document.addEventListener('keydown', onKey);
      setTimeout(() => closeBtnRef.current?.focus(), 0);
      // prevent body scroll
      const scrollY = window.scrollY;
      savedScrollYRef.current = scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.touchAction = 'none';
      // reset zoom and pan
      setZoom(1);
      setPanX(0);
      setPanY(0);
    } else {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.touchAction = '';
      window.scrollTo(0, savedScrollYRef.current);
    }
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.touchAction = '';
      window.scrollTo(0, savedScrollYRef.current);
    };
  }, [isModalOpen]);

  const handleZoomIn = () => setZoom(prev => Math.min(prev * 1.2, 5));
  const handleZoomOut = () => setZoom(prev => Math.max(prev / 1.2, 1));
  const handleWheel = (e) => {
    e.preventDefault();
    if (e.deltaY < 0) handleZoomIn();
    else handleZoomOut();
  };
  const handleMouseDown = (e) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - panX, y: e.clientY - panY });
    }
  };
  const handleMouseMove = (e) => {
    if (isDragging && zoom > 1) {
      const newPanX = e.clientX - dragStart.x;
      const newPanY = e.clientY - dragStart.y;
      constrainPan(newPanX, newPanY);
    }
  };
  const handleMouseUp = () => setIsDragging(false);

  const handleTouchStart = (e) => {
    if (zoom > 1 && e.touches.length === 1) {
      const touch = e.touches[0];
      setIsDragging(true);
      setDragStart({ x: touch.clientX - panX, y: touch.clientY - panY });
    }
  };
  const handleTouchMove = (e) => {
    if (isDragging && zoom > 1 && e.touches.length === 1) {
      e.preventDefault();
      const touch = e.touches[0];
      const newPanX = touch.clientX - dragStart.x;
      const newPanY = touch.clientY - dragStart.y;
      constrainPan(newPanX, newPanY);
    }
  };
  const handleTouchEnd = () => setIsDragging(false);

  const constrainPan = (newPanX, newPanY) => {
    const img = imgRef.current;
    if (!img || !img.complete || img.naturalWidth === 0) return;
    const naturalWidth = img.naturalWidth;
    const naturalHeight = img.naturalHeight;
    const containerWidth = window.innerWidth - 32; // approximate padding
    const containerHeight = window.innerHeight - modalTopOffset - 128;
    const scaleX = containerWidth / naturalWidth;
    const scaleY = containerHeight / naturalHeight;
    const scale = Math.min(scaleX, scaleY);
    const displayedWidth = naturalWidth * scale * zoom;
    const displayedHeight = naturalHeight * scale * zoom;
    const maxPanX = Math.min((displayedWidth - containerWidth) / 2, containerWidth / 2);
    const maxPanY = Math.min((displayedHeight - containerHeight) / 2, containerHeight / 2);
    setPanX(Math.max(-maxPanX, Math.min(maxPanX, newPanX)));
    setPanY(Math.max(-maxPanY, Math.min(maxPanY, newPanY)));
  };

  const sectionClass = (id) => 
    `transition-all duration-1000 ${visibleSections[id] ? 'opacity-100 translate-y-0' : 'opacity-0 sm:translate-y-8'}`;

  const projects = [
    {
      title: 'SCO Creative Optimization for Requests and Engagement System (S-CORE)',
      description: 'A centralized web-based system designed to automate service requests, approval workflows, and task monitoring with performance analytics.',
      tech: ['Node.js', 'Express', 'MongoDB', 'EJS', 'JavaScript', 'DigitalOcean'],
      type: 'Institutional Office Website',
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
      type: 'Elderly Care Mobile App',
      year: '2025',
      category: 'Technical Solutions',
      image: '/images/project2.png',
      link: 'https://www.canva.com/design/DAG7Rbsj_4A/T5gF6Goj8S9RJR_8D67L3w/view?utm_content=DAG7Rbsj_4A&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utm_id=h9a52723737',
      github: 'https://github.com/carebear1919/caresync_mobileapplication.git'
    },
    {
      title: 'Caryl\'s Portfolio',
      description: 'A modern portfolio featuring custom animations, responsive design, and a showcase of skills, projects, and achievements.',
      tech: ['React', 'Tailwind CSS', 'JavaScript', 'Vercel'],
      type: 'Personal Portfolio Website',
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
      year: '2021',
      category: 'Technical Solutions',
      image: '/images/project11.png',
      link: 'https://realestanddeepest.wixsite.com/perdev',
      github: null
    },
    {
      title: 'Chasing Victory Golden: The National Esports Tournament and Gaming Convention',
      description: 'A large-scale esports and cosplay event that united gaming enthusiasts through competitive tournaments, cosplay showcases, and interactive booth experiences supported by notable brands and guests, featuring exclusive appearances by top cosplay icon Charess and international Valorant champion PatMen.',
      tech: [],
      type: 'Esports and Cosplay Convention',
      year: 2025,
      category: 'Community Leadership',
      image: '/images/cl16.png',
      link: 'https://www.facebook.com/media/set/?set=a.122195282144448213&type=3',
      github: null
    },
    {
      title: 'Feast of Saint Julian Alfredo',
      description: 'A spiritual and community-building celebration organized that engaged CICS and non-CICS participants through a solemn mass, fellowship gathering, and creative activities to honor the \'s patron saint.',
      tech: [],
      type: 'Collegiate Event',
      year: 2025,
      category: 'Community Leadership',
      image: '/images/cl15.png',
      link: 'https://www.facebook.com/DLSUD.CICSSG/posts/pfbid08aAZB11LePM3t4XWKWwJBdQc23CVS2oHpBCPmEF5crNPxKhhHoG3QKMYCnjNXUEwl',
      github: null
    },
    {
      title: 'SpeciFi: Find Your Specialization',
      description: 'A strategic academic guidance workshop designed to assist 500 underclassmen in selecting their specialization tracks through comprehensive curriculum overviews and career insights provided by faculty and alumni.',
      tech: [],
      type: 'Specialization Seminar',
      year: 2025,
      category: 'Community Leadership',
      image: '/images/cl14.png',
      link: 'https://www.facebook.com/DLSUD.CICSSG/posts/pfbid0263vzhAsrHgVMDAU5BeFmKvWdkkKvAFbLMnQgCoG2voJ1p77AQ3HyRXLizePvVJkFl',
      github: null
    },
    {
      title: 'CICS College Orientation',
      description: 'An orientation program for incoming students of the College of Information and Computer Studies, featuring interactive activities, informative sessions, and community-building segments to welcome and integrate new students into the college community.',
      tech: [],
      type: 'Collegiate Event',
      year: 2025,
      category: 'Community Leadership',
      image: '/images/cl13.png',
      link: 'https://www.facebook.com/DLSUD.CICSSG/posts/pfbid024TRxtkFqoBB3j8DjphmqBvQjANQduMWdCsxetPgzgH3vwvKN2ym8n5aqbwfEWV4Cl',
      github: null
    },
    {
      title: 'Who Can See Me?: Protecting Privacy and Security in the Digital Landscape',
      description: 'A virtual seminar on digital privacy and security that engaged participants in expert-led discussions regarding access rights and digital footprints, empowering them to navigate the online world safely and responsibly.',
      tech: [],
      type: 'Webinar Event',
      year: 2025,
      category: 'Community Leadership',
      image: '/images/cl12.png',
      link: 'https://www.facebook.com/WhoCanSeeMeWebinar',
      github: null
    },
    {
      title: 'CICS Research Week 2025',
      description: 'An academic event that showcased research projects and innovations from students of the College of Information and Computer Studies, fostering a culture of inquiry and knowledge sharing within the academic community through exhibit, turnover ceremony, ethics webinar, and awarding ceremony.',
      tech: [],
      type: 'Collegiate Event',
      year: 2025,
      category: 'Community Leadership',
      image: '/images/cl11.png',
      link: 'https://www.facebook.com/media/set/?vanity=dlsud.cics&set=a.122104882700863997',
      github: null
    },
    {
      title: 'KISLAP: Three Lights, Two Hands, One Worship',
      description: 'A spiritual worship concert held during the Lasallian Mission Festival 2025 that engaged participants within and beyond the DLSU-D community through musical performances, testimonies, and community prayer to foster resilience and faith.',
      tech: [],
      type: 'Worship Night Event',
      year: 2025,
      category: 'Community Leadership',
      image: '/images/cl10.png',
      link: 'https://www.facebook.com/media/set/?set=a.1049388213891332&type=3',
      github: null
    },
    {
      title: 'SOULace: In the Midst of Challenging Times',
      description: 'A holistic development seminar designed to equip various student leaders with spiritual resilience, mental wellness, and servant leadership skills through immersive workshops, reflective film screening, and strategic team-building activities.',
      tech: [],
      type: 'Spiritual and Leadership Event',
      year: 2024,
      category: 'Community Leadership',
      image: '/images/cl9.png',
      link: 'https://www.facebook.com/media/set/?set=a.942226367940851&type=3',
      github: null
    },
    {
      title: 'Born to Lead: Student L.I.F.E 2024 (Launching into Fresh Experiences)',
      description: 'A dynamic event that serves as central engagement highlight of the weeklong PANIMOLA freshman orientation, connecting to campus culture through interactive organization showcases, performing arts group performances, and recruitment booths designed to introduce new students to Lasallian leadership and extracurricular opportunities.',
      tech: [],
      type: 'Institutional Event',
      year: 2024,
      category: 'Community Leadership',
      image: '/images/cl8.png',
      link: 'https://www.facebook.com/dlsud.cso/posts/pfbid0wqfcHLUhfcfxTvNVr9zUQW6rTCv1WPC7g6C1nYTD98VujkQCE82tRRF2ya7wwGkUl',
      github: null
    },
    {
      title: 'KISLAP: A Worship Concert for Every Juan',
      description: 'A spiritual worship concert organized to bring together individuals from the DLSU-D community to celebrate faith and unity through music and fellowship.',
      tech: [],
      type: 'Worship Night Event',
      year: 2024,
      category: 'Community Leadership',
      image: '/images/cl7.png',
      link: 'https://www.facebook.com/media/set/?set=a.850635360433286&type=3',
      github: null
    },
    {
      title: 'Safe SpACES: A Self-Defense Workshop',
      description: 'An empowering event that conducted self-defense workshops for college students, aiming to empower them with practical skills and knowledge to enhance their personal safety and confidence in various situations.',
      tech: [],
      type: 'Advocacy Event',
      year: 2023,
      category: 'Community Leadership',
      image: '/images/cl6.png',
      link: 'https://www.facebook.com/media/set/?set=a.757982293011523&type=3',
      github: null
    },
    {
      title: 'Talino at Talento: Unleashing the Potential of Young Minds',
      description: 'A children\'s assembly event in partnership with Burol 1, designed to empower underprivileged youth through educational workshops, interactive games, and cultural tours at De La Salle University - Dasmariñas.',
      tech: [],
      type: 'Community Outreach',
      year: 2023,
      category: 'Community Leadership',
      image: '/images/cl5.png',
      link: 'https://youtu.be/jT-zsMNfUqM?si=wbK3MbQsJqt7gPoF',
      github: null
    },
    {
      title: '\'tis the season to be givin\'',
      description: 'An initiative that successfully distributed educational kits and holiday gifts to Grade 4 students at San Nicolas Elementary School for their Christmas celebration.',
      tech: [],
      type: 'Community Outreach',
      year: 2022,
      category: 'Community Leadership',
      image: '/images/cl4.png',
      link: null,
      github: null
    },
    {
      title: 'Project Tanglaw',
      description: 'A structured incubation program within The Initiative PH that guides teams through rigorous research, concept development, and strategic planning to pitch and establish new advocacy-based departments.',
      tech: [],
      type: 'Organizational Development',
      year: 2021,
      category: 'Community Leadership',
      image: '/images/cl3.png',
      link: null,
      github: null
    },
    {
      title: 'Project Alpas: Rebrand',
      description: 'An internal engagement program by the Department of Mental Health for The Initiative PH that utilizes interactive social media prompts and synchronous virtual events to foster community bonding and promote mental wellness.',
      tech: [],
      type: 'Organizational Development',
      year: 2021,
      category: 'Community Leadership',
      image: '/images/cl2.png',
      link: null,
      github: null
    },
    {
      title: 'Project Pitching',
      description: 'An internal incubation platform within The Initiative PH that empowers members to conceptualize and lead diverse organizational initiatives, ranging from community development to internal process improvements, through a structured elevator pitch and proposal refinement cycle.',
      tech: [],
      type: 'Organizational Development',
      year: 2021,
      category: 'Community Leadership',
      image: '/images/cl1.png',
      link: null,
      github: null
    },
    {
      title: 'C Program Process Diagram',
      description: 'A presentation that illustrates the step-by-step process of compiling and executing a C program, from writing the source code to terminating the executable file.',
      tech: [],
      type: 'Presentation',
      year: null,
      category: 'Creative Outputs',
      image: '/images/co19.png',
      link: '/files/CProgramProcessDiagram.pdf',
      github: null
    },
    {
      title: 'Computer Organization',
      description: 'A presentation that provides an overview of computer organization, covering topics such as computer hardware, compiler, and system architecture.',
      tech: [],
      type: 'Presentation',
      year: null,
      category: 'Creative Outputs',
      image: '/images/co18.png',
      link: '/files/ComputerOrganization.pdf',
      github: null
    },
    {
      title: 'Booting Process of a Computer',
      description: 'A presentation that explains the step-by-step booting process of a computer, from power-on, BIOS initialization, POST (Power-On Self-Test), to loading the operating system.',
      tech: [],
      type: 'Presentation',
      year: null,
      category: 'Creative Outputs',
      image: '/images/co17.png',
      link: '/files/BootingProcess.pdf',
      github: null
    },
    {
      title: 'Disciplines of Social Sciences Infographic',
      description: 'An infographic that illustrates the various disciplines within the social sciences field, highlighting their key areas of study and contributions to understanding human behavior and society.',
      tech: [],
      type: 'Graphic Design',
      year: null,
      category: 'Creative Outputs',
      image: '/images/co11.png',
      link: null,
      github: null
    },
    {
      title: 'Parola Zine Cover Design',
      description: 'A sample cover design for Parola, a zine publication from a non-profit organization that showcases creative works and stories.',
      tech: [],
      type: 'Graphic Design',
      year: null,
      category: 'Creative Outputs',
      image: '/images/co10.png',
      link: null,
      github: null
    },
    {
      title: 'Evolution of Media Infographic',
      description: 'An infographic that illustrates the evolution of media from traditional forms to digital platforms.',
      tech: [],
      type: 'Graphic Design',
      year: null,
      category: 'Creative Outputs',
      image: '/images/co9.png',
      link: null,
      github: null
    },
    {
      title: 'Cape Verde Brochure',
      description: 'A travel brochure that highlights the attractions, culture, and experiences of Cape Verde, designed to entice travelers to visit this beautiful island nation.',
      tech: [],
      type: 'Graphic Design',
      year: null,
      category: 'Creative Outputs',
      image: '/images/co14.png',
      link: null,
      github: null
    },
    {
      title: 'How to Invest in the Stock Market',
      description: 'A presentation that provides an overview of the stock market, investment strategies, and tips for beginners looking to start investing.',
      tech: [],
      type: 'Presentation',
      year: null,
      category: 'Creative Outputs',
      image: '/images/co13.png',
      link: '/files/HowToInvestInTheStockMarket.pdf',
      github: null
    },
    {
      title: 'Shadows of Suppression: Martial Law Unveiled',
      description: 'A Wakelet collection that explores the historical context, key events, and lasting impact of Martial Law in the Philippines, shedding light on its effects on society, governance, and human rights.',
      tech: [],
      type: 'Presentation',
      year: null,
      category: 'Creative Outputs',
      image: '/images/co16.png',
      link: 'https://wakelet.com/wake/36E8T4T8x-0-eC-UEzelu',
      github: null
    },
    {
      title: 'Oral Communication Models',
      description: 'A presentation that explains the communication models used in oral communication, highlighting their key components and functions.',
      tech: [],
      type: 'Presentation',
      year: null,
      category: 'Creative Outputs',
      image: '/images/co12.png',
      link: '/files/CommunicationModels.pdf',
      github: null
    },
    {
      title: 'Sustainable Development Goals',
      description: 'A presentation that provides an overview of the United Nations Sustainable Development Goals (SDGs), highlighting their importance and the global efforts to achieve them by 2030.',
      tech: [],
      type: 'Presentation',
      year: null,
      category: 'Creative Outputs',
      image: '/images/co15.png',
      link: '/files/SDGs.pdf',
      github: null
    },
    {
      title: 'Netiquette Infographic',
      description: 'An infographic that outlines the rules and guidelines for proper online behavior and communication.',
      tech: [],
      type: 'Graphic Design',
      year: null,
      category: 'Creative Outputs',
      image: '/images/co8.png',
      link: null,
      github: null
    },
    {
      title: 'Improving Learning Infographic',
      description: 'An infographic that provides tips and strategies for improving learning and study habits.',
      tech: [],
      type: 'Graphic Design',
      year: null,
      category: 'Creative Outputs',
      image: '/images/co7.png',
      link: null,
      github: null
    },
    {
      title: 'Communication, Information, and Media Infographic',
      description: 'An infographic that differentiates between communication, information, and media, highlighting their unique characteristics and roles in society.',
      tech: [],
      type: 'Graphic Design',
      year: null,
      category: 'Creative Outputs',
      image: '/images/co6.png',
      link: null,
      github: null
    },
    {
      title: 'Types of Intelligence Infographic',
      description: 'An infographic that illustrates the different types of intelligence.',
      tech: [],
      type: 'Graphic Design',
      year: null,
      category: 'Creative Outputs',
      image: '/images/co5.png',
      link: null,
      github: null
    },
    {
      title: 'Power Infographic',
      description: 'An infographic that expounds on the concept of power in physical eduction, highlighting benefits, exercises, and training methods for improved athletic performance.',
      tech: [],
      type: 'Graphic Design',
      year: null,
      category: 'Creative Outputs',
      image: '/images/co4.png',
      link: null,
      github: null
    },
    {
      title: 'Principle of Progression Infographic',
      description: 'An infographic that explains the principle of progression in physical fitness, highlighting the importance of gradually increasing workout intensity to achieve optimal results.',
      tech: [],
      type: 'Graphic Design',
      year: null,
      category: 'Creative Outputs',
      image: '/images/co3.png',
      link: null,
      github: null
    },
    {
      title:'Should We Change the World\'s Beauty Standards?',
      description: 'A performance task that explores the arguments for and against changing societal beauty standards, highlighting the impact on self-esteem and cultural perceptions.',
      tech: [],
      type: 'Essay Writing',
      year: null,
      category: 'Creative Outputs',
      image: '/images/co2.png',
      link: null,
      github: null
    },
    {
      title: 'Snapshot Poster',
      description: 'A digital art that captures a moment in Paolo Campos\'s life, displaying his experience through a visually appealing poster design.',
      tech: [],
      type: 'Graphic Design',
      year: null,
      category: 'Creative Outputs',
      image: '/images/co1.png',
      link: null,
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

      {/* Scattered blobs positioned like particles */}
      {particlesLoaded && pageVisible && (
        <div className="fixed inset-0 pointer-events-none opacity-100">
          {particlesRef.current.map((particle) => (
            <div
              key={particle.id}
              className="absolute rounded-full blur-2xl"
              style={{
                left: `${particle.baseX}%`,
                top: `${particle.baseY}%`,
                width: '300px',
                height: '300px',
                background: `radial-gradient(circle, ${particle.color}30 0%, transparent 70%)`,
                animation: `glow 4s ease-in-out infinite`,
                animationDelay: `${particle.delay}s`
              }}
            />
          ))}
        </div>
      )}

      <div className={`transition-opacity duration-1000 ${pageVisible ? 'opacity-100' : 'opacity-0'}`}>

      {/* Main Content */}
      <div id="projects-section" className={`pt-20 px-4 sm:px-6 pb-16 animate-on-scroll ${sectionClass('projects-section')}`}>
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center">
            All <span className="shimmer-text">Projects</span>
          </h1>
          <p className="text-slate-400 text-center mb-12 max-w-2xl mx-auto">A showcase of my multifaceted journey through innovation across various domains.</p>

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
              <div key={project.image || idx} className="group bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl overflow-hidden hover:border-pink-500/30 transition-all duration-500 hover:-translate-y-2">
                <div className={`photo-placeholder aspect-video flex items-center justify-center group-hover:border-pink-500/50 transition-all relative ${project.image ? 'cursor-pointer' : ''}`} onClick={project.image ? () => { setSelectedImage(project.image); setIsModalOpen(true); } : undefined}>
                  {project.image ? (
                    <>
                      <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                      {/* Desktop hover overlay */}
                      <div className="hidden md:flex absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 items-center justify-center">
                        <ZoomIn size={32} className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      {/* Mobile always-visible zoom icon */}
                      <div className="md:hidden absolute bottom-2 right-2 bg-black/60 border border-white/30 rounded-full p-1">
                        <ZoomIn size={20} className="text-white" />
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-slate-500">
                      <Sparkles size={32} className="group-hover:text-pink-400 transition-colors" />
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs px-2 py-1 rounded bg-blue-500/20 text-blue-400">{project.type}</span>
                    <div className="flex flex-col items-end gap-1"><span className="text-xs text-slate-400 font-mono">{project.year}</span></div>
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

      {/* Full-screen image modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-start justify-center p-4" style={{ paddingTop: modalTopOffset + 'px', touchAction: 'none' }} onClick={() => setIsModalOpen(false)} onWheel={() => setIsModalOpen(false)} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd} onTouchStart={(e) => { if (zoom <= 1) e.preventDefault(); }}>
          <div className="relative max-w-full max-h-[calc(100vh-96px)] w-full flex items-center justify-center">
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                ref={closeBtnRef}
                className="absolute right-3 top-3 text-white hover:text-pink-400 transition-colors z-10 bg-black/40 rounded-full p-1"
                onClick={() => setIsModalOpen(false)}
                aria-label="Close image"
              >
                <X size={28} />
              </button>
              <button
                className="absolute left-3 top-3 text-white hover:text-pink-400 transition-colors z-10 bg-black/40 rounded-full p-1"
                onClick={handleZoomIn}
                aria-label="Zoom in"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  <line x1="11" y1="8" x2="11" y2="14"></line>
                  <line x1="8" y1="11" x2="14" y2="11"></line>
                </svg>
              </button>
              <button
                className="absolute left-3 top-16 text-white hover:text-pink-400 transition-colors z-10 bg-black/40 rounded-full p-1"
                onClick={handleZoomOut}
                aria-label="Zoom out"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  <line x1="8" y1="11" x2="14" y2="11"></line>
                </svg>
              </button>
              <img
                ref={imgRef}
                src={selectedImage}
                alt="Full screen"
                className={`max-w-full max-h-[calc(100vh-128px)] object-contain rounded ${zoom > 1 ? 'cursor-move' : ''}`}
                style={{ transform: `scale(${zoom}) translate(${panX}px, ${panY}px)`, transformOrigin: 'center' }}
                onWheel={handleWheel}
                onMouseDown={handleMouseDown}
                onTouchStart={(e) => { handleTouchStart(e); if (zoom > 1) e.preventDefault(); }}
                onTouchMove={(e) => { handleTouchMove(e); if (zoom > 1) e.preventDefault(); }}
                draggable={false}
              />
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes ripple { 0% { transform: translate(-50%, -50%) scale(0); opacity: 1 } 100% { transform: translate(-50%, -50%) scale(1); opacity: 0 } }`}</style>
      </div>
    </div>
  );
}
