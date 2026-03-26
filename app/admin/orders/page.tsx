import { getAllOrders } from '@/lib/actions/order.actions'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatCurrency } from '@/lib/utils'
import { IOrder } from '@/lib/db/models/order.model'
import { Metadata } from 'next'

export const metadata: Metadata = { title: 'Commandes — Admin' }

const statusLabels: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  pending: { label: 'En attente', variant: 'secondary' },
  processing: { label: 'En traitement', variant: 'default' },
  shipped: { label: 'Expédiée', variant: 'default' },
  delivered: { label: 'Livrée', variant: 'default' },
  cancelled: { label: 'Annulée', variant: 'destructive' },
}

export default async function AdminOrdersPage() {
  const orders = await getAllOrders()

  return (
    <div>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold'>Commandes</h1>
        <p className='text-muted-foreground text-sm'>{orders.length} commande(s)</p>
      </div>

      <div className='bg-card rounded-2xl border border-border overflow-hidden'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Articles</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Paiement</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order: IOrder) => {
              const status = statusLabels[order.status] ?? { label: order.status, variant: 'outline' as const }
              return (
                <TableRow key={order._id}>
                  <TableCell className='font-mono text-xs'>
                    #{order._id.toString().slice(-8).toUpperCase()}
                  </TableCell>
                  <TableCell>
                    <p className='text-sm font-medium'>
                      {order.shippingAddress.fullName}
                    </p>
                    <p className='text-xs text-muted-foreground'>
                      {order.shippingAddress.city}
                    </p>
                  </TableCell>
                  <TableCell>{order.items.length}</TableCell>
                  <TableCell className='font-semibold'>
                    {formatCurrency(order.totalPrice)}
                  </TableCell>
                  <TableCell>
                    {order.isPaid ? (
                      <Badge className='bg-green-100 text-green-700 hover:bg-green-100'>
                        Payé
                      </Badge>
                    ) : (
                      <Badge variant='outline' className='text-orange-600 border-orange-300'>
                        Non payé
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={status.variant}>{status.label}</Badge>
                  </TableCell>
                  <TableCell className='text-sm text-muted-foreground'>
                    {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
