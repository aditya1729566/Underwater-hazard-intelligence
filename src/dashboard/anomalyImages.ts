import type { DebrisType } from './data'

export interface AnomalyImage {
  src: string
  alt: string
  caption: string
  credit: string
  source: string
  width: number
  height: number
}

// Category-level reference photographs, never captures from the mock survey.
// Reuse terms and original asset URLs: public/images/anomalies/CREDITS.md.
export const anomalyImages: Record<DebrisType, AnomalyImage> = {
  Pipe: {
    src: '/images/anomalies/pipe.jpg',
    alt: 'Corroded hawse pipe among the submerged remains of Norvana',
    caption: 'Hawse pipe at the bow of Norvana',
    credit: 'Hoyt / NOAA',
    source: 'https://monitor.noaa.gov/shipwrecks/norvana.html',
    width: 598, height: 350,
  },
  'Ghost Net': {
    src: '/images/anomalies/ghost-net.jpg',
    alt: 'A diver beside a large mass of abandoned fishing net at Pearl and Hermes Atoll',
    caption: 'Derelict fishing net at Pearl and Hermes Atoll',
    credit: 'NOAA · Wikimedia Commons',
    source: 'https://commons.wikimedia.org/wiki/File:Pearl_and_Hermes_Atoll_-_Monster_net.jpg',
    width: 600, height: 448,
  },
  Shipwreck: {
    src: '/images/anomalies/shipwreck.jpg',
    alt: 'ROV approaching the corroded hull of the SS Bloody Marsh shipwreck',
    caption: 'SS Bloody Marsh wreck, Windows to the Deep 2021',
    credit: 'NOAA Ocean Exploration, Windows to the Deep 2021',
    source: 'https://oceanexplorer.noaa.gov/news/bloody-marsh/',
    width: 800, height: 450,
  },
  Cylinder: {
    src: '/images/anomalies/cylinder.jpg',
    alt: 'Metal tanks behind broken wooden hull planking on a submerged shipwreck',
    caption: 'Metal tank reference from the Bear wreck survey',
    credit: 'NOAA / MITech',
    source: 'https://oceanexplorer.noaa.gov/multimedia/explorations-21bear-features-photolog-media-planking/',
    width: 768, height: 620,
  },
  'Other Debris': {
    src: '/images/anomalies/other-debris.jpg',
    alt: 'Discarded green glass bottle on the seabed with a fish swimming above it',
    caption: 'Glass bottle at Titov Seamount',
    credit: 'NOAA Ocean Exploration, Discovering the Deep: Exploring Remote Pacific MPAs',
    source: 'https://oceanexplorer.noaa.gov/multimedia/daily-image-media-20210221/',
    width: 768, height: 432,
  },
}
