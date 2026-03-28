'use client'

import { useState } from 'react'
import { ShoppingCartIcon, CheckIcon, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { addToCart } from '@/lib/actions/cart.actions'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

export default function AddToCartButton({
  productId,
  large = false,
}: {
  productId: string
  large?: boolean
}) {
  const { data: session } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [added, setAdded] = useState(false)

  const handleAdd = async () => {
    if (!session?.user) {
      router.push('/sign-in')
      return
    }
    setLoading(true)
    const result = await addToCart(productId, 1)
    setLoading(false)
    if (result.success) {
      setAdded(true)
      toast.success('Ajouté au panier')
      window.dispatchEvent(new CustomEvent('cart-updated', { detail: result.cartItemCount }))
      setTimeout(() => setAdded(false), 2000)
    } else {
      toast.error(result.error ?? 'Erreur')
    }
  }

  return (
    <Button
      size={large ? 'lg' : 'sm'}
      variant={added ? 'default' : 'outline'}
      className={`w-full transition-all duration-200 ${large ? 'text-base h-12' : 'text-xs'} ${
        added ? 'gradient-primary text-white border-0' : 'hover:border-primary hover:text-primary'
      }`}
      onClick={handleAdd}
      disabled={loading}
    >
      {loading ? (
        <Loader2 className={large ? 'h-5 w-5 animate-spin' : 'h-3 w-3 animate-spin'} />
      ) : added ? (
        <>
          <CheckIcon className={large ? 'h-5 w-5 mr-2' : 'h-3 w-3 mr-1'} />
          Ajouté
        </>
      ) : (
        <>
          <ShoppingCartIcon className={large ? 'h-5 w-5 mr-2' : 'h-3 w-3 mr-1'} />
          Ajouter au panier
        </>
      )}
    </Button>
  )
}
