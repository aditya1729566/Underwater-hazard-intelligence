import { ChevronDown, RotateCcw, SlidersHorizontal } from 'lucide-react'
import { debrisClasses, priorityLevels, type DebrisClass, type MapFiltersState, type Priority } from '../types'

interface MapFiltersProps {
  filters: MapFiltersState
  open: boolean
  onOpenChange: (open: boolean) => void
  onChange: (filters: MapFiltersState) => void
  onReset: () => void
}

const symbols: Record<DebrisClass, string> = {
  'Ghost Net': 'GN', Pipe: 'PI', Shipwreck: 'SW', Cylinder: 'CY', 'Other Debris': 'OD',
}

export function MapFilters({ filters, open, onOpenChange, onChange, onReset }: MapFiltersProps) {
  const toggleClass = (classification: DebrisClass) => {
    const classes = filters.classes.includes(classification)
      ? filters.classes.filter((item) => item !== classification)
      : [...filters.classes, classification]
    onChange({ ...filters, classes })
  }

  const togglePriority = (priority: Priority) => {
    const priorities = filters.priorities.includes(priority)
      ? filters.priorities.filter((item) => item !== priority)
      : [...filters.priorities, priority]
    onChange({ ...filters, priorities })
  }

  return (
    <aside className={`ss-filters ${open ? 'is-open' : ''}`} aria-label="Map filters">
      <button className="ss-filters__mobile-trigger" type="button" onClick={() => onOpenChange(!open)} aria-expanded={open}>
        <SlidersHorizontal size={17} aria-hidden="true" /> Filters
        <ChevronDown size={16} aria-hidden="true" />
      </button>
      <div className="ss-filters__body">
        <div className="ss-panel-heading">
          <span><SlidersHorizontal size={16} aria-hidden="true" />Filter detections</span>
          <button type="button" className="ss-text-button" onClick={onReset} title="Reset all filters">
            <RotateCcw size={14} aria-hidden="true" /> Reset
          </button>
        </div>

        <fieldset>
          <legend>Object class</legend>
          {debrisClasses.map((classification) => (
            <label className="ss-check-row" key={classification}>
              <input type="checkbox" checked={filters.classes.includes(classification)} onChange={() => toggleClass(classification)} />
              <span className="ss-class-symbol" aria-hidden="true">{symbols[classification]}</span>
              <span>{classification}</span>
            </label>
          ))}
        </fieldset>

        <fieldset>
          <legend>Priority</legend>
          <div className="ss-priority-grid">
            {priorityLevels.map((priority) => (
              <label className={`ss-priority-check is-${priority.toLowerCase()}`} key={priority}>
                <input type="checkbox" checked={filters.priorities.includes(priority)} onChange={() => togglePriority(priority)} />
                <span className="ss-priority-shape" aria-hidden="true" />
                {priority}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <div className="ss-range-label">
            <legend>Minimum confidence</legend>
            <output htmlFor="confidence-filter">{filters.minimumConfidence}%</output>
          </div>
          <input
            id="confidence-filter"
            className="ss-range"
            type="range"
            min="0"
            max="100"
            step="1"
            value={filters.minimumConfidence}
            onChange={(event) => onChange({ ...filters, minimumConfidence: Number(event.target.value) })}
          />
          <div className="ss-range-ticks" aria-hidden="true"><span>0</span><span>50</span><span>100</span></div>
        </fieldset>
      </div>
    </aside>
  )
}
