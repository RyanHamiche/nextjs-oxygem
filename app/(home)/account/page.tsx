import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
  PackageIcon,
  UserCircleIcon,
  ShieldCheckIcon,
  LayoutDashboardIcon,
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import AccountSignOut from '@/components/shared/account/account-sign-out'
import { Metadata } from 'next'

export const metadata: Metadata = { title: 'Mon compte' }

export default async function AccountPage() {
  const session = await auth()
  if (!session?.user) redirect('/sign-in?callbackUrl=/account')

  const user = session.user

  const links = [
    {
      href: '/orders',
      icon: PackageIcon,
      label: 'Mes commandes',
      description: 'Consulter et suivre vos commandes',
      color: 'bg-violet-50 text-violet-500',
    },
    {
      href: '/account/profile',
      icon: UserCircleIcon,
      label: 'Gérer mon profil',
      description: 'Modifier votre nom et votre mot de passe',
      color: 'bg-pink-50 text-pink-500',
    },
  ]

  if (user.role === 'admin') {
    links.push({
      href: '/admin',
      icon: LayoutDashboardIcon,
      label: 'Dashboard admin',
      description: 'Gérer les produits et les commandes',
      color: 'bg-blue-50 text-blue-500',
    })
  }

  return (
    <div className='max-w-xl mx-auto px-4 py-10'>
      {/* En-tête profil */}
      <div className='flex items-center gap-4 mb-8'>
        <Avatar className='h-16 w-16 border-2 border-primary/20'>
          <AvatarImage src={user.image ?? ''} alt={user.name ?? ''} />
          <AvatarFallback className='bg-primary text-primary-foreground text-2xl font-bold'>
            {user.name?.charAt(0).toUpperCase() ?? 'U'}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className='text-xl font-bold'>{user.name}</h1>
          <p className='text-sm text-muted-foreground'>{user.email}</p>
          {user.role === 'admin' && (
            <span className='inline-flex items-center gap-1 mt-1 text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full'>
              <ShieldCheckIcon className='h-3 w-3' />
              Administrateur
            </span>
          )}
        </div>
      </div>

      <Separator className='mb-6' />

      {/* Cartes de navigation */}
      <div className='space-y-3'>
        {links.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className='flex items-center gap-4 bg-card border border-border rounded-2xl p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200'
          >
            <div className={`p-3 rounded-xl ${item.color}`}>
              <item.icon className='h-5 w-5' />
            </div>
            <div>
              <p className='font-semibold text-sm'>{item.label}</p>
              <p className='text-xs text-muted-foreground'>{item.description}</p>
            </div>
            <span className='ml-auto text-muted-foreground text-lg'>›</span>
          </Link>
        ))}

        {/* Déconnexion */}
        <div className='bg-card border border-border rounded-2xl overflow-hidden'>
          <AccountSignOut />
        </div>
      </div>
    </div>
  )
}
