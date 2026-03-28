'use client'

import { useState } from 'react'
import { toggleProductPublished } from '@/lib/actions/product.actions'
import { toast } from 'sonner'
import { Switch } from '@/components/ui/switch'
import { Loader2 } from 'lucide-react'

export default function TogglePublishedButton({
  productId,
  isPublished,
}: {
  productId: string
  isPublished: boolean
}) {
  const [checked, setChecked] = useState(isPublished)
  const [loading, setLoading] = useState(false)

  const handleToggle = async () => {
    setLoading(true)
    const result = await toggleProductPublished(productId)
    setLoading(false)
    if (result.success) {
      setChecked(result.isPublished!)
      toast.success(result.isPublished ? 'Produit affiché sur le site' : 'Produit masqué du site')
    } else {
      toast.error(result.error)
    }
  }

  return (
    <div className='flex items-center gap-2'>
      {loading ? (
        <Loader2 className='h-4 w-4 animate-spin text-muted-foreground' />
      ) : (
        <Switch
          checked={checked}
          onCheckedChange={handleToggle}
          aria-label='Afficher sur le site'
        />
      )}
      <span className='text-xs text-muted-foreground whitespace-nowrap'>
        {checked ? 'Affiché' : 'Masqué'}
      </span>
    </div>
  )
}
