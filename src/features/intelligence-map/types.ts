export const debrisClasses = ['Ghost Net', 'Pipe', 'Shipwreck', 'Cylinder', 'Other Debris'] as const
export const priorityLevels = ['HIGH', 'MEDIUM', 'LOW'] as const

export type DebrisClass = (typeof debrisClasses)[number]
export type Priority = (typeof priorityLevels)[number]
export type Coordinates = [longitude: number, latitude: number]

export interface Survey {
  id: string
  name: string
  platform: string
  status: 'Completed'
  region: string
  startedAt: string
  completedAt: string
  trackCoordinates: Coordinates[]
}

export interface DetectionDimensions {
  length: number
  width: number
  height: number
}

export interface Detection {
  id: string
  surveyId: string
  classification: DebrisClass
  priority: Priority
  confidence: number
  dimensions: DetectionDimensions
  pingId: string
  timestamp: string
  depth: number
  coordinates: Coordinates
}

export interface MapFiltersState {
  classes: DebrisClass[]
  priorities: Priority[]
  minimumConfidence: number
}

export interface SurveySummaryData {
  totalDetections: number
  highPriorityCount: number
  averageConfidence: number
}
