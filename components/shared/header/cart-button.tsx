'use client'

import { ShoppingCartIcon } from 'lucide-react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { getCartItemCount } from '@/lib/actions/cart.actions'

export default function CartButton() {
  const { data: session } = useSession()
  const [itemCount, setItemCount] = useState(0)

  useEffect(() => {
    if (!session?.user?.id) {
      setItemCount(0)
      return
    }
    getCartItemCount().then(setItemCount)
  }, [session?.user?.id])

  return (
    <Link
      href='/cart'
      className='header-button relative flex items-center justify-center gap-2'
    >
      <div className='relative'>
        <ShoppingCartIcon className='h-5 w-5' />
        {itemCount > 0 && (
          <Badge className='absolute -top-2 -right-2 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-primary text-primary-foreground rounded-full'>
            {itemCount > 9 ? '9+' : itemCount}
          </Badge>
        )}
      </div>
      <span className='font-bold hidden sm:inline text-sm'>Panier</span>
    </Link>
  )
}
