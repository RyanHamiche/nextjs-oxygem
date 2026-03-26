import { signOut } from '@/auth'
import { LogOutIcon } from 'lucide-react'

export default function AdminSignOut() {
  return (
    <form
      action={async () => {
        'use server'
        await signOut({ redirectTo: '/' })
      }}
    >
      <button
        type='submit'
        className='w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors'
      >
        <LogOutIcon className='h-4 w-4' />
        Se déconnecter
      </button>
    </form>
  )
}
