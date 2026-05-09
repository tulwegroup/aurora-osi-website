'use client'

import { useEffect, useMemo, useState } from 'react'
import { ExternalLink, Globe2 } from 'lucide-react'
import Link from 'next/link'
import { permitCountries, type SourceCitation } from '@/lib/connected-platforms'

type CountryCoverage = {
  country: string
  sources: number
  focus: string
  readiness: number
  evidence: string
  why: string
  status: string
  region?: string
  sourceCitations?: SourceCitation[]
}

const getApiBase = () => {
  if (process.env.NEXT_PUBLIC_AURORA_API_URL) return process.env.NEXT_PUBLIC_AURORA_API_URL
  if (typeof window !== 'undefined' && !['127.0.0.1', 'localhost'].includes(window.location.hostname)) return window.location.origin
  return 'http://127.0.0.1:8000'
}

function normalizeCountry(item: any): CountryCoverage {
  const targets = item.permit_source_targets || []
  const focus = item.commodity_focus || []
  const evidence = item.permit_source_targets || item.scan_database_evidence || []
  return {
    country: item.country,
    sources: item.sources || targets.length || 0,
    focus: item.focus || focus.join(', ') || 'Mineral permits, petroleum blocks, critical minerals',
    readiness: item.readiness ?? item.readiness_score ?? 35,
    evidence: item.evidence || evidence.join('; '),
    why: item.why || item.why_it_matters || 'Included for country-level permit research before scan packaging.',
    status: item.status || item.research_status || 'adapter_needed',
    region: item.region,
    sourceCitations: item.sourceCitations || item.source_citations || [],
  }
}

export default function RadarCountriesPage() {
  const [countries, setCountries] = useState<CountryCoverage[]>(permitCountries.map(normalizeCountry))
  const [regionFilter, setRegionFilter] = useState<string>('All')

  useEffect(() => {
    let cancelled = false
    fetch(`${getApiBase()}/api/aor/permits/countries`)
      .then((response) => response.ok ? response.json() : Promise.reject(new Error('country registry unavailable')))
      .then((data) => {
        if (!cancelled && Array.isArray(data.countries)) setCountries(data.countries.map(normalizeCountry))
      })
      .catch(() => undefined)
    return () => { cancelled = true }
  }, [])

  const regions = useMemo(() => {
    const set = new Set<string>()
    countries.forEach((c) => { if (c.region) set.add(c.region) })
    return ['All', ...Array.from(set).sort()]
  }, [countries])

  const filtered = useMemo(() => {
    if (regionFilter === 'All') return countries
    return countries.filter((c) => c.region === regionFilter)
  }, [countries, regionFilter])

  const stats = useMemo(() => {
    const active = filtered.filter((item) => item.status === 'active').length
    const seeded = filtered.filter((item) => item.status === 'seeded').length
    const monitor = filtered.filter((item) => item.status === 'monitor').length
    return { total: filtered.length, active, seeded, monitor }
  }, [filtered])

  return (
    <main className="min-h-screen bg-[#050508] px-5 py-8 text-white">
      <section className="mx-auto max-w-7xl">
        <div className="mb-3 inline-flex items-center gap-2 rounded-md border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-cyan-100">
          <Globe2 className="h-4 w-4" /> Radar Countries
        </div>
        <h1 className="text-3xl font-semibold md:text-5xl">Global country permit coverage.</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-400">
          AOR now includes a global country watchlist. Countries are researched through permit, tenure, licensing, gazette, tender, deal-room, and market-news channels before any Aurora scan is requested.
        </p>
        <Link href="/data-room-admin" className="mt-5 inline-flex rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm font-semibold text-zinc-200 hover:border-cyan-300/40 hover:text-cyan-100">
          Back to Admin
        </Link>
        <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-400">
          <span className="rounded-md border border-white/10 bg-white/5 px-3 py-2">{stats.total} countries</span>
          <span className="rounded-md border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 text-emerald-100">{stats.active} active</span>
          <span className="rounded-md border border-copper/30 bg-copper/10 px-3 py-2 text-copper-light">{stats.seeded} seeded</span>
          <span className="rounded-md border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-amber-100">{stats.monitor} monitor</span>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {regions.map((region) => (
            <button
              key={region}
              onClick={() => setRegionFilter(region)}
              className={`rounded-md border px-3 py-1.5 text-xs font-semibold uppercase tracking-wider ${
                regionFilter === region
                  ? 'border-cyan-300/60 bg-cyan-400/15 text-cyan-100'
                  : 'border-white/10 bg-white/5 text-zinc-300 hover:border-cyan-300/40'
              }`}
            >
              {region}
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((item) => (
            <details key={item.country} className="rounded-md border border-copper/20 bg-[#0b0b12] p-4" title={item.why}>
              <summary className="cursor-pointer list-none">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-semibold">{item.country}</h2>
                    {item.region ? (
                      <span className="mt-1 inline-flex rounded-md border border-violet-400/30 bg-violet-400/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-violet-200">
                        {item.region}
                      </span>
                    ) : null}
                  </div>
                  <span className="rounded-md border border-cyan-300/30 bg-cyan-300/10 px-2 py-1 text-xs font-semibold text-cyan-100">{item.readiness}%</span>
                </div>
              </summary>
              <p className="mt-2 min-h-12 text-sm text-zinc-400">{item.focus}</p>
              <div className="mt-4 text-sm text-copper-light">{item.sources} source classes / {item.status.replaceAll('_', ' ')}</div>
              <div className="mt-4 border-t border-white/10 pt-4 text-sm leading-6 text-zinc-300">
                <div className="font-semibold text-white">Why it belongs here</div>
                <p className="mt-1">{item.why}</p>
                <div className="mt-3 font-semibold text-white">Research channels and small print</div>
                <p className="mt-1 text-zinc-400">{item.evidence || 'Global watchlist entry. Research source portals before creating mineral uploads, scan packs, or client-facing claims.'}</p>
              </div>
              {item.sourceCitations && item.sourceCitations.length > 0 ? (
                <div className="mt-4 border-t border-white/10 pt-4">
                  <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-200">
                    <ExternalLink className="h-3.5 w-3.5" />
                    Verifiable sources
                  </div>
                  <div className="flex flex-col gap-1.5">
                    {item.sourceCitations.map((s) => (
                      <a
                        key={`${s.publisher}-${s.url}`}
                        href={s.url}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="flex items-start justify-between gap-2 rounded-md border border-white/10 bg-black/30 px-2 py-1.5 text-xs text-zinc-200 hover:border-cyan-300/50 hover:bg-cyan-400/5"
                        title={s.note || s.publisher}
                      >
                        <span className="truncate">
                          <span className="font-medium">{s.publisher}</span>
                          <span className="ml-2 text-[10px] uppercase tracking-wider text-zinc-500">
                            {s.className.replace(/_/g, ' ')}{s.jurisdiction ? ' · ' + s.jurisdiction : ''}
                          </span>
                        </span>
                        {s.confidence ? (
                          <span className="rounded-md border border-emerald-400/30 bg-emerald-400/10 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-100">
                            {s.confidence}%
                          </span>
                        ) : null}
                      </a>
                    ))}
                  </div>
                </div>
              ) : null}
            </details>
          ))}
        </div>
      </section>
    </main>
  )
}
