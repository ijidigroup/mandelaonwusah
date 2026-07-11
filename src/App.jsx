import { useState, useEffect, useRef, useCallback } from "react";

/* ─────────────────────────────────────────────
    DATA ARCHITECTURE
───────────────────────────────────────────── */
const NAV = ["About", "Expertise", "Ecosystem", "IGX", "Connect"];

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
    desc: "Designed and deployed a closed AI-powered operating system — 10 specialised agents governing content, strategy, research, finance, and automation across the IJIDI ecosystem.",
    year: "2025 — Present",
    href: "#igx",
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
    desc: "The architect of IGX — a 10-agent AI operations system that governs how the IJIDI ecosystem runs day to day, from research to finance to foundation workflows.",
    tags: ["AI Systems Design", "Workflow Governance", "Digital Intelligence"],
  },
];

const IGX_AGENTS = [
  { n: "01", name: "Executive Agent", role: "The System CEO", desc: "Manages high-level decisions, protects founder runway, and enforces a strict revenue-first sequencing strategy.", log: "Enforcing ecosystem resource sequencing rules..." },
  { n: "02", name: "Research Agent", role: "Strategic Intelligence", desc: "Conducts client research, competitor analysis, market mapping, and pre-meeting due diligence.", log: "Analyzing market entry vectors for SSA operations..." },
  { n: "03", name: "Content Agent", role: "Tri-Entity Translation", desc: "Drafts and optimizes multi-platform, tri-lingual (English, French, Arabic) copy for the personal brand, corporate hub, and foundation.", log: "Syncing trilingual position papers to institutional portals..." },
  { n: "04", name: "Automation Agent", role: "Workflow Engineer", desc: "Builds, tests, and maintains workflows, database triggers, and API integrations with human-in-the-loop controls.", log: "Monitoring webhook relays across microservice boundaries..." },
  { n: "05", name: "COO Agent", role: "Operations Execution", desc: "Coordinates cross-entity execution and keeps day-to-day operations aligned with strategic priorities.", log: "Auditing master delivery roadmaps against timeline milestones..." },
  { n: "06", name: "CTO Agent", role: "Technical Direction", desc: "Oversees the technical architecture and integration decisions across the IJIDI ecosystem's systems.", log: "Securing operational matrix environments and private endpoints..." },
  { n: "07", name: "CMO Agent", role: "Marketing Oversight", desc: "Marketing initiatives are directed here, with execution handled jointly with the Content Agent.", log: "Tracking content distribution velocity matrices..." },
  { n: "08", name: "Finance Agent", role: "Financial Auditing", desc: "Tracks and audits Monthly Recurring Revenue (MRR) and financial performance across entities.", log: "Compiling real-time micro-ledger positions across asset clusters..." },
  { n: "09", name: "Knowledge Agent", role: "Institutional Memory", desc: "Maintains Notion as the primary knowledge repository for the ecosystem.", log: "Indexing legal frameworks and architectural blueprints..." },
  { n: "10", name: "NGO Agent", role: "Foundation Controls", desc: "Dedicated to managing IJIDI Foundation workflows and programme tracking.", log: "Validating resource disbursement transparency indicators..." },
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
    meta: "CAC In Progress",
    desc: "Purpose-led programmes in youth empowerment, sustainable development, and community resilience. The humanitarian arm of the ecosystem.",
    href: "https://ijidi.org",
    accent: "#4A9B6F",
  },
  {
    name: "IGX System",
    tag: "Digital Operations",
    meta: "Proprietary · NDA Only",
    desc: "A closed AI-powered digital operations system governing the IJIDI entities. Designed for institutional intelligence at scale. Architecture undisclosed.",
    href: "#igx",
    accent: "#5B8BD4",
  },
];

const TIMELINE = [
  { year: "2026", event: "IGX v2 deployed — full autonomous digital operations across all active IJIDI entities" },
  { year: "2025", event: "IJIDI Group rebranded from IJIDI Limited — ecosystem architectural expansion initiated" },
  { year: "2024", event: "IJIDI Foundation founded — field programmes underway across multiple development sectors" },
  { year: "2019", event: "IJIDI Limited incorporated — RC 1615219 — corporate strategic services launched" },
];

/* ─────────────────────────────────────────────
    REUSABLE HOOKS
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
        transform: visible ? "none" : "translateY(24px)",
        transition: `opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
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
    MAIN EXPORT COMPONENT
───────────────────────────────────────────── */
export default function MandelaOnwusah() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");
  const [activeAgent, setActiveAgent] = useState(0);
  const [liveLog, setLiveLog] = useState("System idle. All agents operating within nominal latency thresholds.");
  
  // Formspree state management configuration
  const [formState, setFormState] = useState({ submitting: false, succeeded: false, error: null });

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      const ids = NAV.map(n => n.toLowerCase().replace(/\s/g, "-"));
      for (let i = ids.length - 1; i >= 0; i--) {
        const el = document.getElementById(ids[i]);
        if (el && y >= el.offsetTop - 160) { setActive(ids[i]); break; }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = useCallback((name) => {
    const id = name.toLowerCase().replace(/\s/g, "-");
    const el = document.getElementById(id);
    if (el) {
      const offset = 90;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
    setMenuOpen(false);
  }, []);

  // Formspree API submit handler
  const handleFormspreeSubmit = async (e) => {
    e.preventDefault();
    setFormState({ submitting: true, succeeded: false, error: null });
    const form = e.target;
    const data = new FormData(form);
    
    try {
      // Replace the placeholder string with your actual Formspree endpoint hash
      const response = await fetch("https://formspree.io/f/xoqgkyrj", {
        method: "POST",
        body: data,
        headers: { 'Accept': 'application/json' }
      });
      
      if (response.ok) {
        setFormState({ submitting: false, succeeded: true, error: null });
        form.reset();
      } else {
        const errorData = await response.json();
        setFormState({ submitting: false, succeeded: false, error: errorData.error || "Submission failed." });
      }
    } catch (err) {
      setFormState({ submitting: false, succeeded: false, error: "Network error occurred." });
    }
  };

  // Simulating dynamic environment updates inside the AI Operations tier
  useEffect(() => {
    const interval = setInterval(() => {
      const randomAgent = IGX_AGENTS[Math.floor(Math.random() * IGX_AGENTS.length)];
      setLiveLog(`[SYSTEM TRACE] Agent ${randomAgent.n} (${randomAgent.name}): ${randomAgent.log}`);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    document.title = "Mandela Onwusah — Strategic Consultant, Diplomatic Architect, Digital Catalyst";
  }, []);

  return (
    <div className="root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Inter:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; font-size: 16px; background: #0C0C0C; }
        body { overflow-x: hidden; -webkit-font-smoothing: antialiased; }
        ::selection { background: rgba(201,168,76,0.25); color: #EDE8DF; }

        .root {
          font-family: 'Inter', sans-serif;
          background: #0C0C0C;
          color: #EDE8DF;
          overflow-x: hidden;
        }

        /* ── LUXURY HEADER RE-ARCHITECTURE ── */
        .nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 200;
          height: 80px; padding: 0 5vw;
          display: flex; align-items: center; justify-content: space-between;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          border-bottom: 1px solid transparent;
        }
        .nav.up {
          background: rgba(12,12,12,0.85);
          border-bottom-color: rgba(201,168,76,0.12);
          backdrop-filter: blur(20px);
          height: 70px;
        }
        .nav-brand { text-decoration: none; display: flex; flex-direction: column; }
        .nav-brand-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.35rem; font-weight: 500; color: #EDE8DF;
          letter-spacing: 0.03em; line-height: 1.1;
        }
        .nav-brand-tag {
          font-size: 0.55rem; letter-spacing: 0.25em; text-transform: uppercase;
          color: #C9A84C; font-weight: 600; margin-top: 2px;
        }
        .nav-center { display: flex; gap: 0.5rem; list-style: none; }
        .nav-btn {
          background: none; border: none; cursor: pointer;
          font-family: 'Inter', sans-serif; font-size: 0.72rem;
          letter-spacing: 0.15em; text-transform: uppercase;
          color: rgba(237,232,223,0.5); padding: 0.6rem 1.1rem;
          transition: color 0.3s ease; position: relative;
        }
        .nav-btn::after {
          content: ''; position: absolute; bottom: 0;
          left: 1.1rem; right: 1.1rem; height: 1px;
          background: #C9A84C; transform: scaleX(0); transition: transform 0.3s ease;
          transform-origin: left;
        }
        .nav-btn:hover, .nav-btn.on { color: #C9A84C; }
        .nav-btn:hover::after, .nav-btn.on::after { transform: scaleX(1); }
        
        .nav-right { display: flex; align-items: center; gap: 1rem; }
        .nav-talk {
          background: transparent; color: #C9A84C;
          border: 1px solid rgba(201,168,76,0.4); cursor: pointer; font-family: 'Inter', sans-serif;
          font-size: 0.68rem; letter-spacing: 0.16em; text-transform: uppercase;
          font-weight: 500; padding: 0.65rem 1.5rem; transition: all 0.3s;
        }
        .nav-talk:hover { background: #C9A84C; color: #0C0C0C; border-color: #C9A84C; }
        
        .hamburger {
          display: none; flex-direction: column; gap: 6px;
          background: none; border: none; cursor: pointer; padding: 8px; z-index: 210;
        }
        .hamburger span {
          display: block; width: 22px; height: 1.5px; background: #EDE8DF;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .hamburger.open span:nth-child(1) { transform: translateY(7.5px) rotate(45deg); background: #C9A84C; }
        .hamburger.open span:nth-child(2) { opacity: 0; }
        .hamburger.open span:nth-child(3) { transform: translateY(-7.5px) rotate(-45deg); background: #C9A84C; }

        /* ── MOBILE DRAWER NAVIGATION ── */
        .mmenu {
          position: fixed; inset: 0; z-index: 195;
          background: #0C0C0C; display: flex; flex-direction: column;
          padding: 120px 8vw 40px; justify-content: space-between;
          transform: translateX(100%); transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          border-left: 1px solid rgba(201,168,76,0.1);
        }
        .mmenu.open { transform: translateX(0); }
        .mmenu-links { display: flex; flex-direction: column; gap: 1.8rem; }
        .mmenu-btn {
          background: none; border: none; cursor: pointer; text-align: left;
          font-family: 'Cormorant Garamond', serif;
          font-size: 2.4rem; font-weight: 300; color: #EDE8DF;
          transition: all 0.3s; width: 100%;
        }
        .mmenu-btn:hover { color: #C9A84C; transform: translateX(8px); }
        .mmenu-footer {
          border-top: 1px solid rgba(237,232,223,0.08); padding-top: 2rem;
          display: flex; flex-direction: column; gap: 1rem;
        }
        .mmenu-eco-title { font-size: 0.6rem; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(201,168,76,0.6); }
        .mmenu-eco-row { display: flex; gap: 1.5rem; }
        .mmenu-eco-row a { font-size: 0.75rem; color: rgba(237,232,223,0.5); text-decoration: none; transition: color 0.2s; }
        .mmenu-eco-row a:hover { color: #C9A84C; }

        /* ── HERO COMPONENT ── */
        .hero {
          min-height: 100vh; display: grid; grid-template-columns: 1.2fr 0.8fr;
          position: relative; overflow: hidden; background: #0C0C0C;
        }
        .hero-left {
          display: flex; flex-direction: column;
          justify-content: center; padding: 120px 6vw 60px;
          position: relative; z-index: 2;
        }
        .hero-ambient-grid {
          position: absolute; inset: 0;
          background-image: linear-gradient(rgba(201,168,76,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.02) 1px, transparent 1px);
          background-size: 40px 40px; pointer-events: none; opacity: 0.7;
        }
        .hero-eyebrow {
          display: flex; align-items: center; gap: 0.8rem;
          font-size: 0.68rem; letter-spacing: 0.28em; text-transform: uppercase;
          color: #C9A84C; margin-bottom: 2rem; font-weight: 500;
        }
        .hero-eyebrow-dash { width: 30px; height: 1px; background: #C9A84C; }
        .hero-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(3.2rem, 5.8vw, 6rem);
          font-weight: 300; line-height: 0.95; letter-spacing: -0.02em;
          color: #EDE8DF; margin-bottom: 1.5rem;
        }
        .hero-name-gold { color: #C9A84C; font-weight: 600; display: block; font-style: italic; }
        .hero-bio {
          font-size: clamp(0.9rem, 1.1vw, 1.05rem);
          color: rgba(237,232,223,0.6); line-height: 1.8;
          max-width: 520px; margin-bottom: 3rem; font-weight: 300;
        }
        .hero-actions { display: flex; gap: 1.2rem; align-items: center; flex-wrap: wrap; }
        
        .btn-gold {
          background: #C9A84C; color: #0C0C0C; border: none; cursor: pointer;
          font-family: 'Inter', sans-serif; font-size: 0.7rem; letter-spacing: 0.18em;
          text-transform: uppercase; font-weight: 600; padding: 1.1rem 2.4rem;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .btn-gold:hover { background: #D4B560; transform: translateY(-2px); box-shadow: 0 12px 30px rgba(201,168,76,0.2); }
        
        .btn-ghost {
          background: transparent; border: 1px solid rgba(237,232,223,0.2);
          color: rgba(237,232,223,0.7); cursor: pointer;
          font-family: 'Inter', sans-serif; font-size: 0.7rem; letter-spacing: 0.18em;
          text-transform: uppercase; padding: 1.1rem 2.2rem; transition: all 0.3s;
        }
        .btn-ghost:hover { border-color: #C9A84C; color: #C9A84C; background: rgba(201,168,76,0.02); }
        
        .hero-right { position: relative; overflow: hidden; background: #111; }
        .hero-photo-veil {
          position: absolute; inset: 0; z-index: 2;
          background: linear-gradient(to right, #0C0C0C 0%, rgba(12,12,12,0.4) 40%, transparent 70%),
                      linear-gradient(to top, #0C0C0C 0%, transparent 20%);
        }
        .hero-placeholder-art {
          position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
          font-family: 'Cormorant Garamond', serif; font-size: 14vw; font-weight: 300; color: rgba(201,168,76,0.03);
          user-select: none; border-left: 1px solid rgba(201,168,76,0.05);
        }

        /* ── SECTION ARCHITECTURE ── */
        .section-padding { padding: 120px 6vw; }
        .eyebrow {
          font-size: 0.65rem; letter-spacing: 0.25em; text-transform: uppercase;
          color: #C9A84C; margin-bottom: 1.5rem; font-weight: 500;
          display: flex; align-items: center; gap: 0.8rem;
        }
        .eyebrow::before { content: ''; display: block; width: 20px; height: 1px; background: #C9A84C; }
        .section-h {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2.2rem, 4vw, 3.5rem); font-weight: 400; color: #EDE8DF;
          line-height: 1.15; margin-bottom: 2.5rem; letter-spacing: -0.01em;
        }

        /* ── ABOUT MATRIX ── */
        .about-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 6vw; align-items: center; }
        .about-left { display: flex; flex-direction: column; }
        .about-p { font-size: 0.98rem; color: rgba(237,232,223,0.55); line-height: 1.85; margin-bottom: 1.5rem; font-weight: 300; }
        .about-p strong { color: #EDE8DF; font-weight: 500; }
        
        .about-right-panel {
          background: #111111; border: 1px solid rgba(237,232,223,0.05);
          padding: 3rem; border-left: 3px solid #C9A84C; position: relative;
        }
        .about-panel-quote {
          font-family: 'Cormorant Garamond', serif; font-size: 1.6rem; font-style: italic;
          color: #EDE8DF; line-height: 1.5; margin-bottom: 1.5rem; font-weight: 300;
        }
        .about-panel-author { font-size: 0.72rem; letter-spacing: 0.15em; text-transform: uppercase; color: #C9A84C; }

        /* ── STATS TRACK ── */
        .stats-track {
          background: #111; border-top: 1px solid rgba(237,232,223,0.05);
          border-bottom: 1px solid rgba(237,232,223,0.05);
          display: grid; grid-template-columns: repeat(4, 1fr);
        }
        .stat-item { padding: 3rem 2rem; text-align: center; border-right: 1px solid rgba(237,232,223,0.05); }
        .stat-item:last-child { border-right: none; }
        .stat-num {
          display: block; font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2.5rem, 4vw, 4rem); font-weight: 600; color: #C9A84C; line-height: 1; margin-bottom: 0.5rem;
        }
        .stat-label { font-size: 0.65rem; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(237,232,223,0.4); }

        /* ── EXPERTISE ARCHITECTURE ── */
        .pillars-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; margin-top: 2rem; }
        .pillar-card {
          background: #111111; border: 1px solid rgba(237,232,223,0.04);
          padding: 3rem 2.2rem; transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .pillar-card:hover { border-color: #C9A84C; background: #141412; transform: translateY(-4px); }
        .pillar-sub { font-size: 0.6rem; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(201,168,76,0.7); margin-bottom: 0.8rem; font-weight: 500; }
        .pillar-title { font-family: 'Cormorant Garamond', serif; font-size: 1.6rem; font-weight: 500; color: #EDE8DF; margin-bottom: 1.2rem; }
        .pillar-desc { font-size: 0.88rem; color: rgba(237,232,223,0.45); line-height: 1.75; font-weight: 300; margin-bottom: 2rem; }
        .pillar-tags { display: flex; flex-wrap: wrap; gap: 0.5rem; }
        .pillar-tag { font-size: 0.58rem; letter-spacing: 0.12em; text-transform: uppercase; padding: 0.3rem 0.8rem; border: 1px solid rgba(237,232,223,0.08); color: rgba(237,232,223,0.5); }

        /* ── ECOSYSTEM SUITE ── */
        .eco-section { background: #0A0D12; position: relative; }
        .eco-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; margin-top: 1rem; }
        .eco-card {
          background: rgba(16, 22, 30, 0.6); border: 1px solid rgba(237,232,223,0.05);
          padding: 2.5rem; transition: all 0.3s ease; position: relative;
        }
        .eco-card:hover { border-color: #C9A84C; transform: translateY(-3px); background: rgba(16, 22, 30, 0.9); }
        .eco-badge { display: flex; align-items: center; gap: 0.6rem; margin-bottom: 1.2rem; }
        .eco-dot { width: 6px; height: 6px; border-radius: 50%; }
        .eco-tag-label { font-size: 0.6rem; letter-spacing: 0.18em; text-transform: uppercase; color: rgba(237,232,223,0.5); font-weight: 500; }
        .eco-name { font-family: 'Cormorant Garamond', serif; font-size: 1.8rem; font-weight: 500; color: #EDE8DF; margin-bottom: 0.2rem; }
        .eco-meta { font-size: 0.62rem; letter-spacing: 0.12em; color: rgba(201,168,76,0.6); margin-bottom: 1.2rem; }
        .eco-desc { font-size: 0.88rem; color: rgba(170,185,200,0.6); line-height: 1.75; font-weight: 300; margin-bottom: 2rem; }
        .eco-link {
          font-size: 0.65rem; letter-spacing: 0.15em; text-transform: uppercase; text-decoration: none;
          color: #EDE8DF; font-weight: 600; display: inline-flex; align-items: center; gap: 0.4rem; transition: gap 0.25s;
        }
        .eco-link:hover { gap: 0.7rem; color: #C9A84C; }

        /* ── INTERACTIVE IGX SYSTEM CONSOLE ── */
        .igx-section { background: #090B0E; border-top: 1px solid rgba(201,168,76,0.08); }
        .igx-console {
          display: grid; grid-template-columns: 0.9fr 1.1fr; gap: 2rem; background: #0E1217;
          border: 1px solid rgba(255,255,255,0.04); margin-top: 2rem; min-height: 480px;
        }
        .igx-sidebar-tabs {
          border-right: 1px solid rgba(255,255,255,0.04); display: flex; flex-direction: column;
          max-height: 520px; overflow-y: auto;
        }
        .igx-tab-row {
          background: none; border: none; padding: 1.1rem 1.8rem; display: flex; align-items: center;
          gap: 1.2rem; text-align: left; cursor: pointer; width: 100%;
          border-bottom: 1px solid rgba(255,255,255,0.02); transition: all 0.25s;
        }
        .igx-tab-row:hover { background: rgba(201,168,76,0.02); }
        .igx-tab-row.active { background: rgba(201,168,76,0.05); border-left: 3px solid #C9A84C; }
        .igx-tab-num { font-family: 'Cormorant Garamond', serif; font-size: 1.2rem; color: rgba(201,168,76,0.4); font-weight: 600; }
        .igx-tab-row.active .igx-tab-num { color: #C9A84C; }
        .igx-tab-name { font-size: 0.85rem; font-weight: 500; color: rgba(237,232,223,0.6); }
        .igx-tab-row.active .igx-tab-name { color: #EDE8DF; }
        
        .igx-display-panel { padding: 3.5rem; display: flex; flex-direction: column; justify-content: space-between; position: relative; }
        .igx-display-header { margin-bottom: 2rem; }
        .igx-display-title { font-family: 'Cormorant Garamond', serif; font-size: 2.2rem; font-weight: 400; color: #EDE8DF; margin-bottom: 0.4rem; }
        .igx-display-role { font-size: 0.68rem; letter-spacing: 0.15em; text-transform: uppercase; color: #C9A84C; font-weight: 600; }
        .igx-display-desc { font-size: 0.95rem; color: rgba(170,185,200,0.7); line-height: 1.8; font-weight: 300; margin-bottom: 2rem; }
        
        .igx-terminal-ticker {
          background: #07090C; border: 1px solid rgba(201,168,76,0.15); padding: 1.2rem;
          font-family: monospace; font-size: 0.72rem; color: #C9A84C; display: flex; align-items: center; gap: 0.8rem;
        }
        .igx-pulse-node { width: 6px; height: 6px; background: #C9A84C; border-radius: 50%; animation: pulseGlow 1.8s infinite; }
        @keyframes pulseGlow { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; } }

        /* ── CONNECT FORM & TIMELINE ARCHITECTURE ── */
        .connect-section { background: #111111; display: grid; grid-template-columns: 0.9fr 1.1fr; gap: 6vw; }
        .timeline-track { display: flex; flex-direction: column; margin-top: 1rem; }
        .timeline-item { display: grid; grid-template-columns: 80px 1fr; gap: 1.5rem; padding: 2rem 0; border-bottom: 1px solid rgba(237,232,223,0.06); }
        .timeline-item:first-child { border-top: 1px solid rgba(237,232,223,0.06); }
        .timeline-year { font-family: 'Cormorant Garamond', serif; font-size: 1.2rem; font-weight: 600; color: #C9A84C; }
        .timeline-event { font-size: 0.9rem; color: rgba(237,232,223,0.5); line-height: 1.7; font-weight: 300; }

        /* FORMSPREE LUXURY STYLING */
        .contact-form-container { background: #0C0C0C; border: 1px solid rgba(237,232,223,0.05); padding: 3.5rem; }
        .form-group-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem; }
        .form-control { display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1.5rem; }
        .form-control label { font-size: 0.62rem; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(237,232,223,0.4); font-weight: 500; }
        .form-input {
          background: #111111; border: 1px solid rgba(237,232,223,0.1); padding: 1rem;
          color: #EDE8DF; font-family: 'Inter', sans-serif; font-size: 0.88rem; transition: border-color 0.3s;
        }
        .form-input:focus { outline: none; border-color: #C9A84C; }
        .form-textarea { resize: vertical; min-height: 110px; }
        
        .form-status-alert { padding: 1.2rem; font-size: 0.85rem; margin-bottom: 1.5rem; font-weight: 400; line-height: 1.5; }
        .form-status-alert.success { background: rgba(74,155,111,0.1); border: 1px solid rgba(74,155,111,0.3); color: #4A9B6F; }
        .form-status-alert.error { background: rgba(217,83,79,0.1); border: 1px solid rgba(217,83,79,0.3); color: #D9534F; }

        /* ── INSTITUTIONAL FOOTER ── */
        .footer { background: #0C0C0C; border-top: 1px solid rgba(237,232,223,0.05); padding: 4rem 6vw; text-align: center; }
        .footer-brand { font-family: 'Cormorant Garamond', serif; font-size: 1.4rem; color: #EDE8DF; margin-bottom: 0.5rem; letter-spacing: 0.02em; }
        .footer-copy { font-size: 0.7rem; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(237,232,223,0.3); }

        /* ── REFINED FLOATING CHAT WIDGETS ── */
        .floating-actions-pod { position: fixed; bottom: 2rem; right: 2rem; z-index: 150; display: flex; flex-direction: column; gap: 0.8rem; }
        .floating-chat-node {
          width: 48px; height: 48px; border-radius: 50%; background: #111111; border: 1px solid rgba(201,168,76,0.25);
          display: flex; align-items: center; justify-content: center; text-decoration: none; color: #C9A84C;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); box-shadow: 0 8px 24px rgba(0,0,0,0.5);
        }
        .floating-chat-node:hover { transform: translateY(-4px); background: #C9A84C; color: #0C0C0C; border-color: #C9A84C; }
        .floating-chat-node svg { width: 20px; height: 20px; fill: currentColor; }

        /* ── VARYING MEDIA VIEWPORTS ── */
        @media (max-width: 1100px) {
          .nav-center { display: none; }
          .hamburger { display: flex; }
          .hero { grid-template-columns: 1fr; }
          .hero-right { display: none; }
          .about-layout { grid-template-columns: 1fr; gap: 3rem; }
          .pillars-grid { grid-template-columns: 1fr; gap: 1.2rem; }
          .eco-grid { grid-template-columns: 1fr; gap: 1.2rem; }
          .igx-console { grid-template-columns: 1fr; }
          .igx-sidebar-tabs { border-right: none; border-bottom: 1px solid rgba(255,255,255,0.04); max-height: 240px; }
          .connect-section { grid-template-columns: 1fr; gap: 4rem; }
          .stats-track { grid-template-columns: repeat(2, 1fr); }
          .stat-item:nth-child(2) { border-right: none; }
          .stat-item:nth-child(3) { border-top: 1px solid rgba(237,232,223,0.05); }
          .stat-item:nth-child(4) { border-top: 1px solid rgba(237,232,223,0.05); border-right: none; }
        }
        @media (max-width: 640px) {
          .stats-track { grid-template-columns: 1fr; }
          .stat-item { border-right: none; border-bottom: 1px solid rgba(237,232,223,0.05); }
          .stat-item:last-child { border-bottom: none; }
          .form-group-row { grid-template-columns: 1fr; gap: 0; }
          .contact-form-container { padding: 2rem 1.5rem; }
          .igx-display-panel { padding: 2rem 1.5rem; }
          .floating-actions-pod { bottom: 1.5rem; right: 1.5rem; }
        }
      `}</style>

      {/* ── HEADER ARCHITECTURE ── */}
      <nav className={`nav ${scrolled ? "up" : ""}`}>
        <a href="#" className="nav-brand" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
          <span className="nav-brand-name">MANDELA ONWUSAH</span>
          <span className="nav-brand-tag">Ecosystem Architecture</span>
        </a>

        <div className="nav-center">
          {NAV.map((n) => {
            const id = n.toLowerCase().replace(/\s/g, "-");
            return (
              <button key={n} onClick={() => go(n)} className={`nav-btn ${active === id ? "on" : ""}`}>
                {n}
              </button>
            );
          })}
        </div>

        <div className="nav-right">
          <button className="nav-talk" onClick={() => go("Connect")}>Initiate Dialogue</button>
          <button className={`hamburger ${menuOpen ? "open" : ""}`} onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle Navigation Bar Menu">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      {/* ── MOBILE MENU SYSTEM ── */}
      <div className={`mmenu ${menuOpen ? "open" : ""}`}>
        <div className="mmenu-links">
          {NAV.map((n) => (
            <button key={n} onClick={() => go(n)} className="mmenu-btn">
              {n}
            </button>
          ))}
        </div>
        <div className="mmenu-footer">
          <span className="mmenu-eco-title">Ecosystem Projections</span>
          <div className="mmenu-eco-row">
            <a href="https://ijidigroup.com" target="_blank" rel="noopener noreferrer">IJIDI Group</a>
            <a href="https://ijidi.org" target="_blank" rel="noopener noreferrer">IJIDI Foundation</a>
          </div>
        </div>
      </div>

      {/* ── HERO OPERATIONS CENTER ── */}
      <section className="hero">
        <div className="hero-left">
          <div className="hero-ambient-grid" />
          <div className="hero-eyebrow">
            <span className="hero-eyebrow-dash" />
            <span>Institutional Infrastructure</span>
          </div>
          <h1 className="hero-name">
            Architecting Systems That <span className="hero-name-gold">Endure.</span>
          </h1>
          <p className="hero-bio">
            Strategic consultant, diplomatic architect, and digital catalyst. Operating at the structural convergence of high-level advisory and scalable automation systems across Africa.
          </p>
          <div className="hero-actions">
            <button className="btn-gold" onClick={() => go("Connect")}>Consultation Protocol</button>
            <button className="btn-ghost" onClick={() => go("Expertise")}>Core Pillars</button>
          </div>
        </div>
        <div className="hero-right">
          <div className="hero-photo-veil" />
          <div className="hero-placeholder-art">IGX</div>
        </div>
      </section>

      {/* ── STATS TRACK INTEGRATION ── */}
      <div className="stats-track">
        <CountStat num="7+" label="Years Operational Intelligence" />
        <CountStat num="10" label="Proprietary AI Core Agents" />
        <CountStat num="3" label="Integrated Global Entities" />
        <CountStat num="100%" label="System Architectural Sovereign" />
      </div>

      {/* ── ABOUT MATRIX TIERS ── */}
      <section id="about" className="section-padding">
        <div className="about-layout">
          <div className="about-left">
            <span className="eyebrow">Executive Summary</span>
            <h2 className="section-h">Building institutions where intelligence meets execution infrastructure.</h2>
            <p className="about-p">
              I position myself at the intersection of traditional institutional strategy and avant-garde technological structures. As the founder of <strong>IJIDI Group</strong>, I build governance blueprints capable of absorbing transcontinental complexities.
            </p>
            <p className="about-p">
              Through the deployment of <strong>IGX</strong>, an autonomous architecture consisting of 10 discrete intelligence units, my operational models function with absolute resource clarity.
            </p>
          </div>
          <Reveal className="about-right-panel">
            <p className="about-panel-quote">
              "True institutional capability isn't found in reacting to future trends; it lies inside the structural design of frameworks that determine them."
            </p>
            <div className="about-panel-author">— Mandela Onwusah</div>
          </Reveal>
        </div>
      </section>

      {/* ── STRUCTURAL EXPERTISE PILLARS ── */}
      <section id="expertise" className="section-padding" style={{ background: '#111111' }}>
        <span className="eyebrow">Operational Frameworks</span>
        <h2 className="section-h">Core Vectors of Execution</h2>
        <div className="pillars-grid">
          {PILLARS.map((p, idx) => (
            <Reveal key={idx} className="pillar-card" delay={idx * 100}>
              <span className="pillar-sub">{p.sub}</span>
              <h3 className="pillar-title">{p.label}</h3>
              <p className="pillar-desc">{p.desc}</p>
              <div className="pillar-tags">
                {p.tags.map((t, i) => <span key={i} className="pillar-tag">{t}</span>)}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── TRI-ENTITY ECOSYSTEM CORE ── */}
      <section id="ecosystem" className="eco-section section-padding">
        <span className="eyebrow">The Tri-Entity Vehicle</span>
        <h2 className="section-h">The Structural Architecture</h2>
        <div className="eco-grid">
          {ECOSYSTEM.map((eco, idx) => (
            <Reveal key={idx} className="eco-card" delay={idx * 150}>
              <div className="eco-badge">
                <span className="eco-dot" style={{ background: eco.accent }} />
                <span className="eco-tag-label">{eco.tag}</span>
              </div>
              <h3 className="eco-name">{eco.name}</h3>
              <p className="eco-meta">{eco.meta}</p>
              <p className="eco-desc">{eco.desc}</p>
              <a href={eco.href} className="eco-link">
                Inspect Vector <span>→</span>
              </a>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── INTELLIGENT LIVE IGX DASHBOARD ── */}
      <section id="igx" className="igx-section section-padding">
        <span className="eyebrow">Proprietary Core Systems</span>
        <h2 className="section-h">IGX Operations Command</h2>
        <p className="igx-display-desc" style={{ maxWidth: '600px', marginTop: '-1rem' }}>
          An orchestration cluster of 10 task-specialised autonomous units governing asset management, multi-platform language localizations, and structural execution parameters across all entities.
        </p>

        <div className="igx-console">
          <div className="igx-sidebar-tabs">
            {IGX_AGENTS.map((agent, index) => (
              <button
                key={agent.n}
                className={`igx-tab-row ${activeAgent === index ? "active" : ""}`}
                onClick={() => {
                  setActiveAgent(index);
                  setLiveLog(`[USER TRACE] Focus vector explicitly realigned to Node ${agent.n} (${agent.name})`);
                }}
              >
                <span className="igx-tab-num">{agent.n}</span>
                <span className="igx-tab-name">{agent.name}</span>
              </button>
            ))}
          </div>

          <div className="igx-display-panel">
            <div className="igx-display-content">
              <div className="igx-display-header">
                <span className="igx-display-role">{IGX_AGENTS[activeAgent].role}</span>
                <h3 className="igx-display-title">{IGX_AGENTS[activeAgent].name}</h3>
              </div>
              <p className="igx-display-desc">{IGX_AGENTS[activeAgent].desc}</p>
            </div>

            <div className="igx-terminal-ticker">
              <span className="igx-pulse-node" />
              <span>{liveLog}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONNECT FORM & METRIC TIMELINE ── */}
      <section id="connect" className="connect-section section-padding">
        <div>
          <span className="eyebrow">Institutional Vectors</span>
          <h2 className="section-h">Development Chronology</h2>
          <div className="timeline-track">
            {TIMELINE.map((t, idx) => (
              <div key={idx} className="timeline-item">
                <span className="timeline-year">{t.year}</span>
                <p className="timeline-event">{t.event}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FORMSPREE CONTAINER CONTROL */}
        <div className="contact-form-container">
          <span className="eyebrow" style={{ marginBottom: '1rem' }}>Secure Endpoint Channel</span>
          <h3 className="section-h" style={{ fontSize: '1.8rem', marginBottom: '2rem' }}>Initiate Contact</h3>
          
          <form onSubmit={handleFormspreeSubmit}>
            <div className="form-group-row">
              <div className="form-control">
                <label htmlFor="form-name">Identification Name</label>
                <input id="form-name" type="text" name="name" required className="form-input" placeholder="e.g., Director General" />
              </div>
              <div className="form-control">
                <label htmlFor="form-email">Routing Email Address</label>
                <input id="form-email" type="email" name="email" required className="form-input" placeholder="e.g., exec@domain.gov" />
              </div>
            </div>

            <div className="form-control">
              <label htmlFor="form-subject">Dialogue Classification Vector</label>
              <input id="form-subject" type="text" name="subject" required className="form-input" placeholder="Institutional Strategy Advisory / IGX Integration" />
            </div>

            <div className="form-control">
              <label htmlFor="form-message">Operational Message Payload</label>
              <textarea id="form-message" name="message" required className="form-input form-textarea" placeholder="Outline context matrices, target parameters, and scope timelines..." />
            </div>

            {formState.succeeded && (
              <div className="form-status-alert success">
                <strong>Transmission Executed Successfully.</strong> Your secure data packet has been processed through the ecosystem intake gateways. Expect responses within a 24-hour window.
              </div>
            )}

            {formState.error && (
              <div className="form-status-alert error">
                <strong>System Exception:</strong> {formState.error}. Ensure communication vectors are valid and submit again.
              </div>
            )}

            <button type="submit" className="btn-gold" style={{ width: '100%', marginTop: '0.5rem' }} disabled={formState.submitting}>
              {formState.submitting ? "Transmitting Signal..." : "Execute Form Securely"}
            </button>
          </form>
        </div>
      </section>

      {/* ── SYSTEM FOOTER ── */}
      <footer className="footer">
        <div className="footer-brand">MANDELA ONWUSAH</div>
        <div className="footer-copy">© 2026 IJIDI Ecosystem Architecture. All Rights Sovereign. Managed autonomously by IGX Core.</div>
      </footer>

      {/* ── FLOATING COMMUNICATION PODS ── */}
      <div className="floating-actions-pod">
        {/* Minimalist Premium WhatsApp Action Node */}
        <a href="https://wa.me/234XXXXXXXXXX" target="_blank" rel="noopener noreferrer" className="floating-chat-node" aria-label="Initiate WhatsApp Secure Protocol Chat">
          <svg viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397 0 11.93 0c3.165.001 6.14 1.233 8.377 3.469 2.237 2.236 3.466 5.21 3.466 8.377-.003 6.582-5.338 11.93-11.87 11.93h-.005c-2.01-.001-3.987-.544-5.789-1.577L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.742 1.451 5.4 0 9.786-4.386 9.788-9.785 0-2.616-1.019-5.076-2.87-6.929C16.39 2.038 13.93 1.017 11.314 1.017c-5.398 0-9.786 4.387-9.788 9.786-.001 1.62.463 3.203 1.342 4.601l-.1 1.63L6.647 19.15zM17.21 14.12c-.29-.146-1.72-.85-1.986-.946-.266-.097-.46-.147-.654.145-.193.291-.747.946-.917 1.14-.17.192-.34.215-.63.069-.29-.146-1.226-.452-2.334-1.443-.863-.77-1.445-1.72-1.614-2.012-.17-.293-.018-.451.127-.596.13-.13.29-.34.436-.51.145-.17.193-.291.29-.485.097-.194.049-.364-.025-.51-.073-.146-.654-1.579-.896-2.161-.236-.57-.475-.493-.654-.502-.17-.008-.364-.01-.557-.01-.194 0-.51.073-.776.364-.266.291-1.018.995-1.018 2.428s1.042 2.816 1.188 3.01c.145.194 2.05 3.13 4.965 4.387.694.299 1.236.478 1.659.612.698.222 1.334.19 1.837.115.56-.083 1.72-.704 1.962-1.385.242-.68.242-1.263.17-1.385-.073-.122-.266-.194-.557-.34z"/>
          </svg>
        </a>
        {/* Minimalist Premium Telegram Action Node */}
        <a href="https://t.me/MandelaOnwusah" target="_blank" rel="noopener noreferrer" className="floating-chat-node" aria-label="Initiate Telegram Secure Protocol Chat">
          <svg viewBox="0 0 24 24">
            <path d="M11.944 0C5.347 0 0 5.347 0 11.944c0 6.595 5.347 11.944 11.944 11.944 6.596 0 11.944-5.349 11.944-11.944C23.888 5.347 18.54 0 11.944 0zm5.82 8.358l-1.934 9.117c-.144.646-.528.803-1.07.5l-2.95-2.174-1.422 1.37c-.158.158-.29.29-.594.29l.21-2.986 5.436-4.912c.236-.21-.053-.328-.369-.117l-6.72 4.23-2.894-.906c-.63-.196-.642-.628.132-.93l11.312-4.36c.524-.196.982.12.81.972z"/>
          </svg>
        </a>
      </div>
    </div>
  );
}
