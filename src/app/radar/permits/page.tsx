'use client'

import { useEffect, useState } from 'react'
import { Database, ExternalLink, FileDown, Globe2, Layers3, Radar, ScanLine, Send, Upload } from 'lucide-react'
import Link from 'next/link'
import { permitAois, permitCountries } from '@/lib/connected-platforms'

const getApiBase = () => {
  if (process.env.NEXT_PUBLIC_AURORA_API_URL) return process.env.NEXT_PUBLIC_AURORA_API_URL
  if (typeof window !== 'undefined' && !['127.0.0.1', 'localhost'].includes(window.location.hostname)) return window.location.origin
  return 'http://127.0.0.1:8000'
}

export default function PermitRadarPage() {
  const [country, setCountry] = useState('Ghana')
  const [countries, setCountries] = useState(permitCountries)
  const [status, setStatus] = useState('idle')
  const [taskId, setTaskId] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch(`${getApiBase()}/api/aor/permits/countries`)
      .then((response) => response.ok ? response.json() : Promise.reject(new Error('country registry unavailable')))
      .then((data) => {
        if (cancelled || !Array.isArray(data.countries)) return
        setCountries(data.countries.map((item: any) => ({
          country: item.country,
          sources: item.permit_source_targets?.length || item.sources || 0,
          focus: item.commodity_focus?.join(', ') || item.focus || 'Mineral permits, petroleum blocks, critical minerals',
          readiness: item.readiness_score ?? item.readiness ?? 35,
          evidence: item.scan_database_evidence?.join('; ') || item.evidence || 'Global watchlist entry',
          why: item.why_it_matters || item.why || 'Researchable AOR country watchlist entry.',
        })))
      })
      .catch(() => undefined)
    return () => { cancelled = true }
  }, [])

  async function researchCountry() {
    setStatus('researching')
    const response = await fetch(`${getApiBase()}/api/aor/permits/research`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ country }),
    })
    setStatus(response.ok ? 'country researched' : 'research failed')
  }

  async function extractAois() {
    setStatus('extracting AOIs')
    const response = await fetch(`${getApiBase()}/api/aor/permits/extract-aois`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ country }),
    })
    setStatus(response.ok ? 'AOIs extracted' : 'extraction failed')
  }

  async function runAuroraScan(aoiId: string) {
    setStatus('submitting to aurora_scan')
    setTaskId(null)
    const response = await fetch(`${getApiBase()}/api/aor/permits/run-scan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ aoi_id: aoiId, grid_size_km: 10, requested_scan_type: 'permit-opportunity-screening' }),
    })
    const data = await response.json()
    setStatus(response.ok ? data.status : 'handoff failed')
    setTaskId(data.task_id || null)
  }

  async function generateReport(aoiId: string) {
    setStatus('generating report')
    const response = await fetch(`${getApiBase()}/api/aor/permits/generate-report`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ aoi_id: aoiId }),
    })
    setStatus(response.ok ? 'report ready' : 'report failed')
  }

  return (
    <main className="min-h-screen bg-[#050508] text-white">
      <section className="border-b border-copper/25 bg-[#090910]">
        <div className="mx-auto max-w-7xl px-5 py-8">
          <div className="mb-3 inline-flex items-center gap-2 rounded-md border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-cyan-100">
            <Radar className="h-4 w-4" />
            Permit-to-Scan Radar
          </div>
          <h1 className="text-3xl font-semibold md:text-5xl">Country permit intelligence agent.</h1>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-zinc-300">
            Research permit, tenure, licensing, gazette, tender, deal-room, and breaking-market channels first. Only tenure that is open, acquirable, partnerable, distressed, or commercially packageable should move to Aurora scanning.
          </p>
          <Link href="/data-room-admin" className="mt-5 inline-flex rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm font-semibold text-zinc-200 hover:border-cyan-300/40 hover:text-cyan-100">
            Back to Admin
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-6">
        <div className="grid gap-3 rounded-md border border-cyan-400/20 bg-[#071014] p-4 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="flex flex-wrap items-center gap-3">
            <select value={country} onChange={(event) => setCountry(event.target.value)} className="rounded-md border border-white/10 bg-black/40 px-3 py-2 text-sm">
              {countries.map((item) => <option key={item.country}>{item.country}</option>)}
            </select>
            <div className="text-sm text-zinc-400">Status: <span className="font-semibold text-copper-light">{status}</span></div>
            <div className="text-sm text-zinc-400">Task: <span className="font-semibold text-cyan-100">{taskId || 'none'}</span></div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={researchCountry} className="inline-flex items-center gap-2 rounded-md border border-cyan-300/40 bg-cyan-300/10 px-3 py-2 text-sm font-semibold text-cyan-100"><Globe2 className="h-4 w-4" />Research Country</button>
            <button className="inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm font-semibold text-zinc-200"><Upload className="h-4 w-4" />Import Permit Database</button>
            <button onClick={extractAois} className="inline-flex items-center gap-2 rounded-md border border-copper/40 bg-copper/15 px-3 py-2 text-sm font-semibold text-copper-light"><Layers3 className="h-4 w-4" />Extract AOIs</button>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-5 pb-10">
        {permitAois.map((aoi) => (
          <div key={aoi.id} className="rounded-md border border-copper/20 bg-[#0b0b12] p-4">
            <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-start">
              <div>
                <div className="mb-2 flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.12em] text-zinc-500">
                  <span>{aoi.country}</span>
                  <span>{aoi.status}</span>
                  <span>{aoi.commodity}</span>
                </div>
                <h2 className="text-xl font-semibold" title={`Evidence confidence: ${aoi.confidence}%. Why: ${aoi.selectionReason || aoi.action}`}>{aoi.license}</h2>
                <p className="mt-2 text-sm text-zinc-400">{aoi.holder}</p>
                <p className="mt-3 text-sm text-copper-light">{aoi.aoiHint}</p>
                <details className="mt-4 rounded-md border border-white/10 bg-black/20 p-3 text-sm">
                  <summary className="cursor-pointer font-semibold text-zinc-200">Why this permit matters</summary>
                  <p className="mt-2 leading-6 text-zinc-400">
                    {aoi.selectionReason || `${aoi.action}. This AOI is included because it can become a controlled Aurora scan handoff and a data-room-ready intelligence product.`}
                  </p>
                  <div className="mt-3 font-semibold text-zinc-200">Research basis</div>
                  <ul className="mt-2 space-y-1 text-zinc-400">
                    {(aoi.researchBasis || ['Seeded AOI intelligence scaffold', 'Official geometry and document extraction required']).map((basis) => (
                      <li key={basis}>- {basis}</li>
                    ))}
                  </ul>
                  <div className="mt-3 font-semibold text-zinc-200">Commercial thesis</div>
                  <p className="mt-2 leading-6 text-zinc-400">{aoi.commercialThesis || 'Research whether this tenure can be acquired, partnered, developed, flipped, packaged, or resold as a higher-value intelligence product.'}</p>
                  <div className="mt-3 font-semibold text-zinc-200">Qualification criteria</div>
                  <ul className="mt-2 space-y-1 text-zinc-400">
                    {(aoi.qualificationCriteria || ['Open/acquirable/partnerable status', 'Clear commercial path', 'Official coordinates or credible AOI boundaries']).map((criterion) => (
                      <li key={criterion}>- {criterion}</li>
                    ))}
                  </ul>
                  <p className="mt-2 text-zinc-500">{aoi.clarification || 'Small print: seeded AOI intelligence is a research scaffold until country-specific cadastre adapters extract official geometries and documents.'}</p>
                  {aoi.sourceCitations && aoi.sourceCitations.length > 0 ? (
                    <div className="mt-4 border-t border-white/10 pt-3">
                      <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-200">
                        <ExternalLink className="h-3.5 w-3.5" />
                        Verifiable sources
                      </div>
                      <div className="flex flex-col gap-1.5">
                        {aoi.sourceCitations.map((s) => (
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
                      <p className="mt-2 text-[11px] text-zinc-500">Click any source to verify. Aurora claims must be auditable to be defensible.</p>
                    </div>
                  ) : null}
                </details>
              </div>
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="rounded-md border border-red-400/30 bg-red-500/10 p-3">
                  <div className="text-xl font-semibold text-red-100">{aoi.score}</div>
                  <div className="text-xs text-zinc-500">score</div>
                </div>
                <div className="rounded-md border border-cyan-400/30 bg-cyan-500/10 p-3">
                  <div className="text-xl font-semibold text-cyan-100">{aoi.confidence}%</div>
                  <div className="text-xs text-zinc-500">confidence</div>
                </div>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button onClick={() => runAuroraScan(aoi.id)} className="inline-flex items-center gap-2 rounded-md border border-emerald-300/40 bg-emerald-300/10 px-3 py-2 text-sm font-semibold text-emerald-100"><ScanLine className="h-4 w-4" />Run Aurora Scan</button>
              <button onClick={() => generateReport(aoi.id)} className="inline-flex items-center gap-2 rounded-md border border-copper/40 bg-copper/15 px-3 py-2 text-sm font-semibold text-copper-light"><FileDown className="h-4 w-4" />Generate Report</button>
              <button className="inline-flex items-center gap-2 rounded-md border border-cyan-300/40 bg-cyan-300/10 px-3 py-2 text-sm font-semibold text-cyan-100"><Database className="h-4 w-4" />Publish to Data Room</button>
              <button className="inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm font-semibold text-zinc-200"><Send className="h-4 w-4" />Create Outreach</button>
            </div>
          </div>
        ))}
      </section>
    </main>
  )
}
