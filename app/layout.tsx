import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '3D Map Viewer',
  description: '2次元地図から3次元マップを表示するアプリケーション',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}
