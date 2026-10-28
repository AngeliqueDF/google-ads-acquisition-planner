import { useEffect, useState } from 'react'
import type { StepNumber } from './types'

export function useActiveStep(): StepNumber {
  const [activeStep, setActiveStep] = useState<StepNumber>(1)

  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>('.calculator .step[data-step]'),
    )
    let frame = 0

    const updateActiveStep = () => {
      const header = document.querySelector<HTMLElement>('.site-header')
      const headerBottom = header?.getBoundingClientRect().bottom ?? 0
      const focusY = headerBottom + (window.innerHeight - headerBottom) * 0.35
      const focusedSection = sections.find((section) => {
        const { top, bottom } = section.getBoundingClientRect()
        return top <= focusY && bottom > focusY
      })
      const nearestSection =
        focusedSection ??
        sections.reduce<HTMLElement | null>((nearest, section) => {
          if (!nearest) return section
          const distance = (element: HTMLElement) => {
            const { top, bottom } = element.getBoundingClientRect()
            return focusY < top ? top - focusY : focusY > bottom ? focusY - bottom : 0
          }
          return distance(section) < distance(nearest) ? section : nearest
        }, null)
      const step = Number(nearestSection?.dataset.step)

      if (step >= 1 && step <= 4) setActiveStep(step as StepNumber)
    }

    const scheduleUpdate = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(updateActiveStep)
    }

    updateActiveStep()
    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
    }
  }, [])

  return activeStep
}
