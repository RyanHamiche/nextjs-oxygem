'use client'

import { useSession } from 'next-auth/react'
import { UserIcon } from 'lucide-react'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import CartButton from './cart-button'

export default function Menu() {
  const { data: session, status } = useSession()
  const user = session?.user

  return (
    <div className='flex justify-end items-center gap-1'>
      <CartButton />

      {status === 'loading' ? (
        <div className='h-8 w-8 rounded-full bg-primary/20 animate-pulse' />
      ) : user ? (
        <Link
          href='/account'
          className='header-button flex items-center gap-2 px-2 py-1'
        >
          <Avatar className='h-8 w-8'>
            <AvatarImage src={user.image ?? ''} alt={user.name ?? ''} />
            <AvatarFallback className='bg-primary text-primary-foreground text-sm font-bold'>
              {user.name?.charAt(0).toUpperCase() ?? 'U'}
            </AvatarFallback>
          </Avatar>
          <span className='font-medium hidden sm:inline text-sm'>
            {user.name?.split(' ')[0]}
          </span>
        </Link>
      ) : (
        <Link
          href='/sign-in'
          className='header-button flex items-center justify-center gap-2'
        >
          <UserIcon className='h-5 w-5' />
          <span className='font-bold hidden sm:inline text-sm'>Connexion</span>
        </Link>
      )}
    </div>
  )
}
