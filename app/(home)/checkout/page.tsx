import { getCart } from '@/lib/actions/cart.actions'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import CheckoutForm from '@/components/shared/checkout/checkout-form'
import { Metadata } from 'next'

export const metadata: Metadata = { title: 'Commander' }

export default async function CheckoutPage() {
  const session = await auth()
  if (!session?.user) redirect('/sign-in?callbackUrl=/checkout')

  const cart = await getCart()
  if (!cart || cart.items.length === 0) redirect('/cart')

  return (
    <div className='max-w-4xl mx-auto px-4 py-8'>
      <h1 className='text-2xl font-bold mb-6'>Finaliser ma commande</h1>
      <CheckoutForm cart={cart} />
    </div>
  )
}
