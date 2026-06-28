import { useState, useEffect, useRef, useCallback } from "react";

/* ── DATA ── */
const NAV = ["About", "Expertise", "Ecosystem", "Credentials", "Connect"];

const PILLARS = [
  {
    id: "01",
    icon: `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><polygon points="20,4 36,36 4,36" stroke="#C9A84C" stroke-width="1.5" fill="none"/><line x1="20" y1="4" x2="20" y2="36" stroke="#C9A84C" stroke-width="0.8" opacity="0.4"/><line x1="4" y1="36" x2="36" y2="36" stroke="#C9A84C" stroke-width="0.8" opacity="0.4"/></svg>`,
    title: "Strategic Consulting",
    sub: "Institutional Transformation",
    desc: "Diagnosing complexity, architecting clarity. Mandela works with governments, multilaterals, and private institutions to build strategy that endures beyond the boardroom — decisions rooted in context, culture, and long-term consequence.",
    tags: ["Policy Architecture", "Stakeholder Alignment", "Organisational Design"],
  },
  {
    id: "02",
    icon: `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="20" cy="20" r="14" stroke="#C9A84C" stroke-width="1.5" fill="none"/><circle cx="20" cy="20" r="6" stroke="#C9A84C" stroke-width="0.8" fill="none" opacity="0.5"/><line x1="6" y1="20" x2="34" y2="20" stroke="#C9A84C" stroke-width="0.8" opacity="0.4"/><line x1="20" y1="6" x2="20" y2="34" stroke="#C9A84C" stroke-width="0.8" opacity="0.4"/></svg>`,
    title: "Diplomatic Architecture",
    sub: "Global Engagement",
    desc: "Building bridges across borders, sectors, and systems. From multilateral frameworks to bilateral partnerships, Mandela designs the structures through which institutions find common ground and create shared value.",
    tags: ["Partnership Frameworks", "Multilateral Engagement", "Protocol & Dialogue"],
  },
  {
    id: "03",
    icon: `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="8" y="8" width="24" height="24" stroke="#C9A84C" stroke-width="1.5" fill="none"/><rect x="14" y="14" width="12" height="12" stroke="#C9A84C" stroke-width="0.8" fill="none" opacity="0.5"/><line x1="8" y1="20" x2="32" y2="20" stroke="#C9A84C" stroke-width="0.8" opacity="0.4"/><line x1="20" y1="8" x2="20" y2="32" stroke="#C9A84C" stroke-width="0.8" opacity="0.4"/></svg>`,
    title: "Digital Catalysis",
    sub: "AI-Powered Operations",
    desc: "Mandela is the architect of IGX — a proprietary AI-powered digital operations system that transforms how institutions create content, govern workflows, and scale intelligence. The future of organisations is automated and adaptive.",
    tags: ["AI Systems Design", "Workflow Automation", "Digital Governance"],
  },
];

const ECOSYSTEM = [
  {
    name: "IJIDI Group",
    tag: "Professional Services",
    rc: "RC 1615219",
    desc: "Strategic consulting and advisory firm delivering institutional transformation across Africa and beyond. The commercial engine of the IJIDI ecosystem.",
    href: "https://ijidigroup.com",
    accent: "#C9A84C",
    bg: "rgba(201,168,76,0.06)",
  },
  {
    name: "IJIDI Foundation",
    tag: "Social Impact",
    rc: "Est. 2024",
    desc: "Purpose-led programmes in youth empowerment, sustainable development, and community resilience. The conscience of the ecosystem.",
    href: "#",
    accent: "#4A9B6F",
    bg: "rgba(74,155,111,0.06)",
  },
  {
    name: "IGX",
    tag: "Digital Operations",
    rc: "Proprietary Platform",
    desc: "An AI-powered system governing content, automation, and digital intelligence for the IJIDI entities. Built on n8n, Supabase, Telegram, and Claude.",
    href: "#",
    accent: "#4A7CC9",
    bg: "rgba(74,124,201,0.06)",
  },
];

const CREDENTIALS = [
  { num: "10+", label: "Years in Strategy & Diplomacy" },
  { num: "3", label: "Active Institutional Entities" },
  { num: "∞", label: "Commitment to African Growth" },
  { num: "1", label: "Proprietary AI Platform (IGX)" },
];

const TIMELINE = [
  { year: "2026", event: "IGX Platform deployed — AI-powered digital operations across all IJIDI entities" },
  { year: "2025", event: "IJIDI Group rebranded from IJIDI Limited — ecosystem expansion initiated" },
  { year: "2024", event: "IJIDI Foundation established — social impact arm operationalised" },
  { year: "2015", event: "IJIDI Limited incorporated — RC 1615219 — professional services launched" },
];

/* ── HOOKS ── */
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function useCounter(target, visible, duration = 1800) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!visible || isNaN(parseInt(target))) return;
    const n = parseInt(target);
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setCount(Math.floor(ease * n));
      if (p < 1) requestAnimationFrame(tick);
      else setCount(n);
    };
    requestAnimationFrame(tick);
  }, [visible, target, duration]);
  return count;
}

/* ── COMPONENTS ── */
function AnimSection({ children, className, id, delay = 0 }) {
  const [ref, visible] = useInView();
  return (
    <section
      ref={ref} id={id} className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.8s ease ${delay}ms, transform 0.8s ease ${delay}ms`,
      }}
    >
      {children}
    </section>
  );
}

function StatCard({ num, label }) {
  const [ref, visible] = useInView(0.3);
  const raw = parseInt(num);
  const counted = useCounter(raw, visible);
  const suffix = num.replace(/[0-9]/g, "");
  return (
    <div ref={ref} className="stat-card">
      <span className="stat-num">{isNaN(raw) ? num : `${counted}${suffix}`}</span>
      <span className="stat-label">{label}</span>
    </div>
  );
}

function PillarCard({ pillar, index }) {
  const [ref, visible] = useInView(0.1);
  const [hovered, setHovered] = useState(false);
  return (
    <div
      ref={ref}
      className="pillar-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(40px)",
        transition: `opacity 0.7s ease ${index * 150}ms, transform 0.7s ease ${index * 150}ms, border-color 0.3s, background 0.3s`,
        borderTopColor: hovered ? "#C9A84C" : "transparent",
        background: hovered ? "rgba(201,168,76,0.04)" : "#FAFAF8",
      }}
    >
      <div className="pillar-id">{pillar.id}</div>
      <div className="pillar-icon" dangerouslySetInnerHTML={{ __html: pillar.icon }} />
      <div className="pillar-sub">{pillar.sub}</div>
      <h3 className="pillar-title">{pillar.title}</h3>
      <p className="pillar-desc">{pillar.desc}</p>
      <div className="pillar-tags">
        {pillar.tags.map(t => <span key={t} className="pillar-tag">{t}</span>)}
      </div>
    </div>
  );
}

/* ── MAIN COMPONENT ── */
export default function MandelaOnwusah() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [activeSection, setActiveSection] = useState("");
  const heroRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
      setScrollY(window.scrollY);
      // Track active section
      const sections = NAV.map(n => n.toLowerCase().replace(/\s/g, "-"));
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && window.scrollY >= el.offsetTop - 120) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = useCallback((name) => {
    const id = name.toLowerCase().replace(/\s/g, "-");
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  }, []);

  const heroParallax = scrollY * 0.35;

  return (
    <div className="site-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { overflow-x: hidden; }
        ::selection { background: rgba(201,168,76,0.2); }

        .site-root {
          font-family: 'Inter', sans-serif;
          background: #F7F5F0;
          color: #0E1A2B;
          overflow-x: hidden;
        }

        /* ─── NAV ─── */
        .nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 200;
          height: 72px; padding: 0 5vw;
          display: flex; align-items: center; justify-content: space-between;
          transition: background 0.4s, box-shadow 0.4s;
        }
        .nav.scrolled {
          background: rgba(247,245,240,0.95);
          box-shadow: 0 1px 0 rgba(201,168,76,0.25);
          backdrop-filter: blur(12px);
        }
        .nav-brand {
          display: flex; flex-direction: column; gap: 1px; text-decoration: none;
        }
        .nav-brand-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.2rem; font-weight: 600; letter-spacing: 0.06em;
          color: #0E1A2B; line-height: 1;
        }
        .nav-brand-sub {
          font-size: 0.6rem; letter-spacing: 0.22em; text-transform: uppercase;
          color: #C9A84C; font-weight: 500;
        }
        .nav-links {
          display: flex; gap: 0; list-style: none; align-items: center;
        }
        .nav-link-btn {
          background: none; border: none; cursor: pointer;
          font-family: 'Inter', sans-serif; font-size: 0.72rem;
          letter-spacing: 0.14em; text-transform: uppercase;
          color: #0E1A2B; padding: 0.5rem 1rem;
          transition: color 0.2s; position: relative;
        }
        .nav-link-btn::after {
          content: ''; position: absolute; bottom: 0; left: 1rem; right: 1rem;
          height: 1px; background: #C9A84C;
          transform: scaleX(0); transition: transform 0.25s;
        }
        .nav-link-btn:hover::after, .nav-link-btn.active::after { transform: scaleX(1); }
        .nav-link-btn:hover, .nav-link-btn.active { color: #C9A84C; }
        .nav-cta-btn {
          margin-left: 1.5rem;
          background: #0E1A2B; color: #C9A84C;
          border: none; cursor: pointer;
          font-family: 'Inter', sans-serif; font-size: 0.7rem;
          letter-spacing: 0.16em; text-transform: uppercase;
          padding: 0.65rem 1.6rem;
          transition: background 0.25s, transform 0.15s;
        }
        .nav-cta-btn:hover { background: #1B3A6B; transform: translateY(-1px); }
        .hamburger {
          display: none; flex-direction: column; gap: 6px;
          background: none; border: none; cursor: pointer; padding: 6px;
        }
        .hamburger span {
          display: block; width: 26px; height: 1.5px; background: #0E1A2B;
          transition: transform 0.25s, opacity 0.25s;
        }

        /* ─── MOBILE MENU ─── */
        .mobile-overlay {
          display: none; position: fixed; inset: 0; z-index: 190;
          background: #F7F5F0; flex-direction: column;
          align-items: center; justify-content: center; gap: 2.5rem;
        }
        .mobile-overlay.open { display: flex; }
        .mobile-close {
          position: absolute; top: 1.5rem; right: 5vw;
          background: none; border: none; cursor: pointer;
          font-size: 1.8rem; color: #0E1A2B; line-height: 1;
        }
        .mobile-nav-btn {
          background: none; border: none; cursor: pointer;
          font-family: 'Cormorant Garamond', serif;
          font-size: 2rem; font-weight: 600; color: #0E1A2B;
          letter-spacing: 0.04em; transition: color 0.2s;
        }
        .mobile-nav-btn:hover { color: #C9A84C; }

        /* ─── HERO ─── */
        .hero {
          min-height: 100vh;
          display: grid; grid-template-columns: 1fr 1fr;
          overflow: hidden; position: relative;
          background: #0E1A2B;
        }
        .hero-left {
          display: flex; flex-direction: column; justify-content: flex-end;
          padding: 130px 5vw 80px;
          position: relative; z-index: 2;
        }
        .hero-eyebrow {
          display: flex; align-items: center; gap: 0.8rem;
          font-size: 0.68rem; letter-spacing: 0.24em; text-transform: uppercase;
          color: #C9A84C; margin-bottom: 2rem; font-weight: 500;
        }
        .hero-eyebrow-line { width: 40px; height: 1px; background: #C9A84C; flex-shrink: 0; }
        .hero-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(3.5rem, 6vw, 6rem);
          font-weight: 300; line-height: 0.95;
          color: #F7F5F0; letter-spacing: -0.02em;
          margin-bottom: 0.4rem;
        }
        .hero-name-bold {
          font-weight: 700; color: #C9A84C; display: block;
        }
        .hero-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1rem, 1.8vw, 1.35rem);
          font-style: italic; color: rgba(247,245,240,0.55);
          margin-bottom: 2.5rem; letter-spacing: 0.03em;
        }
        .hero-sub {
          font-size: clamp(0.9rem, 1.3vw, 1rem);
          color: rgba(168,184,204,0.9); line-height: 1.8;
          max-width: 440px; margin-bottom: 3rem; font-weight: 300;
        }
        .hero-actions { display: flex; gap: 1rem; align-items: center; flex-wrap: wrap; }
        .btn-gold {
          background: #C9A84C; color: #0E1A2B;
          border: none; cursor: pointer; font-family: 'Inter', sans-serif;
          font-size: 0.72rem; letter-spacing: 0.16em; text-transform: uppercase;
          font-weight: 600; padding: 1rem 2.2rem;
          transition: background 0.25s, transform 0.15s, box-shadow 0.25s;
        }
        .btn-gold:hover {
          background: #D4B560; transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(201,168,76,0.35);
        }
        .btn-ghost {
          background: transparent; color: rgba(247,245,240,0.7);
          border: 1px solid rgba(247,245,240,0.2); cursor: pointer;
          font-family: 'Inter', sans-serif; font-size: 0.72rem;
          letter-spacing: 0.16em; text-transform: uppercase;
          padding: 1rem 2rem; transition: border-color 0.25s, color 0.25s;
        }
        .btn-ghost:hover { border-color: #C9A84C; color: #C9A84C; }

        .hero-right {
          position: relative; overflow: hidden;
        }
        .hero-img {
          position: absolute; inset: 0;
          width: 100%; height: 100%;
          object-fit: cover; object-position: top center;
          filter: grayscale(15%) contrast(1.05);
        }
        .hero-img-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to right, #0E1A2B 0%, transparent 40%),
                      linear-gradient(to top, #0E1A2B 0%, transparent 30%);
        }
        .hero-scroll-indicator {
          position: absolute; bottom: 2.5rem; left: 50%;
          transform: translateX(-50%);
          display: flex; flex-direction: column; align-items: center; gap: 0.5rem;
          color: rgba(247,245,240,0.35); font-size: 0.6rem; letter-spacing: 0.2em;
          text-transform: uppercase; z-index: 3;
          animation: scrollBounce 2s ease-in-out infinite;
        }
        .hero-scroll-line {
          width: 1px; height: 50px;
          background: linear-gradient(to bottom, rgba(201,168,76,0.6), transparent);
        }
        @keyframes scrollBounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(6px); }
        }

        /* ─── ABOUT ─── */
        .about {
          display: grid; grid-template-columns: 1fr 1fr;
          min-height: 85vh; align-items: stretch;
        }
        .about-img-side {
          position: relative; overflow: hidden; min-height: 500px;
        }
        .about-img {
          width: 100%; height: 100%;
          object-fit: cover; object-position: top center;
          filter: grayscale(10%);
          display: block;
        }
        .about-img-caption {
          position: absolute; bottom: 2rem; left: 2rem; right: 2rem;
          background: rgba(14,26,43,0.85); backdrop-filter: blur(8px);
          padding: 1.2rem 1.5rem; border-left: 2px solid #C9A84C;
        }
        .about-img-caption-text {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1rem; font-style: italic;
          color: rgba(247,245,240,0.8); line-height: 1.6;
        }
        .about-content {
          padding: 80px 6vw; background: #F7F5F0;
          display: flex; flex-direction: column; justify-content: center;
        }
        .eyebrow {
          font-size: 0.68rem; letter-spacing: 0.24em; text-transform: uppercase;
          color: #C9A84C; margin-bottom: 1.2rem; font-weight: 500;
          display: flex; align-items: center; gap: 0.7rem;
        }
        .eyebrow::before { content: ''; display: block; width: 28px; height: 1px; background: #C9A84C; }
        .section-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2rem, 3.5vw, 3.2rem);
          font-weight: 600; line-height: 1.1;
          color: #0E1A2B; margin-bottom: 2rem; letter-spacing: -0.01em;
        }
        .about-body {
          font-size: 0.97rem; color: #3D4F63; line-height: 1.85;
          margin-bottom: 1.2rem; font-weight: 300;
        }
        .about-body strong { color: #0E1A2B; font-weight: 600; }
        .about-signature {
          margin-top: 2.5rem; padding-top: 2rem;
          border-top: 1px solid rgba(14,26,43,0.1);
          display: flex; align-items: center; gap: 1.5rem;
        }
        .sig-line { width: 1px; height: 48px; background: #C9A84C; flex-shrink: 0; }
        .sig-text { font-family: 'Cormorant Garamond', serif; }
        .sig-name { font-size: 1.3rem; font-weight: 600; color: #0E1A2B; display: block; }
        .sig-role { font-size: 0.8rem; color: #C9A84C; letter-spacing: 0.1em; font-style: italic; }

        /* ─── STATS ─── */
        .stats-band {
          background: #0E1A2B; padding: 4rem 5vw;
          display: grid; grid-template-columns: repeat(4, 1fr);
          gap: 1px; position: relative; overflow: hidden;
        }
        .stats-band::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(to right, transparent, #C9A84C, transparent);
        }
        .stat-card {
          padding: 2.5rem 2rem; text-align: center; position: relative;
        }
        .stat-card::after {
          content: ''; position: absolute; right: 0; top: 20%; bottom: 20%;
          width: 1px; background: rgba(201,168,76,0.15);
        }
        .stat-card:last-child::after { display: none; }
        .stat-num {
          display: block; font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2.5rem, 4vw, 4rem); font-weight: 700;
          color: #C9A84C; line-height: 1;
          margin-bottom: 0.6rem;
        }
        .stat-label {
          font-size: 0.72rem; letter-spacing: 0.14em; text-transform: uppercase;
          color: rgba(247,245,240,0.45); font-weight: 400;
        }

        /* ─── EXPERTISE / PILLARS ─── */
        .expertise {
          padding: 100px 5vw; background: #F7F5F0;
        }
        .expertise-header {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 3rem; align-items: end; margin-bottom: 5rem;
        }
        .expertise-sub {
          font-size: 1rem; color: #3D4F63; line-height: 1.8; font-weight: 300;
          align-self: end;
        }
        .pillars-grid {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 2px; background: rgba(14,26,43,0.08);
        }
        .pillar-card {
          padding: 3rem 2.5rem; border-top: 3px solid transparent;
          cursor: default; position: relative;
        }
        .pillar-id {
          font-family: 'Cormorant Garamond', serif;
          font-size: 3rem; font-weight: 700; color: rgba(14,26,43,0.06);
          line-height: 1; margin-bottom: 1.5rem; letter-spacing: -0.04em;
        }
        .pillar-icon { width: 40px; height: 40px; margin-bottom: 1.5rem; }
        .pillar-sub {
          font-size: 0.65rem; letter-spacing: 0.2em; text-transform: uppercase;
          color: #C9A84C; margin-bottom: 0.6rem; font-weight: 500;
        }
        .pillar-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.5rem; font-weight: 600; color: #0E1A2B;
          margin-bottom: 1.2rem; line-height: 1.2;
        }
        .pillar-desc {
          font-size: 0.88rem; color: #3D4F63; line-height: 1.8; font-weight: 300;
          margin-bottom: 1.8rem;
        }
        .pillar-tags { display: flex; gap: 0.5rem; flex-wrap: wrap; }
        .pillar-tag {
          font-size: 0.62rem; letter-spacing: 0.12em; text-transform: uppercase;
          padding: 0.3rem 0.7rem; border: 1px solid rgba(201,168,76,0.3);
          color: #C9A84C; font-weight: 500;
        }

        /* ─── ECOSYSTEM ─── */
        .ecosystem {
          padding: 100px 5vw;
          background: #0E1A2B; position: relative; overflow: hidden;
        }
        .ecosystem::before {
          content: 'IJIDI'; position: absolute;
          font-family: 'Cormorant Garamond', serif;
          font-size: 20vw; font-weight: 700; color: rgba(255,255,255,0.02);
          right: -2vw; top: 50%; transform: translateY(-50%);
          pointer-events: none; letter-spacing: -0.05em; line-height: 1;
        }
        .eco-header { margin-bottom: 4rem; }
        .section-title-light {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2rem, 3.5vw, 3.2rem);
          font-weight: 600; color: #F7F5F0;
          line-height: 1.1; letter-spacing: -0.01em;
        }
        .eco-grid {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem; position: relative; z-index: 1;
        }
        .eco-card {
          padding: 2.5rem; border: 1px solid rgba(255,255,255,0.07);
          transition: border-color 0.3s, transform 0.3s;
          cursor: default; position: relative; overflow: hidden;
        }
        .eco-card::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
          transition: opacity 0.3s; opacity: 0;
        }
        .eco-card:hover { transform: translateY(-4px); }
        .eco-card:hover::before { opacity: 1; }
        .eco-badge {
          display: inline-flex; align-items: center; gap: 0.5rem;
          margin-bottom: 1.2rem;
        }
        .eco-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
        .eco-tag {
          font-size: 0.62rem; letter-spacing: 0.18em; text-transform: uppercase;
          font-weight: 500;
        }
        .eco-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.8rem; font-weight: 600; color: #F7F5F0;
          margin-bottom: 0.3rem; line-height: 1;
        }
        .eco-rc {
          font-size: 0.65rem; letter-spacing: 0.14em; color: rgba(247,245,240,0.25);
          margin-bottom: 1.4rem; font-weight: 400;
        }
        .eco-divider { height: 1px; background: rgba(255,255,255,0.07); margin-bottom: 1.4rem; }
        .eco-desc {
          font-size: 0.88rem; color: rgba(168,184,204,0.8);
          line-height: 1.8; font-weight: 300; margin-bottom: 2rem;
        }
        .eco-link {
          display: inline-flex; align-items: center; gap: 0.5rem;
          font-size: 0.68rem; letter-spacing: 0.16em; text-transform: uppercase;
          text-decoration: none; font-weight: 500;
          transition: gap 0.25s;
        }
        .eco-link:hover { gap: 0.9rem; }
        .eco-link-arrow { font-size: 0.9rem; }

        /* ─── CREDENTIALS / TIMELINE ─── */
        .credentials {
          padding: 100px 5vw; background: #F7F5F0;
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 8vw; align-items: start;
        }
        .timeline { display: flex; flex-direction: column; gap: 0; }
        .timeline-item {
          display: grid; grid-template-columns: 80px 1fr;
          gap: 2rem; padding: 2rem 0;
          border-bottom: 1px solid rgba(14,26,43,0.08);
          transition: background 0.2s;
        }
        .timeline-item:first-child { border-top: 1px solid rgba(14,26,43,0.08); }
        .timeline-year {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.1rem; font-weight: 600; color: #C9A84C;
          padding-top: 2px;
        }
        .timeline-event {
          font-size: 0.9rem; color: #3D4F63; line-height: 1.75; font-weight: 300;
        }
        .credentials-right {}
        .credentials-quote {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.4rem, 2.2vw, 2rem);
          font-weight: 400; font-style: italic;
          color: #0E1A2B; line-height: 1.5;
          margin-bottom: 2rem; padding-left: 1.5rem;
          border-left: 2px solid #C9A84C;
        }
        .credentials-list { display: flex; flex-direction: column; gap: 1rem; margin-top: 2rem; }
        .credentials-item {
          display: flex; align-items: flex-start; gap: 1rem;
          font-size: 0.9rem; color: #3D4F63; font-weight: 300; line-height: 1.6;
        }
        .credentials-item::before {
          content: '◆'; color: #C9A84C; font-size: 0.5rem; flex-shrink: 0; margin-top: 5px;
        }

        /* ─── CONNECT ─── */
        .connect {
          background: #0E1A2B; padding: 100px 5vw;
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 6vw; align-items: center;
        }
        .connect-heading {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2.2rem, 4vw, 3.8rem);
          font-weight: 600; color: #F7F5F0;
          line-height: 1.1; letter-spacing: -0.02em;
        }
        .connect-heading em { color: #C9A84C; font-style: italic; }
        .connect-right {}
        .connect-sub {
          font-size: 0.97rem; color: rgba(168,184,204,0.8);
          line-height: 1.85; font-weight: 300; margin-bottom: 2.5rem;
        }
        .connect-channels { display: flex; flex-direction: column; gap: 0.8rem; }
        .connect-channel {
          display: flex; align-items: center; justify-content: space-between;
          padding: 1.2rem 1.5rem;
          border: 1px solid rgba(255,255,255,0.07);
          text-decoration: none;
          transition: border-color 0.25s, background 0.25s;
        }
        .connect-channel:hover {
          border-color: rgba(201,168,76,0.4);
          background: rgba(201,168,76,0.04);
        }
        .connect-channel-label {
          font-size: 0.72rem; letter-spacing: 0.16em; text-transform: uppercase;
          color: rgba(247,245,240,0.5); font-weight: 500;
        }
        .connect-channel-value {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.05rem; color: #F7F5F0;
        }
        .connect-channel-arrow { color: #C9A84C; font-size: 0.9rem; }

        /* ─── FOOTER ─── */
        .footer {
          background: #080F1A; padding: 2rem 5vw;
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 1rem;
        }
        .footer-brand {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1rem; font-weight: 600; letter-spacing: 0.06em;
          color: rgba(247,245,240,0.4);
        }
        .footer-copy {
          font-size: 0.68rem; letter-spacing: 0.1em;
          color: rgba(247,245,240,0.2);
        }
        .footer-links { display: flex; gap: 2rem; }
        .footer-link {
          font-size: 0.68rem; letter-spacing: 0.12em; text-transform: uppercase;
          color: rgba(247,245,240,0.3); text-decoration: none;
          transition: color 0.2s;
        }
        .footer-link:hover { color: #C9A84C; }

        /* ─── RESPONSIVE ─── */
        @media (max-width: 1024px) {
          .hero { grid-template-columns: 1fr; }
          .hero-right { display: none; }
          .hero-left { min-height: 100vh; justify-content: center; background: #0E1A2B; }
          .about { grid-template-columns: 1fr; }
          .stats-band { grid-template-columns: repeat(2, 1fr); }
          .expertise-header { grid-template-columns: 1fr; gap: 1.5rem; }
          .pillars-grid { grid-template-columns: 1fr; }
          .eco-grid { grid-template-columns: 1fr; }
          .credentials { grid-template-columns: 1fr; }
          .connect { grid-template-columns: 1fr; }
          .nav-links, .nav-cta-btn { display: none; }
          .hamburger { display: flex; }
        }
        @media (max-width: 640px) {
          .stats-band { grid-template-columns: repeat(2, 1fr); }
          .hero-name { font-size: 3rem; }
          .section-title { font-size: 1.8rem; }
        }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation: none !important; transition-duration: 0.01ms !important; }
        }
      `}</style>

      {/* ── NAV ── */}
      <nav className={`nav${scrolled ? " scrolled" : ""}`}>
        <a className="nav-brand" href="#">
          <span className="nav-brand-name">Mandela Onwusah</span>
          <span className="nav-brand-sub">Founder &amp; CEO · IJIDI Group</span>
        </a>
        <ul className="nav-links">
          {NAV.map(n => {
            const id = n.toLowerCase().replace(/\s/g, "-");
            return (
              <li key={n}>
                <button
                  className={`nav-link-btn${activeSection === id ? " active" : ""}`}
                  onClick={() => scrollTo(n)}
                >{n}</button>
              </li>
            );
          })}
        </ul>
        <button className="nav-cta-btn" onClick={() => scrollTo("Connect")}>Let's Talk</button>
        <button className="hamburger" onClick={() => setMenuOpen(true)} aria-label="Menu">
          <span /><span /><span />
        </button>
      </nav>

      {/* ── MOBILE MENU ── */}
      <div className={`mobile-overlay${menuOpen ? " open" : ""}`} role="dialog" aria-modal="true">
        <button className="mobile-close" onClick={() => setMenuOpen(false)}>✕</button>
        {NAV.map(n => (
          <button key={n} className="mobile-nav-btn" onClick={() => scrollTo(n)}>{n}</button>
        ))}
      </div>

      {/* ── HERO ── */}
      <section className="hero" ref={heroRef}>
        <div className="hero-left">
          <p className="hero-eyebrow">
            <span className="hero-eyebrow-line" />
            Abuja, Nigeria · Global Reach
          </p>
          <h1 className="hero-name">
            Mandela
            <span className="hero-name-bold">Onwusah</span>
          </h1>
          <p className="hero-title">Strategic Consultant. Diplomatic Architect. Digital Catalyst.</p>
          <p className="hero-sub">
            Helping organisations think strategically, operate digitally, and engage globally.
          </p>
          <div className="hero-actions">
            <button className="btn-gold" onClick={() => scrollTo("Connect")}>Work With Me</button>
            <button className="btn-ghost" onClick={() => scrollTo("About")}>Discover More</button>
          </div>
        </div>
        <div className="hero-right">
          <img
            className="hero-img"
            src="/images/hero.png"
            alt="Mandela Onwusah"
            style={{ transform: `translateY(${heroParallax * 0.3}px)` }}
          />
          <div className="hero-img-overlay" />
        </div>
        <div className="hero-scroll-indicator">
          <div className="hero-scroll-line" />
          <span>Scroll</span>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <AnimSection className="about" id="about">
        <div className="about-img-side">
          <img className="about-img" src="/images/about.png" alt="Mandela Onwusah" />
          <div className="about-img-caption">
            <p className="about-img-caption-text">
              "Strategy without systems is intention. Systems without strategy is noise. I build both."
            </p>
          </div>
        </div>
        <div className="about-content">
          <p className="eyebrow">About Mandela</p>
          <h2 className="section-title">A builder of institutions, systems, and partnerships</h2>
          <p className="about-body">
            Mandela Onwusah is a <strong>strategic consultant, diplomatic architect, and digital catalyst</strong> based in Abuja, Nigeria. He is the Founder &amp; CEO of <strong>IJIDI Group</strong> — a professional services firm operating at the intersection of strategy, diplomacy, and technology.
          </p>
          <p className="about-body">
            With over a decade of experience advising institutions across Africa, Mandela brings a rare combination of <strong>strategic depth, diplomatic fluency, and operational systems thinking</strong> to every engagement — seeing not just what organisations are, but what they could become.
          </p>
          <p className="about-body">
            He is the sole architect of <strong>IGX</strong> — a proprietary AI-powered digital operations platform built on n8n, Supabase, Telegram, and Claude, transforming how organisations create, communicate, and scale intelligence.
          </p>
          <div className="about-signature">
            <div className="sig-line" />
            <div className="sig-text">
              <span className="sig-name">Mandela Onwusah</span>
              <span className="sig-role">Founder &amp; CEO, IJIDI Group · RC 1615219</span>
            </div>
          </div>
        </div>
      </AnimSection>

      {/* ── STATS ── */}
      <div className="stats-band">
        {CREDENTIALS.map(c => <StatCard key={c.label} num={c.num} label={c.label} />)}
      </div>

      {/* ── EXPERTISE ── */}
      <AnimSection className="expertise" id="expertise">
        <div className="expertise-header">
          <div>
            <p className="eyebrow">Capabilities</p>
            <h2 className="section-title">Three disciplines.<br />One integrated approach.</h2>
          </div>
          <p className="expertise-sub">
            Mandela's work sits at the convergence of strategy, diplomacy, and digital systems — disciplines that, when unified, produce transformation that endures.
          </p>
        </div>
        <div className="pillars-grid">
          {PILLARS.map((p, i) => <PillarCard key={p.id} pillar={p} index={i} />)}
        </div>
      </AnimSection>

      {/* ── ECOSYSTEM ── */}
      <AnimSection className="ecosystem" id="ecosystem">
        <div className="eco-header">
          <p className="eyebrow" style={{ color: "rgba(201,168,76,0.6)" }}>The IJIDI Ecosystem</p>
          <h2 className="section-title-light">Three entities.<br />One mission.</h2>
        </div>
        <div className="eco-grid">
          {ECOSYSTEM.map(e => (
            <div
              key={e.name} className="eco-card"
              style={{ background: e.bg, borderColor: "rgba(255,255,255,0.07)" }}
              onMouseEnter={ev => ev.currentTarget.style.borderColor = `${e.accent}44`}
              onMouseLeave={ev => ev.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"}
            >
              <div className="eco-badge">
                <span className="eco-dot" style={{ background: e.accent }} />
                <span className="eco-tag" style={{ color: e.accent }}>{e.tag}</span>
              </div>
              <h3 className="eco-name">{e.name}</h3>
              <p className="eco-rc">{e.rc}</p>
              <div className="eco-divider" />
              <p className="eco-desc">{e.desc}</p>
              <a className="eco-link" href={e.href} target="_blank" rel="noreferrer"
                style={{ color: e.accent }}>
                Visit <span className="eco-link-arrow">→</span>
              </a>
            </div>
          ))}
        </div>
      </AnimSection>

      {/* ── CREDENTIALS ── */}
      <AnimSection className="credentials" id="credentials">
        <div>
          <p className="eyebrow">Journey</p>
          <h2 className="section-title">Building with intention, since day one.</h2>
          <div className="timeline">
            {TIMELINE.map(t => (
              <div key={t.year} className="timeline-item">
                <span className="timeline-year">{t.year}</span>
                <p className="timeline-event">{t.event}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="credentials-right">
          <p className="eyebrow">Philosophy</p>
          <blockquote className="credentials-quote">
            "The institutions of tomorrow are built today — with strategy, diplomacy, and the courage to automate what slows us down."
          </blockquote>
          <p className="about-body">Mandela operates from a core conviction: Africa's next era will not be built by those who wait for resources, but by those who build systems that multiply them.</p>
          <div className="credentials-list">
            {[
              "Founder-operator with no execution gap between strategy and delivery",
              "Pioneer of AI-governed institutional operations in Nigeria",
              "Advisor to organisations seeking both global presence and local impact",
              "Architect of the IJIDI ecosystem — professional, social, and digital",
            ].map(item => (
              <div key={item} className="credentials-item">{item}</div>
            ))}
          </div>
        </div>
      </AnimSection>

      {/* ── CONNECT ── */}
      <AnimSection className="connect" id="connect">
        <div>
          <p className="eyebrow" style={{ color: "rgba(201,168,76,0.6)" }}>Get In Touch</p>
          <h2 className="connect-heading">
            Let's build something<br />
            <em>that matters.</em>
          </h2>
        </div>
        <div className="connect-right">
          <p className="connect-sub">
            Whether you're an institution seeking strategic direction, an investor exploring Africa's next frontier, a government partner, or a collaborator with vision — the conversation starts here.
          </p>
          <div className="connect-channels">
            {[
              { label: "Email", value: "mandela@ijidigroup.com", href: "mailto:mandela@ijidigroup.com" },
              { label: "LinkedIn", value: "@mandelaonwusah1", href: "https://linkedin.com/in/mandelaonwusah1" },
              { label: "Company", value: "ijidigroup.com", href: "https://ijidigroup.com" },
            ].map(c => (
              <a key={c.label} className="connect-channel" href={c.href} target="_blank" rel="noreferrer">
                <span className="connect-channel-label">{c.label}</span>
                <span className="connect-channel-value">{c.value}</span>
                <span className="connect-channel-arrow">→</span>
              </a>
            ))}
          </div>
        </div>
      </AnimSection>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <span className="footer-brand">Mandela Onwusah</span>
        <span className="footer-copy">© 2026 Mandela Onwusah. All rights reserved.</span>
        <div className="footer-links">
          <a className="footer-link" href="https://ijidigroup.com" target="_blank" rel="noreferrer">IJIDI Group</a>
          <a className="footer-link" href="#" target="_blank" rel="noreferrer">Foundation</a>
          <a className="footer-link" href="https://linkedin.com/in/mandelaonwusah1" target="_blank" rel="noreferrer">LinkedIn</a>
        </div>
      </footer>
    </div>
  );
}