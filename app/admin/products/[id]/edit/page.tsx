import { getProductById } from '@/lib/actions/product.actions'
import ProductForm from '@/components/shared/admin/product-form'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'

export const metadata: Metadata = { title: 'Modifier le produit' }

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const product = await getProductById(id)
  if (!product) notFound()

  return (
    <div>
      <h1 className='text-2xl font-bold mb-6'>Modifier le produit</h1>
      <div className='bg-card rounded-2xl border border-border p-6'>
        <ProductForm product={product} />
      </div>
    </div>
  )
}
