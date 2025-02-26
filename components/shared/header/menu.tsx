import { ShoppingCartIcon, UserIcon } from 'lucide-react'
import Link from 'next/link'

export default function Menu() {
  return (
    <div className='flex justify-end'>
      <nav className='flex gap-3 w-full'>
        <Link
          href='/cart'
          className='header-button flex items-center justify-center gap-2'
        >
          <UserIcon className='h-8 w-8' />
          <span className='font-bold hidden sm:inline'>Inscription</span>{' '}
          {/* Masqué sur mobile, affiché à partir de sm */}
        </Link>

        <Link
          href='/cart'
          className='header-button flex items-center justify-center gap-2'
        >
          <ShoppingCartIcon className='h-8 w-8' />
          <span className='font-bold hidden sm:inline'>Panier</span>{' '}
          {/* Masqué sur mobile, affiché à partir de sm */}
        </Link>
      </nav>
    </div>
  )
}
