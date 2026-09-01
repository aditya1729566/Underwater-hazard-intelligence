import { ChevronDown, Layers3 } from 'lucide-react'
import { useState } from 'react'

export function MapLegend() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside className={`ss-legend ${collapsed ? 'is-collapsed' : ''}`} aria-label="Map legend">
      <button type="button" onClick={() => setCollapsed((value) => !value)} aria-expanded={!collapsed}>
        <span><Layers3 size={15} aria-hidden="true" />Legend</span>
        <ChevronDown size={15} aria-hidden="true" />
      </button>
      <div className="ss-legend__body">
        <span><i className="ss-dot is-high" />High priority</span>
        <span><i className="ss-dot is-medium" />Medium priority</span>
        <span><i className="ss-dot is-low" />Low priority</span>
        <small>Marker weight indicates priority</small>
      </div>
    </aside>
  )
}
