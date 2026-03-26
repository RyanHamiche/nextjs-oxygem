'use server'

import { auth } from '@/auth'
import { connectToDatabase } from '@/lib/db'
import Cart from '@/lib/db/models/cart.model'
import Order from '@/lib/db/models/order.model'
import { IShippingAddress } from '@/lib/validator'
import { revalidatePath } from 'next/cache'

export async function createOrder(shippingAddress: IShippingAddress) {
  const session = await auth()
  if (!session?.user?.id) return { success: false, error: 'Non connecté' }

  await connectToDatabase()
  const cart = await Cart.findOne({ userId: session.user.id })
  if (!cart || cart.items.length === 0) {
    return { success: false, error: 'Panier vide' }
  }

  const order = await Order.create({
    userId: session.user.id,
    items: cart.items,
    shippingAddress,
    totalPrice: cart.totalPrice,
    isPaid: false,
    isDelivered: false,
    status: 'pending',
  })

  await Cart.findOneAndDelete({ userId: session.user.id })
  revalidatePath('/orders')
  revalidatePath('/cart')

  return { success: true, orderId: order._id.toString() }
}

export async function payOrder(orderId: string) {
  const session = await auth()
  if (!session?.user?.id) return { success: false, error: 'Non connecté' }

  await connectToDatabase()
  const order = await Order.findOne({
    _id: orderId,
    userId: session.user.id,
  })
  if (!order) return { success: false, error: 'Commande introuvable' }

  order.isPaid = true
  order.paidAt = new Date()
  order.status = 'processing'
  await order.save()
  revalidatePath(`/orders/${orderId}`)
  revalidatePath('/orders')

  return { success: true }
}

export async function getMyOrders() {
  const session = await auth()
  if (!session?.user?.id) return []

  await connectToDatabase()
  const orders = await Order.find({ userId: session.user.id }).sort({
    createdAt: -1,
  })
  return JSON.parse(JSON.stringify(orders))
}

export async function getOrderById(orderId: string) {
  const session = await auth()
  if (!session?.user?.id) return null

  await connectToDatabase()
  const order = await Order.findOne({
    _id: orderId,
    userId: session.user.id,
  })
  if (!order) return null
  return JSON.parse(JSON.stringify(order))
}

export async function getAllOrders() {
  const session = await auth()
  if (session?.user?.role !== 'admin') return []

  await connectToDatabase()
  const orders = await Order.find({}).sort({ createdAt: -1 })
  return JSON.parse(JSON.stringify(orders))
}
