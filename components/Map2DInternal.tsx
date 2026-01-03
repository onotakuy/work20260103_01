'use client'

import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import { MapBounds } from '@/types/map'
import { fixLeafletIcons } from '@/lib/leaflet-fix'

interface Map2DInternalProps {
  onBoundsSelected: (bounds: MapBounds) => void
}

function RectangleSelector({ onBoundsSelected }: { onBoundsSelected: (bounds: MapBounds) => void }) {
  const map = useMapEvents({
    mousedown(e) {
      const startLat = e.latlng.lat
      const startLng = e.latlng.lng
      let rectangle: L.Rectangle | null = null

      const onMouseMove = (e: L.LeafletMouseEvent) => {
        const currentLat = e.latlng.lat
        const currentLng = e.latlng.lng

        const bounds = L.latLngBounds(
          [Math.min(startLat, currentLat), Math.min(startLng, currentLng)],
          [Math.max(startLat, currentLat), Math.max(startLng, currentLng)]
        )

        if (rectangle) {
          rectangle.setBounds(bounds)
        } else {
          rectangle = L.rectangle(bounds, {
            color: '#3388ff',
            weight: 2,
            fillColor: '#3388ff',
            fillOpacity: 0.2,
          }).addTo(map)
        }
      }

      const onMouseUp = () => {
        if (rectangle) {
          const bounds = rectangle.getBounds()
          const north = bounds.getNorth()
          const south = bounds.getSouth()
          const east = bounds.getEast()
          const west = bounds.getWest()

          onBoundsSelected({ north, south, east, west })
          rectangle.remove()
        }

        map.off('mousemove', onMouseMove)
        map.off('mouseup', onMouseUp)
        map.getContainer().style.cursor = ''
      }

      map.on('mousemove', onMouseMove)
      map.on('mouseup', onMouseUp)
      map.getContainer().style.cursor = 'crosshair'
    },
  })

  return null
}

export default function Map2DInternal({ onBoundsSelected }: Map2DInternalProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    fixLeafletIcons()
  }, [])

  if (!isClient) {
    return <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>読み込み中...</div>
  }

  return (
    <MapContainer
      center={[35.6812, 139.7671]} // 東京駅付近
      zoom={15}
      style={{ height: '100%', width: '100%' }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <RectangleSelector onBoundsSelected={onBoundsSelected} />
    </MapContainer>
  )
}
