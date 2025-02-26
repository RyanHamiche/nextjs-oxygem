import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import { Card, CardContent } from '@/components/ui/card'
import { IProduct } from '@/lib/db/models/product.model'

import Rating from './rating'
import { formatNumber } from '@/lib/utils'
import ProductPrice from './product-price'
import ImageHover from './image-hover'

const ProductCard = ({
  product,
  hideBorder = false,
  hideDetails = false,
}: {
  product: IProduct
  hideDetails?: boolean
  hideBorder?: boolean
}) => {
  const ProductImage = () => (
    <Link href={`/product/${product.slug}`}>
      <div className='relative w-full aspect-square rounded-xl overflow-hidden bg-gray-100'>
        {product.images.length > 1 ? (
          <ImageHover
            src={product.images[0]}
            hoverSrc={product.images[1]}
            alt={product.name}
          />
        ) : (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
            className='object-cover hover:scale-105 transition-transform duration-300'
          />
        )}
      </div>
    </Link>
  )

  const ProductDetails = () => (
    <div className='space-y-2'>
      <Link
        href={`/product/${product.slug}`}
        className='block text-sm font-medium text-gray-800 overflow-hidden'
        style={{
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
        }}
      >
        {product.name}
      </Link>

      <div className='flex justify-center items-center gap-1 text-sm text-gray-600'>
        <Rating rating={product.avgRating} />
        <span>({formatNumber(product.numReviews)})</span>
      </div>

      <ProductPrice
        isDeal={product.tags.includes('todays-deal')}
        price={product.price}
        listPrice={product.listPrice}
        forListing
      />
    </div>
  )

  return (
    <Card
      className={`flex flex-col w-full aspect-square ${
        hideBorder ? '' : 'border rounded-2xl shadow-sm'
      } transition-transform hover:scale-105`}
    >
      <ProductImage />
      {!hideDetails && (
        <CardContent className='p-3 text-center flex-1 flex flex-col justify-between'>
          <ProductDetails />
        </CardContent>
      )}
    </Card>
  )
}

export default ProductCard
