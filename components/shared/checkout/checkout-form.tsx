'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ShippingAddressSchema } from '@/lib/validator'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { createOrder } from '@/lib/actions/order.actions'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { ICart, ICartItem } from '@/lib/db/models/cart.model'
import Image from 'next/image'
import { formatCurrency } from '@/lib/utils'

type AddressFormValues = z.infer<typeof ShippingAddressSchema>

export default function CheckoutForm({ cart }: { cart: ICart }) {
  const router = useRouter()

  const form = useForm<AddressFormValues>({
    resolver: zodResolver(ShippingAddressSchema),
    defaultValues: {
      fullName: '',
      address: '',
      city: '',
      postalCode: '',
      country: 'France',
    },
  })

  const onSubmit = async (values: AddressFormValues) => {
    const result = await createOrder(values)
    if (!result.success) {
      toast.error(result.error ?? 'Erreur lors de la commande')
      return
    }
    toast.success('Commande créée !')
    router.push(`/orders/${result.orderId}`)
  }

  return (
    <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
      <div className='lg:col-span-2'>
        <div className='bg-card rounded-2xl border border-border p-6'>
          <h2 className='font-semibold text-lg mb-5'>Adresse de livraison</h2>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
              <FormField
                control={form.control}
                name='fullName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom complet</FormLabel>
                    <FormControl>
                      <Input placeholder='Marie Dupont' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='address'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adresse</FormLabel>
                    <FormControl>
                      <Input placeholder='12 rue des Lilas' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className='grid grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='postalCode'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Code postal</FormLabel>
                      <FormControl>
                        <Input placeholder='75001' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='city'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ville</FormLabel>
                      <FormControl>
                        <Input placeholder='Paris' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name='country'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pays</FormLabel>
                    <FormControl>
                      <Input placeholder='France' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type='submit'
                className='w-full gradient-primary text-white mt-2'
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <Loader2 className='h-4 w-4 animate-spin mr-2' />
                ) : null}
                Confirmer la commande
              </Button>
            </form>
          </Form>
        </div>
      </div>

      <div className='lg:col-span-1'>
        <div className='bg-card rounded-2xl border border-border p-5 sticky top-4'>
          <h2 className='font-semibold mb-4'>Votre panier</h2>
          <div className='space-y-3'>
            {cart.items.map((item: ICartItem) => (
              <div key={item.productId} className='flex items-center gap-3'>
                <div className='relative h-12 w-12 rounded-lg overflow-hidden bg-secondary/40 flex-shrink-0'>
                  <Image src={item.images[0]} alt={item.name} fill sizes='48px' className='object-cover' />
                </div>
                <div className='flex-1 min-w-0'>
                  <p className='text-sm font-medium line-clamp-1'>{item.name}</p>
                  <p className='text-xs text-muted-foreground'>× {item.qty}</p>
                </div>
                <p className='text-sm font-semibold'>
                  {formatCurrency(item.price * item.qty)}
                </p>
              </div>
            ))}
          </div>
          <Separator className='my-4' />
          <div className='flex justify-between font-bold'>
            <span>Total</span>
            <span className='text-primary'>{formatCurrency(cart.totalPrice)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
