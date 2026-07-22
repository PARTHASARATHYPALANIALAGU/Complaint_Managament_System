import { useEffect, useRef, useState } from 'react'

/**
 * AnimatedCounter
 * Counts up from 0 to `target` using requestAnimationFrame.
 * @param {number} target - The final number to count to
 * @param {number} duration - Animation duration in ms (default 1200)
 * @param {string} suffix - Optional suffix like "%" or "+"
 */
export default function AnimatedCounter({ target, duration = 1200, suffix = '' }) {
  const [count, setCount] = useState(0)
  const [started, setStarted] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true)
        }
      },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [started])

  useEffect(() => {
    if (!started || target === 0) return

    let startTime = null
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime
      const progress = Math.min(elapsed / duration, 1)
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * target))

      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [started, target, duration])

  return (
    <span ref={ref} style={{ animation: 'counter-up 0.4s ease-out forwards' }}>
      {count}{suffix}
    </span>
  )
}
