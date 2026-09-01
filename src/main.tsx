import { lazy, StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/space-grotesk'
import '@fontsource/ibm-plex-mono/400.css'
import '@fontsource/ibm-plex-mono/500.css'
import '@fontsource/ibm-plex-mono/600.css'
import './styles.css'
const isIntelligenceMap = window.location.pathname.replace(/\/$/, '') === '/intelligence-map'
const App = lazy(() => import('./App'))
const IntelligenceMapPage = lazy(() => import('./features/intelligence-map/IntelligenceMapPage'))

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Suspense fallback={<div className="route-loading">Loading interface…</div>}>
      {isIntelligenceMap ? <IntelligenceMapPage /> : <App />}
    </Suspense>
  </StrictMode>,
)
