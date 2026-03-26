import { getProductBySlug } from '@/lib/actions/product.actions'
import { notFound } from 'next/navigation'
import Rating from '@/components/shared/product/rating'
import ProductPrice from '@/components/shared/product/product-price'
import AddToCartButton from '@/components/shared/product/add-to-cart-button'
import ProductGallery from '@/components/shared/product/product-gallery'
import { Badge } from '@/components/ui/badge'
import { Metadata } from 'next'
import { formatNumber } from '@/lib/utils'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return { title: 'Produit introuvable' }
  return { title: product.name, description: product.description }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) notFound()

  return (
    <div className='max-w-5xl mx-auto px-4 py-8'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
        <ProductGallery images={product.images} name={product.name} />

        <div className='flex flex-col gap-4'>
          <div>
            <Badge variant='secondary' className='mb-2'>
              {product.category}
            </Badge>
            <h1 className='text-2xl font-bold'>{product.name}</h1>
          </div>

          <div className='flex items-center gap-2'>
            <Rating rating={product.avgRating} />
            <span className='text-sm text-muted-foreground'>
              ({formatNumber(product.numReviews)} avis)
            </span>
          </div>

          <ProductPrice
            price={product.price}
            listPrice={product.listPrice}
            isDeal={product.tags.includes('todays-deal')}
          />

          <p className='text-muted-foreground text-sm leading-relaxed'>
            {product.description}
          </p>

          {product.tags.length > 0 && (
            <div className='flex flex-wrap gap-2'>
              {product.tags.map((tag) => (
                <Badge key={tag} variant='outline' className='text-xs'>
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          <div className='mt-2'>
            <AddToCartButton productId={product._id.toString()} />
          </div>

          <p className='text-xs text-muted-foreground'>
            {product.numSales} vente{product.numSales !== 1 ? 's' : ''}
          </p>
        </div>
      </div>
    </div>
  )
}
