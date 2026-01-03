'use client'

import { useMemo, useEffect, useState } from 'react'
import { MapBounds } from '@/types/map'
import sampleBuildingsData from '@/data/sample-buildings.json'

interface BuildingsProps {
  bounds: MapBounds
}

interface Building {
  id: string
  position: { lat: number; lng: number }
  size: { width: number; depth: number; height: number }
  color: string
}

export default function Buildings({ bounds }: BuildingsProps) {
  const [buildingsData, setBuildingsData] = useState<Building[]>([])

  useEffect(() => {
    // サンプルデータを読み込む（実際の実装では、APIやファイルから読み込む）
    // 範囲内の建物のみをフィルタリング
    const sampleBounds = {
      north: 35.6820,
      south: 35.6800,
      east: 139.7680,
      west: 139.7660,
    }
    
    const isInSampleRange = 
      bounds.north <= sampleBounds.north &&
      bounds.south >= sampleBounds.south &&
      bounds.east <= sampleBounds.east &&
      bounds.west >= sampleBounds.west

    if (isInSampleRange) {
      // 範囲内の建物をフィルタリング
      const filtered = sampleBuildingsData.buildings.filter(building => {
        return (
          building.position.lat >= bounds.south &&
          building.position.lat <= bounds.north &&
          building.position.lng >= bounds.west &&
          building.position.lng <= bounds.east
        )
      })
      setBuildingsData(filtered)
    } else {
      // サンプルデータがない場合は、ランダムに生成
      setBuildingsData([])
    }
  }, [bounds])

  const buildings = useMemo(() => {
    if (buildingsData.length > 0) {
      // サンプルデータを使用
      const latDiff = bounds.north - bounds.south
      const lngDiff = bounds.east - bounds.west
      const centerLat = (bounds.north + bounds.south) / 2
      const centerLng = (bounds.east + bounds.west) / 2
      
      const width = lngDiff * 111000 * Math.cos(centerLat * Math.PI / 180)
      const height = latDiff * 111000
      
      return buildingsData.map(building => {
        // 緯度経度をメートル単位の座標に変換
        const latOffset = (building.position.lat - centerLat) * 111000
        const lngOffset = (building.position.lng - centerLng) * 111000 * Math.cos(centerLat * Math.PI / 180)
        
        return {
          x: lngOffset,
          z: -latOffset, // Y軸が上向きなので、Z軸を反転
          width: building.size.width,
          depth: building.size.depth,
          height: building.size.height,
          color: building.color,
        }
      })
    } else {
      // ランダム生成（サンプルデータがない場合）
      const latDiff = bounds.north - bounds.south
      const lngDiff = bounds.east - bounds.west
      const centerLat = (bounds.north + bounds.south) / 2
      const centerLng = (bounds.east + bounds.west) / 2
      
      const width = lngDiff * 111000 * Math.cos(centerLat * Math.PI / 180)
      const height = latDiff * 111000
      
      const buildingCount = 8
      const buildings: Array<{
        x: number
        z: number
        width: number
        depth: number
        height: number
        color: string
      }> = []
      
      for (let i = 0; i < buildingCount; i++) {
        buildings.push({
          x: (Math.random() - 0.5) * width * 0.8,
          z: (Math.random() - 0.5) * height * 0.8,
          width: 10 + Math.random() * 20,
          depth: 10 + Math.random() * 20,
          height: 15 + Math.random() * 30,
          color: `hsl(${200 + Math.random() * 40}, 50%, ${60 + Math.random() * 20}%)`,
        })
      }
      
      return buildings
    }
  }, [bounds, buildingsData])

  return (
    <>
      {buildings.map((building, index) => (
        <mesh
          key={index}
          position={[building.x, building.height / 2, building.z]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[building.width, building.height, building.depth]} />
          <meshStandardMaterial color={building.color} />
        </mesh>
      ))}
    </>
  )
}
