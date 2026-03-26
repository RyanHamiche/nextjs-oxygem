import Link from 'next/link'
import { APP_NAME } from '@/lib/constants'
import Image from 'next/image'
import { LayoutDashboardIcon, PackageIcon, ShoppingBagIcon } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import AdminSignOut from '@/components/shared/admin/admin-sign-out'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboardIcon },
  { href: '/admin/products', label: 'Produits', icon: PackageIcon },
  { href: '/admin/orders', label: 'Commandes', icon: ShoppingBagIcon },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className='flex min-h-screen bg-background'>
      <aside className='w-60 flex-shrink-0 border-r border-border bg-card flex flex-col'>
        <div className='p-4 flex items-center gap-2'>
          <Image
            src='/icons/oxygemlogo.svg'
            width={32}
            height={32}
            alt={APP_NAME}
            style={{ width: 32, height: 'auto' }}
          />
          <div>
            <p className='font-bold text-primary text-sm'>{APP_NAME}</p>
            <p className='text-xs text-muted-foreground'>Administration</p>
          </div>
        </div>
        <Separator />
        <nav className='flex-1 p-3 space-y-1'>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className='flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors'
            >
              <item.icon className='h-4 w-4' />
              {item.label}
            </Link>
          ))}
        </nav>
        <Separator />
        <div className='p-3 space-y-1'>
          <Link
            href='/'
            className='flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors'
          >
            ← Retour au site
          </Link>
          <AdminSignOut />
        </div>
      </aside>
      <main className='flex-1 overflow-auto'>
        <div className='p-6'>{children}</div>
      </main>
    </div>
  )
}
