'use server'

import { auth } from '@/auth'
import { connectToDatabase } from '@/lib/db'
import Cart from '@/lib/db/models/cart.model'
import Product from '@/lib/db/models/product.model'
import { revalidatePath } from 'next/cache'

function calcTotal(items: { price: number; qty: number }[]): number {
  return parseFloat(
    items.reduce((sum, item) => sum + item.price * item.qty, 0).toFixed(2)
  )
}

export async function addToCart(productId: string, qty = 1) {
  const session = await auth()
  if (!session?.user?.id) return { success: false, error: 'Non connecté' }

  await connectToDatabase()
  const product = await Product.findById(productId)
  if (!product) return { success: false, error: 'Produit introuvable' }

  let cart = await Cart.findOne({ userId: session.user.id })
  if (!cart) {
    cart = new Cart({ userId: session.user.id, items: [], totalPrice: 0 })
  }

  const existingItem = cart.items.find(
    (i: { productId: string }) => i.productId === productId
  )
  if (existingItem) {
    existingItem.qty += qty
  } else {
    cart.items.push({
      productId,
      name: product.name,
      images: product.images,
      price: product.price,
      listPrice: product.listPrice,
      qty,
      slug: product.slug,
    })
  }

  cart.totalPrice = calcTotal(cart.items)
  await cart.save()
  revalidatePath('/cart')
  return { success: true }
}

export async function removeFromCart(productId: string) {
  const session = await auth()
  if (!session?.user?.id) return { success: false, error: 'Non connecté' }

  await connectToDatabase()
  const cart = await Cart.findOne({ userId: session.user.id })
  if (!cart) return { success: false, error: 'Panier introuvable' }

  cart.items = cart.items.filter(
    (i: { productId: string }) => i.productId !== productId
  )
  cart.totalPrice = calcTotal(cart.items)
  await cart.save()
  revalidatePath('/cart')
  return { success: true }
}

export async function updateCartQty(productId: string, qty: number) {
  const session = await auth()
  if (!session?.user?.id) return { success: false, error: 'Non connecté' }

  await connectToDatabase()
  const cart = await Cart.findOne({ userId: session.user.id })
  if (!cart) return { success: false, error: 'Panier introuvable' }

  const item = cart.items.find(
    (i: { productId: string }) => i.productId === productId
  )
  if (item) {
    if (qty <= 0) {
      cart.items = cart.items.filter(
        (i: { productId: string }) => i.productId !== productId
      )
    } else {
      item.qty = qty
    }
  }

  cart.totalPrice = calcTotal(cart.items)
  await cart.save()
  revalidatePath('/cart')
  return { success: true }
}

export async function getCart() {
  const session = await auth()
  if (!session?.user?.id) return null

  await connectToDatabase()
  const cart = await Cart.findOne({ userId: session.user.id })
  if (!cart) return null
  return JSON.parse(JSON.stringify(cart))
}

export async function getCartItemCount(): Promise<number> {
  const session = await auth()
  if (!session?.user?.id) return 0

  await connectToDatabase()
  const cart = await Cart.findOne({ userId: session.user.id }).select('items.qty')
  if (!cart) return 0
  return cart.items.reduce((sum: number, item: { qty: number }) => sum + item.qty, 0)
}

export async function clearCart() {
  const session = await auth()
  if (!session?.user?.id) return { success: false, error: 'Non connecté' }

  await connectToDatabase()
  await Cart.findOneAndDelete({ userId: session.user.id })
  revalidatePath('/cart')
  return { success: true }
}
