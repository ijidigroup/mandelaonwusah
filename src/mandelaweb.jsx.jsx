import { useState, useEffect, useRef, useCallback } from "react";

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const NAV = ["About", "Work", "Expertise", "Ecosystem", "IGX", "Blog", "Books", "Connect"];

const WORK_ITEMS = [
  {
    tag: "Institution",
    title: "IJIDI Group",
    desc: "Founded and built a professional services holding company operating across consulting, strategy, and institutional development across Africa and beyond.",
    year: "2019 — Present",
    href: "https://ijidigroup.com",
    rc: "RC 1615219",
  },
  {
    tag: "AI System",
    title: "IGX — Proprietary Digital Operations",
    desc: "Designed and deployed a closed AI-powered operating system — 10 specialised agents governing content, strategy, research, finance, and automation across the IJIDI ecosystem. Each agent's role is documented in the Ecosystem section; the underlying implementation is proprietary.",
    year: "2025 — Present",
    href: "https://ijidigroup.com",
    rc: "NDA — implementation only",
  },
  {
    tag: "Foundation",
    title: "IJIDI Foundation",
    desc: "Established a humanitarian and social impact arm focused on community development, education, and institutional capacity building across Nigeria.",
    year: "2023 — Present",
    href: "https://ijidi.org",
    rc: "CAC registration in progress",
  },
];

const PILLARS = [
  {
    label: "Strategic Consulting",
    sub: "Institutional Transformation",
    desc: "Diagnosing complexity, architecting clarity. Working with governments, multilaterals, and private institutions to build strategy that endures — decisions rooted in context, culture, and long-term consequence.",
    tags: ["Policy Architecture", "Stakeholder Alignment", "Organisational Design"],
  },
  {
    label: "Diplomatic Architecture",
    sub: "Global Engagement",
    desc: "Building bridges across borders, sectors, and systems. Designing the frameworks through which institutions find common ground, create shared value, and engage at scale.",
    tags: ["Partnership Frameworks", "Multilateral Engagement", "Protocol & Dialogue"],
  },
  {
    label: "Digital Catalysis",
    sub: "Proprietary AI Operations",
    desc: "The architect of IGX — a 10-agent AI operations system that governs how the IJIDI ecosystem runs day to day, from research to finance to foundation workflows. Each agent's function is documented below; the underlying implementation remains proprietary.",
    tags: ["AI Systems Design", "Workflow Governance", "Digital Intelligence"],
  },
];

const IGX_AGENTS = [
  { n: "01", name: "Executive Agent", role: "The System CEO", desc: "Manages high-level decisions, protects founder runway, and enforces a strict revenue-first sequencing strategy." },
  { n: "02", name: "Research Agent", role: "The Strategic Intelligence Bureau", desc: "Conducts client research, competitor analysis, market mapping, and pre-meeting due diligence." },
  { n: "03", name: "Content Agent", role: "The Tri-Entity Multiplication Engine", desc: "Drafts and optimizes multi-platform, tri-lingual (English, French, Arabic) copy for the personal brand, corporate hub, and foundation." },
  { n: "04", name: "Automation Agent", role: "The Workflow Engineer", desc: "Builds, tests, and maintains workflows, database triggers, and API integrations with human-in-the-loop controls." },
  { n: "05", name: "COO Agent", role: "Operations", desc: "Coordinates cross-entity execution and keeps day-to-day operations aligned with strategic priorities." },
  { n: "06", name: "CTO Agent", role: "Technical Direction", desc: "Oversees the technical architecture and integration decisions across the IJIDI ecosystem's systems." },
  { n: "07", name: "CMO Agent", role: "Marketing Oversight", desc: "Marketing initiatives are directed here, with execution handled jointly with the Content Agent." },
  { n: "08", name: "Finance Agent", role: "Financial Auditing", desc: "Tracks and audits Monthly Recurring Revenue (MRR) and financial performance across entities." },
  { n: "09", name: "Knowledge Agent", role: "Institutional Memory", desc: "Maintains Notion as the primary knowledge repository for the ecosystem." },
  { n: "10", name: "NGO Agent", role: "Foundation Operations", desc: "Dedicated to managing IJIDI Foundation workflows and programme tracking." },
];

const ECOSYSTEM = [
  {
    name: "IJIDI Group",
    tag: "Professional Services",
    meta: "RC 1615219",
    desc: "Strategic consulting and advisory firm delivering institutional transformation across Africa and beyond. The commercial engine of the IJIDI ecosystem.",
    href: "https://ijidigroup.com",
    accent: "#C9A84C",
  },
  {
    name: "IJIDI Foundation",
    tag: "Social Impact",
    meta: "CAC registration in progress",
    desc: "Purpose-led programmes in youth empowerment, sustainable development, and community resilience. The conscience and humanitarian arm of the ecosystem.",
    href: "https://ijidi.org",
    accent: "#4A9B6F",
  },
  {
    name: "IGX",
    tag: "Digital Operations",
    meta: "Proprietary · NDA Only",
    desc: "A closed AI-powered digital operations system governing the IJIDI entities. Designed for institutional intelligence at scale. Architecture undisclosed.",
    href: "https://ijidigroup.com",
    accent: "#5B8BD4",
  },
];

const BLOG_POSTS = [
  {
    tag: "Leadership",
    title: "Building Institutions in the Age of AI",
    excerpt: "What does it mean to lead an organisation when intelligence itself is becoming infrastructure? A reflection on IGX and the future of African institutional design.",
    date: "Coming Soon",
  },
  {
    tag: "Strategy",
    title: "Why Africa Needs Systems Builders, Not Just Entrepreneurs",
    excerpt: "The difference between starting a business and building an institution — and why the continent's next chapter depends on founders who understand the distinction.",
    date: "Coming Soon",
  },
  {
    tag: "Operations",
    title: "Running a Company on AI: Lessons from Year One",
    excerpt: "Honest reflections on what worked, what failed, and what surprised me about deploying a proprietary AI operations system as a solo founder.",
    date: "Coming Soon",
  },
];

const BOOKS = [
  {
    title: "The Institution Builder",
    subtitle: "On founding, designing, and sustaining organisations that outlast their founders",
    status: "In Development",
    initial: "I",
  },
  {
    title: "IGX: Intelligence as Infrastructure",
    subtitle: "How proprietary AI systems are reshaping the way African organisations operate",
    status: "In Development",
    initial: "A",
  },
  {
    title: "Letters from Abuja",
    subtitle: "Dispatches on leadership, vision, and building from the inside of a continent in motion",
    status: "In Development",
    initial: "L",
  },
];

const TIMELINE = [
  { year: "2026", event: "IGX deployed — AI-powered digital operations across all IJIDI entities" },
  { year: "2025", event: "IJIDI Group rebranded from IJIDI Limited — ecosystem expansion initiated" },
  { year: "2024", event: "IJIDI Foundation founded — field programmes underway, CAC registration in progress" },
  { year: "2019", event: "IJIDI Limited incorporated — RC 1615219 — professional services launched" },
];

/* ─────────────────────────────────────────────
   HOOKS
───────────────────────────────────────────── */
function useInView(threshold = 0.12) {
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

function useCounter(target, active, duration = 2000) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    const n = parseInt(target);
    if (isNaN(n)) return;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 4);
      setVal(Math.floor(ease * n));
      if (p < 1) requestAnimationFrame(tick);
      else setVal(n);
    };
    requestAnimationFrame(tick);
  }, [active, target, duration]);
  return val;
}

/* ─────────────────────────────────────────────
   SUB-COMPONENTS
───────────────────────────────────────────── */
function Reveal({ children, delay = 0, className = "", id = "" }) {
  const [ref, visible] = useInView();
  return (
    <div
      ref={ref} id={id} className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(28px)",
        transition: `opacity 0.9s ease ${delay}ms, transform 0.9s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

function CountStat({ num, label }) {
  const [ref, visible] = useInView(0.3);
  const raw = parseInt(num);
  const counted = useCounter(raw, visible);
  const suffix = isNaN(raw) ? "" : num.replace(/[0-9]/g, "");
  return (
    <div ref={ref} className="stat-item">
      <span className="stat-num">{isNaN(raw) ? num : `${counted}${suffix}`}</span>
      <span className="stat-label">{label}</span>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN
───────────────────────────────────────────── */
export default function MandelaOnwusah() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [active, setActive] = useState("");
  const [hoveredWork, setHoveredWork] = useState(null);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 60);
      setScrollY(y);
      const ids = NAV.map(n => n.toLowerCase().replace(/\s/g, "-"));
      for (let i = ids.length - 1; i >= 0; i--) {
        const el = document.getElementById(ids[i]);
        if (el && y >= el.offsetTop - 140) { setActive(ids[i]); break; }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = useCallback((name) => {
    const id = name.toLowerCase().replace(/\s/g, "-");
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => { if (e.key === "Escape") setMenuOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  useEffect(() => {
    document.title = "Mandela Onwusah — Strategic Consultant, Diplomatic Architect, Digital Catalyst";
    const setMeta = (name, content, attr = "name") => {
      let tag = document.querySelector(`meta[${attr}="${name}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute(attr, name);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    };
    setMeta("description", "Mandela Onwusah — Founder of IJIDI Group, architect of the IGX AI operations system, and founder of the IJIDI Foundation. Building institutions across Africa.");
    setMeta("og:title", "Mandela Onwusah", "property");
    setMeta("og:description", "Strategic Consultant. Diplomatic Architect. Digital Catalyst.", "property");
    setMeta("og:type", "website", "property");
  }, []);

  return (
    <div className="root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600&family=IBM+Plex+Sans:wght@300;400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; font-size: 16px; }
        body { overflow-x: hidden; }
        ::selection { background: rgba(201,168,76,0.18); }
        img { display: block; max-width: 100%; }

        .root {
          font-family: 'IBM Plex Sans', sans-serif;
          background: #0C0C0C;
          color: #EDE8DF;
          overflow-x: hidden;
        }

        /* ── NAV ── */
        .nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 200;
          height: 70px; padding: 0 4vw;
          display: flex; align-items: center; justify-content: space-between;
          transition: background 0.4s, border-color 0.4s;
          border-bottom: 1px solid transparent;
        }
        .nav.up {
          background: rgba(12,12,12,0.96);
          border-bottom-color: rgba(201,168,76,0.15);
          backdrop-filter: blur(16px);
        }
        .nav-brand { text-decoration: none; display: flex; flex-direction: column; gap: 2px; }
        .nav-brand-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.15rem; font-weight: 600; color: #EDE8DF;
          letter-spacing: 0.04em; line-height: 1;
        }
        .nav-brand-tag {
          font-size: 0.58rem; letter-spacing: 0.22em; text-transform: uppercase;
          color: #C9A84C; font-weight: 500;
        }
        .nav-center { display: flex; gap: 0; list-style: none; }
        .nav-btn {
          background: none; border: none; cursor: pointer;
          font-family: 'IBM Plex Sans', sans-serif; font-size: 0.7rem;
          letter-spacing: 0.14em; text-transform: uppercase;
          color: rgba(237,232,223,0.55); padding: 0.5rem 0.9rem;
          transition: color 0.2s; position: relative;
        }
        .nav-btn::after {
          content: ''; position: absolute; bottom: 0;
          left: 0.9rem; right: 0.9rem; height: 1px;
          background: #C9A84C; transform: scaleX(0); transition: transform 0.25s;
          transform-origin: left;
        }
        .nav-btn:hover, .nav-btn.on { color: #C9A84C; }
        .nav-btn:hover::after, .nav-btn.on::after { transform: scaleX(1); }
        .nav-right { display: flex; align-items: center; gap: 1.5rem; }
        .nav-eco { display: flex; gap: 1.2rem; list-style: none; }
        .nav-eco a {
          font-size: 0.62rem; letter-spacing: 0.16em; text-transform: uppercase;
          color: rgba(201,168,76,0.5); text-decoration: none; transition: color 0.2s;
        }
        .nav-eco a:hover { color: #C9A84C; }
        .nav-talk {
          background: #C9A84C; color: #0C0C0C;
          border: none; cursor: pointer; font-family: 'IBM Plex Sans', sans-serif;
          font-size: 0.68rem; letter-spacing: 0.16em; text-transform: uppercase;
          font-weight: 600; padding: 0.6rem 1.4rem;
          transition: background 0.2s, transform 0.15s;
        }
        .nav-talk:hover { background: #D4B560; transform: translateY(-1px); }
        .hamburger {
          display: none; flex-direction: column; gap: 5px;
          background: none; border: none; cursor: pointer; padding: 6px;
        }
        .hamburger span {
          display: block; width: 24px; height: 1.5px; background: #EDE8DF;
          transition: all 0.25s;
        }

        /* ── MOBILE MENU ── */
        .mmenu {
          display: none; position: fixed; inset: 0; z-index: 195;
          background: #0C0C0C; flex-direction: column;
          align-items: center; justify-content: center; gap: 2.5rem;
        }
        .mmenu.open { display: flex; }
        .mmenu-close {
          position: absolute; top: 1.5rem; right: 4vw;
          background: none; border: none; cursor: pointer;
          font-size: 1.6rem; color: #EDE8DF;
        }
        .mmenu-btn {
          background: none; border: none; cursor: pointer;
          font-family: 'Cormorant Garamond', serif;
          font-size: 2.2rem; font-weight: 400; color: #EDE8DF;
          transition: color 0.2s;
        }
        .mmenu-btn:hover { color: #C9A84C; }

        /* ── HERO ── */
        .hero {
          min-height: 100vh;
          display: grid; grid-template-columns: 1fr 1fr;
          position: relative; overflow: hidden;
          background: #0C0C0C;
        }
        .hero-left {
          display: flex; flex-direction: column;
          justify-content: flex-end; padding: 140px 5vw 80px;
          position: relative; z-index: 2;
        }
        .hero-glow {
          position: absolute; top: 30%; left: 0; width: 50%;
          height: 50%; background: radial-gradient(ellipse, rgba(201,168,76,0.06) 0%, transparent 70%);
          pointer-events: none;
        }
        .hero-eyebrow {
          display: flex; align-items: center; gap: 0.8rem;
          font-size: 0.65rem; letter-spacing: 0.28em; text-transform: uppercase;
          color: #C9A84C; margin-bottom: 2.5rem; font-weight: 500;
        }
        .hero-eyebrow-dash { width: 36px; height: 1px; background: #C9A84C; }
        .hero-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(3.8rem, 6.5vw, 7rem);
          font-weight: 300; line-height: 0.92; letter-spacing: -0.02em;
          color: #EDE8DF; margin-bottom: 0.5rem;
        }
        .hero-name-gold { color: #C9A84C; font-weight: 700; display: block; }
        .hero-tagline {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1rem, 1.6vw, 1.3rem);
          font-style: italic; color: rgba(237,232,223,0.45);
          margin-bottom: 2.5rem; line-height: 1.5;
        }
        .hero-bio {
          font-size: clamp(0.88rem, 1.2vw, 0.97rem);
          color: rgba(237,232,223,0.6); line-height: 1.85;
          max-width: 420px; margin-bottom: 3rem; font-weight: 300;
        }
        .hero-actions { display: flex; gap: 1rem; align-items: center; flex-wrap: wrap; }
        .btn-gold {
          background: #C9A84C; color: #0C0C0C;
          border: none; cursor: pointer; font-family: 'IBM Plex Sans', sans-serif;
          font-size: 0.7rem; letter-spacing: 0.18em; text-transform: uppercase;
          font-weight: 600; padding: 1rem 2.2rem;
          transition: background 0.25s, transform 0.15s, box-shadow 0.25s;
        }
        .btn-gold:hover {
          background: #D4B560; transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(201,168,76,0.3);
        }
        .btn-ghost {
          background: transparent; border: 1px solid rgba(237,232,223,0.18);
          color: rgba(237,232,223,0.6); cursor: pointer;
          font-family: 'IBM Plex Sans', sans-serif; font-size: 0.7rem;
          letter-spacing: 0.18em; text-transform: uppercase;
          padding: 1rem 2rem; transition: border-color 0.25s, color 0.25s;
        }
        .btn-ghost:hover { border-color: #C9A84C; color: #C9A84C; }
        .hero-right {
          position: relative; overflow: hidden;
        }
        .hero-photo {
          position: absolute; inset: 0; width: 100%; height: 100%;
          object-fit: cover; object-position: top center;
          filter: grayscale(12%) contrast(1.04);
        }
        .hero-photo-veil {
          position: absolute; inset: 0;
          background: linear-gradient(to right, #0C0C0C 0%, rgba(12,12,12,0.3) 35%, transparent 60%),
                      linear-gradient(to top, #0C0C0C 0%, transparent 25%);
        }
        .hero-scroll {
          position: absolute; bottom: 3rem; left: 50%;
          transform: translateX(-50%); z-index: 3;
          display: flex; flex-direction: column; align-items: center; gap: 0.5rem;
          animation: bob 2.2s ease-in-out infinite;
        }
        .hero-scroll-bar {
          width: 1px; height: 52px;
          background: linear-gradient(to bottom, rgba(201,168,76,0.7), transparent);
        }
        .hero-scroll-label {
          font-size: 0.58rem; letter-spacing: 0.22em; text-transform: uppercase;
          color: rgba(237,232,223,0.3); writing-mode: vertical-rl;
        }
        @keyframes bob {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(7px); }
        }

        /* ── THIN RULE ── */
        .rule { width: 100%; height: 1px; background: rgba(237,232,223,0.06); }

        /* ── ABOUT ── */
        .about {
          display: grid; grid-template-columns: 1fr 1fr;
          min-height: 80vh;
        }
        .about-photo-side { position: relative; overflow: hidden; min-height: 560px; }
        .about-photo {
          width: 100%; height: 100%;
          object-fit: cover; object-position: top;
          filter: grayscale(8%);
        }
        .about-photo-caption {
          position: absolute; bottom: 2.5rem; left: 2.5rem; right: 2.5rem;
          background: rgba(12,12,12,0.88); backdrop-filter: blur(8px);
          padding: 1.2rem 1.5rem; border-left: 2px solid #C9A84C;
        }
        .about-photo-caption p {
          font-family: 'Cormorant Garamond', serif;
          font-size: 0.98rem; font-style: italic;
          color: rgba(237,232,223,0.7); line-height: 1.6;
        }
        .about-content {
          padding: 80px 5vw; background: #111110;
          display: flex; flex-direction: column; justify-content: center;
        }
        .eyebrow {
          font-size: 0.62rem; letter-spacing: 0.26em; text-transform: uppercase;
          color: #C9A84C; margin-bottom: 1.2rem; font-weight: 500;
          display: flex; align-items: center; gap: 0.7rem;
        }
        .eyebrow::before { content: ''; display: block; width: 24px; height: 1px; background: #C9A84C; }
        .section-h {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2rem, 3.5vw, 3rem);
          font-weight: 400; color: #EDE8DF;
          line-height: 1.12; margin-bottom: 2rem; letter-spacing: -0.01em;
        }
        .about-p {
          font-size: 0.95rem; color: rgba(237,232,223,0.6);
          line-height: 1.9; margin-bottom: 1.2rem; font-weight: 300;
        }
        .about-p strong { color: #EDE8DF; font-weight: 500; }
        .sig {
          margin-top: 2.5rem; padding-top: 2rem;
          border-top: 1px solid rgba(237,232,223,0.08);
          display: flex; align-items: center; gap: 1.5rem;
        }
        .sig-bar { width: 1px; height: 50px; background: #C9A84C; flex-shrink: 0; }
        .sig-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.3rem; font-weight: 600; color: #EDE8DF; display: block;
        }
        .sig-role { font-size: 0.72rem; color: rgba(201,168,76,0.7); letter-spacing: 0.1em; font-style: italic; }

        /* ── STATS ── */
        .stats {
          background: #0C0C0C; padding: 4rem 4vw;
          display: grid; grid-template-columns: repeat(4, 1fr);
          gap: 1px; position: relative;
        }
        .stats::before {
          content: ''; position: absolute; top: 0; left: 4vw; right: 4vw;
          height: 1px; background: linear-gradient(to right, transparent, #C9A84C55, transparent);
        }
        .stat-item {
          padding: 2.5rem 2rem; text-align: center; position: relative;
        }
        .stat-item::after {
          content: ''; position: absolute; right: 0; top: 25%; bottom: 25%;
          width: 1px; background: rgba(237,232,223,0.06);
        }
        .stat-item:last-child::after { display: none; }
        .stat-num {
          display: block; font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2.8rem, 4.5vw, 4.5rem); font-weight: 700;
          color: #C9A84C; line-height: 1; margin-bottom: 0.6rem;
        }
        .stat-label {
          font-size: 0.65rem; letter-spacing: 0.16em; text-transform: uppercase;
          color: rgba(237,232,223,0.3); font-weight: 400;
        }

        /* ── WORK ── */
        .work-section { padding: 100px 4vw; background: #111110; }
        .work-header { margin-bottom: 4rem; }
        .work-list { display: flex; flex-direction: column; }
        .work-row {
          display: grid; grid-template-columns: 100px 1fr 110px;
          gap: 2.5rem; padding: 2.5rem 0;
          border-bottom: 1px solid rgba(237,232,223,0.06);
          text-decoration: none; color: inherit;
          transition: background 0.2s; cursor: pointer;
          align-items: start;
        }
        .work-row:first-child { border-top: 1px solid rgba(237,232,223,0.06); }
        .work-row:hover { background: rgba(201,168,76,0.03); }
        .work-tag {
          font-size: 0.6rem; letter-spacing: 0.2em; text-transform: uppercase;
          color: rgba(201,168,76,0.6); padding-top: 4px; font-weight: 500;
        }
        .work-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.3rem, 2vw, 1.7rem); font-weight: 400;
          color: #EDE8DF; margin-bottom: 0.6rem; line-height: 1.2;
          transition: color 0.25s;
        }
        .work-row:hover .work-title { color: #C9A84C; }
        .work-meta {
          font-size: 0.72rem; letter-spacing: 0.08em;
          color: rgba(237,232,223,0.3); margin-bottom: 0.6rem;
        }
        .work-desc {
          font-size: 0.85rem; line-height: 1.75;
          color: rgba(237,232,223,0.45); font-weight: 300;
        }
        .work-year {
          font-size: 0.68rem; letter-spacing: 0.1em;
          color: rgba(237,232,223,0.3); text-align: right; padding-top: 4px;
        }

        /* ── EXPERTISE ── */
        .expertise-section { padding: 100px 4vw; background: #0C0C0C; }
        .expertise-header {
          display: grid; grid-template-columns: 1fr 1fr; gap: 4rem;
          align-items: end; margin-bottom: 5rem;
        }
        .expertise-intro {
          font-size: 0.95rem; color: rgba(237,232,223,0.5);
          line-height: 1.85; font-weight: 300;
        }
        .pillars { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2px; background: rgba(237,232,223,0.04); }
        .pillar {
          padding: 3rem 2.5rem; background: #0C0C0C;
          border-top: 2px solid transparent;
          transition: border-color 0.3s, background 0.3s;
        }
        .pillar:hover { border-color: #C9A84C; background: #111008; }
        .pillar-sub {
          font-size: 0.6rem; letter-spacing: 0.22em; text-transform: uppercase;
          color: rgba(201,168,76,0.6); margin-bottom: 0.6rem; font-weight: 500;
        }
        .pillar-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.45rem; font-weight: 600; color: #EDE8DF;
          margin-bottom: 1.2rem; line-height: 1.15;
        }
        .pillar-desc {
          font-size: 0.85rem; color: rgba(237,232,223,0.45);
          line-height: 1.8; font-weight: 300; margin-bottom: 1.8rem;
        }
        .pillar-tags { display: flex; flex-wrap: wrap; gap: 0.5rem; }
        .pillar-tag {
          font-size: 0.58rem; letter-spacing: 0.14em; text-transform: uppercase;
          padding: 0.28rem 0.7rem; border: 1px solid rgba(201,168,76,0.25);
          color: rgba(201,168,76,0.7); font-weight: 500;
        }

        /* ── ECOSYSTEM ── */
        .eco-section {
          padding: 100px 4vw; background: #0D1117;
          position: relative; overflow: hidden;
        }
        .eco-bg-text {
          position: absolute; font-family: 'Cormorant Garamond', serif;
          font-size: 22vw; font-weight: 700; color: rgba(255,255,255,0.018);
          right: -2vw; top: 50%; transform: translateY(-50%);
          pointer-events: none; line-height: 1; letter-spacing: -0.06em;
          user-select: none;
        }
        .eco-grid {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem; position: relative; z-index: 1; margin-top: 4rem;
        }
        .eco-card {
          border: 1px solid rgba(237,232,223,0.06);
          padding: 2.5rem; transition: border-color 0.3s, transform 0.3s;
          position: relative; overflow: hidden;
        }
        .eco-card:hover { transform: translateY(-5px); }
        .eco-card-bar {
          position: absolute; top: 0; left: 0; right: 0; height: 2px;
          opacity: 0; transition: opacity 0.3s;
        }
        .eco-card:hover .eco-card-bar { opacity: 1; }
        .eco-badge { display: flex; align-items: center; gap: 0.6rem; margin-bottom: 1.2rem; }
        .eco-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
        .eco-tag-label {
          font-size: 0.6rem; letter-spacing: 0.2em; text-transform: uppercase; font-weight: 500;
        }
        .eco-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.9rem; font-weight: 600; color: #EDE8DF;
          margin-bottom: 0.25rem; line-height: 1;
        }
        .eco-meta {
          font-size: 0.6rem; letter-spacing: 0.16em;
          color: rgba(237,232,223,0.4); margin-bottom: 1.4rem;
        }
        .eco-divider { height: 1px; background: rgba(237,232,223,0.06); margin-bottom: 1.4rem; }
        .eco-desc {
          font-size: 0.85rem; color: rgba(237,232,223,0.45);
          line-height: 1.8; font-weight: 300; margin-bottom: 2rem;
        }
        .eco-link {
          font-size: 0.65rem; letter-spacing: 0.18em; text-transform: uppercase;
          text-decoration: none; font-weight: 500;
          display: inline-flex; align-items: center; gap: 0.5rem;
          transition: gap 0.25s;
        }
        .eco-link:hover { gap: 0.9rem; }

        /* ── IGX AGENTS ── */
        .igx-section { padding: 100px 4vw; background: #0D1117; }
        .igx-intro {
          font-size: 0.95rem; color: rgba(237,232,223,0.5);
          line-height: 1.85; font-weight: 300; max-width: 620px; margin-bottom: 3.5rem;
        }
        .igx-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1px; background: rgba(237,232,223,0.06); border: 1px solid rgba(237,232,223,0.06); }
        .igx-item { background: #0D1117; padding: 2rem 2.2rem; display: flex; gap: 1.3rem; }
        .igx-num { font-family: 'Cormorant Garamond', serif; font-size: 1.6rem; color: rgba(201,168,76,0.5); font-weight: 600; flex-shrink: 0; padding-top: 2px; }
        .igx-name { font-family: 'Cormorant Garamond', serif; font-size: 1.2rem; font-weight: 600; color: #EDE8DF; margin-bottom: 0.2rem; }
        .igx-role { font-size: 0.62rem; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(201,168,76,0.65); margin-bottom: 0.6rem; font-weight: 500; }
        .igx-desc { font-size: 0.82rem; color: rgba(237,232,223,0.45); line-height: 1.7; font-weight: 300; }
        @media (max-width: 1024px) { .igx-grid { grid-template-columns: 1fr; } }

        /* ── CREDENTIALS ── */
        .creds-section {
          padding: 100px 4vw; background: #111110;
          display: grid; grid-template-columns: 1fr 1fr; gap: 8vw;
        }
        .timeline { display: flex; flex-direction: column; }
        .tl-item {
          display: grid; grid-template-columns: 70px 1fr;
          gap: 2rem; padding: 2rem 0;
          border-bottom: 1px solid rgba(237,232,223,0.06);
        }
        .tl-item:first-child { border-top: 1px solid rgba(237,232,223,0.06); }
        .tl-year {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.1rem; font-weight: 600; color: #C9A84C; padding-top: 2px;
        }
        .tl-event {
          font-size: 0.88rem; color: rgba(237,232,223,0.55); line-height: 1.75; font-weight: 300;
        }
        .philosophy-quote {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.3rem, 2vw, 1.9rem); font-weight: 400; font-style: italic;
          color: #EDE8DF; line-height: 1.55; margin-bottom: 2rem;
          padding-left: 1.5rem; border-left: 2px solid #C9A84C;
        }
        .creds-list { display: flex; flex-direction: column; gap: 1rem; margin-top: 2rem; }
        .creds-item {
          display: flex; gap: 1rem; font-size: 0.88rem;
          color: rgba(237,232,223,0.5); font-weight: 300; line-height: 1.65;
          align-items: flex-start;
        }
        .creds-item::before {
          content: '◆'; color: #C9A84C; font-size: 0.45rem; flex-shrink: 0; margin-top: 6px;
        }

        /* ── BLOG ── */
        .blog-section { padding: 100px 4vw; background: #0C0C0C; }
        .blog-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; margin-top: 4rem; }
        .blog-card {
          border: 1px solid rgba(237,232,223,0.06); padding: 2rem;
          transition: border-color 0.3s; cursor: default;
        }
        .blog-card:hover { border-color: rgba(201,168,76,0.3); }
        .blog-tag {
          font-size: 0.58rem; letter-spacing: 0.22em; text-transform: uppercase;
          color: #C9A84C; margin-bottom: 1rem; font-weight: 500;
        }
        .blog-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.3rem; font-weight: 400; color: #EDE8DF;
          margin-bottom: 1rem; line-height: 1.3;
        }
        .blog-excerpt {
          font-size: 0.82rem; line-height: 1.75;
          color: rgba(237,232,223,0.4); font-weight: 300; margin-bottom: 1.5rem;
        }
        .blog-date {
          font-size: 0.6rem; letter-spacing: 0.18em; text-transform: uppercase;
          color: rgba(237,232,223,0.2); font-weight: 500;
        }

        /* ── BOOKS ── */
        .books-section { padding: 100px 4vw; background: #111110; }
        .books-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; margin-top: 4rem; }
        .book-card {
          border: 1px solid rgba(237,232,223,0.06); overflow: hidden;
          transition: border-color 0.3s, transform 0.3s;
        }
        .book-card:hover { border-color: rgba(201,168,76,0.35); transform: translateY(-5px); }
        .book-spine {
          height: 220px;
          background: linear-gradient(140deg, #181208 0%, #221a08 50%, #151005 100%);
          display: flex; align-items: center; justify-content: center;
          position: relative; overflow: hidden;
          border-bottom: 1px solid rgba(201,168,76,0.15);
        }
        .book-spine::before {
          content: ''; position: absolute;
          left: 0; top: 0; bottom: 0; width: 4px;
          background: linear-gradient(to bottom, #C9A84C, #8B6914, #C9A84C);
        }
        .book-spine-letter {
          font-family: 'Cormorant Garamond', serif;
          font-size: 5rem; font-weight: 700; font-style: italic;
          color: rgba(201,168,76,0.12); user-select: none;
        }
        .book-body { padding: 1.8rem; }
        .book-status {
          font-size: 0.58rem; letter-spacing: 0.22em; text-transform: uppercase;
          color: rgba(201,168,76,0.6); margin-bottom: 0.8rem; font-weight: 500;
        }
        .book-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.15rem; font-weight: 600; color: #EDE8DF;
          margin-bottom: 0.6rem; line-height: 1.3;
        }
        .book-subtitle {
          font-size: 0.78rem; line-height: 1.65;
          color: rgba(237,232,223,0.4); font-weight: 300;
        }

        /* ── CONNECT ── */
        .connect-section {
          padding: 100px 4vw; background: #0C0C0C;
          display: grid; grid-template-columns: 1fr 1fr; gap: 6vw; align-items: center;
        }
        .connect-h {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2.5rem, 4.5vw, 4.5rem);
          font-weight: 300; color: #EDE8DF;
          line-height: 1.08; letter-spacing: -0.02em;
        }
        .connect-h em { color: #C9A84C; font-style: italic; }
        .connect-sub {
          font-size: 0.95rem; color: rgba(237,232,223,0.5);
          line-height: 1.9; font-weight: 300; margin-bottom: 3rem;
        }
        .connect-channels { display: flex; flex-direction: column; gap: 0.6rem; }
        .connect-ch {
          display: flex; align-items: center; justify-content: space-between;
          padding: 1.2rem 1.5rem; text-decoration: none; color: inherit;
          border: 1px solid rgba(237,232,223,0.06);
          transition: border-color 0.25s, background 0.25s;
        }
        .connect-ch:hover {
          border-color: rgba(201,168,76,0.3);
          background: rgba(201,168,76,0.03);
        }
        .ch-label {
          font-size: 0.62rem; letter-spacing: 0.2em; text-transform: uppercase;
          color: rgba(237,232,223,0.35); font-weight: 500;
        }
        .ch-val {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1rem; color: #EDE8DF;
        }
        .ch-arr { color: #C9A84C; font-size: 0.9rem; }

        /* ── FOOTER ── */
        .footer {
          background: #070707; padding: 2rem 4vw;
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 1rem;
          border-top: 1px solid rgba(237,232,223,0.04);
        }
        .footer-brand {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1rem; font-weight: 600; color: rgba(237,232,223,0.3);
          letter-spacing: 0.04em;
        }
        .footer-copy { font-size: 0.65rem; color: rgba(237,232,223,0.32); letter-spacing: 0.08em; }
        .footer-links { display: flex; gap: 2rem; }
        .footer-link {
          font-size: 0.62rem; letter-spacing: 0.14em; text-transform: uppercase;
          color: rgba(201,168,76,0.35); text-decoration: none; transition: color 0.2s;
        }
        .footer-link:hover { color: #C9A84C; }

        /* ── RESPONSIVE ── */
        @media (max-width: 1024px) {
          .hero { grid-template-columns: 1fr; }
          .hero-right { display: none; }
          .hero-left { min-height: 100vh; justify-content: center; }
          .about { grid-template-columns: 1fr; }
          .stats { grid-template-columns: repeat(2, 1fr); }
          .expertise-header { grid-template-columns: 1fr; }
          .pillars { grid-template-columns: 1fr; }
          .eco-grid { grid-template-columns: 1fr; }
          .creds-section { grid-template-columns: 1fr; }
          .blog-grid { grid-template-columns: 1fr; }
          .books-grid { grid-template-columns: 1fr; }
          .connect-section { grid-template-columns: 1fr; }
          .nav-center, .nav-right { display: none; }
          .hamburger { display: flex; }
          .work-row { grid-template-columns: 1fr; gap: 0.4rem; }
          .work-year { text-align: left; }
        }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation: none !important; transition-duration: 0.01ms !important; }
        }
      `}</style>

      {/* ── NAV ── */}
      <nav className={`nav${scrolled ? " up" : ""}`}>
        <a className="nav-brand" href="#" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <span className="nav-brand-name">Mandela Onwusah</span>
          <span className="nav-brand-tag">Founder &amp; CEO · IJIDI Group</span>
        </a>
        <ul className="nav-center">
          {NAV.map(n => (
            <li key={n}>
              <button
                className={`nav-btn${active === n.toLowerCase().replace(/\s/g, "-") ? " on" : ""}`}
                onClick={() => go(n)}
              >{n}</button>
            </li>
          ))}
        </ul>
        <div className="nav-right">
          <ul className="nav-eco">
            <li><a href="https://ijidigroup.com" target="_blank" rel="noreferrer">IJIDI Group</a></li>
            <li><a href="https://ijidi.org" target="_blank" rel="noreferrer">Foundation</a></li>
          </ul>
          <button className="nav-talk" onClick={() => go("Connect")}>Let's Talk</button>
        </div>
        <button className="hamburger" onClick={() => setMenuOpen(true)} aria-label="Menu">
          <span /><span /><span />
        </button>
      </nav>

      {/* ── MOBILE MENU ── */}
      <div className={`mmenu${menuOpen ? " open" : ""}`} role="dialog" aria-modal="true">
        <button className="mmenu-close" onClick={() => setMenuOpen(false)} aria-label="Close menu">✕</button>
        {NAV.map(n => (
          <button key={n} className="mmenu-btn" onClick={() => go(n)}>{n}</button>
        ))}
      </div>

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-glow" />
        <div className="hero-left">
          <p className="hero-eyebrow">
            <span className="hero-eyebrow-dash" />
            Abuja, Nigeria · Global Reach
          </p>
          <h1 className="hero-name">
            Mandela
            <span className="hero-name-gold">Onwusah</span>
          </h1>
          <p className="hero-tagline">Strategic Consultant. Diplomatic Architect. Digital Catalyst.</p>
          <p className="hero-bio">
            Founder, systems builder, and author — designing institutions, intelligence,
            and the next chapter of African leadership.
          </p>
          <div className="hero-actions">
            <button className="btn-gold" onClick={() => go("Connect")}>Work With Me</button>
            <button className="btn-ghost" onClick={() => go("About")}>Discover More</button>
          </div>
        </div>
        <div className="hero-right">
          <img
            className="hero-photo"
            src="/images/mandela-hero.png"
            alt="Mandela Onwusah, standing portrait"
            style={{ transform: `translateY(${scrollY * 0.12}px)` }}
          />
          <div className="hero-photo-veil" />
        </div>
        <div className="hero-scroll">
          <div className="hero-scroll-bar" />
          <span className="hero-scroll-label">Scroll</span>
        </div>
      </section>

      <div className="rule" />

      {/* ── ABOUT ── */}
      <div id="about" className="about">
        <div className="about-photo-side">
          <img className="about-photo" src="/images/mandela-about.jpg" alt="Mandela Onwusah, formal portrait with the IJIDI Group crest" />
          <div className="about-photo-caption">
            <p>"Strategy without systems is intention. Systems without strategy is noise. I build both."</p>
          </div>
        </div>
        <Reveal className="about-content">
          <p className="eyebrow">About Mandela</p>
          <h2 className="section-h">Built to build<br />institutions.</h2>
          <p className="about-p">
            I am a <strong>founder, systems architect, and author</strong> based in Abuja, Nigeria. My work sits at the intersection of institutional design, operational intelligence, and African leadership — building organisations that are structured to last, not just to launch.
          </p>
          <p className="about-p">
            In 2019, I founded <strong>IJIDI Group</strong> — a professional services holding company designed around a simple thesis: Africa needs more institutions, not just more businesses. Since then, I have expanded that work into the IJIDI Foundation and a proprietary AI operating system I built to govern the entire ecosystem.
          </p>
          <p className="about-p">
            I write, build, and think out loud — because the ideas that shape institutions deserve to live beyond boardrooms.
          </p>
          <div className="sig">
            <div className="sig-bar" />
            <div>
              <span className="sig-name">Mandela Onwusah</span>
              <span className="sig-role">Founder &amp; CEO, IJIDI Group · RC 1615219</span>
            </div>
          </div>
        </Reveal>
      </div>

      {/* ── STATS ── */}
      <div className="stats">
        <CountStat num="2019" label="Year IJIDI Group was founded" />
        <CountStat num="3" label="Entities in the IJIDI ecosystem" />
        <CountStat num="10" label="IGX AI agents deployed" />
        <CountStat num="∞" label="Books being written simultaneously" />
      </div>

      <div className="rule" />

      {/* ── WORK ── */}
      <Reveal id="work" className="work-section">
        <div className="work-header">
          <p className="eyebrow">Work</p>
          <h2 className="section-h">What I've built.</h2>
        </div>
        <div className="work-list">
          {WORK_ITEMS.map((w, i) => (
            <a
              key={w.title} className="work-row"
              href={w.href} target="_blank" rel="noreferrer"
              onMouseEnter={() => setHoveredWork(i)}
              onMouseLeave={() => setHoveredWork(null)}
            >
              <span className="work-tag">{w.tag}</span>
              <div>
                <div className="work-title">{w.title}</div>
                <div className="work-meta">{w.rc}</div>
                <div className="work-desc">{w.desc}</div>
              </div>
              <span className="work-year">{w.year}</span>
            </a>
          ))}
        </div>
      </Reveal>

      <div className="rule" />

      {/* ── EXPERTISE ── */}
      <Reveal id="expertise" className="expertise-section">
        <div className="expertise-header">
          <div>
            <p className="eyebrow">Capabilities</p>
            <h2 className="section-h">Three disciplines.<br />One integrated approach.</h2>
          </div>
          <p className="expertise-intro">
            Mandela's work converges strategy, diplomacy, and digital systems — disciplines that, when unified, produce transformation that endures long after the engagement ends.
          </p>
        </div>
        <div className="pillars">
          {PILLARS.map(p => (
            <div key={p.label} className="pillar">
              <p className="pillar-sub">{p.sub}</p>
              <h3 className="pillar-title">{p.label}</h3>
              <p className="pillar-desc">{p.desc}</p>
              <div className="pillar-tags">
                {p.tags.map(t => <span key={t} className="pillar-tag">{t}</span>)}
              </div>
            </div>
          ))}
        </div>
      </Reveal>

      <div className="rule" />

      {/* ── ECOSYSTEM ── */}
      <Reveal id="ecosystem" className="eco-section">
        <div className="eco-bg-text">IJIDI</div>
        <p className="eyebrow">The IJIDI Ecosystem</p>
        <h2 className="section-h">Three entities.<br />One mission.</h2>
        <div className="eco-grid">
          {ECOSYSTEM.map(e => (
            <div
              key={e.name} className="eco-card"
              onMouseEnter={ev => ev.currentTarget.style.borderColor = `${e.accent}44`}
              onMouseLeave={ev => ev.currentTarget.style.borderColor = "rgba(237,232,223,0.06)"}
            >
              <div className="eco-card-bar" style={{ background: e.accent }} />
              <div className="eco-badge">
                <span className="eco-dot" style={{ background: e.accent }} />
                <span className="eco-tag-label" style={{ color: e.accent }}>{e.tag}</span>
              </div>
              <h3 className="eco-name">{e.name}</h3>
              <p className="eco-meta">{e.meta}</p>
              <div className="eco-divider" />
              <p className="eco-desc">{e.desc}</p>
              <a className="eco-link" href={e.href} target="_blank" rel="noreferrer"
                style={{ color: e.accent }}>
                Visit <span>→</span>
              </a>
            </div>
          ))}
        </div>
      </Reveal>

      <div className="rule" />

      {/* ── IGX AGENTS ── */}
      <Reveal id="igx" className="igx-section">
        <p className="eyebrow">IGX System Breakdown</p>
        <h2 className="section-h">Ten agents.<br />One operating system.</h2>
        <p className="igx-intro">
          The underlying prompts and implementation stay proprietary, but what each agent is responsible for doesn't need to be a mystery. Here's the actual breakdown.
        </p>
        <div className="igx-grid">
          {IGX_AGENTS.map(a => (
            <div key={a.n} className="igx-item">
              <span className="igx-num">{a.n}</span>
              <div>
                <h4 className="igx-name">{a.name}</h4>
                <p className="igx-role">{a.role}</p>
                <p className="igx-desc">{a.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Reveal>

      <div className="rule" />

      {/* ── CREDENTIALS ── */}
      <div id="credentials" className="creds-section">
        <Reveal>
          <p className="eyebrow">Journey</p>
          <h2 className="section-h">Building with intention,<br />since day one.</h2>
          <div className="timeline">
            {TIMELINE.map(t => (
              <div key={t.year} className="tl-item">
                <span className="tl-year">{t.year}</span>
                <p className="tl-event">{t.event}</p>
              </div>
            ))}
          </div>
        </Reveal>
        <Reveal delay={150}>
          <p className="eyebrow">Philosophy</p>
          <blockquote className="philosophy-quote">
            "The institutions of tomorrow are built today — with strategy, diplomacy, and the courage to build systems that multiply resources, not just consume them."
          </blockquote>
          <p className="about-p">Mandela operates from a core conviction: Africa's next era will not be built by those who wait for resources, but by those who build systems that create them.</p>
          <div className="creds-list">
            {[
              "Founder-operator with no execution gap between strategy and delivery",
              "Pioneer of proprietary AI-governed institutional operations in Nigeria",
              "Advisor to organisations seeking both global presence and local impact",
              "Architect of the IJIDI ecosystem — professional, social, and digital",
            ].map(c => <div key={c} className="creds-item">{c}</div>)}
          </div>
        </Reveal>
      </div>

      <div className="rule" />

      {/* ── BLOG ── */}
      <Reveal id="blog" className="blog-section">
        <p className="eyebrow">Blog</p>
        <h2 className="section-h">Ideas worth writing.</h2>
        <div className="blog-grid">
          {BLOG_POSTS.map(b => (
            <div key={b.title} className="blog-card">
              <p className="blog-tag">{b.tag}</p>
              <h3 className="blog-title">{b.title}</h3>
              <p className="blog-excerpt">{b.excerpt}</p>
              <p className="blog-date">{b.date}</p>
            </div>
          ))}
        </div>
      </Reveal>

      <div className="rule" />

      {/* ── BOOKS ── */}
      <Reveal id="books" className="books-section">
        <p className="eyebrow">Books</p>
        <h2 className="section-h">Everything we think,<br />written every way.</h2>
        <div className="books-grid">
          {BOOKS.map(b => (
            <div key={b.title} className="book-card">
              <div className="book-spine">
                <span className="book-spine-letter">{b.initial}</span>
              </div>
              <div className="book-body">
                <p className="book-status">{b.status}</p>
                <h3 className="book-title">{b.title}</h3>
                <p className="book-subtitle">{b.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </Reveal>

      <div className="rule" />

      {/* ── CONNECT ── */}
      <div id="connect" className="connect-section">
        <Reveal>
          <p className="eyebrow">Get In Touch</p>
          <h2 className="connect-h">
            Let's build something<br />
            <em>that matters.</em>
          </h2>
        </Reveal>
        <Reveal delay={100}>
          <p className="connect-sub">
            Whether you're an institution seeking strategic direction, an investor exploring Africa's next frontier, a government partner, or a collaborator with vision — no forms, no gatekeepers. The conversation starts here.
          </p>
          <div className="connect-channels">
            {[
              { label: "Email", val: "mandela@mandelaonwusah.com", href: "mailto:mandela@mandelaonwusah.com" },
              { label: "LinkedIn", val: "@mandelaonwusah1", href: "https://linkedin.com/in/mandelaonwusah1" },
              { label: "IJIDI Group", val: "ijidigroup.com", href: "https://ijidigroup.com" },
              { label: "Foundation", val: "ijidi.org", href: "https://ijidi.org" },
            ].map(c => (
              <a key={c.label} className="connect-ch" href={c.href} target="_blank" rel="noreferrer">
                <span className="ch-label">{c.label}</span>
                <span className="ch-val">{c.val}</span>
                <span className="ch-arr">→</span>
              </a>
            ))}
          </div>
        </Reveal>
      </div>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <span className="footer-brand">Mandela Onwusah</span>
        <span className="footer-copy">© 2026 Mandela Onwusah. All rights reserved.</span>
        <div className="footer-links">
          <a className="footer-link" href="https://ijidigroup.com" target="_blank" rel="noreferrer">IJIDI Group</a>
          <a className="footer-link" href="https://ijidi.org" target="_blank" rel="noreferrer">Foundation</a>
          <a className="footer-link" href="https://linkedin.com/in/mandelaonwusah1" target="_blank" rel="noreferrer">LinkedIn</a>
        </div>
      </footer>
    </div>
  );
}
