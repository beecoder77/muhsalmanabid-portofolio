"use client"

import { motion } from "framer-motion"

interface RobotAnimationProps {
  state: "idle" | "looking" | "happy" | "thinking" | "surprised" | "error"
}

export default function RobotAnimation({ state }: RobotAnimationProps) {
  // Define different eye positions and expressions based on state
  const eyeVariants = {
    idle: { cx: 0, cy: 0 },
    looking: { cx: 3, cy: -2 },
    happy: { cx: 0, cy: 2 },
    thinking: { cx: 5, cy: -5 },
    surprised: { cx: 0, cy: -3 },
    error: { cx: 0, cy: 0 },
  }

  // Define different mouth shapes based on state
  const mouthVariants = {
    idle: { d: "M 20,55 Q 40,65 60,55" },
    looking: { d: "M 20,55 Q 40,65 60,55" },
    happy: { d: "M 20,55 Q 40,75 60,55" },
    thinking: { d: "M 25,55 Q 40,55 55,55" },
    surprised: { d: "M 30,55 Q 40,65 50,55" },
    error: { d: "M 20,65 Q 40,45 60,65" },
  }

  // Define antenna animations based on state
  const antennaVariants = {
    idle: { rotate: 0 },
    looking: { rotate: 15 },
    happy: { rotate: [0, 10, -10, 0], transition: { repeat: Number.POSITIVE_INFINITY, duration: 1 } },
    thinking: { rotate: [0, 5, -5, 0], transition: { repeat: Number.POSITIVE_INFINITY, duration: 0.5 } },
    surprised: { rotate: 30 },
    error: { rotate: [-10, 10], transition: { repeat: Number.POSITIVE_INFINITY, duration: 0.2 } },
  }

  // Define body animations based on state
  const bodyVariants = {
    idle: { y: [0, -5, 0], transition: { repeat: Number.POSITIVE_INFINITY, duration: 3, ease: "easeInOut" } },
    looking: { y: 0 },
    happy: { y: [0, -10, 0], transition: { repeat: Number.POSITIVE_INFINITY, duration: 0.5 } },
    thinking: { rotate: [0, 1, -1, 0], transition: { repeat: Number.POSITIVE_INFINITY, duration: 1.5 } },
    surprised: { y: -10, transition: { type: "spring", stiffness: 300, damping: 10 } },
    error: { x: [0, -5, 5, -5, 5, 0], transition: { repeat: Number.POSITIVE_INFINITY, duration: 0.5 } },
  }

  // Define color changes based on state
  const getBodyColor = () => {
    switch (state) {
      case "happy":
        return "#4ade80"
      case "error":
        return "#ef4444"
      case "thinking":
        return "#3b82f6"
      case "surprised":
        return "#f59e0b"
      default:
        return "#6366f1"
    }
  }

  return (
    <motion.div
      className="w-40 h-40 relative"
      initial={{ scale: 0.8 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" animate={state} variants={bodyVariants}>
        {/* Antenna */}
        <motion.g variants={antennaVariants} animate={state} style={{ originX: 0.4, originY: 0.15 }}>
          <line x1="40" y1="15" x2="40" y2="5" stroke="#94a3b8" strokeWidth="2" />
          <circle cx="40" cy="3" r="3" fill="#f43f5e" />
        </motion.g>

        {/* Head */}
        <motion.rect
          x="20"
          y="15"
          width="40"
          height="30"
          rx="10"
          ry="10"
          fill={getBodyColor()}
          animate={{ fill: getBodyColor() }}
          transition={{ duration: 0.3 }}
        />

        {/* Eyes */}
        <g>
          {/* Left eye socket */}
          <circle cx="30" cy="30" r="8" fill="#1e293b" />
          {/* Right eye socket */}
          <circle cx="50" cy="30" r="8" fill="#1e293b" />

          {/* Left eye pupil */}
          <motion.circle
            cx="30"
            cy="30"
            r="4"
            fill="white"
            animate={{
              cx: 30 + (eyeVariants[state]?.cx ?? 0),
              cy: 30 + (eyeVariants[state]?.cy ?? 0),
            }}
            transition={{ type: "spring", stiffness: 300, damping: 10 }}
          />
          {/* Right eye pupil */}
          <motion.circle
            cx="50"
            cy="30"
            r="4"
            fill="white"
            animate={{
              cx: 50 + (eyeVariants[state]?.cx ?? 0),
              cy: 30 + (eyeVariants[state]?.cy ?? 0),
            }}
            transition={{ type: "spring", stiffness: 300, damping: 10 }}
          />
        </g>

        {/* Mouth */}
        <motion.path variants={mouthVariants} animate={state} stroke="#1e293b" strokeWidth="2" fill="none" />

        {/* Body */}
        <motion.rect
          x="25"
          y="45"
          width="30"
          height="35"
          rx="5"
          ry="5"
          fill={getBodyColor()}
          animate={{ fill: getBodyColor() }}
          transition={{ duration: 0.3 }}
        />

        {/* Arms */}
        <motion.rect
          x="10"
          y="50"
          width="15"
          height="5"
          rx="2"
          ry="2"
          fill="#94a3b8"
          animate={state === "happy" ? { rotate: [0, 20, 0, 20, 0], x: 10, y: 50 } : {}}
          transition={{ repeat: state === "happy" ? Number.POSITIVE_INFINITY : 0, duration: 1 }}
        />
        <motion.rect
          x="55"
          y="50"
          width="15"
          height="5"
          rx="2"
          ry="2"
          fill="#94a3b8"
          animate={state === "happy" ? { rotate: [0, -20, 0, -20, 0], x: 55, y: 50 } : {}}
          transition={{ repeat: state === "happy" ? Number.POSITIVE_INFINITY : 0, duration: 1 }}
        />

        {/* Legs */}
        <rect x="30" y="80" width="5" height="15" rx="2" ry="2" fill="#94a3b8" />
        <rect x="45" y="80" width="5" height="15" rx="2" ry="2" fill="#94a3b8" />

        {/* Control panel */}
        <rect x="30" y="55" width="20" height="10" rx="2" ry="2" fill="#1e293b" />
        <circle cx="35" cy="60" r="2" fill="#ef4444" />
        <circle cx="40" cy="60" r="2" fill="#f59e0b" />
        <circle cx="45" cy="60" r="2" fill="#4ade80" />
      </motion.svg>
    </motion.div>
  )
}
