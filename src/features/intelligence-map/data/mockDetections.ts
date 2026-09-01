import type { DebrisClass, Detection, Priority } from '../types'
import { mockSurvey } from './mockSurvey'

type DetectionSeed = [
  trackIndex: number,
  classification: DebrisClass,
  priority: Priority,
  confidence: number,
  depth: number,
  dimensions: [number, number, number],
  offset: [number, number],
]

const seeds: DetectionSeed[] = [
  [3, 'Ghost Net', 'HIGH', 96, 41.8, [18.4, 7.2, 1.3], [0.0018, -0.0012]],
  [7, 'Pipe', 'MEDIUM', 86, 44.2, [7.8, 0.7, 0.7], [-0.0012, 0.0015]],
  [11, 'Cylinder', 'LOW', 71, 46.7, [1.9, 0.8, 0.8], [0.0014, -0.0011]],
  [15, 'Shipwreck', 'HIGH', 94, 49.1, [21.3, 8.4, 4.1], [-0.0018, 0.001]],
  [18, 'Other Debris', 'LOW', 67, 45.6, [2.6, 1.8, 1.1], [0.0011, 0.0017]],
  [22, 'Ghost Net', 'MEDIUM', 84, 52.4, [12.7, 6.1, 0.9], [-0.0015, -0.0013]],
  [26, 'Pipe', 'HIGH', 92, 54.8, [11.4, 0.9, 0.9], [0.0019, 0.0012]],
  [29, 'Cylinder', 'MEDIUM', 81, 56.2, [2.8, 1.2, 1.2], [-0.001, -0.0016]],
  [33, 'Shipwreck', 'MEDIUM', 88, 58.7, [14.8, 5.7, 3.3], [0.0016, 0.0014]],
  [37, 'Other Debris', 'LOW', 64, 55.3, [3.4, 2.2, 1.4], [-0.0014, 0.0011]],
  [40, 'Ghost Net', 'HIGH', 95, 51.9, [16.1, 8.8, 1.6], [0.0015, -0.0015]],
  [44, 'Pipe', 'MEDIUM', 83, 48.5, [9.2, 0.6, 0.6], [-0.0019, 0.0013]],
  [48, 'Cylinder', 'LOW', 73, 47.1, [1.6, 0.7, 0.7], [0.0013, 0.0016]],
  [51, 'Shipwreck', 'HIGH', 91, 43.9, [19.6, 7.9, 4.5], [-0.0016, -0.0014]],
  [55, 'Other Debris', 'MEDIUM', 79, 42.6, [5.1, 2.9, 1.8], [0.0012, 0.001]],
  [59, 'Ghost Net', 'LOW', 69, 39.8, [9.8, 4.3, 0.8], [-0.0012, -0.0017]],
  [62, 'Pipe', 'MEDIUM', 82, 38.1, [6.7, 0.5, 0.5], [0.0017, 0.0011]],
  [65, 'Cylinder', 'HIGH', 90, 36.4, [3.2, 1.4, 1.4], [-0.0015, 0.0014]],
  [68, 'Shipwreck', 'LOW', 74, 34.7, [10.6, 4.2, 2.7], [0.0012, -0.0013]],
  [70, 'Other Debris', 'MEDIUM', 77, 33.5, [4.3, 2.1, 1.2], [-0.0014, 0.001]],
]

export const mockDetections: Detection[] = seeds.map((seed, index) => {
  const [trackIndex, classification, priority, confidence, depth, dimensions, offset] = seed
  const trackPoint = mockSurvey.trackCoordinates[trackIndex]
  const timestamp = new Date(Date.parse(mockSurvey.startedAt) + (index + 1) * 9.4 * 60_000)

  return {
    id: `DET-${String(index + 1).padStart(3, '0')}`,
    surveyId: mockSurvey.id,
    classification,
    priority,
    confidence,
    dimensions: { length: dimensions[0], width: dimensions[1], height: dimensions[2] },
    pingId: `PING-${String(4218 + index * 37).padStart(6, '0')}`,
    timestamp: timestamp.toISOString(),
    depth,
    coordinates: [
      Number((trackPoint[0] + offset[0]).toFixed(6)),
      Number((trackPoint[1] + offset[1]).toFixed(6)),
    ],
  }
})
