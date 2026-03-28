'use client'

import Link from 'next/link'
import MultiImageLightbox from '@/components/ui/multi-image-lightbox'
import { useState, useTransition } from 'react'
import { ICart, ICartItem } from '@/lib/db/models/cart.model'
import { removeFromCart, updateCartQty } from '@/lib/actions/cart.actions'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Trash2Icon, MinusIcon, PlusIcon, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { formatCurrency } from '@/lib/utils'
import { useRouter } from 'next/navigation'

export default function CartClient({ cart }: { cart: ICart }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const handleRemove = (productId: string) => {
    setLoadingId(productId)
    startTransition(async () => {
      const res = await removeFromCart(productId)
      if (res.success) {
        toast.success('Article retiré')
        window.dispatchEvent(new CustomEvent('cart-updated', { detail: res.cartItemCount }))
      } else {
        toast.error(res.error)
      }
      setLoadingId(null)
    })
  }

  const handleQtyChange = (productId: string, qty: number) => {
    setLoadingId(productId)
    startTransition(async () => {
      const res = await updateCartQty(productId, qty)
      if (res.success) {
        window.dispatchEvent(new CustomEvent('cart-updated', { detail: res.cartItemCount }))
      }
      setLoadingId(null)
    })
  }

  return (
    <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
      <div className='lg:col-span-2 space-y-4'>
        {cart.items.map((item: ICartItem) => (
          <div
            key={item.productId}
            className='flex gap-4 bg-card rounded-2xl p-4 border border-border shadow-sm'
          >
            <div className='relative w-20 h-20 rounded-xl overflow-hidden bg-secondary/40 flex-shrink-0'>
              <MultiImageLightbox
                images={item.images}
                alt={item.name}
                thumbSize={80}
              />
            </div>

            <div className='flex-1 min-w-0'>
              <Link
                href={`/product/${item.slug}`}
                className='font-semibold text-sm hover:text-primary transition-colors line-clamp-2'
              >
                {item.name}
              </Link>
              <div className='flex items-baseline gap-2 mt-1'>
                <p className='text-primary font-bold'>
                  {formatCurrency(item.price)}
                </p>
                {item.listPrice > 0 && item.listPrice > item.price && (
                  <p className='text-muted-foreground text-xs line-through'>
                    {formatCurrency(item.listPrice)}
                  </p>
                )}
              </div>

              <div className='flex items-center gap-2 mt-2'>
                <button
                  onClick={() =>
                    handleQtyChange(item.productId, item.qty - 1)
                  }
                  disabled={isPending && loadingId === item.productId}
                  className='h-7 w-7 rounded-full border flex items-center justify-center hover:bg-secondary disabled:opacity-50'
                >
                  <MinusIcon className='h-3 w-3' />
                </button>
                <span className='w-8 text-center font-medium text-sm'>
                  {loadingId === item.productId && isPending ? (
                    <Loader2 className='h-3 w-3 animate-spin mx-auto' />
                  ) : (
                    item.qty
                  )}
                </span>
                <button
                  onClick={() =>
                    handleQtyChange(item.productId, item.qty + 1)
                  }
                  disabled={isPending && loadingId === item.productId}
                  className='h-7 w-7 rounded-full border flex items-center justify-center hover:bg-secondary disabled:opacity-50'
                >
                  <PlusIcon className='h-3 w-3' />
                </button>

                <button
                  onClick={() => handleRemove(item.productId)}
                  disabled={isPending && loadingId === item.productId}
                  className='ml-auto text-destructive hover:text-destructive/80 disabled:opacity-50'
                >
                  <Trash2Icon className='h-4 w-4' />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className='lg:col-span-1'>
        <div className='bg-card rounded-2xl p-6 border border-border shadow-sm sticky top-4'>
          <h2 className='font-bold text-lg mb-4'>Récapitulatif</h2>
          <div className='space-y-2 text-sm'>
            {cart.items.map((item: ICartItem) => (
              <div key={item.productId} className='flex justify-between'>
                <span className='text-muted-foreground truncate max-w-[160px]'>
                  {item.name} × {item.qty}
                </span>
                <span>{formatCurrency(item.listPrice > 0 && item.listPrice > item.price ? item.listPrice * item.qty : item.price * item.qty)}</span>
              </div>
            ))}
          </div>
          {(() => {
            const totalSavings = cart.items.reduce(
              (sum: number, item: ICartItem) =>
                item.listPrice > 0 && item.listPrice > item.price
                  ? sum + (item.listPrice - item.price) * item.qty
                  : sum,
              0
            )
            return totalSavings > 0 ? (
              <>
                <Separator className='my-3' />
                <div className='flex justify-between text-sm text-green-600 font-medium'>
                  <span>Promotions</span>
                  <span>- {formatCurrency(totalSavings)}</span>
                </div>
              </>
            ) : null
          })()}
          <Separator className='my-4' />
          <div className='flex justify-between font-bold text-base'>
            <span>Total</span>
            <span className='text-primary'>{formatCurrency(cart.totalPrice)}</span>
          </div>
          <Button
            className='w-full mt-4 gradient-primary text-white'
            onClick={() => router.push('/checkout')}
          >
            Passer la commande
          </Button>
          <Button
            variant='outline'
            className='w-full mt-2'
            asChild
          >
            <Link href='/'>Continuer mes achats</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
