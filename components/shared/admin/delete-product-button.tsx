'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { deleteProduct } from '@/lib/actions/product.actions'
import { toast } from 'sonner'
import { Loader2, Trash2Icon } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function DeleteProductButton({
  productId,
}: {
  productId: string
}) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    setLoading(true)
    const result = await deleteProduct(productId)
    setLoading(false)
    if (result.success) {
      toast.success('Produit supprimé')
      setOpen(false)
      router.refresh()
    } else {
      toast.error(result.error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size='sm' variant='destructive'>
          <Trash2Icon className='h-4 w-4' />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Supprimer ce produit ?</DialogTitle>
          <DialogDescription>
            Cette action est irréversible. Le produit sera définitivement
            supprimé du catalogue.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant='outline' onClick={() => setOpen(false)}>
            Annuler
          </Button>
          <Button
            variant='destructive'
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className='h-4 w-4 animate-spin mr-2' />
            ) : null}
            Supprimer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
