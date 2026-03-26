import { getOrderById } from '@/lib/actions/order.actions'
import { auth } from '@/auth'
import { redirect, notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { formatCurrency } from '@/lib/utils'
import { IOrder, IOrderItem } from '@/lib/db/models/order.model'
import PayButton from '@/components/shared/checkout/pay-button'
import { Metadata } from 'next'

export const metadata: Metadata = { title: 'Détail commande' }

const statusLabels: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  pending: { label: 'En attente', variant: 'secondary' },
  processing: { label: 'En traitement', variant: 'default' },
  shipped: { label: 'Expédiée', variant: 'default' },
  delivered: { label: 'Livrée', variant: 'default' },
  cancelled: { label: 'Annulée', variant: 'destructive' },
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const session = await auth()
  if (!session?.user) redirect('/sign-in')

  const order: IOrder | null = await getOrderById(id)
  if (!order) notFound()

  const status = statusLabels[order.status] ?? { label: order.status, variant: 'outline' as const }

  return (
    <div className='max-w-3xl mx-auto px-4 py-8'>
      <div className='mb-6 flex items-center justify-between flex-wrap gap-4'>
        <div>
          <h1 className='text-2xl font-bold'>Commande</h1>
          <p className='text-muted-foreground text-sm mt-1'>
            #{order._id.toString().slice(-8).toUpperCase()} •{' '}
            {new Date(order.createdAt).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>
        <div className='flex gap-2'>
          <Badge variant={status.variant}>{status.label}</Badge>
          {order.isPaid ? (
            <Badge variant='default' className='bg-green-600'>Payé</Badge>
          ) : (
            <Badge variant='outline' className='text-orange-600 border-orange-300'>Non payé</Badge>
          )}
        </div>
      </div>

      <div className='bg-card rounded-2xl border border-border p-5 mb-4 space-y-3'>
        <h2 className='font-semibold'>Articles</h2>
        {order.items.map((item: IOrderItem) => (
          <div key={item.productId} className='flex items-center gap-3'>
            <div className='relative h-14 w-14 rounded-lg overflow-hidden bg-secondary/40 flex-shrink-0'>
              <Image src={item.images[0]} alt={item.name} fill sizes='56px' className='object-cover' />
            </div>
            <div className='flex-1 min-w-0'>
              <Link href={`/product/${item.slug}`} className='text-sm font-medium hover:text-primary line-clamp-1'>
                {item.name}
              </Link>
              <p className='text-xs text-muted-foreground'>Qté : {item.qty}</p>
            </div>
            <p className='font-semibold text-sm'>{formatCurrency(item.price * item.qty)}</p>
          </div>
        ))}
        <Separator />
        <div className='flex justify-between font-bold'>
          <span>Total</span>
          <span className='text-primary'>{formatCurrency(order.totalPrice)}</span>
        </div>
      </div>

      <div className='bg-card rounded-2xl border border-border p-5 mb-4'>
        <h2 className='font-semibold mb-3'>Adresse de livraison</h2>
        <p className='text-sm'>{order.shippingAddress.fullName}</p>
        <p className='text-sm text-muted-foreground'>
          {order.shippingAddress.address}, {order.shippingAddress.postalCode}{' '}
          {order.shippingAddress.city}
        </p>
        <p className='text-sm text-muted-foreground'>{order.shippingAddress.country}</p>
      </div>

      {!order.isPaid && (
        <PayButton orderId={order._id.toString()} total={order.totalPrice} />
      )}
    </div>
  )
}
