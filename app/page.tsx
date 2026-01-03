'use client'

import { useState } from 'react'
import Map2D from '@/components/Map2D'
import Map3D from '@/components/Map3D'
import { MapBounds } from '@/types/map'

export default function Home() {
  const [selectedBounds, setSelectedBounds] = useState<MapBounds | null>(null)
  const [show3D, setShow3D] = useState(false)

  const handleBoundsSelected = (bounds: MapBounds) => {
    setSelectedBounds(bounds)
    setShow3D(true)
  }

  const handleBackTo2D = () => {
    setShow3D(false)
  }

  return (
    <main style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      {!show3D ? (
        <Map2D onBoundsSelected={handleBoundsSelected} />
      ) : (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          <button
            onClick={handleBackTo2D}
            style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              zIndex: 1000,
              padding: '10px 20px',
              backgroundColor: '#fff',
              border: '1px solid #ccc',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            }}
          >
            ← 2D地図に戻る
          </button>
          {selectedBounds && <Map3D bounds={selectedBounds} />}
        </div>
      )}
    </main>
  )
}
