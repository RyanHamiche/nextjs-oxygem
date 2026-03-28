import ProductCard from '@/components/shared/product/product-card'
import SortSelector from '@/components/shared/product/sort-selector'
import { getPublishedProducts } from '@/lib/actions/product.actions'
import { Suspense } from 'react'

type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'newest' | 'oldest'

const SORT_OPTIONS: SortOption[] = [
  'featured',
  'price-asc',
  'price-desc',
  'newest',
  'oldest',
]

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string
    category?: string
    tag?: string
    sort?: SortOption
  }>
}) {
  const { q, category, tag, sort } = await searchParams
  const selectedSort = SORT_OPTIONS.find((option) => option === sort) ?? 'featured'

  const allProducts = await getPublishedProducts({ sort: selectedSort })
  const qLower = q?.trim().toLowerCase() ?? ''
  const categoryLower = category?.trim().toLowerCase()
  const tagLower = tag?.trim().toLowerCase()

  const filteredProducts = allProducts.filter((product) => {
    if (categoryLower && categoryLower !== 'all') {
      if (product.category.toLowerCase() !== categoryLower) return false
    }

    if (tagLower) {
      const hasTag = product.tags.some((productTag) => productTag.toLowerCase() === tagLower)
      if (!hasTag) return false
    }

    if (qLower) {
      const searchable = `${product.name} ${product.description ?? ''}`.toLowerCase()
      if (!searchable.includes(qLower)) return false
    }

    return true
  })

  const heading = q ? `Résultats pour "${q}"` : 'Résultats de recherche'

  return (
    <div className='px-[10%] py-6 space-y-6'>
      <div className='flex flex-col gap-3 md:flex-row md:items-center md:justify-between'>
        <div>
          <h1 className='text-2xl font-bold'>{heading}</h1>
          <p className='text-sm text-muted-foreground'>
            {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''} trouvé
            {filteredProducts.length > 1 ? 's' : ''}
          </p>
        </div>
        <Suspense>
          <SortSelector />
        </Suspense>
      </div>

      {filteredProducts.length === 0 ? (
        <div className='rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground'>
          Aucun produit ne correspond à votre recherche.
        </div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
          {filteredProducts.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
