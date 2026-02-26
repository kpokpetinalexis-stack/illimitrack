import { useEffect, useRef, useState, useCallback } from "react"
import { ArrowRight, Check, Menu, X, Zap, Brain, Shield, Mail, Phone, MapPin } from "lucide-react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

/* ─── Brand Constants ───────────────────────────────────────── */
const BRAND = "Rhysting AI"
const TAGLINE = "Automatisation intelligente et solutions prédictives pour entreprises modernes."
const CTA = "Réserver une consultation"

const NAV_LINKS = [
  { label: "Services", href: "#services" },
  { label: "Manifeste", href: "#philosophie" },
  { label: "Protocole", href: "#protocole" },
  { label: "Tarifs", href: "#tarifs" },
]

/* ─── Unsplash Images (Organic Tech mood) ───────────────────── */
const HERO_IMG = "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=2400&q=80"
const TEXTURE_IMG = "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1800&q=80"

/* ─── Feature Copy ──────────────────────────────────────────── */
const SHUFFLER_ITEMS = [
  "Cartographie des workflows métier",
  "Priorisation ROI des cas d'usage IA",
  "Roadmap stratégique en 90 jours",
]

const TYPEWRITER_MSGS = [
  "→ Signal capté : réduction de 37 % du temps de traitement.",
  "→ Pipeline IA activé : qualification automatique des leads.",
  "→ Boucle continue : modèles auto-ajustés en production.",
  "→ Alerte process : anomalie détectée et corrigée en 4 s.",
]

const DAYS = ["D", "L", "M", "M", "J", "V", "S"]

/* ─── Protocol Steps ────────────────────────────────────────── */
const PROTOCOL = [
  {
    step: "01",
    title: "Cartographier",
    desc: "Identifier les frictions métier et les opportunités IA à impact rapide grâce à un audit collaboratif.",
    icon: Brain,
  },
  {
    step: "02",
    title: "Orchestrer",
    desc: "Concevoir et connecter agents IA et flux d'automatisation à vos outils existants, sans rupture.",
    icon: Zap,
  },
  {
    step: "03",
    title: "Industrialiser",
    desc: "Déployer avec gouvernance de bout en bout, suivi KPI en temps réel et montée en compétences des équipes.",
    icon: Shield,
  },
]

/* ─── Pricing ───────────────────────────────────────────────── */
const TIERS = [
  {
    name: "Essentiel",
    price: "1 900 €",
    period: "/ projet",
    desc: "Diagnostic stratégique + feuille de route IA personnalisée.",
    features: ["Atelier stratégique 1 journée", "Backlog IA priorisé", "Plan de déploiement 90 j", "Support email 30 j"],
    featured: false,
    cta: "Choisir l'Essentiel",
  },
  {
    name: "Performance",
    price: "4 900 €",
    period: "/ projet",
    desc: "Automatisations IA prêtes production, intégrées à vos outils.",
    features: ["2 workflows IA déployés", "Intégration outils existants", "Tableau de bord KPI", "Accompagnement 60 j"],
    featured: true,
    cta: "Choisir Performance",
  },
  {
    name: "Entreprise",
    price: "Sur mesure",
    period: "",
    desc: "Programme IA transverse — architecture, gouvernance, culture.",
    features: ["Architecture IA multi-équipes", "Formation interne complète", "Gouvernance & conformité", "Support dédié continu"],
    featured: false,
    cta: "Nous contacter",
  },
]

/* ════════════════════════════════════════════════════════════ */
/*  NAVBAR                                                     */
/* ════════════════════════════════════════════════════════════ */
function Navbar({ solid }) {
  const [open, setOpen] = useState(false)
  const close = useCallback(() => setOpen(false), [])

  return (
    <header
      className="fixed left-1/2 top-4 z-50 w-[96%] max-w-6xl -translate-x-1/2"
      style={{ transition: "top 0.3s" }}
    >
      <div
        className={`rounded-[3rem] px-5 py-3 transition-all duration-500 md:px-8 ${solid
            ? "border border-moss/20 bg-cream/75 text-moss shadow-card backdrop-blur-2xl"
            : "border border-white/15 bg-white/8 text-cream backdrop-blur-md"
          }`}
        style={{ backdropFilter: solid ? "blur(24px) saturate(160%)" : "blur(8px)" }}
      >
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a
            href="#"
            className="font-heading text-sm font-extrabold tracking-[0.1em] transition-opacity hover:opacity-80"
          >
            {BRAND}
          </a>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-7 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`lift-hover text-xs font-semibold tracking-wide transition-colors ${solid ? "text-charcoal/80 hover:text-moss" : "text-cream/80 hover:text-cream"
                  }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden md:block">
            <a
              href="#contact"
              className="group magnetic relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-clay px-5 py-2.5 text-xs font-bold text-cream"
            >
              <span className="absolute inset-0 -translate-x-full bg-moss transition-transform duration-300 ease-out group-hover:translate-x-0" />
              <span className="relative z-10 inline-flex items-center gap-2">
                {CTA} <ArrowRight size={13} />
              </span>
            </a>
          </div>

          {/* Hamburger */}
          <button
            className={`rounded-full p-2 md:hidden ${solid ? "text-moss" : "text-cream"}`}
            onClick={() => setOpen((v) => !v)}
            aria-label="Ouvrir le menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Drawer */}
        {open && (
          <div className="mt-3 space-y-2 rounded-[1.75rem] border border-moss/15 bg-cream p-5 shadow-card md:hidden">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={close}
                className="block rounded-xl px-3 py-2 text-sm font-semibold text-moss transition-colors hover:bg-moss/8"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={close}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-clay px-4 py-3 text-sm font-bold text-cream"
            >
              {CTA} <ArrowRight size={14} />
            </a>
          </div>
        )}
      </div>
    </header>
  )
}

/* ════════════════════════════════════════════════════════════ */
/*  HERO                                                       */
/* ════════════════════════════════════════════════════════════ */
function Hero({ heroRef }) {
  const contentRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(".hero-el", { opacity: 0, y: 48 })
      gsap.to(".hero-el", {
        opacity: 1,
        y: 0,
        stagger: 0.09,
        duration: 1.15,
        ease: "power3.out",
        delay: 0.2,
      })
    }, contentRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={heroRef}
      className="relative flex min-h-dvh flex-col justify-end overflow-hidden px-6 pb-16 pt-32 md:px-16 md:pb-24"
      style={{
        backgroundImage: `
          linear-gradient(to top, rgba(46,64,54,0.98) 0%, rgba(26,26,26,0.72) 55%, rgba(0,0,0,0.32) 100%),
          url(${HERO_IMG})
        `,
        backgroundSize: "cover",
        backgroundPosition: "center 30%",
      }}
    >
      {/* Decorative pixel-grid overlay */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(204,88,51,0.05) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />

      <div ref={contentRef} className="relative z-10 max-w-5xl">
        {/* Eyebrow */}
        <p className="hero-el font-data mb-5 inline-flex items-center gap-3 rounded-full border border-clay/30 bg-clay/12 px-4 py-1.5 text-[11px] uppercase tracking-[0.22em] text-cream/75">
          <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-clay" />
          Agence IA — Paris, France
        </p>

        {/* Headline */}
        <h1 className="hero-el font-heading text-5xl font-extrabold leading-[0.93] text-cream md:text-[6.5rem] lg:text-[8.5rem]">
          L'intelligence appliquée est la
        </h1>

        {/* Drama word */}
        <p className="hero-el font-drama -mt-2 text-7xl italic leading-[0.88] text-clay md:text-[9rem] lg:text-[12rem]">
          Traction.
        </p>

        {/* Sub-line */}
        <p className="hero-el mt-8 max-w-xl text-sm leading-relaxed text-cream/78 md:text-base">
          {BRAND} transforme vos opérations en systèmes IA mesurables, fiables
          et prêts pour la production — avec un ROI prouvé dès 90 jours.
        </p>

        {/* CTA row */}
        <div className="hero-el mt-10 flex flex-wrap items-center gap-4">
          <a
            href="#contact"
            className="group magnetic relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-clay px-8 py-3.5 font-heading text-sm font-bold text-cream"
          >
            <span className="absolute inset-0 -translate-x-full bg-cream transition-transform duration-300 ease-out group-hover:translate-x-0" />
            <span className="relative z-10 inline-flex items-center gap-2 group-hover:text-moss">
              {CTA} <ArrowRight size={16} />
            </span>
          </a>
          <a
            href="#services"
            className="lift-hover font-data text-xs uppercase tracking-[0.18em] text-cream/60 hover:text-cream"
          >
            Voir nos services ↓
          </a>
        </div>
      </div>

      {/* Bottom stat bar */}
      <div className="hero-el relative z-10 mt-16 flex flex-wrap gap-8 border-t border-white/10 pt-8">
        {[
          { n: "+40", label: "Projets IA livrés" },
          { n: "37%", label: "Réduction temps moyen" },
          { n: "90 j", label: "Premier ROI mesurable" },
        ].map(({ n, label }) => (
          <div key={label}>
            <p className="font-drama text-3xl italic text-clay">{n}</p>
            <p className="font-data mt-0.5 text-[11px] tracking-[0.12em] text-cream/55">{label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ════════════════════════════════════════════════════════════ */
/*  FEATURE CARD 1 — Diagnostic Shuffler                      */
/* ════════════════════════════════════════════════════════════ */
function DiagnosticShuffler() {
  const [items, setItems] = useState(SHUFFLER_ITEMS)

  useEffect(() => {
    const t = setInterval(() => {
      setItems((prev) => {
        const copy = [...prev]
        copy.unshift(copy.pop())
        return copy
      })
    }, 3000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="relative h-44">
      {items.map((item, idx) => (
        <div
          key={item}
          className="absolute inset-x-0 rounded-[1.5rem] border border-moss/12 bg-cream px-4 py-3.5 shadow-card"
          style={{
            top: `${idx * 22}px`,
            zIndex: 30 - idx,
            transform: `scale(${1 - idx * 0.05})`,
            transition: "all 0.55s cubic-bezier(0.34, 1.56, 0.64, 1)",
            opacity: 1 - idx * 0.2,
          }}
        >
          <div className="font-data mb-1 text-[9px] uppercase tracking-[0.18em] text-moss/50">
            Diagnostic IA
          </div>
          <div className="font-heading text-sm font-semibold text-charcoal">{item}</div>
          <div className="mt-2 h-1 w-16 rounded-full bg-clay/30" />
        </div>
      ))}
    </div>
  )
}

/* ════════════════════════════════════════════════════════════ */
/*  FEATURE CARD 2 — Telemetry Typewriter                     */
/* ════════════════════════════════════════════════════════════ */
function TelemetryTypewriter() {
  const [msgIdx, setMsgIdx] = useState(0)
  const [charIdx, setCharIdx] = useState(0)
  const [typed, setTyped] = useState("")

  useEffect(() => {
    const current = TYPEWRITER_MSGS[msgIdx]
    if (charIdx < current.length) {
      const t = setTimeout(() => {
        setCharIdx((v) => v + 1)
        setTyped(current.slice(0, charIdx + 1))
      }, 28)
      return () => clearTimeout(t)
    }
    const next = setTimeout(() => {
      setCharIdx(0)
      setTyped("")
      setMsgIdx((v) => (v + 1) % TYPEWRITER_MSGS.length)
    }, 1600)
    return () => clearTimeout(next)
  }, [charIdx, msgIdx])

  return (
    <div className="rounded-[1.5rem] border border-moss/10 bg-charcoal p-5 text-cream">
      <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-cream/8 px-3 py-1 font-data text-[10px] uppercase tracking-[0.16em]">
        <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-clay" />
        Live Feed
      </div>
      <div className="font-data min-h-[4.5rem] text-[12px] leading-[1.7] text-cream/85">
        {typed}
        <span className="blink ml-0.5 text-clay">|</span>
      </div>
      <div className="mt-4 flex items-center gap-2">
        {TYPEWRITER_MSGS.map((_, i) => (
          <span
            key={i}
            className="h-0.5 flex-1 rounded-full bg-cream/20 transition-all duration-300"
            style={{ background: i === msgIdx ? "#CC5833" : "rgba(255,255,255,0.15)" }}
          />
        ))}
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════ */
/*  FEATURE CARD 3 — Cursor Protocol Scheduler                */
/* ════════════════════════════════════════════════════════════ */
function SchedulerCard() {
  const [activeDay, setActiveDay] = useState(2)
  const [phase, setPhase] = useState("grid") // "grid" | "save"
  const [cursorPos, setCursorPos] = useState({ x: 12, y: 0 })

  useEffect(() => {
    const interval = setInterval(() => {
      const next = (activeDay + 1) % 7
      setActiveDay(next)
      setPhase("grid")
      // Cursor moves to day cell
      setCursorPos({ x: 12 + next * 36, y: -52 })
      // Then to Save button
      setTimeout(() => {
        setPhase("save")
        setCursorPos({ x: 200, y: 12 })
      }, 900)
      // Reset
      setTimeout(() => {
        setPhase("grid")
        setCursorPos({ x: 12, y: 0 })
      }, 1700)
    }, 2800)
    return () => clearInterval(interval)
  }, [activeDay])

  return (
    <div className="rounded-[1.5rem] border border-moss/12 bg-cream p-5 relative overflow-hidden">
      {/* Week grid */}
      <div className="grid grid-cols-7 gap-1.5">
        {DAYS.map((d, i) => (
          <div
            key={`${d}-${i}`}
            className="relative flex h-9 items-center justify-center rounded-xl border font-data text-xs transition-all duration-300"
            style={{
              borderColor: i === activeDay ? "#CC5833" : "rgba(46,64,54,0.18)",
              background: i === activeDay ? "rgba(204,88,51,0.12)" : "transparent",
              color: i === activeDay ? "#2E4036" : "rgba(46,64,54,0.55)",
              transform: i === activeDay ? "scale(0.94)" : "scale(1)",
            }}
          >
            {d}
            {i === activeDay && (
              <span className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-clay" />
            )}
          </div>
        ))}
      </div>

      {/* Footer row */}
      <div className="relative mt-4 flex items-center justify-between">
        <span className="font-data text-[10px] tracking-[0.1em] text-moss/60">
          Déploiement structuré
        </span>
        <button
          className="rounded-full px-4 py-1.5 font-data text-[11px] font-semibold text-cream transition-all duration-200"
          style={{ background: phase === "save" ? "#CC5833" : "#2E4036" }}
        >
          Sauvegarder
        </button>
      </div>

      {/* Animated cursor dot */}
      <div
        className="pointer-events-none absolute h-3 w-3 rounded-full border-2 border-clay bg-clay/40 shadow-sm"
        style={{
          bottom: 0,
          left: 0,
          transform: `translate(${cursorPos.x}px, ${cursorPos.y}px)`,
          transition: "transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)",
          opacity: 0.9,
        }}
      />
    </div>
  )
}

/* ════════════════════════════════════════════════════════════ */
/*  FEATURES SECTION                                          */
/* ════════════════════════════════════════════════════════════ */
function Features() {
  const ref = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".feature-card", {
        opacity: 0,
        y: 50,
        stagger: 0.15,
        duration: 0.95,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 68%",
        },
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  const cards = [
    {
      icon: Brain,
      title: "Audit stratégique IA orienté ROI",
      desc: "Architecture de diagnostic priorisée par valeur métier — feuille de route actionnable en 2 semaines.",
      Widget: DiagnosticShuffler,
    },
    {
      icon: Zap,
      title: "Automatisation intelligente des opérations",
      desc: "Flux temps réel pour piloter, mesurer et amplifier vos gains d'automatisation au quotidien.",
      Widget: TelemetryTypewriter,
    },
    {
      icon: Shield,
      title: "Déploiement, gouvernance et formation IA",
      desc: "Cadence de déploiement contrôlée, traçabilité et acculturation des équipes à chaque sprint.",
      Widget: SchedulerCard,
    },
  ]

  return (
    <section id="services" ref={ref} className="px-6 py-24 md:px-16">
      <div className="mx-auto max-w-6xl">
        {/* Section header */}
        <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-data text-[11px] uppercase tracking-[0.22em] text-moss/55">Services IA</p>
            <h2 className="mt-3 font-heading text-4xl font-extrabold leading-tight text-moss md:text-6xl">
              Des artefacts <br className="hidden md:block" />
              <span className="font-drama italic text-clay">opérables.</span>
            </h2>
          </div>
          <p className="max-w-sm text-sm text-charcoal/65">
            Chaque service est conçu pour produire une valeur mesurable — pas une
            présentation PowerPoint de plus.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          {cards.map(({ icon: Icon, title, desc, Widget }) => (
            <article
              key={title}
              className="feature-card group flex flex-col rounded-[2rem] border border-moss/12 bg-cream p-7 shadow-card transition-shadow duration-300 hover:shadow-hero"
            >
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-moss/8">
                <Icon size={18} className="text-moss" />
              </div>
              <h3 className="font-heading text-base font-bold leading-snug text-moss">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-charcoal/65">{desc}</p>
              <div className="mt-6 flex-1">
                <Widget />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ════════════════════════════════════════════════════════════ */
/*  PHILOSOPHY — The Manifesto                                */
/* ════════════════════════════════════════════════════════════ */
function Philosophy() {
  const ref = useRef(null)
  const imgRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax texture
      gsap.to(imgRef.current, {
        y: "-18%",
        ease: "none",
        scrollTrigger: {
          trigger: ref.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      })

      // Word-by-word reveal
      gsap.from(".manifest-word", {
        opacity: 0,
        y: 30,
        stagger: 0.06,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 65%",
        },
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  const strongLine =
    "Nous nous concentrons sur : des systèmes IA utiles, mesurables et intégrés à vos opérations."

  return (
    <section
      id="philosophie"
      ref={ref}
      className="relative overflow-hidden bg-charcoal px-6 py-32 text-cream md:px-16"
    >
      {/* Parallax texture */}
      <img
        ref={imgRef}
        src={TEXTURE_IMG}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-[130%] w-full object-cover opacity-[0.12]"
      />
      {/* Gradient veil */}
      <div className="absolute inset-0 bg-gradient-to-b from-moss/40 via-charcoal/60 to-charcoal" />

      <div className="relative mx-auto max-w-6xl">
        <p className="manifest-word font-data text-[11px] uppercase tracking-[0.24em] text-cream/50">
          Manifeste
        </p>

        <p className="manifest-word mt-8 max-w-3xl text-lg text-cream/65 md:text-2xl">
          La plupart des agences IA se concentrent sur :{" "}
          <span className="text-cream/90">des POC sans adoption réelle.</span>
        </p>

        <p className="mt-10 max-w-5xl font-drama text-4xl italic leading-[1.05] md:text-7xl">
          {strongLine.split(" ").map((word, idx) => (
            <span
              key={`${word}-${idx}`}
              className="manifest-word mr-3 inline-block"
              style={{ color: word === "mesurables" ? "#CC5833" : undefined }}
            >
              {word}
            </span>
          ))}
        </p>

        {/* Accent rule */}
        <div className="manifest-word mt-16 flex items-center gap-6">
          <div className="h-px flex-1 bg-cream/10" />
          <p className="font-data text-[10px] uppercase tracking-[0.22em] text-cream/35">
            {BRAND} — 2025
          </p>
          <div className="h-px flex-1 bg-cream/10" />
        </div>
      </div>
    </section>
  )
}

/* ════════════════════════════════════════════════════════════ */
/*  SVG ANIMATIONS for Protocol cards                         */
/* ════════════════════════════════════════════════════════════ */
function RotorViz() {
  return (
    <svg viewBox="0 0 240 240" className="rotor-anim h-44 w-44 text-moss/60" aria-hidden="true">
      <circle cx="120" cy="120" r="88" fill="none" stroke="currentColor" strokeWidth="3" />
      <circle cx="120" cy="120" r="52" fill="none" stroke="#CC5833" strokeWidth="3" strokeDasharray="8 6" />
      <circle cx="120" cy="120" r="20" fill="none" stroke="currentColor" strokeWidth="2" />
      {/* Spokes */}
      {[0, 60, 120, 180, 240, 300].map((deg) => (
        <line
          key={deg}
          x1="120" y1="120"
          x2={120 + 88 * Math.cos((deg * Math.PI) / 180)}
          y2={120 + 88 * Math.sin((deg * Math.PI) / 180)}
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.4"
        />
      ))}
    </svg>
  )
}

function ScanViz() {
  return (
    <svg viewBox="0 0 300 180" className="h-40 w-full max-w-md" aria-hidden="true">
      <defs>
        <pattern id="dots-grid" width="18" height="18" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.8" fill="#2E4036" opacity="0.28" />
        </pattern>
      </defs>
      <rect x="0" y="0" width="300" height="180" fill="url(#dots-grid)" />
      <rect
        className="scan-anim"
        x="0" y="8"
        width="300" height="14"
        rx="4"
        fill="#CC5833"
        opacity="0.32"
      />
    </svg>
  )
}

function WaveViz() {
  return (
    <svg viewBox="0 0 360 120" className="h-32 w-full max-w-lg" aria-hidden="true">
      {/* Grid lines */}
      {[30, 60, 90].map((y) => (
        <line key={y} x1="0" y1={y} x2="360" y2={y} stroke="#2E4036" strokeWidth="0.5" opacity="0.2" />
      ))}
      <path
        className="wave-anim"
        d="M0 60 L38 60 L58 36 L84 86 L116 28 L148 64 L178 56 L204 78 L238 34 L276 70 L312 48 L360 60"
        fill="none"
        stroke="#CC5833"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="220"
        strokeDashoffset="0"
      />
    </svg>
  )
}

/* ════════════════════════════════════════════════════════════ */
/*  PROTOCOL — Sticky Stacking Archive                        */
/* ════════════════════════════════════════════════════════════ */
function Protocol() {
  const wrapperRef = useRef(null)
  const VIZS = [RotorViz, ScanViz, WaveViz]

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray(".protocol-card")

      cards.forEach((card, i) => {
        ScrollTrigger.create({
          trigger: card,
          start: "top top+=80",
          end: "+=90%",
          pin: true,
          pinSpacing: false,
        })

        if (i > 0) {
          gsap.to(cards[i - 1], {
            scale: 0.9,
            opacity: 0.45,
            filter: "blur(18px)",
            ease: "power2.inOut",
            scrollTrigger: {
              trigger: card,
              start: "top 80%",
              end: "top 20%",
              scrub: true,
            },
          })
        }
      })
    }, wrapperRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="protocole" ref={wrapperRef} className="bg-cream px-6 py-20 md:px-16">
      <div className="mx-auto mb-14 max-w-6xl">
        <p className="font-data text-[11px] uppercase tracking-[0.22em] text-moss/55">
          Protocole d'exécution
        </p>
        <h2 className="mt-3 font-heading text-4xl font-extrabold text-moss md:text-6xl">
          Comment nous <br />
          <span className="font-drama italic text-clay">travaillons.</span>
        </h2>
      </div>

      <div className="mx-auto max-w-6xl space-y-6">
        {PROTOCOL.map((card, idx) => {
          const Viz = VIZS[idx]
          return (
            <article
              key={card.step}
              className="protocol-card relative flex min-h-[82vh] flex-col justify-between overflow-hidden rounded-[2.5rem] border border-moss/12 bg-white/80 p-10 shadow-card backdrop-blur-sm md:p-14"
            >
              {/* Background number watermark */}
              <span
                className="pointer-events-none absolute right-10 top-8 font-drama text-[12rem] font-bold leading-none text-moss/5 md:text-[18rem]"
                aria-hidden="true"
              >
                {card.step}
              </span>

              <div className="relative z-10">
                <p className="font-data text-[11px] uppercase tracking-[0.2em] text-moss/45">
                  ÉTAPE {card.step}
                </p>
                <h3 className="mt-4 font-heading text-4xl font-bold leading-tight text-moss md:text-6xl">
                  {card.title}
                </h3>
                <p className="mt-5 max-w-lg text-base leading-relaxed text-charcoal/65 md:text-lg">
                  {card.desc}
                </p>
              </div>

              <div className="relative z-10 mt-10">
                <Viz />
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

/* ════════════════════════════════════════════════════════════ */
/*  PRICING                                                    */
/* ════════════════════════════════════════════════════════════ */
function Pricing() {
  const ref = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".pricing-card", {
        opacity: 0,
        y: 40,
        stagger: 0.15,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 70%" },
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section id="tarifs" ref={ref} className="px-6 py-24 md:px-16">
      <div className="mx-auto max-w-6xl">
        <p className="font-data text-[11px] uppercase tracking-[0.22em] text-moss/55">
          Formules
        </p>
        <h2 className="mt-3 font-heading text-4xl font-extrabold text-moss md:text-6xl">
          Choisissez votre <br />
          <span className="font-drama italic text-clay">niveau d'engagement.</span>
        </h2>

        <div className="mt-14 grid items-start gap-6 md:grid-cols-3">
          {TIERS.map((tier) => (
            <article
              key={tier.name}
              className={`pricing-card rounded-[2rem] border p-8 shadow-card transition-transform duration-300 hover:scale-[1.015] ${tier.featured
                  ? "border-moss bg-moss text-cream ring-2 ring-clay/60 scale-[1.02]"
                  : "border-moss/12 bg-cream text-charcoal"
                }`}
            >
              {tier.featured && (
                <p className="font-data mb-4 inline-block rounded-full bg-clay/25 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-clay">
                  Recommandé
                </p>
              )}

              <p className="font-heading text-xl font-bold">{tier.name}</p>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="font-heading text-4xl font-extrabold">{tier.price}</span>
                {tier.period && (
                  <span className={`text-sm ${tier.featured ? "text-cream/60" : "text-charcoal/50"}`}>
                    {tier.period}
                  </span>
                )}
              </div>
              <p className={`mt-3 text-sm ${tier.featured ? "text-cream/70" : "text-charcoal/60"}`}>
                {tier.desc}
              </p>

              <ul className="mt-7 space-y-3">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <Check
                      size={15}
                      className={`mt-0.5 shrink-0 ${tier.featured ? "text-clay" : "text-moss"}`}
                    />
                    <span className={tier.featured ? "text-cream/85" : "text-charcoal/80"}>{f}</span>
                  </li>
                ))}
              </ul>

              <a
                href="#contact"
                className={`group magnetic relative mt-8 inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-full px-5 py-3.5 text-sm font-bold transition-all ${tier.featured
                    ? "bg-clay text-cream"
                    : "bg-moss text-cream"
                  }`}
              >
                <span className="absolute inset-0 -translate-x-full bg-charcoal transition-transform duration-300 ease-out group-hover:translate-x-0" />
                <span className="relative z-10 inline-flex items-center gap-2">
                  {tier.cta} <ArrowRight size={14} />
                </span>
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ════════════════════════════════════════════════════════════ */
/*  CONTACT — CTA + Form                                      */
/* ════════════════════════════════════════════════════════════ */
function Contact() {
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "" })

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  const handleSubmit = (e) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <section
      id="contact"
      className="px-6 py-24 md:px-16"
    >
      <div className="mx-auto max-w-6xl">
        <div className="overflow-hidden rounded-[3rem] bg-moss px-8 py-14 shadow-hero md:px-16 md:py-20">
          <div className="grid gap-14 md:grid-cols-2">
            {/* Left */}
            <div>
              <p className="font-data text-[11px] uppercase tracking-[0.22em] text-cream/50">Contact</p>
              <h2 className="mt-4 font-heading text-4xl font-extrabold leading-tight text-cream md:text-6xl">
                Parlons de votre{" "}
                <span className="font-drama italic text-clay">projet IA.</span>
              </h2>
              <p className="mt-6 text-sm leading-relaxed text-cream/65">
                Réservez une consultation gratuite de 30 minutes pour explorer comment
                l'IA peut transformer concrètement vos opérations.
              </p>

              <div className="mt-10 space-y-4">
                {[
                  { Icon: Mail, text: "contact@rhysting.ai" },
                  { Icon: Phone, text: "+33 1 XX XX XX XX" },
                  { Icon: MapPin, text: "Paris, France — Remote worldwide" },
                ].map(({ Icon, text }) => (
                  <div key={text} className="flex items-center gap-3 text-sm text-cream/70">
                    <Icon size={15} className="text-clay" />
                    {text}
                  </div>
                ))}
              </div>
            </div>

            {/* Right — form */}
            <div>
              {sent ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-clay">
                    <Check size={26} className="text-cream" />
                  </div>
                  <p className="font-heading text-xl font-bold text-cream">Message envoyé !</p>
                  <p className="mt-2 text-sm text-cream/60">
                    Nous vous répondrons sous 24 h ouvrées.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {[
                    { name: "name", label: "Nom complet", type: "text", placeholder: "Jean Dupont" },
                    { name: "email", label: "Email professionnel", type: "email", placeholder: "jean@entreprise.fr" },
                    { name: "company", label: "Entreprise", type: "text", placeholder: "ACME SAS" },
                  ].map(({ name, label, type, placeholder }) => (
                    <div key={name}>
                      <label className="font-data mb-1.5 block text-[11px] uppercase tracking-[0.14em] text-cream/55">
                        {label}
                      </label>
                      <input
                        type={type}
                        name={name}
                        required
                        value={form[name]}
                        onChange={handleChange}
                        placeholder={placeholder}
                        className="w-full rounded-2xl border border-cream/15 bg-cream/8 px-4 py-3 text-sm text-cream placeholder-cream/35 outline-none transition-all focus:border-clay focus:ring-2 focus:ring-clay/25"
                      />
                    </div>
                  ))}

                  <div>
                    <label className="font-data mb-1.5 block text-[11px] uppercase tracking-[0.14em] text-cream/55">
                      Votre projet en quelques mots
                    </label>
                    <textarea
                      name="message"
                      required
                      rows={3}
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Nous souhaitons automatiser..."
                      className="w-full resize-none rounded-2xl border border-cream/15 bg-cream/8 px-4 py-3 text-sm text-cream placeholder-cream/35 outline-none transition-all focus:border-clay focus:ring-2 focus:ring-clay/25"
                    />
                  </div>

                  <button
                    type="submit"
                    className="group magnetic relative w-full overflow-hidden rounded-full bg-clay py-4 font-heading text-sm font-bold text-cream"
                  >
                    <span className="absolute inset-0 -translate-x-full bg-cream transition-transform duration-300 ease-out group-hover:translate-x-0" />
                    <span className="relative z-10 inline-flex items-center justify-center gap-2 group-hover:text-moss">
                      {CTA} <ArrowRight size={15} />
                    </span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ════════════════════════════════════════════════════════════ */
/*  FOOTER                                                     */
/* ════════════════════════════════════════════════════════════ */
function Footer() {
  return (
    <footer className="rounded-t-[4rem] bg-charcoal px-6 pt-16 pb-10 text-cream md:px-16">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 border-b border-cream/8 pb-14 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2">
            <p className="font-heading text-2xl font-extrabold tracking-tight">{BRAND}</p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-cream/55">{TAGLINE}</p>
            {/* Status */}
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-4 py-2 font-data text-[10px] uppercase tracking-[0.16em] text-emerald-300">
              <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Système opérationnel
            </div>
          </div>

          {/* Nav */}
          <div>
            <p className="font-data mb-5 text-[10px] uppercase tracking-[0.2em] text-cream/40">
              Navigation
            </p>
            <div className="space-y-3">
              {NAV_LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="lift-hover block text-sm text-cream/65 hover:text-cream"
                >
                  {l.label}
                </a>
              ))}
            </div>
          </div>

          {/* Legal */}
          <div>
            <p className="font-data mb-5 text-[10px] uppercase tracking-[0.2em] text-cream/40">
              Légal
            </p>
            <div className="space-y-3">
              {["Mentions légales", "Politique de confidentialité", "CGU"].map((t) => (
                <a
                  key={t}
                  href="#"
                  className="lift-hover block text-sm text-cream/65 hover:text-cream"
                >
                  {t}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-8 flex flex-col items-start gap-3 md:flex-row md:items-center md:justify-between">
          <p className="font-data text-[11px] text-cream/30">
            © {new Date().getFullYear()} {BRAND}. Tous droits réservés.
          </p>
          <p className="font-data text-[11px] text-cream/25">
            Conçu avec rigueur — Paris, France
          </p>
        </div>
      </div>
    </footer>
  )
}

/* ════════════════════════════════════════════════════════════ */
/*  APP ROOT                                                   */
/* ════════════════════════════════════════════════════════════ */
export default function App() {
  const heroRef = useRef(null)
  const [solidNav, setSolidNav] = useState(false)

  useEffect(() => {
    const el = heroRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => setSolidNav(!entry.isIntersecting),
      { threshold: 0.15 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <main className="bg-cream text-charcoal">
      <Navbar solid={solidNav} />
      <Hero heroRef={heroRef} />
      <Features />
      <Philosophy />
      <Protocol />
      <Pricing />
      <Contact />
      <Footer />
    </main>
  )
}
