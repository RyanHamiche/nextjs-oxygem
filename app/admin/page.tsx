import { getAllProducts } from '@/lib/actions/product.actions'
import { getAllOrders } from '@/lib/actions/order.actions'
import { connectToDatabase } from '@/lib/db'
import User from '@/lib/db/models/user.model'
import { PackageIcon, ShoppingBagIcon, UsersIcon, TrendingUpIcon } from 'lucide-react'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils'
import { Metadata } from 'next'

export const metadata: Metadata = { title: 'Dashboard Admin' }

async function getStats() {
  const [{ total: totalProducts }, orders] = await Promise.all([
    getAllProducts(),
    getAllOrders(),
  ])
  await connectToDatabase()
  const totalUsers = await User.countDocuments()
  const totalRevenue = orders.reduce(
    (sum: number, o: { totalPrice: number; isPaid: boolean }) =>
      o.isPaid ? sum + o.totalPrice : sum,
    0
  )
  return { totalProducts, totalOrders: orders.length, totalUsers, totalRevenue }
}

export default async function AdminDashboard() {
  const { totalProducts, totalOrders, totalUsers, totalRevenue } =
    await getStats()

  const stats = [
    {
      label: 'Produits',
      value: totalProducts,
      icon: PackageIcon,
      href: '/admin/products',
      color: 'text-violet-500',
      bg: 'bg-violet-50',
    },
    {
      label: 'Commandes',
      value: totalOrders,
      icon: ShoppingBagIcon,
      href: '/admin/orders',
      color: 'text-pink-500',
      bg: 'bg-pink-50',
    },
    {
      label: 'Utilisateurs',
      value: totalUsers,
      icon: UsersIcon,
      href: '#',
      color: 'text-blue-500',
      bg: 'bg-blue-50',
    },
    {
      label: 'Revenus',
      value: formatCurrency(totalRevenue),
      icon: TrendingUpIcon,
      href: '/admin/orders',
      color: 'text-green-500',
      bg: 'bg-green-50',
    },
  ]

  return (
    <div>
      <h1 className='text-2xl font-bold mb-6'>Dashboard</h1>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className='bg-card rounded-2xl border border-border p-5 hover:shadow-md transition-all hover:-translate-y-0.5'
          >
            <div className='flex items-center justify-between mb-3'>
              <p className='text-sm font-medium text-muted-foreground'>
                {stat.label}
              </p>
              <div className={`${stat.bg} p-2 rounded-lg`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </div>
            <p className='text-2xl font-bold'>{stat.value}</p>
          </Link>
        ))}
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <Link
          href='/admin/products/create'
          className='bg-primary/10 border border-primary/20 rounded-2xl p-5 hover:bg-primary/15 transition-colors'
        >
          <h3 className='font-semibold text-primary mb-1'>
            + Ajouter un produit
          </h3>
          <p className='text-sm text-muted-foreground'>
            Créer un nouveau produit dans le catalogue
          </p>
        </Link>
        <Link
          href='/admin/products'
          className='bg-card border border-border rounded-2xl p-5 hover:shadow-md transition-all'
        >
          <h3 className='font-semibold mb-1'>Gérer les produits</h3>
          <p className='text-sm text-muted-foreground'>
            Modifier ou supprimer les produits existants
          </p>
        </Link>
      </div>
    </div>
  )
}
