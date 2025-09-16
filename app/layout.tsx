import type React from "react"
import "./globals.css"

export const metadata = {
  title: "IFC Viewer",
  description: "Simple IFC 3D viewer (Next.js + three + web-ifc-three)",
    generator: 'v0.app'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body style={{ margin: 0, fontFamily: "ui-sans-serif, system-ui, -apple-system" }}>{children}</body>
    </html>
  )
}
