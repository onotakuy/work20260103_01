'use client'

import dynamic from 'next/dynamic'
import { MapBounds } from '@/types/map'

interface Map2DProps {
  onBoundsSelected: (bounds: MapBounds) => void
}

// react-leafletはクライアント側でのみ動作するため、動的インポートを使用
const Map2DInternal = dynamic(
  () => import('./Map2DInternal'),
  { 
    ssr: false,
    loading: () => <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>読み込み中...</div>
  }
)

export default function Map2D({ onBoundsSelected }: Map2DProps) {
  return <Map2DInternal onBoundsSelected={onBoundsSelected} />
}
