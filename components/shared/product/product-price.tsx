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
  const formattedPrice = price.toFixed(2).replace('.', ',')

  if (plain) {
    return <span>{formattedPrice}€</span>
  }

  return (
    <div className={cn('flex items-baseline gap-2', forListing && 'justify-center')}>
      {listPrice > 0 && (
        <span className='text-sm text-muted-foreground line-through'>
          {listPrice.toFixed(2).replace('.', ',')}€
        </span>
      )}
      <span className={cn('text-xl font-semibold', className)}>
        {formattedPrice}€
      </span>
    </div>
  )
}

export default ProductPrice
