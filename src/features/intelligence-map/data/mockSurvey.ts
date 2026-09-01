import type { Coordinates, Survey } from '../types'

function createLawnmowerTrack(): Coordinates[] {
  const points: Coordinates[] = []
  const west = 72.665
  const east = 72.79
  const north = 18.83
  const rowGap = 0.013

  for (let row = 0; row < 8; row += 1) {
    const latitude = north - row * rowGap
    const leftToRight = row % 2 === 0
    for (let point = 0; point < 8; point += 1) {
      const progress = point / 7
      const longitude = leftToRight
        ? west + (east - west) * progress
        : east - (east - west) * progress
      points.push([Number(longitude.toFixed(6)), Number(latitude.toFixed(6))])
    }

    if (row < 7) {
      points.push([leftToRight ? east : west, Number((latitude - rowGap).toFixed(6))])
    }
  }

  return points
}

export const mockSurvey: Survey = {
  id: 'SURVEY-SS-2026-014',
  name: 'Arabian Sea Coastal Survey',
  platform: 'AUV-04',
  status: 'Completed',
  region: 'Mumbai offshore sector, Arabian Sea',
  startedAt: '2026-08-27T05:40:00.000Z',
  completedAt: '2026-08-27T09:18:00.000Z',
  trackCoordinates: createLawnmowerTrack(),
}
