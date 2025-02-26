import { HomeCarousel } from '@/components/shared/home/home-carousel'
import ProductCard from '@/components/shared/product/product-card'
import { getProductsByTag } from '@/lib/actions/product.actions'
import data from '@/lib/data'

export default async function Page() {
  const hpProduct = await getProductsByTag({ tag: 'homepage' })
  return (
    <>
      <div className='mb-8'>
        {' '}
        <HomeCarousel items={data.carousels} />
      </div>
      <div className='px-[10%]'>
        {' '}
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
          {' '}
          {hpProduct?.map((product) => (
            <ProductCard
              key={product.slug}
              product={product}
              hideDetails={false}
              hideBorder={false}
            />
          ))}
        </div>
      </div>
      <div className='mt-8'></div>{' '}
    </>
  )
}
