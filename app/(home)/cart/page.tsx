import { getCart } from '@/lib/actions/cart.actions'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import CartClient from '@/components/shared/cart/cart-client'
import Link from 'next/link'
import { ShoppingCartIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Metadata } from 'next'

export const metadata: Metadata = { title: 'Mon panier' }

export default async function CartPage() {
  const session = await auth()
  if (!session?.user) {
    redirect('/sign-in?callbackUrl=/cart')
  }

  const cart = await getCart()

  if (!cart || cart.items.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4'>
        <div className='bg-secondary/50 rounded-full p-6'>
          <ShoppingCartIcon className='h-16 w-16 text-primary/50' />
        </div>
        <div className='text-center'>
          <h1 className='text-2xl font-bold'>Votre panier est vide</h1>
          <p className='text-muted-foreground mt-2'>
            Ajoutez des articles pour commencer vos achats.
          </p>
        </div>
        <Button asChild className='gradient-primary text-white'>
          <Link href='/'>Découvrir nos produits</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className='max-w-5xl mx-auto px-4 py-8'>
      <h1 className='text-2xl font-bold mb-6'>Mon panier</h1>
      <CartClient cart={cart} />
    </div>
  )
}
