"use client"

import { useEffect, useRef } from "react"
import { Chart, type ChartConfiguration, registerables } from "chart.js"

Chart.register(...registerables)

interface ChartProps {
  data: {
    labels: string[]
    datasets: {
      label: string
      data: number[]
      backgroundColor?: string | string[]
      borderColor?: string | string[]
      borderWidth?: number
      tension?: number
      fill?: boolean
    }[]
  }
  options?: any
}

export function LineChart({ data, options = {} }: ChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chartRef = useRef<Chart | null>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return

    // Destroy existing chart
    if (chartRef.current) {
      chartRef.current.destroy()
    }

    // Create new chart
    const config: ChartConfiguration = {
      type: "line",
      data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "top",
          },
        },
        scales: {
          y: {
            beginAtZero: true,
          },
        },
        ...options,
      },
    }

    chartRef.current = new Chart(ctx, config)

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy()
      }
    }
  }, [data, options])

  return <canvas ref={canvasRef} />
}

export function BarChart({ data, options = {} }: ChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chartRef = useRef<Chart | null>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return

    // Destroy existing chart
    if (chartRef.current) {
      chartRef.current.destroy()
    }

    // Create new chart
    const config: ChartConfiguration = {
      type: "bar",
      data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "top",
          },
        },
        scales: {
          y: {
            beginAtZero: true,
          },
        },
        ...options,
      },
    }

    chartRef.current = new Chart(ctx, config)

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy()
      }
    }
  }, [data, options])

  return <canvas ref={canvasRef} />
}
