import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { IProduct } from '@/lib/db/models/product.model'
import Rating from './rating'
import { formatNumber } from '@/lib/utils'
import ProductPrice from './product-price'
import ImageHover from './image-hover'
import AddToCartButton from './add-to-cart-button'

const ProductCard = ({
  product,
  hideBorder = false,
  hideDetails = false,
}: {
  product: IProduct
  hideDetails?: boolean
  hideBorder?: boolean
}) => {
  const isNewProduct = (() => {
    const createdAt = new Date(product.createdAt).getTime()
    if (Number.isNaN(createdAt)) return false
    const oneWeekInMs = 7 * 24 * 60 * 60 * 1000
    return Date.now() - createdAt < oneWeekInMs
  })()

  const ProductImage = () => (
    <Link href={`/product/${product.slug}`}>
      <div className='relative w-full aspect-square rounded-xl overflow-hidden bg-secondary/40 group'>
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
            className='object-cover group-hover:scale-105 transition-transform duration-500'
          />
        )}
        {isNewProduct && (
          <span className='absolute top-2 left-2 text-white text-[10px] font-bold px-2 py-0.5 rounded bg-[#309CF2]'>
            New
          </span>
        )}
        {product.listPrice > 0 && (
          <span className='absolute bottom-2 left-2 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded'>
            Promo
          </span>
        )}
      </div>
    </Link>
  )

  const ProductDetails = () => (
    <div className='space-y-2'>
      <Link
        href={`/product/${product.slug}`}
        className='block text-sm font-semibold text-foreground hover:text-primary transition-colors overflow-hidden'
        style={{
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
        }}
      >
        {product.name}
      </Link>

      <div className='flex justify-center items-center gap-1 text-sm text-muted-foreground'>
        <Rating rating={product.avgRating} />
        <span>({formatNumber(product.numReviews)})</span>
      </div>

      <ProductPrice
        isDeal={product.tags.includes('todays-deal')}
        price={product.price}
        listPrice={product.listPrice}
        forListing
      />

      <AddToCartButton productId={product._id.toString()} />
    </div>
  )

  return (
    <Card
      className={`flex flex-col w-full ${
        hideBorder ? 'border-0 shadow-none' : 'border shadow-sm hover:shadow-md'
      } rounded-2xl transition-all duration-300 hover:-translate-y-1 bg-card`}
    >
      <ProductImage />
      {!hideDetails && (
        <CardContent className='p-4 text-center flex-1 flex flex-col justify-between gap-2'>
          <ProductDetails />
        </CardContent>
      )}
    </Card>
  )
}

export default ProductCard
