import { useEffect, useRef } from 'react'
import { categories, type DetectionRecord } from './data'

export function Sparkline({ color, variant = 0 }: { color: string; variant?: number }) {
  const paths = [
    'M1 26 Q10 30 17 25 T30 27 T44 26 T56 18 T70 12 T85 8 T101 9 T117 13 T132 21 T148 26 T163 24 T180 26',
    'M1 26 Q15 26 21 21 T35 19 T48 25 T63 24 T79 20 T94 17 T111 19 T127 15 T143 18 T160 21 T180 20',
    'M1 27 Q12 32 23 27 T40 27 T58 25 T76 16 T95 14 T112 17 T130 21 T147 15 T164 16 T180 19',
    'M1 28 Q12 27 22 23 T39 25 T56 27 T74 28 T88 17 T104 16 T120 18 T137 22 T153 25 T168 25 T180 26',
  ]
  return <svg className="ds-spark" viewBox="0 0 181 38" aria-hidden="true"><path d={paths[variant % paths.length]} fill="none" stroke={color} strokeWidth="2" /></svg>
}

export function TypeChart({ items }: { items: DetectionRecord[] }) {
  let offset = 0
  const total = items.length
  return <div className="ds-type-chart"><div className="ds-donut"><svg viewBox="0 0 180 180" role="img" aria-label={`Detection types, ${total} total`}>
    {[categories[1], categories[0], categories[3], categories[2], categories[4]].map(category => {
      const amount = items.filter(item => item.type === category.name).length
      const fraction = total ? amount / total : 0
      const start = offset; offset += fraction * 100
      return <circle key={category.name} cx="90" cy="90" r="66" fill="none" stroke={category.color} strokeWidth="31" pathLength="100" strokeDasharray={`${fraction * 100} ${100 - fraction * 100}`} strokeDashoffset={-start} transform="rotate(-90 90 90)"><title>{category.name}: {amount}</title></circle>
    })}
  </svg><span><strong>{total}</strong><small>Total</small></span></div><ul>{categories.map(category => {
    const count = items.filter(item => item.type === category.name).length
    return <li key={category.name}><i style={{ background: category.color }} /><span>{category.name}</span><b>{count} ({total ? Math.round(count / total * 100) : 0}%)</b></li>
  })}</ul></div>
}

export function TimelineChart({ compact = false }: { compact?: boolean }) {
  const values = [40, 32, 53, 65, 28, 42, 57]
  return <svg className={`ds-timeline ${compact ? 'is-large' : ''}`} viewBox="0 0 430 204" role="img" aria-label="Detections over time: May 15, 40; May 16, 32; May 17, 53; May 18, 65; May 19, 28; May 20, 42; May 21, 57.">
    {[0, 20, 40, 60, 80].map(n => <g key={n}><line x1="33" x2="418" y1={169 - n * 1.85} y2={169 - n * 1.85} stroke="#17232e" strokeWidth=".7"/><text x="4" y={173 - n * 1.85}>{n}</text></g>)}
    <path d="M33 18V169H418" fill="none" stroke="#617181" strokeWidth=".7" />
    <polyline points={values.map((n, i) => `${36 + i * 62},${169 - n * 1.85}`).join(' ')} fill="none" stroke="#5c85ee" strokeWidth="1.8" />
    {values.map((n, i) => <g key={i}><circle cx={36 + i * 62} cy={169 - n * 1.85} r="5.5" fill="#345ccd" opacity=".38"/><circle cx={36 + i * 62} cy={169 - n * 1.85} r="2.8" fill="#e3efff" stroke="#7d9eff"><title>May {15 + i}: {n} detections</title></circle><text x={36 + i * 62} y="191" textAnchor="middle">May {15 + i}</text></g>)}
  </svg>
}

export function ConfidenceChart({ items }: { items: DetectionRecord[] }) {
  const bins = Array.from({ length: 10 }, (_, index) => items.filter(item => item.confidence >= index * 10 && (index === 9 ? item.confidence <= 100 : item.confidence < (index + 1) * 10)).length)
  const maximum = Math.max(60, ...bins)
  return <svg className="ds-confidence" viewBox="0 0 370 186" role="img" aria-label="Detection confidence distribution in ten percentage bands">
    <defs><linearGradient id="confidence-bars" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#7dc9a4"/><stop offset="1" stopColor="#5f9f77"/></linearGradient></defs>
    {[0, 20, 40, 60].map(n => <g key={n}><line x1="41" x2="354" y1={143 - n / maximum * 122} y2={143 - n / maximum * 122} stroke="#1c2a33" strokeWidth=".7"/><text x="24" y={147 - n / maximum * 122} textAnchor="end">{n}</text></g>)}
    <text transform="translate(10 93) rotate(-90)" textAnchor="middle">Detections</text>
    {bins.map((value, i) => <rect key={i} x={43 + i * 31} y={143 - value / maximum * 122} width="20" height={Math.max(1, value / maximum * 122)} rx="1" fill="url(#confidence-bars)"><title>{i * 10}–{(i + 1) * 10}%: {value} detections</title></rect>)}
    <path d="M40 18V144H355" fill="none" stroke="#53606d" strokeWidth=".6"/>
    {[0, 20, 40, 60, 80, 100].map((n, i) => <text key={n} x={43 + i * 62} y="162" textAnchor="middle">{n}</text>)}<text x="199" y="182" textAnchor="middle">Confidence (%)</text>
  </svg>
}

export function AnomalyPreview() {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const context = ref.current?.getContext('2d')
    if (!context) return
    const width = 560, height = 240
    const pixels = context.createImageData(width, height)
    let seed = 1742
    const rand = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296 }
    for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
      const p = (y * width + x) * 4
      if (x < 278) {
        const distance = Math.abs(x - 139)
        let signal = distance < 13 ? 3 : (0.18 + rand() ** 3 * .8) * (70 + 125 * Math.exp(-distance / 55))
        const object = Math.exp(-((x - 72) ** 2 / 150 + (y - 157) ** 2 / 690))
        signal += object * rand() * 150
        pixels.data[p] = signal * .96; pixels.data[p + 1] = signal; pixels.data[p + 2] = signal * .99
      } else {
        const fx = x - 278
        let heat = 0
        for (const [cx, cy, scale] of [[98, 127, 1], [56, 156, .6], [133, 106, .8], [153, 163, .4]]) heat += scale * Math.exp(-((fx - cx) ** 2 / 240 + (y - cy) ** 2 / 190))
        heat = Math.min(1, heat + Math.max(0, Math.sin(fx / 8) * Math.cos(y / 11)) * .08 + rand() * .07)
        const rgb = heat < .25 ? [0, heat * 130, 80 + heat * 540] : heat < .5 ? [0, (heat - .25) * 1020, 220] : heat < .75 ? [(heat - .5) * 1020, 230, 200 - (heat - .5) * 800] : [255, 220 - (heat - .75) * 780, 0]
        pixels.data[p] = rgb[0]; pixels.data[p + 1] = rgb[1]; pixels.data[p + 2] = rgb[2]
      }
      pixels.data[p + 3] = 255
    }
    context.putImageData(pixels, 0, 0)
  }, [])
  return <div className="ds-anomaly"><canvas ref={ref} width="560" height="240" role="img" aria-label="Mock side-scan sonar intensity on the left and VAE anomaly heatmap on the right"/><div className="ds-heat-legend"><span>Low</span><i/><span>High</span></div></div>
}
