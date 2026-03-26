'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { ZoomInIcon, XIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'

export default function MultiImageLightbox({
  images,
  alt,
  thumbSize = 80,
}: {
  images: string[]
  alt: string
  thumbSize?: number
}) {
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)

  const prev = useCallback(
    () => setIndex((i) => (i - 1 + images.length) % images.length),
    [images.length]
  )
  const next = useCallback(
    () => setIndex((i) => (i + 1) % images.length),
    [images.length]
  )

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, prev, next])

  const openAt = (i: number) => {
    setIndex(i)
    setOpen(true)
  }

  return (
    <>
      {/* Miniature */}
      <button
        type='button'
        onClick={() => openAt(0)}
        className='relative group cursor-zoom-in focus:outline-none'
        style={{ width: thumbSize, height: thumbSize }}
      >
        <Image
          src={images[0]}
          alt={alt}
          fill
          sizes={`${thumbSize}px`}
          className='object-cover'
        />
        <div className='absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100'>
          <ZoomInIcon className='h-5 w-5 text-white drop-shadow' />
        </div>
      </button>

      {/* Lightbox */}
      {open && (
        <div
          className='fixed inset-0 z-50 flex items-center justify-center bg-black/88 backdrop-blur-sm'
          onClick={() => setOpen(false)}
        >
          {/* Fermer */}
          <button
            className='absolute top-4 right-4 text-white hover:text-white bg-black/60 hover:bg-black/80 rounded-full p-2 transition-colors z-10'
            onClick={() => setOpen(false)}
          >
            <XIcon className='h-6 w-6' />
          </button>

          {/* Compteur */}
          {images.length > 1 && (
            <div className='absolute top-4 left-1/2 -translate-x-1/2 text-white/70 text-sm bg-black/40 px-3 py-1 rounded-full z-10'>
              {index + 1} / {images.length}
            </div>
          )}

          {/* Précédent */}
          {images.length > 1 && (
            <button
              className='absolute left-4 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors z-10'
              onClick={(e) => { e.stopPropagation(); prev() }}
            >
              <ChevronLeftIcon className='h-6 w-6' />
            </button>
          )}

          {/* Image agrandie */}
          <div
            className='relative max-w-[90vw] max-h-[80vh] w-full h-full flex items-center justify-center px-16'
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[index]}
              alt={`${alt} ${index + 1}`}
              fill
              sizes='90vw'
              className='object-contain'
              priority
            />
          </div>

          {/* Suivant */}
          {images.length > 1 && (
            <button
              className='absolute right-4 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors z-10'
              onClick={(e) => { e.stopPropagation(); next() }}
            >
              <ChevronRightIcon className='h-6 w-6' />
            </button>
          )}

          {/* Miniatures en bas */}
          {images.length > 1 && (
            <div className='absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10'>
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setIndex(i) }}
                  className={`relative h-12 w-12 rounded-lg overflow-hidden flex-shrink-0 transition-all duration-200 ${
                    index === i
                      ? 'ring-2 ring-white scale-110'
                      : 'opacity-50 hover:opacity-80'
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${alt} ${i + 1}`}
                    fill
                    sizes='48px'
                    className='object-cover'
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  )
}
