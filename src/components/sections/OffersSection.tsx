'use client'

import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  Compass,
  Layers,
  Lock,
  Map,
  PlayCircle,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

/**
 * OffersSection — "Latest round of offers" landing block.
 *
 * Mounted at the top of the landing page (right after HeroSection)
 * to surface the active hydrogen + lithium plays for junior miners
 * and corporate buyers. Four panels in the order the buyer reads:
 *
 *   1. What's Available  — which AOIs are live
 *   2. What You Get      — three deliverables that move a deal forward
 *   3. Access Levels     — Teaser / Executive Summary / Target Pack
 *   4. CTA               — Request access to data room
 *
 * A hero video frame sits at the top of the section. Drop an mp4 at
 * /public/videos/landing-hero.mp4 (or .webm) and the player will pick
 * it up; until then the placeholder card explains the framing.
 *
 * Animation conventions follow HeroSection / ResourcesSection:
 *   - framer-motion whileInView fade-up on each card
 *   - staggered delays for a cinematic reveal
 *   - subtle hover lift on cards via Tailwind transitions
 */
export function OffersSection() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [videoError, setVideoError] = useState(false)

  const handleVideoLoaded = () => setVideoLoaded(true)
  const handleVideoError = () => setVideoError(true)

  const playVideo = () => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        /* autoplay blocked — fine, user clicked */
      })
    }
  }

  return (
    <section
      id="offers"
      className="relative bg-[#050508] py-28 md:py-36 overflow-hidden"
    >
      {/* Background — grid + radial accent */}
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(201,132,74,0.10)_0%,_transparent_60%)]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Section header ────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="text-center mb-14 md:mb-20"
        >
          <p className="text-[#c9844a] text-sm tracking-[0.35em] uppercase mb-6 font-medium">
            Latest Round of Offers · North America
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight leading-tight text-white mb-7">
            Actionable Subsurface Intelligence —{' '}
            <span className="aurora-gradient">Hydrogen &amp; Lithium</span>{' '}
            Systems
          </h2>
          <p className="text-[#a0a0b0] font-light text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Decision-grade target packs across natural-hydrogen and
            lithium-brine systems in Canada and the United States.
            Open-ground positioning, ranked zones, and farm-in
            opportunities — ready for staking or strategic capital.
          </p>
        </motion.div>

        {/* ── Hero video ────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mb-20 md:mb-24"
        >
          <div className="relative aurora-border rounded-xl overflow-hidden bg-[#0a0a10] aspect-video shadow-[0_30px_80px_-30px_rgba(201,132,74,0.30)]">
            {/* The video element. When the user drops landing-hero.mp4 into
                public/videos/, this picks it up automatically. */}
            <video
              ref={videoRef}
              controls
              preload="metadata"
              poster="/logo.svg"
              className="absolute inset-0 w-full h-full object-cover"
              onLoadedMetadata={handleVideoLoaded}
              onError={handleVideoError}
            >
              <source src="/videos/landing-hero.mp4" type="video/mp4" />
              <source src="/videos/landing-hero.webm" type="video/webm" />
            </video>

            {/* Placeholder shown while video metadata is loading or if the
                source is missing. Hidden once the video reports loaded. */}
            {(!videoLoaded || videoError) && (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#0a0a10] via-[#050508] to-[#08080d] z-10 cursor-pointer"
                   onClick={playVideo}>
                <div className="text-center px-6">
                  <motion.div
                    animate={{ scale: [1, 1.06, 1] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                    className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#c9844a]/10 border border-[#c9844a]/40 mb-6"
                  >
                    <PlayCircle className="w-10 h-10 text-[#c9844a]" />
                  </motion.div>
                  <p className="text-[#c9844a] text-xs tracking-[0.35em] uppercase mb-3 font-medium">
                    {videoError ? 'Hero Video' : 'Loading Hero Video'}
                  </p>
                  <p className="text-white/90 text-base md:text-lg max-w-md mx-auto">
                    {videoError
                      ? 'Drop landing-hero.mp4 into /public/videos/ to enable the hero video. Until then, the call below works without it.'
                      : 'Aurora OSI overview — hydrogen and lithium systems, North America.'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* ── Section 1: What's Available ───────────────────────── */}
        <div className="mb-24 md:mb-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="mb-10"
          >
            <p className="text-[#c9844a] text-xs tracking-[0.35em] uppercase mb-3 font-medium">
              Section 01 · What&rsquo;s Available
            </p>
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-medium tracking-tight text-white">
              Live target packs across two North American systems
            </h3>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-7">
            {[
              {
                icon: Activity,
                badge: 'Hydrogen',
                title: 'Hydrogen AOIs (Canada + US)',
                body:
                  'Fault-plumbed natural-hydrogen targets across Atlantic Canada, the Williston Basin, the Avalon Zone, and select US plays. Each AOI ships ranked-zone topology, structural interpretation, and a Tier-2 commercial pack.',
                tag: 'Canada · United States',
              },
              {
                icon: Layers,
                badge: 'Lithium',
                title: 'Lithium Brine AOIs (Canada)',
                body:
                  'Oil-field formation brines across the Western Canada Sedimentary Basin and analogue settings — calibrated against published Class-A ground truth and mapped at 2 km resolution.',
                tag: 'Canada',
              },
            ].map((card, idx) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6, delay: 0.1 + idx * 0.15 }}
                className="group aurora-border bg-[#0a0a10]/80 rounded-xl p-7 md:p-9 hover:bg-[#0d0d14] transition-colors"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="inline-flex items-center justify-center w-11 h-11 rounded-lg bg-[#c9844a]/10 border border-[#c9844a]/30">
                    <card.icon className="w-5 h-5 text-[#c9844a]" />
                  </div>
                  <span className="inline-block px-3 py-1 rounded-full text-[10px] tracking-[0.18em] uppercase font-medium text-[#c9844a] bg-[#c9844a]/10 border border-[#c9844a]/30">
                    {card.badge}
                  </span>
                </div>
                <h4 className="text-xl md:text-2xl font-semibold text-white mb-3">
                  {card.title}
                </h4>
                <p className="text-[#a0a0b0] leading-relaxed mb-5">
                  {card.body}
                </p>
                <p className="text-xs tracking-[0.25em] uppercase text-[#c9844a]/80 font-medium">
                  {card.tag}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Section 2: What You Get ───────────────────────────── */}
        <div className="mb-24 md:mb-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="mb-10"
          >
            <p className="text-[#c9844a] text-xs tracking-[0.35em] uppercase mb-3 font-medium">
              Section 02 · What You Get
            </p>
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-medium tracking-tight text-white">
              Three deliverables that move a deal forward
            </h3>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Map,
                title: 'Ranked zones',
                body:
                  'Field-scale A / B / C / D zoning derived from per-cell ACIF scores. Concentrates ground programmes on the highest-density fault-related signal corridors.',
              },
              {
                icon: Compass,
                title: 'Entry positioning',
                body:
                  'Open-ground vs claimed status, farm-in candidates, and jurisdictional tenure context — so you know exactly where to stake first and where to negotiate.',
              },
              {
                icon: Sparkles,
                title: 'System interpretation',
                body:
                  'Structural framework, alteration class, thermal regime, gravity / magnetic posture — the geological story that underwrites every Tier-1 cell.',
              },
            ].map((card, idx) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6, delay: 0.1 + idx * 0.12 }}
                className="aurora-border bg-[#0a0a10]/70 rounded-xl p-7 hover:bg-[#0d0d14] transition-colors"
              >
                <div className="inline-flex items-center justify-center w-11 h-11 rounded-lg bg-[#c9844a]/10 border border-[#c9844a]/30 mb-5">
                  <card.icon className="w-5 h-5 text-[#c9844a]" />
                </div>
                <h4 className="text-xl font-semibold text-white mb-3">
                  {card.title}
                </h4>
                <p className="text-[#a0a0b0] leading-relaxed">
                  {card.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Section 3: Access Levels ──────────────────────────── */}
        <div className="mb-24 md:mb-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="mb-10"
          >
            <p className="text-[#c9844a] text-xs tracking-[0.35em] uppercase mb-3 font-medium">
              Section 03 · Access Levels
            </p>
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-medium tracking-tight text-white">
              Three tiers, mapped to where you are in your decision
            </h3>
          </motion.div>

          {/* Tier table — three column cards on desktop, stacked on mobile */}
          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                tier: 'Teaser',
                access: 'Free',
                accessTone: 'neutral' as const,
                bullet: 'Public-safe AOI summaries, sanitised zone visuals, system-level narrative.',
                cta: 'View teaser',
                href: '/data-room/teaser',
                icon: Sparkles,
              },
              {
                tier: 'Executive Summary',
                access: 'NDA',
                accessTone: 'accent' as const,
                bullet:
                  'Methodology, calibration framework, target-class context. NDA-gated; no per-cell coordinates.',
                cta: 'Sign NDA',
                href: '/data-room/teaser',
                icon: ShieldCheck,
                featured: true,
              },
              {
                tier: 'Target Pack',
                access: 'Paid',
                accessTone: 'paid' as const,
                bullet:
                  'Full Tier-2/3 commercial pack: ranked-cell datasets, GIS / KML, voxel models, raw scan outputs.',
                cta: 'Go to checkout',
                href: '/data-room/checkout',
                icon: Lock,
              },
            ].map((row, idx) => (
              <motion.div
                key={row.tier}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6, delay: 0.1 + idx * 0.12 }}
                className={
                  row.featured
                    ? 'relative aurora-border bg-[#0d0d14] rounded-xl p-7 md:p-8 ring-1 ring-[#c9844a]/40 shadow-[0_20px_60px_-25px_rgba(201,132,74,0.40)]'
                    : 'aurora-border bg-[#0a0a10]/70 rounded-xl p-7 md:p-8'
                }
              >
                {row.featured && (
                  <div className="absolute -top-3 left-7">
                    <span className="inline-block px-3 py-1 rounded-full text-[10px] tracking-[0.25em] uppercase font-semibold text-[#050508] bg-[#c9844a]">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="flex items-start justify-between mb-5">
                  <div className="inline-flex items-center justify-center w-11 h-11 rounded-lg bg-[#c9844a]/10 border border-[#c9844a]/30">
                    <row.icon className="w-5 h-5 text-[#c9844a]" />
                  </div>
                  <span
                    className={
                      row.accessTone === 'accent'
                        ? 'inline-block px-3 py-1 rounded-full text-[10px] tracking-[0.18em] uppercase font-semibold text-[#c9844a] bg-[#c9844a]/15 border border-[#c9844a]/40'
                        : row.accessTone === 'paid'
                        ? 'inline-block px-3 py-1 rounded-full text-[10px] tracking-[0.18em] uppercase font-semibold text-[#fcd34d] bg-[#fcd34d]/10 border border-[#fcd34d]/30'
                        : 'inline-block px-3 py-1 rounded-full text-[10px] tracking-[0.18em] uppercase font-semibold text-[#a0a0b0] bg-[#a0a0b0]/10 border border-[#a0a0b0]/25'
                    }
                  >
                    {row.access}
                  </span>
                </div>
                <h4 className="text-xl md:text-2xl font-semibold text-white mb-3">
                  {row.tier}
                </h4>
                <p className="text-[#a0a0b0] leading-relaxed mb-6">
                  {row.bullet}
                </p>
                <a
                  href={row.href}
                  className="inline-flex items-center text-sm font-semibold text-[#c9844a] hover:text-[#d4a574] transition-colors"
                >
                  {row.cta}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </a>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Section 4: CTA ────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="relative aurora-border rounded-2xl overflow-hidden bg-gradient-to-br from-[#0d0d14] via-[#0a0a10] to-[#050508] p-10 md:p-14 text-center"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(201,132,74,0.12)_0%,_transparent_70%)]" />
          <div className="relative">
            <p className="text-[#c9844a] text-xs tracking-[0.35em] uppercase mb-4 font-medium">
              Section 04 · Take the next step
            </p>
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-medium tracking-tight text-white mb-5">
              Request access to the data room
            </h3>
            <p className="text-[#a0a0b0] font-light text-lg max-w-2xl mx-auto mb-9 leading-relaxed">
              Sign the NDA online and unlock the executive summary in minutes.
              Buyers ready to move on a target pack can route directly to
              checkout. Either way, you&rsquo;re one click from open-ground
              positioning intelligence.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                asChild
                size="lg"
                className="bg-[#c9844a] hover:bg-[#d4a574] text-[#050508] font-semibold tracking-wide px-8 h-14 text-base animate-subtle-pulse"
              >
                <a href="/data-room/teaser">
                  Request access to data room
                  <ArrowRight className="ml-2 w-5 h-5" />
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-[#c9844a]/40 text-[#c9844a] hover:bg-[#c9844a]/10 hover:border-[#c9844a]/60 font-semibold tracking-wide px-8 h-14 text-base"
              >
                <a href="/data-room/checkout">
                  View pricing
                </a>
              </Button>
            </div>
            <p className="mt-7 text-xs text-[#a0a0b0]/70 tracking-[0.18em] uppercase flex items-center justify-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#c9844a]/80" />
              Tier-0 free · NDA in browser · 30-day session token
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
