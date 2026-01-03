'use client'

import { useMemo, useEffect, useState } from 'react'
import { BufferGeometry, Float32BufferAttribute, Uint16BufferAttribute } from 'three'
import { MapBounds } from '@/types/map'
import sampleTerrainData from '@/data/sample-terrain.json'

interface TerrainProps {
  bounds: MapBounds
}

export default function Terrain({ bounds }: TerrainProps) {
  const [elevationData, setElevationData] = useState<number[][] | null>(null)

  useEffect(() => {
    // サンプルデータを読み込む（実際の実装では、APIやファイルから読み込む）
    // 範囲がサンプルデータの範囲と一致する場合、サンプルデータを使用
    const sampleBounds = sampleTerrainData.bounds
    const isInSampleRange = 
      bounds.north <= sampleBounds.north &&
      bounds.south >= sampleBounds.south &&
      bounds.east <= sampleBounds.east &&
      bounds.west >= sampleBounds.west

    if (isInSampleRange) {
      setElevationData(sampleTerrainData.elevationData)
    } else {
      setElevationData(null)
    }
  }, [bounds])

  const { geometry, centerX, centerZ, width, height } = useMemo(() => {
    // 範囲をメートル単位に変換（簡易計算）
    const latDiff = bounds.north - bounds.south
    const lngDiff = bounds.east - bounds.west
    
    // 中心点
    const centerLat = (bounds.north + bounds.south) / 2
    const centerLng = (bounds.east + bounds.west) / 2
    
    // メートル単位でのサイズ（概算）
    const width = lngDiff * 111000 * Math.cos(centerLat * Math.PI / 180)
    const height = latDiff * 111000
    
    // 地形データの解像度
    const segments = elevationData ? elevationData.length - 1 : 32
    
    // ジオメトリを作成
    const geometry = new BufferGeometry()
    
    const vertices: number[] = []
    const indices: number[] = []
    
    for (let i = 0; i <= segments; i++) {
      for (let j = 0; j <= segments; j++) {
        const x = (j / segments - 0.5) * width
        const z = (i / segments - 0.5) * height
        
        // 標高データがある場合はそれを使用、ない場合は簡易的な起伏
        let y = 0
        if (elevationData && elevationData[i] && elevationData[i][j] !== undefined) {
          y = elevationData[i][j]
        } else {
          // 簡易的な起伏（サンプル）
          y = Math.sin(x * 0.01) * Math.cos(z * 0.01) * 5
        }
        
        vertices.push(x, y, z)
        
        if (i < segments && j < segments) {
          const a = i * (segments + 1) + j
          const b = a + 1
          const c = a + segments + 1
          const d = c + 1
          
          indices.push(a, c, b)
          indices.push(b, c, d)
        }
      }
    }
    
    geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3))
    geometry.setIndex(new Uint16BufferAttribute(indices, 1))
    geometry.computeVertexNormals()
    
    return {
      geometry,
      centerX: 0,
      centerZ: 0,
      width,
      height,
    }
  }, [bounds, elevationData])

  return (
    <mesh geometry={geometry} position={[centerX, 0, centerZ]} receiveShadow>
      <meshStandardMaterial color="#8B7355" />
    </mesh>
  )
}
