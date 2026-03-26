import { signOut } from '@/auth'
import { LogOutIcon } from 'lucide-react'

export default function AccountSignOut() {
  return (
    <form
      action={async () => {
        'use server'
        await signOut({ redirectTo: '/' })
      }}
    >
      <button
        type='submit'
        className='w-full flex items-center gap-4 p-5 text-left hover:bg-destructive/5 transition-colors'
      >
        <div className='p-3 rounded-xl bg-red-50 text-red-500'>
          <LogOutIcon className='h-5 w-5' />
        </div>
        <div>
          <p className='font-semibold text-sm text-destructive'>Se déconnecter</p>
          <p className='text-xs text-muted-foreground'>Fermer la session en cours</p>
        </div>
        <span className='ml-auto text-muted-foreground text-lg'>›</span>
      </button>
    </form>
  )
}
