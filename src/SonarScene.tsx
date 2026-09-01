import { Line, OrbitControls } from '@react-three/drei'
import { Canvas, ThreeEvent, useFrame } from '@react-three/fiber'
import { Component, ReactNode, useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'

export type Detection = {
  id: string
  name: string
  kind: string
  confidence: number
  priority: 'Critical' | 'High' | 'Review'
  depth: number
  distance: number
  ping: number
  shadow: number
  segmentation: number
  anomaly: number
  position: [number, number, number]
}

type SonarSceneProps = {
  detections: Detection[]
  selectedId: string
  onSelect: (id: string) => void
  showMask: boolean
  showShadow: boolean
  scanning: boolean
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])
  return reduced
}

function Seafloor() {
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(18, 12, 70, 48)
    const pos = geo.attributes.position
    for (let i = 0; i < pos.count; i += 1) {
      const x = pos.getX(i)
      const y = pos.getY(i)
      const ridge = Math.sin(x * 1.35) * 0.18 + Math.cos(y * 1.8) * 0.12
      const trench = -0.72 * Math.exp(-Math.pow(x * 0.46, 2))
      pos.setZ(i, ridge + trench + Math.sin((x + y) * 2.8) * 0.035)
    }
    geo.computeVertexNormals()
    return geo
  }, [])

  return (
    <group rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.25, 0]}>
      <mesh geometry={geometry} receiveShadow>
        <meshStandardMaterial color="#092838" roughness={0.96} metalness={0.04} />
      </mesh>
      <mesh geometry={geometry} position={[0, 0, 0.014]}>
        <meshBasicMaterial color="#226878" wireframe transparent opacity={0.22} />
      </mesh>
    </group>
  )
}

function DetectionObject({
  detection,
  selected,
  showMask,
  showShadow,
  onSelect,
}: {
  detection: Detection
  selected: boolean
  showMask: boolean
  showShadow: boolean
  onSelect: (id: string) => void
}) {
  const [hovered, setHovered] = useState(false)
  const color = detection.priority === 'Critical' ? '#ff626b' : detection.priority === 'High' ? '#ffb84d' : '#38e8e0'
  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation()
    onSelect(detection.id)
  }

  return (
    <group position={detection.position}>
      <mesh
        castShadow
        scale={selected || hovered ? 1.14 : 1}
        onClick={handleClick}
        onPointerEnter={(event) => {
          event.stopPropagation()
          setHovered(true)
          document.body.style.cursor = 'pointer'
        }}
        onPointerLeave={() => {
          setHovered(false)
          document.body.style.cursor = 'default'
        }}
      >
        {detection.kind === 'Pipe / cable' ? (
          <cylinderGeometry args={[0.18, 0.18, 1.9, 18]} />
        ) : detection.kind === 'Ghost net' ? (
          <torusKnotGeometry args={[0.44, 0.1, 64, 8, 2, 3]} />
        ) : (
          <dodecahedronGeometry args={[0.48, 0]} />
        )}
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={selected ? 1.05 : 0.35} roughness={0.42} />
      </mesh>
      {showMask && (
        <mesh scale={1.32}>
          <sphereGeometry args={[0.62, 18, 12]} />
          <meshBasicMaterial color={color} wireframe transparent opacity={selected ? 0.55 : 0.24} />
        </mesh>
      )}
      {showShadow && (
        <mesh rotation={[-Math.PI / 2, 0, 0.18]} position={[0.72, -1.18, 0.34]} scale={[1.5, 0.38, 1]}>
          <circleGeometry args={[0.62, 32]} />
          <meshBasicMaterial color="#01070b" transparent opacity={0.58} depthWrite={false} />
        </mesh>
      )}
      <Line points={[[-0.66, -0.66, 0], [0.66, -0.66, 0], [0.66, 0.66, 0], [-0.66, 0.66, 0], [-0.66, -0.66, 0]]} color={color} lineWidth={selected ? 2.1 : 1} transparent opacity={selected ? 0.95 : 0.42} />
    </group>
  )
}

function AcousticScan({ active, reduced }: { active: boolean; reduced: boolean }) {
  const scan = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    if (!scan.current || !active || reduced) return
    scan.current.position.x = ((clock.elapsedTime * 2.3) % 16) - 8
  })

  return (
    <group>
      <mesh ref={scan} position={[-5, 0.4, 0]}>
        <planeGeometry args={[0.035, 8]} />
        <meshBasicMaterial color="#42fff1" transparent opacity={active ? 0.72 : 0.12} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh position={[-5.9, 2.1, 0]} rotation={[0, 0, -0.18]}>
        <coneGeometry args={[0.28, 1.25, 14]} />
        <meshStandardMaterial color="#d5eced" metalness={0.75} roughness={0.28} />
      </mesh>
      <Line points={[[ -5.5, 1.7, 0], [2.5, -1.1, 3.2]]} color="#38e8e0" transparent opacity={0.24} />
      <Line points={[[ -5.5, 1.7, 0], [2.5, -1.1, -3.2]]} color="#38e8e0" transparent opacity={0.24} />
    </group>
  )
}

function Scene({ detections, selectedId, onSelect, showMask, showShadow, scanning }: SonarSceneProps) {
  const reduced = useReducedMotion()
  return (
    <>
      <color attach="background" args={['#061019']} />
      <fog attach="fog" args={['#061019', 9, 20]} />
      <ambientLight intensity={0.45} color="#70b8c0" />
      <directionalLight position={[-4, 7, 4]} intensity={2.3} color="#d5fdff" castShadow />
      <pointLight position={[3, 1, 1]} intensity={8} color="#ffae3d" distance={8} />
      <Seafloor />
      <gridHelper args={[18, 18, '#1f6773', '#103543']} position={[0, -1.21, 0]} />
      <AcousticScan active={scanning} reduced={reduced} />
      {detections.map((detection) => (
        <DetectionObject
          key={detection.id}
          detection={detection}
          selected={detection.id === selectedId}
          showMask={showMask}
          showShadow={showShadow}
          onSelect={onSelect}
        />
      ))}
      <OrbitControls
        makeDefault
        enablePan={false}
        enableDamping={!reduced}
        minDistance={7}
        maxDistance={14}
        minPolarAngle={0.72}
        maxPolarAngle={1.32}
        target={[0, -0.4, 0]}
      />
    </>
  )
}

class SceneErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() {
    if (this.state.failed) {
      return <div className="scene-fallback">3D sonar view is unavailable. Detection evidence remains available in the review panel.</div>
    }
    return this.props.children
  }
}

export function SonarScene(props: SonarSceneProps) {
  return (
    <SceneErrorBoundary>
      <Canvas
        dpr={[1, 1.55]}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        camera={{ position: [8.6, 7.2, 10.8], fov: 46 }}
        shadows
        aria-label="Interactive 3D sonar volume showing an AUV scan beam, seafloor terrain, and selectable detected hazards"
      >
        <Scene {...props} />
      </Canvas>
    </SceneErrorBoundary>
  )
}

export default SonarScene
