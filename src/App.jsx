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
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600&family=Inter:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; font-size: 16px; }
        body { overflow-x: hidden; }
        ::selection { background: rgba(201,168,76,0.18); }
        img { display: block; max-width: 100%; }

        .root {
          font-family: 'Inter', sans-serif;
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
          font-family: 'Inter', sans-serif; font-size: 0.7rem;
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
          border: none; cursor: pointer; font-family: 'Inter', sans-serif;
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
          border: none; cursor: pointer; font-family: 'Inter', sans-serif;
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
          font-family: 'Inter', sans-serif; font-size: 0.7rem;
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
            src="data:image/jpeg;base64,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"
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
          <img className="about-photo" src="data:image/jpeg;base64,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zhzzFolFDDYe5F6w9PBvfnf7t5Zg1988885Do/8A/wD/AJcXx7nhSfK1pBbB9zb7pZ5K8ohC/Rv9jSJTDJSBRLa41ra90+pgajZBE88888ucv3//AP7WjfTz3+tZ+zxT70T4z8wfd0YEWBpQYwLQz73IV4ag0W0VdH5phIQ8c1/PPPPPJi2v/wD/AJqtrVqFM3NvbEYL/Dvf/JFQNQVZ3G9zTN//ABZK5TEVB7wO8aC2HgU0PnPPPPPPL8p9/wD/ADyVPHybjGTJ9JAF7L//AL60cfFffIklArX/AOM56h+jgEwN2tr2qIvHptXzzzzzzzwffD//AHuV7bhwV77JpfBBP3/fz/1V6hBBLP7GBbjZfgkceLPrE+tsN5eGPTHc88888888uCaX7l3hrrtCztX7hzpAdTLHRbJfBTNBr4RtbzLa/Jv88++BP88tWGN7gPU8888888888cdnjI6NR+An38ljnL19vLnXjHrzlP1sCiON9967bBL4Q87hf8nJqiS2ba888888888888XWfMC1VzNix8OnHLfz/wA0yW2S3dwoKZI4t/b6I4fZ8HPgVfPFl/pHWMnvPPPPPPPPPPPLkODE56zYfWnjmW9+3841y7VX86CKVrtaW22I/wAmVcDoMH7y8nXT2EgTzzzzzzzzzzzzzy0sXblPt46B21cmcsoM/wDt5xlDa+cLYvNHZaX7RtScjFd88oB5Ugem8888888888888888MokFBda7Llu22F/v/PXFpRZJ35y2UzzzMTbNxn0zB/8AvK38jfpX/PPPPPPPPPPPPPPPPPPUtmQYcwrtLyGzWf7+9aR6XSVo4tT63iU6WWxMh/f/ADz9R/5Onzzzzzzzzzzzzzzzzzzzxpg50S54GOZNB5uEmFGncO+n0ehPEnw/dlpiMN3/AO84UpqMm8888888888888888888888sI3ArKjXU+mIirpTVp/SWLXIL31AVFVkjN9v++88yWYo+888888888888888888888888+cupM3RFev2o2bldNXQyyCpNLVkTNkj9++88887kSUE888888888888888888888888888um/KQHH8pXMSH1LWU2sE9D/CRZkj9+8888881pFf8APPPPPPPPPPPPPPPPPPPPPPPPPPPPL6zZN8HfCd7EJi3vASPIJnnkXq3fvPPPPOgUD/PP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" alt="Mandela Onwusah, formal portrait with the IJIDI Group crest" />
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
