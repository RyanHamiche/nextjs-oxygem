import { SearchIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { APP_NAME } from '@/lib/constants'
const categories = ['Ongles', 'Gel', 'Colle', 'Accessoires']
export default function Search() {
  return (
    <form action='/search' method='GET' className='flex items-stretch h-10'>
      <select
        name='category'
        defaultValue='all'
        className='w-28 md:w-36 h-full rounded-r-none rounded-l-md border border-r-0 border-gray-200 bg-gray-100 px-2 text-sm text-black'
      >
        <option value='all'>All</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
      <Input
        className='flex-1 rounded-none dark:border-gray-200 bg-gray-100 text-black text-base h-full'
        placeholder={`Rechercher sur ${APP_NAME}`}
        name='q'
        type='search'
      />
      <button
        type='submit'
        className='bg-primary text-primary-foreground text-black rounded-s-none rounded-e-md h-full px-3 py-2'
      >
        <SearchIcon className='w-6 h-6' />
      </button>
    </form>
  )
}
