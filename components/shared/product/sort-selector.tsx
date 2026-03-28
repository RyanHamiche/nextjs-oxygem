'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const SORT_OPTIONS = [
  { value: 'featured',   label: 'En vedette' },
  { value: 'price-asc',  label: 'Prix croissant' },
  { value: 'price-desc', label: 'Prix décroissant' },
  { value: 'newest',     label: 'Date d\'ajout récents' },
  { value: 'oldest',     label: 'Date d\'ajout anciens' },
]

export default function SortSelector() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const current = searchParams.get('sort') ?? 'featured'

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('sort', value)
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className='flex items-center gap-2'>
      <span className='text-sm text-muted-foreground whitespace-nowrap'>Trier par</span>
      <Select value={current} onValueChange={handleChange}>
        <SelectTrigger className='w-52 h-9 text-sm'>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {SORT_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
