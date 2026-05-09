'use client'

import { useEffect, useState } from 'react'
import { Activity, Clock, ExternalLink, Gauge, Globe, History, Layers, Map, Network, RadioTower, Send, ShieldCheck, Sparkles, Target, Zap } from 'lucide-react'
import Link from 'next/link'
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import {
  adaptiveTriggers,
  aorScoreBands,
  commodityHeat,
  confidenceSources,
  conversionLoop,
  disruptiveSignals,
  explorationTimeline,
  globalScoutingFeeds,
  opportunities,
  promptTemplates,
  relationshipSignals,
  verificationProtocol,
  type SourceCitation,
} from '@/lib/connected-platforms'

const getApiBase = () => {
  if (process.env.NEXT_PUBLIC_AURORA_API_URL) return process.env.NEXT_PUBLIC_AURORA_API_URL
  if (typeof window !== 'undefined' && !['127.0.0.1', 'localhost'].includes(window.location.hostname)) {
    return window.location.origin
  }
  return 'http://127.0.0.1:8000'
}

const scoreTone = (score: number) => {
  if (score >= 81) return 'border-red-400/50 bg-red-500/10 text-red-100'
  if (score >= 61) return 'border-amber-400/50 bg-amber-500/10 text-amber-100'
  if (score >= 31) return 'border-emerald-400/50 bg-emerald-500/10 text-emerald-100'
  return 'border-slate-400/40 bg-slate-500/10 text-slate-100'
}

function SourceList({ sources, compact = false }: { sources?: SourceCitation[]; compact?: boolean }) {
  if (!sources || sources.length === 0) {
    return <span className="text-xs text-zinc-500">no source attached</span>
  }
  return (
    <div className={`flex flex-wrap gap-1 ${compact ? '' : 'mt-2'}`}>
      {sources.map((source) => (
        <a
          key={`${source.publisher}-${source.url}`}
          href={source.url}
          target="_blank"
          rel="noreferrer noopener"
          title={`${source.publisher}${source.note ? ' — ' + source.note : ''}${source.confidence ? ' · ' + source.confidence + '% confidence' : ''}`}
          className="inline-flex items-center gap-1 rounded-md border border-cyan-400/30 bg-cyan-400/5 px-1.5 py-0.5 text-[11px] font-medium text-cyan-100 hover:border-cyan-300/60 hover:bg-cyan-400/15"
        >
          <ExternalLink className="h-3 w-3" />
          <span className="truncate max-w-[180px]">{source.publisher}</span>
          {source.jurisdiction ? <span className="text-zinc-500">/{source.jurisdiction}</span> : null}
        </a>
      ))}
    </div>
  )
}

export default function RadarPage() {
  const [backendStatus, setBackendStatus] = useState('checking')
  const [scanStatus, setScanStatus] = useState('idle')
  const [taskId, setTaskId] = useState<string | null>(null)
  const [liveCount, setLiveCount] = useState<number | null>(null)
  const criticalCount = opportunities.filter((item) => item.score >= 81).length
  const avgScore = Math.round(opportunities.reduce((sum, item) => sum + item.score, 0) / opportunities.length)

  useEffect(() => {
    let cancelled = false
    async function checkBackend() {
      try {
        const response = await fetch(`${getApiBase()}/api/aor/health`, { cache: 'no-store' })
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        if (!cancelled) setBackendStatus('online')
      } catch {
        if (!cancelled) setBackendStatus('offline')
      }
    }
    checkBackend()
    return () => {
      cancelled = true
    }
  }, [])

  async function runScan() {
    setScanStatus('starting')
    setTaskId(null)
    try {
      const response = await fetch(`${getApiBase()}/api/aor/scan/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ limit_per_source: 12, use_queue: true }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data?.detail || `HTTP ${response.status}`)
      setTaskId(data.task_id || null)
      setScanStatus(data.mode === 'queued' ? 'queued' : 'completed')
      if (Array.isArray(data.opportunities)) setLiveCount(data.opportunities.length)
    } catch {
      setScanStatus('queue unavailable')
    }
  }

  async function runSyncScan() {
    setScanStatus('running sync')
    setTaskId(null)
    try {
      const response = await fetch(`${getApiBase()}/api/aor/scan/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ limit_per_source: 8, use_queue: false }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data?.detail || `HTTP ${response.status}`)
      setScanStatus('completed')
      setLiveCount(Array.isArray(data.opportunities) ? data.opportunities.length : null)
    } catch {
      setScanStatus('scan failed')
    }
  }

  return (
    <main className="min-h-screen bg-[#050508] text-white">
      <section className="border-b border-copper/25 bg-[#090910]">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-md border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-cyan-100">
              <RadioTower className="h-4 w-4" />
              Aurora Opportunity Radar
            </div>
            <h1 className="text-3xl font-semibold leading-tight md:text-5xl">Live commercial intelligence for Aurora OSI.</h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-300 md:text-base">
              AOR intercepts financings, tenders, licensing rounds, procurement signals, acquisition intent, and exploration demand before they become crowded opportunities.
            </p>
            <Link href="/data-room-admin" className="mt-5 inline-flex rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm font-semibold text-zinc-200 hover:border-cyan-300/40 hover:text-cyan-100">
              Back to Admin
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-md border border-copper/25 bg-[#111119] p-4">
              <div className="text-2xl font-semibold text-copper-light">{opportunities.length}</div>
              <div className="mt-1 text-xs text-zinc-400">live signals</div>
            </div>
            <div className="rounded-md border border-red-400/30 bg-red-500/10 p-4">
              <div className="text-2xl font-semibold text-red-100">{criticalCount}</div>
              <div className="mt-1 text-xs text-zinc-400">critical</div>
            </div>
            <div className="rounded-md border border-emerald-400/30 bg-emerald-500/10 p-4">
              <div className="text-2xl font-semibold text-emerald-100">{avgScore}</div>
              <div className="mt-1 text-xs text-zinc-400">avg score</div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pt-6">
        <div className="mb-4 flex flex-wrap gap-2 text-sm">
          {[
            ['/radar/permits', 'Permits'],
            ['/radar/countries', 'Countries'],
            ['/radar/aois', 'AOIs'],
            ['/radar/scan-queue', 'Scan Queue'],
            ['/radar/reports-ready', 'Reports Ready'],
          ].map(([href, label]) => (
            <a key={href} href={href} className="rounded-md border border-white/10 bg-white/5 px-3 py-2 font-semibold text-zinc-200 hover:border-copper/40 hover:text-copper-light">
              {label}
            </a>
          ))}
        </div>
        <div className="grid gap-3 rounded-md border border-cyan-400/20 bg-[#071014] p-4 md:grid-cols-[1fr_auto] md:items-center">
          <div className="grid gap-3 md:grid-cols-4">
            <div>
              <div className="text-xs uppercase tracking-[0.14em] text-zinc-500">Backend</div>
              <div className={backendStatus === 'online' ? 'mt-1 font-semibold text-emerald-200' : 'mt-1 font-semibold text-amber-200'}>
                {backendStatus}
              </div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.14em] text-zinc-500">AOR queue</div>
              <div className="mt-1 font-semibold text-cyan-100">aor_polling</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.14em] text-zinc-500">Scan state</div>
              <div className="mt-1 font-semibold text-copper-light">{scanStatus}</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.14em] text-zinc-500">Task / live hits</div>
              <div className="mt-1 truncate font-semibold text-zinc-200">{taskId || (liveCount === null ? 'none' : `${liveCount} hits`)}</div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={runScan} className="inline-flex items-center gap-2 rounded-md border border-cyan-300/40 bg-cyan-300/10 px-3 py-2 text-sm font-semibold text-cyan-100">
              <RadioTower className="h-4 w-4" />
              Queue Scan
            </button>
            <button onClick={runSyncScan} className="inline-flex items-center gap-2 rounded-md border border-copper/40 bg-copper/15 px-3 py-2 text-sm font-semibold text-copper-light">
              <Zap className="h-4 w-4" />
              Scan Now
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-5 py-6 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-md border border-copper/20 bg-[#0b0b12]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-copper/20 px-4 py-4">
            <div>
              <h2 className="text-lg font-semibold">Live Opportunities</h2>
              <p className="mt-1 text-sm text-zinc-400">Ranked by funding, urgency, strategic trigger, and Aurora fit.</p>
            </div>
            <button className="inline-flex items-center gap-2 rounded-md border border-copper/40 bg-copper/15 px-3 py-2 text-sm font-semibold text-copper-light">
              <Zap className="h-4 w-4" />
              Capture Signal
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="border-b border-white/10 text-xs uppercase tracking-[0.12em] text-zinc-500">
                <tr>
                  <th className="px-4 py-3">Entity</th>
                  <th className="px-4 py-3">Trigger</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Score</th>
                  <th className="px-4 py-3">Aurora Fit</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {opportunities.map((item) => (
                  <tr key={`${item.company}-${item.country}`} className="align-top">
                    <td className="px-4 py-4">
                      <div className="font-medium text-white">{item.company}</div>
                      <div className="mt-1 text-xs text-zinc-400">{item.country} / {item.commodity}</div>
                      {item.triggerTag ? (
                        <span className="mt-2 inline-flex rounded-md border border-violet-400/30 bg-violet-400/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-violet-200">
                          {item.triggerTag}
                        </span>
                      ) : null}
                    </td>
                    <td className="max-w-[270px] px-4 py-4 text-zinc-300">
                      <div>{item.signal}</div>
                      <div className="mt-2"><SourceList sources={item.sources} compact /></div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-zinc-200">{item.category}</div>
                      <div className="mt-1 text-xs text-zinc-500">{item.source}</div>
                      {item.horizon ? (
                        <div className="mt-1 text-[10px] font-semibold uppercase text-emerald-200">{item.horizon}</div>
                      ) : null}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex min-w-16 justify-center rounded-md border px-2 py-1 font-semibold ${scoreTone(item.score)}`}>
                        {item.score}
                      </span>
                      <div className="mt-1 text-xs text-zinc-500">{item.urgency}</div>
                    </td>
                    <td className="max-w-[260px] px-4 py-4 text-zinc-300">{item.auroraFit}</td>
                    <td className="max-w-[220px] px-4 py-4 text-copper-light">{item.action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid gap-5">
          <div className="rounded-md border border-cyan-400/20 bg-[#0b1014] p-4">
            <div className="mb-4 flex items-center gap-2">
              <Activity className="h-5 w-5 text-cyan-200" />
              <h2 className="text-lg font-semibold">Commodity Heat</h2>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={commodityHeat} layout="vertical" margin={{ left: 18, right: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                  <XAxis type="number" domain={[0, 100]} tick={{ fill: '#a1a1aa', fontSize: 11 }} />
                  <YAxis dataKey="commodity" type="category" width={112} tick={{ fill: '#d4d4d8', fontSize: 11 }} />
                  <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ background: '#0a0a10', border: '1px solid rgba(201,132,74,0.3)' }} />
                  <Bar dataKey="heat" fill="#22d3ee" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-md border border-copper/20 bg-[#0b0b12] p-4">
            <div className="mb-4 flex items-center gap-2">
              <Target className="h-5 w-5 text-copper-light" />
              <h2 className="text-lg font-semibold">Score Bands</h2>
            </div>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={aorScoreBands} dataKey="value" nameKey="name" innerRadius={52} outerRadius={78} paddingAngle={3}>
                    {aorScoreBands.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#0a0a10', border: '1px solid rgba(201,132,74,0.3)' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs text-zinc-300">
              {aorScoreBands.map((band) => (
                <div key={band.name} className="rounded-md border border-white/10 px-2 py-2">
                  <span className="mr-2 inline-block h-2 w-2 rounded-full" style={{ background: band.color }} />
                  {band.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-5 pb-10 lg:grid-cols-4">
        {[
          { icon: Network, title: 'Entity Graph', text: 'Track executives, investors, ministries, advisors, recurring teams, and JV patterns.' },
          { icon: Map, title: 'Geo Layer', text: 'Group live opportunities by country, basin, belt, block, project, and commodity.' },
          { icon: Gauge, title: 'Signal Confidence', text: 'Weight filings and government portals above rumors, forums, and soft chatter.' },
          { icon: Clock, title: 'Why Now', text: 'Explain urgency from funding, permits, hiring, drilling, corporate action, and policy windows.' },
        ].map((item) => (
          <div key={item.title} className="rounded-md border border-white/10 bg-[#0b0b12] p-4">
            <item.icon className="mb-3 h-5 w-5 text-copper-light" />
            <h3 className="font-semibold">{item.title}</h3>
            <p className="mt-2 text-sm leading-6 text-zinc-400">{item.text}</p>
          </div>
        ))}
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-5 pb-10 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-md border border-cyan-400/20 bg-[#071014]">
          <div className="border-b border-cyan-400/20 px-4 py-4">
            <div className="flex items-center gap-2">
              <Network className="h-5 w-5 text-cyan-200" />
              <h2 className="text-lg font-semibold">Relationship Intelligence</h2>
            </div>
            <p className="mt-1 text-sm text-zinc-400">The beginning of the entity graph: who is connected to which trigger, asset, or sovereign window.</p>
          </div>
          <div className="divide-y divide-white/10">
            {relationshipSignals.map((signal) => (
              <div key={`${signal.entity}-${signal.target}`} className="grid gap-2 p-4 md:grid-cols-[1fr_auto] md:items-start">
                <div className="text-sm text-zinc-300">
                  <span className="font-semibold text-white">{signal.entity}</span>
                  <span className="text-zinc-500"> {signal.relation} </span>
                  <span className="text-copper-light">{signal.target}</span>
                  <SourceList sources={signal.sources} />
                </div>
                <div className="rounded-md border border-cyan-300/30 bg-cyan-300/10 px-2 py-1 text-xs font-semibold text-cyan-100">
                  {signal.confidence}% confidence
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-md border border-copper/20 bg-[#0b0b12]">
          <div className="border-b border-copper/20 px-4 py-4">
            <div className="flex items-center gap-2">
              <Gauge className="h-5 w-5 text-copper-light" />
              <h2 className="text-lg font-semibold">Source Confidence</h2>
            </div>
          </div>
          <div className="grid gap-3 p-4">
            {confidenceSources.map((source) => (
              <div key={source.source}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium">{source.source}</span>
                  <span className="text-zinc-400">{source.className} / {source.confidence}%</span>
                </div>
                <div className="h-2 rounded bg-white/10">
                  <div className="h-2 rounded bg-copper-light" style={{ width: `${source.confidence}%` }} />
                </div>
                {source.examples && source.examples.length > 0 ? (
                  <SourceList sources={source.examples} />
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-5 pb-10 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-md border border-emerald-400/20 bg-[#07110e]">
          <div className="border-b border-emerald-400/20 px-4 py-4">
            <div className="flex items-center gap-2">
              <History className="h-5 w-5 text-emerald-200" />
              <h2 className="text-lg font-semibold">Exploration Timeline</h2>
            </div>
          </div>
          <div className="divide-y divide-white/10">
            {explorationTimeline.map((event) => (
              <div key={`${event.stage}-${event.entity}`} className="grid gap-2 p-4 md:grid-cols-[120px_1fr_90px]">
                <div className="text-sm font-semibold text-emerald-100">{event.stage}</div>
                <div>
                  <div className="text-sm font-medium">{event.entity}</div>
                  <div className="mt-1 text-sm text-zinc-400">{event.evidence}</div>
                  <SourceList sources={event.sources} />
                </div>
                <div className="text-sm text-copper-light">{event.timing}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-md border border-cyan-400/20 bg-[#081014] p-4">
          <div className="mb-4 flex items-center gap-2">
            <Target className="h-5 w-5 text-cyan-200" />
            <h2 className="text-lg font-semibold">Opportunity-to-Scan Conversion</h2>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={conversionLoop}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="step" tick={{ fill: '#d4d4d8', fontSize: 11 }} />
                <YAxis tick={{ fill: '#a1a1aa', fontSize: 11 }} />
                <Tooltip contentStyle={{ background: '#0a0a10', border: '1px solid rgba(201,132,74,0.3)' }} />
                <Bar dataKey="count" fill="#22d3ee" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-12">
        <div className="rounded-md border border-emerald-400/20 bg-[#07110e]">
          <div className="border-b border-emerald-400/20 px-4 py-4">
            <h2 className="text-lg font-semibold">Prompt Workspace</h2>
            <p className="mt-1 text-sm text-zinc-400">Reusable analyst workflows for manual interception before full source automation.</p>
          </div>
          <div className="grid gap-3 p-4 md:grid-cols-2 lg:grid-cols-4">
            {promptTemplates.map((template) => (
              <div key={template.name} className="rounded-md border border-white/10 bg-black/20 p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h3 className="text-sm font-semibold">{template.name}</h3>
                  <Send className="h-4 w-4 text-emerald-200" />
                </div>
                <p className="text-sm leading-6 text-zinc-400">{template.focus}</p>
                <div className="mt-3 text-xs font-semibold uppercase tracking-[0.12em] text-emerald-200">{template.cadence}</div>
                <SourceList sources={template.sources} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DISRUPTIVE SIGNAL ENGINE */}
      <section className="mx-auto max-w-7xl px-5 pb-12">
        <div className="rounded-md border border-fuchsia-400/25 bg-[#100a14]">
          <div className="border-b border-fuchsia-400/20 px-4 py-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-fuchsia-200" />
              <h2 className="text-lg font-semibold">Disruptive Opportunity Engine</h2>
            </div>
            <p className="mt-1 text-sm text-zinc-400">Asymmetric global shocks — every signal is footnoted with a verifiable source so analysts and clients can audit the basis of any claim.</p>
          </div>
          <div className="grid gap-3 p-4 md:grid-cols-2">
            {disruptiveSignals.map((signal) => (
              <div key={signal.theme} className="rounded-md border border-white/10 bg-black/30 p-4">
                <div className="mb-2 flex items-start justify-between gap-3">
                  <h3 className="text-sm font-semibold text-white">{signal.theme}</h3>
                  <span className="rounded-md border border-fuchsia-400/30 bg-fuchsia-400/10 px-2 py-1 text-[10px] font-semibold uppercase text-fuchsia-100">
                    {signal.category}
                  </span>
                </div>
                <div className="text-xs uppercase tracking-wider text-zinc-500">Trigger</div>
                <p className="text-sm text-zinc-300">{signal.trigger}</p>
                <div className="mt-2 text-xs uppercase tracking-wider text-zinc-500">Why it matters</div>
                <p className="text-sm leading-6 text-zinc-400">{signal.whyItMatters}</p>
                <div className="mt-3 flex items-center justify-between">
                  <div className="text-xs text-zinc-500">Asymmetry score</div>
                  <span className="rounded-md border border-amber-400/40 bg-amber-400/10 px-2 py-0.5 text-xs font-semibold text-amber-100">{signal.asymmetryScore}</span>
                </div>
                <SourceList sources={signal.sources} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ADAPTIVE TRIGGER LAYER */}
      <section className="mx-auto max-w-7xl px-5 pb-12">
        <div className="rounded-md border border-emerald-400/20 bg-[#07110e]">
          <div className="border-b border-emerald-400/20 px-4 py-4">
            <div className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-emerald-200" />
              <h2 className="text-lg font-semibold">Adaptive Trigger Layer</h2>
            </div>
            <p className="mt-1 text-sm text-zinc-400">Conditions under which the radar self-rebalances — battery chemistry, sanctions deltas, sovereign capital rotation, drilling cycles, distress regimes, carbon-border policy.</p>
          </div>
          <div className="grid gap-3 p-4 md:grid-cols-2">
            {adaptiveTriggers.map((trigger) => (
              <div key={trigger.name} className="rounded-md border border-white/10 bg-black/30 p-4">
                <h3 className="text-sm font-semibold text-white">{trigger.name}</h3>
                <div className="mt-2 text-xs uppercase tracking-wider text-zinc-500">Condition</div>
                <p className="text-sm text-zinc-300">{trigger.condition}</p>
                <div className="mt-2 text-xs uppercase tracking-wider text-zinc-500">Reweights</div>
                <p className="text-sm leading-6 text-zinc-400">{trigger.reweights}</p>
                <SourceList sources={trigger.sources} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GLOBAL SCOUTING FEEDS */}
      <section className="mx-auto max-w-7xl px-5 pb-12">
        <div className="rounded-md border border-cyan-400/20 bg-[#071014]">
          <div className="border-b border-cyan-400/20 px-4 py-4">
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-cyan-200" />
              <h2 className="text-lg font-semibold">Global Scouting Feeds</h2>
            </div>
            <p className="mt-1 text-sm text-zinc-400">The verifiable source registry behind every AOR finding — multilateral, exchange filings, mining cadastres, petroleum commissions, sanction lists, news wires, satellite open data. Click any feed to verify.</p>
          </div>
          <div className="grid gap-2 p-4 md:grid-cols-2 xl:grid-cols-3">
            {globalScoutingFeeds.map((feed) => (
              <a
                key={`${feed.region}-${feed.feed}`}
                href={feed.url}
                target="_blank"
                rel="noreferrer noopener"
                className="flex items-center justify-between gap-2 rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm text-zinc-200 hover:border-cyan-300/50 hover:bg-cyan-400/5"
              >
                <div className="flex flex-col">
                  <span className="font-medium">{feed.feed}</span>
                  <span className="text-[11px] uppercase tracking-wider text-zinc-500">{feed.region} · {feed.className.replace(/_/g, ' ')}</span>
                </div>
                <ExternalLink className="h-4 w-4 text-cyan-200" />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* VERIFICATION PROTOCOL */}
      <section className="mx-auto max-w-7xl px-5 pb-16">
        <div className="rounded-md border border-amber-400/20 bg-[#0f0c08]">
          <div className="border-b border-amber-400/20 px-4 py-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-amber-200" />
              <h2 className="text-lg font-semibold">Verification Protocol</h2>
            </div>
            <p className="mt-1 text-sm text-zinc-400">Every claim shipped through Aurora OSI must satisfy these checks before it leaves the radar.</p>
          </div>
          <ol className="grid gap-2 p-4 md:grid-cols-2">
            {verificationProtocol.map((step, idx) => (
              <li key={step.step} className="flex gap-3 rounded-md border border-white/10 bg-black/30 p-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-amber-400/40 bg-amber-400/10 text-xs font-semibold text-amber-100">{idx + 1}</span>
                <div>
                  <div className="text-sm font-semibold text-white">{step.step}</div>
                  <p className="mt-1 text-sm leading-6 text-zinc-400">{step.requirement}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </main>
  )
}
