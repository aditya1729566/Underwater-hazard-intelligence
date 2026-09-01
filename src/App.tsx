import {
  Activity,
  AlertTriangle,
  Anchor,
  AreaChart,
  Bell,
  Box,
  Check,
  ChevronDown,
  CircleDot,
  Clock3,
  Download,
  Eye,
  EyeOff,
  FileText,
  Gauge,
  Layers3,
  LocateFixed,
  Map,
  MapPinned,
  Menu,
  Pause,
  Play,
  Radio,
  RotateCcw,
  Search,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Target,
  Waves,
  X,
} from 'lucide-react'
import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import type { Detection } from './SonarScene'

const SonarScene = lazy(() => import('./SonarScene'))

const detections: Detection[] = [
  { id: 'DET-0184', name: 'Tangled monofilament net', kind: 'Ghost net', confidence: 94, priority: 'Critical', depth: 42.3, distance: 23.6, ping: 4218, shadow: 96, segmentation: 89, anomaly: 91, position: [-1.8, -0.35, 1.5] },
  { id: 'DET-0189', name: 'Linear utility structure', kind: 'Pipe / cable', confidence: 91, priority: 'High', depth: 46.1, distance: 41.2, ping: 4261, shadow: 93, segmentation: 92, anomaly: 68, position: [2.6, -0.55, -1.6] },
  { id: 'DET-0193', name: 'Angular metallic return', kind: 'Metal debris', confidence: 78, priority: 'Review', depth: 38.7, distance: 18.7, ping: 4297, shadow: 71, segmentation: 84, anomaly: 88, position: [1.1, -0.52, 2.8] },
  { id: 'DET-0201', name: 'Partially buried hull form', kind: 'Possible wreck', confidence: 88, priority: 'High', depth: 51.4, distance: 57.9, ping: 4338, shadow: 90, segmentation: 86, anomaly: 79, position: [-3.2, -0.48, -0.8] },
]

const navigation = [
  { label: 'Mission desk', icon: Gauge },
  { label: 'Sonar volume', icon: Waves },
  { label: 'Detections', icon: Target, count: 12 },
  { label: 'Survey map', icon: Map },
  { label: 'Evidence lab', icon: Layers3 },
  { label: 'Reports', icon: FileText },
]

function Panel({ title, action, className = '', children }: { title: string; action?: React.ReactNode; className?: string; children: React.ReactNode }) {
  return (
    <section className={`panel ${className}`}>
      <header className="panel-header">
        <div><span className="panel-kicker">SonarSense interface</span><h2>{title}</h2></div>
        {action}
      </header>
      {children}
    </section>
  )
}

function Metric({ icon: Icon, label, value, note, tone = 'cyan' }: { icon: typeof Activity; label: string; value: string; note: string; tone?: string }) {
  return (
    <div className="metric">
      <span className={`metric-icon ${tone}`}><Icon size={16} aria-hidden="true" /></span>
      <span><small>{label}</small><strong>{value}</strong></span>
      <em>{note}</em>
    </div>
  )
}

function App() {
  const [selectedId, setSelectedId] = useState(detections[0].id)
  const [activeNav, setActiveNav] = useState('Mission desk')
  const [showMask, setShowMask] = useState(true)
  const [showShadow, setShowShadow] = useState(true)
  const [scanning, setScanning] = useState(true)
  const [mobileNav, setMobileNav] = useState(false)
  const [priority, setPriority] = useState('All priorities')
  const [reviewed, setReviewed] = useState<string[]>([])
  const [toast, setToast] = useState('')
  const selected = useMemo(() => detections.find((item) => item.id === selectedId) ?? detections[0], [selectedId])

  useEffect(() => {
    document.title = 'SonarSense | SIH26057 Sonar Intelligence'
    document.body.style.overflow = mobileNav ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileNav])

  function review(action: 'Confirmed' | 'Rejected' | 'Deferred') {
    setReviewed((current) => current.includes(selected.id) ? current : [...current, selected.id])
    setToast(`${selected.id} ${action.toLowerCase()}. Evidence record updated locally.`)
    window.setTimeout(() => setToast(''), 3200)
  }

  const visibleDetections = priority === 'All priorities' ? detections : detections.filter((item) => item.priority === priority)

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">Skip to mission workspace</a>
      <aside className={`sidebar ${mobileNav ? 'open' : ''}`} aria-label="Primary navigation">
        <div className="brand">
          <div className="brand-mark" aria-hidden="true"><Anchor size={23} /><span /></div>
          <div><strong>SONARSENSE</strong><small>SIH26057 · SONAR INTELLIGENCE</small></div>
          <button className="icon-button sidebar-close" aria-label="Close navigation" onClick={() => setMobileNav(false)}><X size={20} /></button>
        </div>
        <nav>
          {navigation.map(({ label, icon: Icon, count }) => (
            <button key={label} className={activeNav === label ? 'active' : ''} aria-current={activeNav === label ? 'page' : undefined} onClick={() => { setActiveNav(label); setMobileNav(false) }}>
              <Icon size={18} aria-hidden="true" /><span>{label}</span>{count ? <b>{count}</b> : null}
            </button>
          ))}
          <a className="intelligence-map-link" href="/intelligence-map" onClick={() => setMobileNav(false)}>
            <MapPinned size={18} aria-hidden="true" />
            <span>Intelligence Map</span>
            <b>OPEN</b>
          </a>
        </nav>
        <div className="mission-card">
          <div className="mission-orbit"><Radio size={18} /><span /></div>
          <p>Active survey</p><h3>Andaman Shelf / 04</h3>
          <dl><div><dt>Track</dt><dd>SSS-26-014</dd></div><div><dt>Processed</dt><dd>68.4%</dd></div><div><dt>Elapsed</dt><dd>02:34:18</dd></div></dl>
          <button><Pause size={15} aria-hidden="true" /> Pause mission</button>
        </div>
        <button className="settings-link"><Settings size={18} aria-hidden="true" /> Settings</button>
      </aside>

      <div className="workspace">
        <header className="topbar">
          <button className="icon-button menu-button" aria-label="Open navigation" aria-expanded={mobileNav} onClick={() => setMobileNav(true)}><Menu size={21} /></button>
          <div className="mission-title"><span>Live operation</span><strong>Andaman Shelf Survey</strong></div>
          <div className="telemetry" aria-label="Live mission telemetry">
            <Metric icon={Activity} label="System" value="ONLINE" note="healthy" tone="green" />
            <Metric icon={Radio} label="Ping rate" value="24.8 Hz" note="600 kHz" />
            <Metric icon={LocateFixed} label="Depth" value="42.3 m" note="± 0.4" />
            <Metric icon={Gauge} label="AUV speed" value="2.3 m/s" note="steady" tone="amber" />
          </div>
          <div className="top-actions">
            <button className="icon-button notification" aria-label="Open alerts, 3 unread"><Bell size={19} /><b>3</b></button>
            <div className="operator"><span>AA</span><div><strong>Aditya</strong><small>Operator</small></div></div>
          </div>
        </header>

        <main id="main-content" tabIndex={-1}>
          <div className="main-intro">
            <div><p>Mission desk / live evidence</p><h1>Underwater hazard intelligence</h1></div>
            <div className="intro-actions">
              <span className="live-chip"><i /> SENSOR FEED LIVE</span>
              <button className="secondary-button"><Download size={16} /> Export report</button>
            </div>
          </div>

          <div className="dashboard-grid">
            <Panel
              title="3D acoustic evidence chamber"
              className="sonar-panel"
              action={<div className="scene-actions">
                <button className={showMask ? 'pressed' : ''} aria-pressed={showMask} onClick={() => setShowMask(!showMask)}><Box size={15} /> Masks</button>
                <button className={showShadow ? 'pressed' : ''} aria-pressed={showShadow} onClick={() => setShowShadow(!showShadow)}>{showShadow ? <Eye size={15} /> : <EyeOff size={15} />} Shadows</button>
                <button aria-pressed={!scanning} onClick={() => setScanning(!scanning)}>{scanning ? <Pause size={15} /> : <Play size={15} />}{scanning ? 'Pause scan' : 'Resume scan'}</button>
              </div>}
            >
              <div className="sonar-canvas"><Suspense fallback={<div className="scene-loading"><Waves size={22} /><span>Initializing acoustic volume</span></div>}><SonarScene detections={detections} selectedId={selectedId} onSelect={setSelectedId} showMask={showMask} showShadow={showShadow} scanning={scanning} /></Suspense>
                <div className="canvas-guidance"><RotateCcw size={14} /> Drag to orbit · scroll to inspect depth</div>
                <div className="depth-scale"><span>36 m</span><i /><span>54 m</span></div>
                <div className="sonar-legend"><span><i className="critical" />Critical</span><span><i className="high" />High</span><span><i className="review" />Review</span></div>
              </div>
            </Panel>

            <Panel title="Ranked detection queue" className="queue-panel" action={<button className="text-button">View all 12</button>}>
              <div className="queue-summary"><span><b>4</b> visible</span><span><b>2</b> high action</span><span><b>1</b> pending</span></div>
              <div className="detection-list">
                {visibleDetections.map((item) => (
                  <button key={item.id} className={`detection-row ${selectedId === item.id ? 'selected' : ''}`} onClick={() => setSelectedId(item.id)}>
                    <span className={`priority-mark ${item.priority.toLowerCase()}`} />
                    <span className="detection-icon"><CircleDot size={18} /></span>
                    <span className="detection-copy"><strong>{item.kind}</strong><small>{item.name}</small><em>{item.id} · {item.distance} m away</em></span>
                    <span className="confidence"><b>{item.confidence}%</b><small>{reviewed.includes(item.id) ? 'Reviewed' : item.priority}</small></span>
                  </button>
                ))}
              </div>
            </Panel>

            <Panel title="Evidence breakdown" className="evidence-panel" action={<span className={`priority-badge ${selected.priority.toLowerCase()}`}><AlertTriangle size={13} /> {selected.priority}</span>}>
              <div className="evidence-heading"><div><p>{selected.id}</p><h3>{selected.name}</h3><span>{selected.kind} · Ping {selected.ping}</span></div><strong>{selected.confidence}<small>% fused</small></strong></div>
              <div className="evidence-bars">
                {[['Detector confidence', selected.confidence], ['Segmentation quality', selected.segmentation], ['Shadow consistency', selected.shadow], ['Anomaly evidence', selected.anomaly]].map(([label, value]) => (
                  <div key={label as string}><span><b>{label}</b><em>{value}%</em></span><div className="bar"><i style={{ width: `${value}%` }} /></div></div>
                ))}
              </div>
              <div className="physics-note"><ShieldCheck size={20} /><span><b>Physics check passed</b>Reflection and acoustic-shadow alignment are consistent with an elevated man-made object.</span></div>
              <div className="review-actions"><button className="reject" onClick={() => review('Rejected')}><X size={16} /> Reject</button><button onClick={() => review('Deferred')}><Clock3 size={16} /> Defer</button><button className="confirm" onClick={() => review('Confirmed')}><Check size={16} /> Confirm hazard</button></div>
            </Panel>

            <Panel title="Survey track & field context" className="map-panel" action={<button className="icon-button" aria-label="Map layer options"><Layers3 size={17} /></button>}>
              <div className="map-visual" role="img" aria-label="Stylized survey route map with four detected hazard markers">
                <div className="bathymetry b1" /><div className="bathymetry b2" /><div className="bathymetry b3" />
                <svg viewBox="0 0 420 180" aria-hidden="true"><path d="M24 142 C70 127,82 94,125 112 S185 87,220 98 S276 58,315 71 S360 34,400 49" /><circle cx="125" cy="112" r="6" /><circle cx="220" cy="98" r="6" /><circle cx="315" cy="71" r="8" /><circle cx="400" cy="49" r="6" /></svg>
                <span className="auv-marker"><Anchor size={14} /> AUV-01</span><span className="map-scale">250 m</span>
              </div>
              <div className="map-meta"><div><small>Coordinates</small><b>11.6942° N · 92.7541° E</b></div><div><small>Estimated depth</small><b>{selected.depth} m</b></div><button aria-label="Center map on selected detection"><LocateFixed size={18} /></button></div>
            </Panel>

            <Panel title="Mission throughput" className="progress-panel" action={<span className="mono-label">LAST 90 MIN</span>}>
              <div className="progress-layout"><div className="progress-ring" style={{ '--progress': '68deg' } as React.CSSProperties}><strong>68<small>%</small></strong><span>processed</span></div>
                <div className="progress-stats"><div><span>Survey strip</span><b>18.73 / 27.4 km</b></div><div><span>Tiles analyzed</span><b>4,218</b></div><div><span>Est. completion</span><b>01:12:34</b></div></div>
                <svg className="sparkline" viewBox="0 0 240 92" role="img" aria-label="Analysis throughput rose steadily from 31 to 68 percent over 90 minutes"><defs><linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#38e8e0" stopOpacity=".38"/><stop offset="1" stopColor="#38e8e0" stopOpacity="0"/></linearGradient></defs><path className="area" d="M3 83 L3 72 L28 67 L54 57 L80 60 L106 45 L132 40 L158 29 L184 25 L210 13 L237 8 L237 83 Z"/><path className="line" d="M3 72 L28 67 L54 57 L80 60 L106 45 L132 40 L158 29 L184 25 L210 13 L237 8"/>{[3,28,54,80,106,132,158,184,210,237].map((x,i)=><circle key={x} cx={x} cy={[72,67,57,60,45,40,29,25,13,8][i]} r="2.4" />)}</svg>
              </div>
            </Panel>
          </div>

          <div className="filter-bar" aria-label="Detection filters">
            <span><SlidersHorizontal size={16} /> Filters</span>
            <label><span>Priority</span><select value={priority} onChange={(event) => setPriority(event.target.value)}><option>All priorities</option><option>Critical</option><option>High</option><option>Review</option></select><ChevronDown size={14} /></label>
            <label><span>Confidence</span><select><option>30% and above</option><option>70% and above</option><option>90% and above</option></select><ChevronDown size={14} /></label>
            <label className="search"><Search size={16} /><input aria-label="Search detections" placeholder="Search ID or class" /></label>
          </div>
        </main>
      </div>
      {mobileNav && <button className="sidebar-scrim" aria-label="Close navigation" onClick={() => setMobileNav(false)} />}
      {toast && <div className="toast" role="status"><Check size={17} />{toast}</div>}
    </div>
  )
}

export default App
