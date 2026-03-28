import { getAllProducts } from '@/lib/actions/product.actions'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { PlusIcon } from 'lucide-react'
import { IProduct } from '@/lib/db/models/product.model'
import { formatCurrency } from '@/lib/utils'
import TogglePublishedButton from '@/components/shared/admin/toggle-published-button'
import Image from 'next/image'
import { Metadata } from 'next'

export const metadata: Metadata = { title: 'Gestion des produits' }

export default async function AdminProductsPage() {
  const { products, total } = await getAllProducts({ limit: 50 })

  return (
    <div>
      <div className='flex items-center justify-between mb-6'>
        <div>
          <h1 className='text-2xl font-bold'>Produits</h1>
          <p className='text-muted-foreground text-sm'>{total} produit(s)</p>
        </div>
        <Button asChild className='gradient-primary text-white'>
          <Link href='/admin/products/create'>
            <PlusIcon className='h-4 w-4 mr-2' />
            Nouveau produit
          </Link>
        </Button>
      </div>

      <div className='bg-card rounded-2xl border border-border overflow-hidden'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Produit</TableHead>
              <TableHead>Catégorie</TableHead>
              <TableHead>Prix</TableHead>
              <TableHead>Afficher sur le site</TableHead>
              <TableHead>Ventes</TableHead>
              <TableHead className='text-right'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product: IProduct) => (
              <TableRow key={product._id}>
                <TableCell>
                  <div className='flex items-center gap-3'>
                    <div className='relative h-10 w-10 rounded-lg overflow-hidden bg-secondary/40 flex-shrink-0'>
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        sizes='40px'
                        className='object-cover'
                      />
                    </div>
                    <div className='min-w-0'>
                      <p className='font-medium text-sm truncate max-w-[200px]'>
                        {product.name}
                      </p>
                      <p className='text-xs text-muted-foreground truncate max-w-[200px]'>
                        {product.slug}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant='secondary'>{product.category}</Badge>
                </TableCell>
                <TableCell className='font-medium'>
                  {formatCurrency(product.price)}
                </TableCell>
                <TableCell>
                  <TogglePublishedButton
                    productId={product._id}
                    isPublished={product.isPublished}
                  />
                </TableCell>
                <TableCell>{product.numSales}</TableCell>
                <TableCell className='text-right'>
                  <div className='flex items-center justify-end gap-2'>
                    <Button asChild size='sm' variant='outline'>
                      <Link href={`/admin/products/${product._id}/edit`}>
                        Modifier
                      </Link>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
