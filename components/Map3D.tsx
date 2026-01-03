'use client'

import { useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { MapBounds } from '@/types/map'
import Terrain from './Terrain'
import Buildings from './Buildings'

interface Map3DProps {
  bounds: MapBounds
}

export default function Map3D({ bounds }: Map3DProps) {
  const centerLat = (bounds.north + bounds.south) / 2
  const centerLng = (bounds.east + bounds.west) / 2

  // 範囲のサイズを計算（メートル単位の概算）
  const latDiff = bounds.north - bounds.south
  const lngDiff = bounds.east - bounds.west
  const size = Math.max(latDiff, lngDiff) * 111000 // 約111km per degree

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[0, size * 0.5, size * 0.8]} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={size * 0.3}
          maxDistance={size * 2}
        />
        <Terrain bounds={bounds} />
        <Buildings bounds={bounds} />
        <gridHelper args={[size, 20]} />
      </Canvas>
    </div>
  )
}
