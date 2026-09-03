import { useState } from 'react'
import { anomalyImages } from './anomalyImages'
import type { DebrisType } from './data'

export function AnomalyImage({ type }: { type: DebrisType }) {
  const reference = anomalyImages[type]
  const [failed, setFailed] = useState(false)

  return <figure className="ds-anomaly-photo">
    <div className="ds-anomaly-photo-label">Anomaly reference image</div>
    {failed ? <div className="ds-anomaly-photo-fallback" role="status">Image unavailable. View the original using the credit link below.</div> :
      <img src={reference.src} alt={reference.alt} width={reference.width} height={reference.height} decoding="async" onError={() => setFailed(true)}/>}
    <figcaption>
      <strong>{reference.caption}</strong>
      <span>Illustrative reference only — not a capture from this detection.</span>
      <a href={reference.source} target="_blank" rel="noopener noreferrer">Photo: {reference.credit} · View source ↗</a>
    </figcaption>
  </figure>
}
