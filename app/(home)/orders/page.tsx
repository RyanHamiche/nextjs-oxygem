import { getMyOrders } from '@/lib/actions/order.actions'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'
import { IOrder } from '@/lib/db/models/order.model'
import { PackageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Metadata } from 'next'

export const metadata: Metadata = { title: 'Mes commandes' }

const statusLabels: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  pending: { label: 'En attente', variant: 'secondary' },
  processing: { label: 'En traitement', variant: 'default' },
  shipped: { label: 'Expédiée', variant: 'default' },
  delivered: { label: 'Livrée', variant: 'default' },
  cancelled: { label: 'Annulée', variant: 'destructive' },
}

export default async function OrdersPage() {
  const session = await auth()
  if (!session?.user) redirect('/sign-in?callbackUrl=/orders')

  const orders = await getMyOrders()

  if (!orders.length) {
    return (
      <div className='flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4'>
        <div className='bg-secondary/50 rounded-full p-6'>
          <PackageIcon className='h-16 w-16 text-primary/50' />
        </div>
        <div className='text-center'>
          <h1 className='text-2xl font-bold'>Aucune commande</h1>
          <p className='text-muted-foreground mt-2'>
            Vous n&apos;avez pas encore passé de commande.
          </p>
        </div>
        <Button asChild className='gradient-primary text-white'>
          <Link href='/'>Commencer mes achats</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className='max-w-4xl mx-auto px-4 py-8'>
      <h1 className='text-2xl font-bold mb-6'>Mes commandes</h1>
      <div className='space-y-4'>
        {orders.map((order: IOrder) => {
          const status = statusLabels[order.status] ?? { label: order.status, variant: 'outline' as const }
          return (
            <Link
              key={order._id}
              href={`/orders/${order._id}`}
              className='block bg-card rounded-2xl border border-border p-5 hover:shadow-md transition-all hover:-translate-y-0.5'
            >
              <div className='flex items-center justify-between gap-4 flex-wrap'>
                <div>
                  <p className='text-xs text-muted-foreground mb-1'>
                    Commande #{order._id.toString().slice(-8).toUpperCase()}
                  </p>
                  <p className='text-sm text-muted-foreground'>
                    {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                  <p className='text-sm mt-1'>
                    {order.items.length} article{order.items.length > 1 ? 's' : ''}
                  </p>
                </div>
                <div className='text-right flex flex-col items-end gap-2'>
                  <p className='font-bold text-primary text-lg'>
                    {formatCurrency(order.totalPrice)}
                  </p>
                  <Badge variant={status.variant}>{status.label}</Badge>
                  {!order.isPaid && (
                    <Badge variant='outline' className='text-orange-600 border-orange-300'>
                      Non payé
                    </Badge>
                  )}
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
