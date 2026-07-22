import { useEffect, useRef } from 'react'

const PARTICLE_COUNT = 28

function randomBetween(min, max) {
  return Math.random() * (max - min) + min
}

export default function ParticleBackground() {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Clear previous particles
    container.innerHTML = ''

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const particle = document.createElement('div')

      const size = randomBetween(3, 10)
      const x = randomBetween(0, 100)
      const y = randomBetween(0, 100)
      const duration = randomBetween(4, 12)
      const delay = randomBetween(0, 8)
      const opacity = randomBetween(0.02, 0.1)

      // Pick a shape & color
      const shapes = ['rounded-full', 'rounded-sm', 'rounded-lg']
      const colors = [
        'bg-blue-600', 'bg-indigo-600', 'bg-purple-600',
        'bg-cyan-600', 'bg-sky-600', 'bg-violet-600'
      ]
      const shape = shapes[Math.floor(Math.random() * shapes.length)]
      const color = colors[Math.floor(Math.random() * colors.length)]

      particle.className = `absolute ${shape} ${color}`
      particle.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${x}%;
        top: ${y}%;
        opacity: ${opacity};
        animation: float ${duration}s ease-in-out infinite;
        animation-delay: -${delay}s;
        filter: blur(${size > 7 ? 1 : 0}px);
        pointer-events: none;
      `

      container.appendChild(particle)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
    />
  )
}
