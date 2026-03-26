import ProductForm from '@/components/shared/admin/product-form'
import { Metadata } from 'next'

export const metadata: Metadata = { title: 'Créer un produit' }

export default function CreateProductPage() {
  return (
    <div>
      <h1 className='text-2xl font-bold mb-6'>Nouveau produit</h1>
      <div className='bg-card rounded-2xl border border-border p-6'>
        <ProductForm />
      </div>
    </div>
  )
}
