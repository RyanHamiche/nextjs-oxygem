import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import ProfileForm from '@/components/shared/account/profile-form'
import { Metadata } from 'next'
import { ChevronLeftIcon } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Mon profil' }

export default async function ProfilePage() {
  const session = await auth()
  if (!session?.user) redirect('/sign-in?callbackUrl=/account/profile')

  return (
    <div className='max-w-xl mx-auto px-4 py-8'>
      <Link
        href='/account'
        className='inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors'
      >
        <ChevronLeftIcon className='h-4 w-4' />
        Mon compte
      </Link>
      <h1 className='text-2xl font-bold mb-6'>Gérer mon profil</h1>
      <div className='bg-card rounded-2xl border border-border p-6'>
        <ProfileForm user={session.user} />
      </div>
    </div>
  )
}
