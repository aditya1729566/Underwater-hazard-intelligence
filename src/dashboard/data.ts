export const categories = [
  { name: 'Pipe', color: '#4c80df', count: 78 },
  { name: 'Ghost Net', color: '#5daa72', count: 65 },
  { name: 'Shipwreck', color: '#e6635b', count: 48 },
  { name: 'Cylinder', color: '#ecac48', count: 28 },
  { name: 'Other Debris', color: '#8862c6', count: 24 },
] as const
export type DebrisType = typeof categories[number]['name']
export type Priority = 'High' | 'Medium' | 'Low'
export interface DetectionRecord {
  id: number; type: DebrisType; confidence: number; depth: number
  latitude: number; longitude: number; timestamp: string; priority: Priority; mission: string
}
const firstTypes: DebrisType[] = ['Pipe', 'Ghost Net', 'Shipwreck', 'Cylinder', 'Pipe']
const remainingTypes = categories.flatMap(category => Array.from({ length: category.count - firstTypes.filter(type => type === category.name).length }, () => category.name))
const orderedTypes = [...firstTypes, ...remainingTypes]
const confidenceSamples = [4, 5, 6, 8, 11, 16, 24, 35, 54, 80].flatMap((count, bin) => Array(count).fill(bin * 10 + 8) as number[])
export const surveyTrack: [number, number][] = [
  [72.65, 18.63], [72.62, 18.59], [72.57, 18.55], [72.52, 18.49], [72.47, 18.43],
  [72.45, 18.38], [72.44, 18.32], [72.44, 18.27], [72.47, 18.24], [72.53, 18.23],
  [72.59, 18.21], [72.62, 18.17], [72.60, 18.12], [72.54, 18.10], [72.48, 18.09],
  [72.40, 18.08], [72.34, 18.10], [72.33, 18.16], [72.35, 18.22], [72.37, 18.28],
  [72.38, 18.34], [72.39, 18.40], [72.40, 18.46], [72.43, 18.52], [72.48, 18.56],
]
function coordinateAt(index: number): [number, number] {
  const progress = index / 242 * (surveyTrack.length - 1)
  const start = Math.floor(progress), end = Math.min(start + 1, surveyTrack.length - 1), ratio = progress - start
  return [0, 1].map(axis => Number((surveyTrack[start][axis] + (surveyTrack[end][axis] - surveyTrack[start][axis]) * ratio).toFixed(4))) as [number, number]
}
export const detections: DetectionRecord[] = orderedTypes.map((type, i) => ({
  id: 10245 - i, type, confidence: i < 5 ? [78, 65, 82, 71, 67][i] : confidenceSamples[(i * 71) % 243],
  depth: i < 5 ? [42.6, 38.1, 55.3, 41.0, 39.2][i] : Number((31 + (i * 7.3) % 38).toFixed(1)),
  latitude: i < 5 ? [18.2345, 18.2351, 18.2338, 18.2320, 18.2305][i] : coordinateAt(i)[1],
  longitude: i < 5 ? [72.3456, 72.3472, 72.3441, 72.3410, 72.3398][i] : coordinateAt(i)[0],
  timestamp: i < 5 ? `2025-05-21T14:${String([32, 28, 21, 15, 8][i]).padStart(2, '0')}:00` : `2025-05-${21 - (i % 7)}T${String(8 + (i % 9)).padStart(2, '0')}:${String((i * 7) % 60).padStart(2, '0')}:00`,
  priority: i === 0 || i === 2 || (i >= 5 && i < 41) ? 'High' : i < 5 || i % 3 ? 'Medium' : 'Low',
  mission: `M-2025-${String(51 - (i % 7)).padStart(3, '0')}`,
}))
// Keep the deterministic demonstration dataset aligned with the reference summary.
let adjustment = 78 * detections.length - detections.reduce((sum, item) => sum + item.confidence, 0)
for (let i = 5; adjustment !== 0 && i < detections.length; i += 1) {
  const delta = Math.max(0 - detections[i].confidence, Math.min(98 - detections[i].confidence, adjustment))
  detections[i].confidence += delta
  adjustment -= delta
}
export const missions = [
  { id: 'M-2025-051', date: 'May 21, 2025', area: 22.4, pings: 124532, quality: 93, status: 'Completed', name: 'Northern coastal transect' },
  { id: 'M-2025-050', date: 'May 20, 2025', area: 18.7, pings: 98721, quality: 91, status: 'Completed', name: 'Shelf debris assessment' },
  { id: 'M-2025-049', date: 'May 19, 2025', area: 21.3, pings: 110345, quality: 89, status: 'Completed', name: 'Southern survey corridor' },
  { id: 'M-2025-048', date: 'May 18, 2025', area: 16.2, pings: 86531, quality: 95, status: 'Completed', name: 'Harbour approach scan' },
  { id: 'M-2025-047', date: 'May 17, 2025', area: 14.5, pings: 78214, quality: 92, status: 'Completed', name: 'Offshore pipeline survey' },
  { id: 'M-2025-046', date: 'May 16, 2025', area: 17.8, pings: 94621, quality: 94, status: 'Completed', name: 'Central seabed mapping' },
  { id: 'M-2025-045', date: 'May 15, 2025', area: 14.1, pings: 75430, quality: 90, status: 'Completed', name: 'Western boundary scan' },
]
export const formatTime = (value: string) => new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date(value)).replace(',', '')
export const colorForType = (type: string) => categories.find(category => category.name === type)?.color ?? '#4c80df'
export function downloadCsv(filename: string, rows: (string | number)[][]) {
  const csv = rows.map(row => row.map(value => `"${String(value).replace(/"/g, '""')}"`).join(',')).join('\r\n')
  const link = document.createElement('a')
  link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }))
  link.download = filename
  link.click()
  window.setTimeout(() => URL.revokeObjectURL(link.href), 1000)
}
export const detectionCsv = (items: DetectionRecord[]) => [
  ['ID', 'Type', 'Confidence (%)', 'Depth (m)', 'Latitude', 'Longitude', 'Timestamp', 'Priority', 'Mission'],
  ...items.map(item => [item.id, item.type, item.confidence, item.depth, item.latitude, item.longitude, item.timestamp, item.priority, item.mission]),
]
