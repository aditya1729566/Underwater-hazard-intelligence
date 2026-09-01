import type { Feature, FeatureCollection, LineString, Point } from 'geojson'
import type { Detection, Survey, SurveySummaryData } from '../types'

const classSymbols: Record<Detection['classification'], string> = {
  'Ghost Net': 'GN',
  Pipe: 'PI',
  Shipwreck: 'SW',
  Cylinder: 'CY',
  'Other Debris': 'OD',
}

export type DetectionFeatureProperties = {
  id: string
  classification: Detection['classification']
  priority: Detection['priority']
  confidence: number
  classSymbol: string
}

export function detectionsToGeoJSON(
  detections: Detection[],
): FeatureCollection<Point, DetectionFeatureProperties> {
  return {
    type: 'FeatureCollection',
    features: detections.map((detection) => ({
      type: 'Feature',
      id: detection.id,
      geometry: { type: 'Point', coordinates: detection.coordinates },
      properties: {
        id: detection.id,
        classification: detection.classification,
        priority: detection.priority,
        confidence: detection.confidence,
        classSymbol: classSymbols[detection.classification],
      },
    })),
  }
}

export function surveyTrackToGeoJSON(survey: Survey): Feature<LineString> {
  return {
    type: 'Feature',
    properties: { surveyId: survey.id },
    geometry: { type: 'LineString', coordinates: survey.trackCoordinates },
  }
}

export function getSurveySummary(detections: Detection[]): SurveySummaryData {
  const totalConfidence = detections.reduce((sum, detection) => sum + detection.confidence, 0)
  return {
    totalDetections: detections.length,
    highPriorityCount: detections.filter((detection) => detection.priority === 'HIGH').length,
    averageConfidence: detections.length ? Math.round(totalConfidence / detections.length) : 0,
  }
}

export function getSurveyBounds(survey: Survey, detections: Detection[]) {
  const points = [...survey.trackCoordinates, ...detections.map((detection) => detection.coordinates)]
  return points.reduce(
    (bounds, [longitude, latitude]) => ({
      west: Math.min(bounds.west, longitude),
      south: Math.min(bounds.south, latitude),
      east: Math.max(bounds.east, longitude),
      north: Math.max(bounds.north, latitude),
    }),
    { west: Infinity, south: Infinity, east: -Infinity, north: -Infinity },
  )
}
