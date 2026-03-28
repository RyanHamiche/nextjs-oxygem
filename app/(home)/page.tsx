import { HomeCarousel } from '@/components/shared/home/home-carousel'
import ProductCard from '@/components/shared/product/product-card'
import { getPublishedProducts } from '@/lib/actions/product.actions'
import data from '@/lib/data'
import SortSelector from '@/components/shared/product/sort-selector'
import { Suspense } from 'react'

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string }>
}) {
  const { sort } = await searchParams
  const validSort = (['featured', 'price-asc', 'price-desc', 'newest', 'oldest'] as const).find(
    (s) => s === sort
  ) ?? 'featured'

  const hpProduct = await getPublishedProducts({ sort: validSort })

  return (
    <>
      <div className='mb-8'>
        <HomeCarousel items={data.carousels} />
      </div>
      <div className='px-[10%]'>
        <div className='flex justify-end mb-4'>
          <Suspense>
            <SortSelector />
          </Suspense>
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
          {hpProduct.map((product) => (
            <ProductCard
              key={product.slug}
              product={product}
              hideDetails={false}
              hideBorder={false}
            />
          ))}
        </div>
      </div>
      <div className='mt-8'></div>
    </>
  )
}
