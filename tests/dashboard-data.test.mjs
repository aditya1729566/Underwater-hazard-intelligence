import test from 'node:test'
import assert from 'node:assert/strict'
import { detections, missions, categories, detectionCsv, formatTime, surveyTrack } from '../src/dashboard/data.ts'

test('reference summary matches the mock detection inventory', () => {
  assert.equal(detections.length, 243)
  assert.equal(detections.filter(item => item.priority === 'High').length, 38)
  assert.equal(detections.reduce((sum, item) => sum + item.confidence, 0) / detections.length, 78)
  for (const category of categories) assert.equal(detections.filter(item => item.type === category.name).length, category.count)
})
test('every observation has a unique identity, valid timestamp, and bounded fields', () => {
  assert.equal(new Set(detections.map(item => item.id)).size, detections.length)
  for (const item of detections) {
    assert.ok(Number.isFinite(Date.parse(item.timestamp)))
    assert.ok(item.confidence >= 0 && item.confidence <= 100)
    assert.ok(item.depth > 0 && item.depth < 100)
    assert.ok(item.latitude >= 18 && item.latitude <= 19)
    assert.ok(item.longitude >= 72 && item.longitude <= 73)
    assert.doesNotThrow(() => formatTime(item.timestamp))
    assert.ok(missions.some(mission => mission.id === item.mission))
  }
})
test('missions and CSV export are complete', () => {
  assert.equal(missions.length, 7)
  assert.equal(Math.round(missions.reduce((sum, item) => sum + item.area, 0)), 125)
  const csv = detectionCsv(detections)
  assert.equal(csv.length, 244)
  assert.ok(csv.every(row => row.length === 9))
  assert.equal(surveyTrack.length, 25)
})
