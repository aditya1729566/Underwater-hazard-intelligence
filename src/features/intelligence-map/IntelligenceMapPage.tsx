import { useEffect, useMemo, useRef, useState } from 'react'
import { Anchor, Crosshair, MapPinned, RadioTower, X } from 'lucide-react'
import 'maplibre-gl/dist/maplibre-gl.css'
import './intelligence-map.css'
import { mockSurvey } from './data/mockSurvey'
import { mockDetections } from './data/mockDetections'
import { debrisClasses, priorityLevels, type Detection, type MapFiltersState } from './types'
import { getSurveySummary } from './services/mapDataAdapter'
import { SurveySummary } from './components/SurveySummary'
import { MapFilters } from './components/MapFilters'
import { DetectionDetails } from './components/DetectionDetails'
import { MarineIntelligenceMap, type MarineIntelligenceMapHandle } from './components/MarineIntelligenceMap'

const defaultFilters: MapFiltersState = {
  classes: [...debrisClasses],
  priorities: [...priorityLevels],
  minimumConfidence: 0,
}

export default function IntelligenceMapPage() {
  const [filters, setFilters] = useState<MapFiltersState>(defaultFilters)
  const [selectedDetection, setSelectedDetection] = useState<Detection | null>(null)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const mapRef = useRef<MarineIntelligenceMapHandle>(null)
  const summary = useMemo(() => getSurveySummary(mockDetections), [])
  const filteredDetections = useMemo(() => mockDetections.filter((detection) =>
    filters.classes.includes(detection.classification)
    && filters.priorities.includes(detection.priority)
    && detection.confidence >= filters.minimumConfidence,
  ), [filters])

  useEffect(() => {
    document.title = 'Marine Debris Intelligence Map · SonarSense'
  }, [])

  useEffect(() => {
    if (selectedDetection && !filteredDetections.some((item) => item.id === selectedDetection.id)) {
      setSelectedDetection(null)
    }
  }, [filteredDetections, selectedDetection])

  return (
    <div className="ss-app">
      <a className="ss-skip-link" href="#intelligence-map">Skip to intelligence map</a>
      <header className="ss-topbar">
        <a className="ss-brand" href="/intelligence-map" aria-label="SonarSense intelligence map home">
          <span className="ss-brand__mark" aria-hidden="true"><Anchor size={20} /></span>
          <span><strong>SonarSense</strong><small>Marine intelligence</small></span>
        </a>
        <div className="ss-topbar__context">
          <span className="ss-live-dot" aria-hidden="true" />
          <span>Intelligence Map</span>
          <span className="ss-topbar__divider" />
          <span>{mockSurvey.region}</span>
        </div>
        <nav aria-label="Page utilities">
          <div className="ss-operator"><span>SS</span><div><strong>Survey team</strong><small>Analyst view</small></div></div>
        </nav>
      </header>

      <main id="intelligence-map" className="ss-main">
        <SurveySummary survey={mockSurvey} summary={summary} />
        <div className="ss-workspace">
          <MarineIntelligenceMap
            ref={mapRef}
            survey={mockSurvey}
            detections={filteredDetections}
            allDetections={mockDetections}
            onSelect={setSelectedDetection}
          />
          <MapFilters
            filters={filters}
            open={filtersOpen}
            onOpenChange={setFiltersOpen}
            onChange={setFilters}
            onReset={() => setFilters(defaultFilters)}
          />
          <button type="button" className="ss-fit-button" onClick={() => mapRef.current?.fitSurvey()}>
            <Crosshair size={16} /> Fit Survey
          </button>
          {filteredDetections.length === 0 && (
            <div className="ss-empty" role="status">
              <RadioTower size={22} aria-hidden="true" />
              <strong>No detections match these filters</strong>
              <span>The survey track remains visible. Reset or broaden the filters to restore detections.</span>
              <button type="button" onClick={() => setFilters(defaultFilters)}>Reset filters</button>
            </div>
          )}
          <DetectionDetails detection={selectedDetection} onClose={() => setSelectedDetection(null)} />
          {selectedDetection && <button className="ss-details-scrim" onClick={() => setSelectedDetection(null)} aria-label="Close detection details"><X /></button>}
        </div>
      </main>
      <footer className="ss-statusbar">
        <span><MapPinned size={14} /> WGS 84</span>
        <span>Coastal survey extent</span>
        <span>{filteredDetections.length} of {mockDetections.length} detections visible</span>
      </footer>
    </div>
  )
}
