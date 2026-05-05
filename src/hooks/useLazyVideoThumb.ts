'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Lazy-loads a video thumbnail by:
 * 1. Observing containerRef with IntersectionObserver (rootMargin 400px so
 *    the video starts fetching metadata just before it scrolls into view).
 * 2. Once in view, creating a hidden <video>, seeking to `seekTo` seconds,
 *    drawing to canvas, and returning the result as a JPEG data-URL poster.
 *
 * Usage:
 *   const { containerRef, isInView, posterUrl } = useLazyVideoThumb('/videos/clip.mp4')
 *   <div ref={containerRef}>
 *     <video preload={isInView ? 'metadata' : 'none'} poster={posterUrl ?? undefined} ...>
 */
export function useLazyVideoThumb(src: string, seekTo = 2) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)
  const [posterUrl, setPosterUrl] = useState<string | null>(null)

  // Step 1: watch for the container entering the viewport
  useEffect(() => {
    const el = containerRef.current
    if (!el || typeof IntersectionObserver === 'undefined') {
      setIsInView(true) // SSR / unsupported browser — load immediately
      return
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          obs.disconnect()
        }
      },
      { rootMargin: '400px', threshold: 0 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  // Step 2: once in view, capture a frame from the video
  useEffect(() => {
    if (!src || !isInView || typeof document === 'undefined') return
    let cancelled = false

    const vid = document.createElement('video')
    vid.muted = true
    vid.playsInline = true
    vid.preload = 'metadata'

    const capture = () => {
      if (cancelled) return
      try {
        const canvas = document.createElement('canvas')
        canvas.width = vid.videoWidth || 640
        canvas.height = vid.videoHeight || 360
        canvas.getContext('2d')?.drawImage(vid, 0, 0)
        const url = canvas.toDataURL('image/jpeg', 0.78)
        if (!cancelled && url && url !== 'data:,') setPosterUrl(url)
      } catch {
        // Canvas tainted or draw failed — poster stays null; that's fine
      } finally {
        vid.src = ''
      }
    }

    vid.addEventListener('seeked', capture, { once: true })
    vid.addEventListener('loadedmetadata', () => {
      if (!cancelled) vid.currentTime = seekTo
    }, { once: true })
    vid.addEventListener('error', () => { vid.src = '' }, { once: true })

    vid.src = src

    return () => {
      cancelled = true
      vid.src = '' // abort any pending network request
    }
  }, [src, isInView, seekTo])

  return { containerRef, isInView, posterUrl }
}
