import { useEffect, useState } from 'react'
import type { StepNumber } from './types'

export function useActiveStep(): StepNumber {
  const [activeStep, setActiveStep] = useState<StepNumber>(1)

  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>('.calculator .step[data-step]'),
    )
    const mobileViewport = window.matchMedia('(max-width: 840px)')
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

    const updateListeners = () => {
      cancelAnimationFrame(frame)
      if (mobileViewport.matches) {
        window.removeEventListener('scroll', scheduleUpdate)
        window.removeEventListener('resize', scheduleUpdate)
        return
      }
      updateActiveStep()
      window.addEventListener('scroll', scheduleUpdate, { passive: true })
      window.addEventListener('resize', scheduleUpdate)
    }

    updateListeners()
    mobileViewport.addEventListener('change', updateListeners)
    return () => {
      cancelAnimationFrame(frame)
      mobileViewport.removeEventListener('change', updateListeners)
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
    }
  }, [])

  return activeStep
}
