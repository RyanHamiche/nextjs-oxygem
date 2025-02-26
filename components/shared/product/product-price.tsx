'use client'
import { cn } from '@/lib/utils'

const ProductPrice = ({
  price,
  className,
  listPrice = 0,
  isDeal = false,
  plain = false,
  forListing = false,
}: {
  price: number
  isDeal?: boolean
  listPrice?: number
  className?: string
  forListing?: boolean
  plain?: boolean
}) => {
  const discountPercent = Math.round(100 - (price / listPrice) * 100)
  const formattedPrice = price.toFixed(2).replace('.', ',') // Format the price with 2 decimal places

  if (plain) {
    return <span>{formattedPrice}€</span>
  }

  return (
    <div className={cn('flex flex-col', forListing && 'items-center')}>
      {listPrice > 0 && isDeal && (
        <div className='flex items-center gap-2 mb-2'>
          <span className='bg-red-700 rounded-sm p-1 text-white text-sm font-semibold'>
            {discountPercent}% Off
          </span>
          <span className='text-red-700 text-xs font-bold'>
            Limited time deal
          </span>
        </div>
      )}

      <div className='flex items-center gap-2'>
        {listPrice > 0 && !isDeal && (
          <div className='text-xl text-orange-700'>-{discountPercent}%</div>
        )}
        <div className={cn('text-xl flex items-baseline', className)}>
          {formattedPrice}
          <span className='text-xl'>€</span> {/* Symbole € à la même taille */}
        </div>
      </div>

      {listPrice > 0 && (
        <div className='text-muted-foreground text-xs py-2'>
          {isDeal ? 'Was:' : 'List price:'}{' '}
          <span className='line-through'>
            {listPrice.toFixed(2).replace('.', ',')}€
          </span>
        </div>
      )}
    </div>
  )
}

export default ProductPrice
