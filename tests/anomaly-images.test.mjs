import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { categories } from '../src/dashboard/data.ts'
import { anomalyImages } from '../src/dashboard/anomalyImages.ts'

test('each detection category has a bundled JPEG and source attribution', () => {
  assert.deepEqual(Object.keys(anomalyImages).sort(), categories.map(item => item.name).sort())
  for (const image of Object.values(anomalyImages)) {
    const bytes = readFileSync(new URL(`../public${image.src}`, import.meta.url))
    assert.equal(bytes.readUInt16BE(0), 0xffd8, image.src)
    assert.ok(bytes.length > 1000 && bytes.length < 250000, image.src)
    assert.ok(image.alt.length > 30)
    assert.ok(image.caption && image.credit)
    assert.equal(new URL(image.source).protocol, 'https:')
    assert.ok(image.width > 0 && image.height > 0)
  }
})

test('map workspace link is removed and detection details render the image component', () => {
  const code = readFileSync(new URL('../src/dashboard/Dashboard.tsx', import.meta.url), 'utf8')
  assert.ok(!code.includes('Intelligence workspace'))
  assert.ok(code.includes('<AnomalyImage key={detection.id} type={detection.type}/>'))
})
