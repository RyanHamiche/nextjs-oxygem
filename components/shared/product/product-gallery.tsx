'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { ZoomInIcon, ChevronLeftIcon, ChevronRightIcon, XIcon } from 'lucide-react'

export default function ProductGallery({
  images,
  name,
}: {
  images: string[]
  name: string
}) {
  const [selected, setSelected] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  const prev = useCallback(() => {
    setLightboxIndex((i) => (i - 1 + images.length) % images.length)
  }, [images.length])

  const next = useCallback(() => {
    setLightboxIndex((i) => (i + 1) % images.length)
  }, [images.length])

  useEffect(() => {
    if (!lightboxOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxOpen(false)
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightboxOpen, prev, next])

  return (
    <>
      {/* Image principale */}
      <div className='flex flex-col gap-3'>
        <div
          className='relative aspect-square rounded-2xl overflow-hidden bg-secondary/40 cursor-zoom-in group'
          onClick={() => openLightbox(selected)}
        >
          <Image
            src={images[selected]}
            alt={name}
            fill
            sizes='(max-width: 768px) 100vw, 50vw'
            className='object-cover transition-transform duration-500 group-hover:scale-105'
            priority
          />
          <div className='absolute inset-0 flex items-end justify-end p-3 opacity-0 group-hover:opacity-100 transition-opacity'>
            <div className='bg-black/40 backdrop-blur-sm rounded-lg p-2'>
              <ZoomInIcon className='h-5 w-5 text-white' />
            </div>
          </div>
        </div>

        {/* Miniatures */}
        {images.length > 1 && (
          <div className='flex gap-2 flex-wrap'>
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelected(i)}
                className={`relative h-16 w-16 rounded-xl overflow-hidden bg-secondary/40 flex-shrink-0 transition-all duration-200 ${
                  selected === i
                    ? 'ring-2 ring-primary ring-offset-2 scale-105'
                    : 'opacity-60 hover:opacity-100'
                }`}
              >
                <Image
                  src={img}
                  alt={`${name} ${i + 1}`}
                  fill
                  sizes='64px'
                  className='object-cover'
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className='fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm'
          onClick={() => setLightboxOpen(false)}
        >
          {/* Fermer */}
          <button
            className='absolute top-4 right-4 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors z-10'
            onClick={() => setLightboxOpen(false)}
          >
            <XIcon className='h-6 w-6' />
          </button>

          {/* Compteur */}
          <div className='absolute top-4 left-1/2 -translate-x-1/2 text-white/70 text-sm bg-black/40 px-3 py-1 rounded-full'>
            {lightboxIndex + 1} / {images.length}
          </div>

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
            className='relative max-w-[90vw] max-h-[85vh] w-full h-full flex items-center justify-center px-16'
            onClick={(e) => e.stopPropagation()}
          >
            <div className='relative w-full h-full'>
              <Image
                src={images[lightboxIndex]}
                alt={`${name} ${lightboxIndex + 1}`}
                fill
                sizes='90vw'
                className='object-contain'
                priority
              />
            </div>
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
            <div className='absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2'>
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setLightboxIndex(i) }}
                  className={`relative h-12 w-12 rounded-lg overflow-hidden flex-shrink-0 transition-all duration-200 ${
                    lightboxIndex === i
                      ? 'ring-2 ring-white scale-110'
                      : 'opacity-50 hover:opacity-80'
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${name} ${i + 1}`}
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
