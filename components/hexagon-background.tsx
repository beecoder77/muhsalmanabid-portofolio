"use client"

import { useEffect, useRef } from "react"

export default function HexagonBackground() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const hexagons: HTMLDivElement[] = []
    const numHexagons = 20

    // Create hexagons
    for (let i = 0; i < numHexagons; i++) {
      const hexagon = document.createElement("div")
      hexagon.className = "hexagon"

      // Random position
      hexagon.style.left = `${Math.random() * 100}%`
      hexagon.style.top = `${Math.random() * 100}%`

      // Random size
      const size = Math.random() * 50 + 50
      hexagon.style.width = `${size}px`
      hexagon.style.height = `${size * 1.1}px`

      // Random opacity
      hexagon.style.opacity = `${Math.random() * 0.2 + 0.1}`

      // Add animation with random delay
      hexagon.style.animation = `float ${Math.random() * 10 + 10}s ease-in-out infinite`
      hexagon.style.animationDelay = `${Math.random() * 5}s`

      container.appendChild(hexagon)
      hexagons.push(hexagon)
    }

    return () => {
      hexagons.forEach((hexagon) => {
        if (container.contains(hexagon)) {
          container.removeChild(hexagon)
        }
      })
    }
  }, [])

  return <div ref={containerRef} className="hexagon-grid"></div>
}
