import { useEffect, useRef, useState } from 'react'
import maplibregl, { type GeoJSONSource, type Map as LibreMap } from 'maplibre-gl'
import { Crosshair, Layers, Minus, Plus } from 'lucide-react'
import 'maplibre-gl/dist/maplibre-gl.css'
import { surveyTrack as route, type DetectionRecord } from './data'

export function DetectionMap({ items, onSelect, full = false }: { items: DetectionRecord[]; onSelect: (item: DetectionRecord) => void; full?: boolean }) {
  const container = useRef<HTMLDivElement>(null)
  const mapRef = useRef<LibreMap | null>(null)
  const callback = useRef(onSelect)
  const dataRef = useRef(items)
  const [ready, setReady] = useState(false)
  const [style, setStyle] = useState('Map')
  const [showTrack, setShowTrack] = useState(true)
  const [failed, setFailed] = useState(false)
  callback.current = onSelect; dataRef.current = items
  const geoJSON = (records: DetectionRecord[]): GeoJSON.FeatureCollection => ({
    type: 'FeatureCollection', features: records.filter(record => full || (10245 - record.id) % 4 === 0).map(record => {
      const coordinates = [record.longitude, record.latitude]
      return { type: 'Feature', geometry: { type: 'Point', coordinates }, properties: { id: record.id, confidence: record.confidence, emphasized: (10245 - record.id) % 12 === 0 } }
    }),
  })
  const fit = () => mapRef.current?.fitBounds([[72.21, 18.00], [72.85, 18.72]], { padding: 35, duration: 500 })
  useEffect(() => {
    if (!container.current) return
    let map: LibreMap
    try {
      map = new maplibregl.Map({ container: container.current, center: [72.53, 18.35], zoom: 8.8, attributionControl: false, style: {
        version: 8, sources: {
          imagery: { type: 'raster', tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'], tileSize: 256, attribution: 'Imagery © Esri & contributors' },
          labels: { type: 'raster', tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}'], tileSize: 256 },
        }, layers: [
          { id: 'imagery', type: 'raster', source: 'imagery', paint: { 'raster-saturation': -.15, 'raster-brightness-max': .77 } },
          { id: 'labels', type: 'raster', source: 'labels', paint: { 'raster-opacity': .8 } },
        ],
      } })
    } catch { setFailed(true); return }
    mapRef.current = map
    map.on('load', () => {
      map.addSource('route', { type: 'geojson', data: { type: 'Feature', geometry: { type: 'LineString', coordinates: route }, properties: {} } })
      map.addLayer({ id: 'route', source: 'route', type: 'line', paint: { 'line-color': '#5f99e6', 'line-width': 1.8, 'line-dasharray': [2, 2] } })
      map.addSource('points', { type: 'geojson', data: geoJSON(dataRef.current) })
      map.addLayer({ id: 'points', source: 'points', type: 'circle', paint: {
        'circle-radius': ['case', ['get', 'emphasized'], 6.5, 3.4],
        'circle-color': ['step', ['get', 'confidence'], '#bf586a', 20, '#dd663c', 40, '#e5a942', 60, '#219ad0', 80, '#4eaf6b'],
        'circle-stroke-color': '#b0d2d2', 'circle-stroke-width': 1, 'circle-stroke-opacity': .5,
      } })
      map.addLayer({ id: 'point-centers', source: 'points', type: 'circle', paint: { 'circle-radius': 1.1, 'circle-color': '#d6f1fb' } })
      map.on('click', 'points', event => {
        const record = dataRef.current.find(item => item.id === event.features?.[0].properties.id)
        if (record) callback.current(record)
      })
      map.on('mouseenter', 'points', () => { map.getCanvas().style.cursor = 'pointer' })
      map.on('mouseleave', 'points', () => { map.getCanvas().style.cursor = '' })
      map.addControl(new maplibregl.ScaleControl({ maxWidth: 62, unit: 'metric' }), 'bottom-left')
      map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-right')
      setReady(true); fit()
    })
    const resize = new ResizeObserver(() => map.resize())
    resize.observe(container.current)
    return () => { resize.disconnect(); map.remove(); mapRef.current = null; setReady(false) }
  }, [])
  useEffect(() => { if (ready) (mapRef.current?.getSource('points') as GeoJSONSource)?.setData(geoJSON(items)) }, [items, ready])
  const toggleStyle = (next: string) => { setStyle(next); if (ready) mapRef.current?.setPaintProperty('labels', 'raster-opacity', next === 'Map' ? .8 : 0) }
  const toggleTrack = () => { if (ready) mapRef.current?.setLayoutProperty('route', 'visibility', showTrack ? 'none' : 'visible'); setShowTrack(!showTrack) }
  return <div className={`ds-map ${full ? 'ds-map-full' : ''}`}>
    <div className="ds-map-mount" ref={container} role="region" aria-label="Interactive mock detection map" />
    {failed && <div className="ds-map-unavailable">WebGL is unavailable. Detection coordinates are available in the Detections view.</div>}
    <div className="ds-map-tabs">{['Map', 'Satellite'].map(label => <button key={label} className={style === label ? 'selected' : ''} onClick={() => toggleStyle(label)} aria-pressed={style === label}>{label}</button>)}</div>
    <div className="ds-map-zoom"><button aria-label="Zoom in" title="Zoom in" onClick={() => mapRef.current?.zoomIn()}><Plus size={19}/></button><button aria-label="Zoom out" title="Zoom out" onClick={() => mapRef.current?.zoomOut()}><Minus size={19}/></button></div>
    <button className="ds-map-layer" title="Toggle survey track" aria-label="Toggle survey track" aria-pressed={showTrack} onClick={toggleTrack}><Layers size={19}/></button>
    {full && <button className="ds-map-fit" onClick={fit}><Crosshair size={15}/> Fit survey</button>}
    <div className="ds-map-key"><strong>Confidence</strong>{[['#4eaf6b', '80–100%'], ['#219ad0', '60–80%'], ['#e5a942', '40–60%'], ['#dd663c', '20–40%'], ['#bf586a', '0–20%']].map(([color, label]) => <span key={label}><i style={{ background: color }}/>{label}</span>)}</div>
  </div>
}
