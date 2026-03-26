'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { ZoomInIcon, XIcon } from 'lucide-react'

export default function ImageLightbox({
  src,
  alt,
  width,
  height,
  className,
}: {
  src: string
  alt: string
  width: number
  height: number
  className?: string
}) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      <button
        type='button'
        onClick={() => setOpen(true)}
        className='relative group cursor-zoom-in focus:outline-none'
        style={{ width, height }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes={`${width}px`}
          className={className ?? 'object-cover'}
        />
        <div className='absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-inherit flex items-center justify-center opacity-0 group-hover:opacity-100'>
          <ZoomInIcon className='h-5 w-5 text-white drop-shadow' />
        </div>
      </button>

      {open && (
        <div
          className='fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm'
          onClick={() => setOpen(false)}
        >
          <button
            className='absolute top-4 right-4 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors'
            onClick={() => setOpen(false)}
          >
            <XIcon className='h-6 w-6' />
          </button>

          <div
            className='relative max-w-[90vw] max-h-[85vh] w-full h-full flex items-center justify-center'
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={src}
              alt={alt}
              fill
              sizes='90vw'
              className='object-contain'
              priority
            />
          </div>
        </div>
      )}
    </>
  )
}
