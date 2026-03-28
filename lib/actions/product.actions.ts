'use server'

import Product, { IProduct } from '@/lib/db/models/product.model'
import { connectToDatabase } from '../db'
import { auth } from '@/auth'
import { ProductInputSchema } from '@/lib/validator'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { toSlug } from '@/lib/utils'

type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'newest' | 'oldest'

const SORT_MAP: Record<Exclude<SortOption, 'featured'>, Record<string, 1 | -1>> = {
  'price-asc':  { price: 1 },
  'price-desc': { price: -1 },
  newest:       { createdAt: -1 },
  oldest:       { createdAt: 1 },
}

export async function getProductsByTag({
  tag,
  limit = 10,
  sort = 'featured',
}: {
  tag: string
  limit?: number
  sort?: SortOption
}) {
  await connectToDatabase()

  const baseQuery = { tags: { $in: [tag] }, isPublished: true }

  if (sort === 'featured') {
    const products = await Product.find({ ...baseQuery, avgRating: { $gte: 4 } })
      .sort({ numReviews: -1, avgRating: -1 })
      .limit(limit)
    return JSON.parse(JSON.stringify(products)) as IProduct[]
  }

  const products = await Product.find(baseQuery)
    .sort(SORT_MAP[sort])
    .limit(limit)
  return JSON.parse(JSON.stringify(products)) as IProduct[]
}

export async function getPublishedProducts({
  limit = 100,
  sort = 'featured',
}: {
  limit?: number
  sort?: SortOption
} = {}) {
  await connectToDatabase()

  const baseQuery = { isPublished: true }

  if (sort === 'featured') {
    const products = await Product.find({ ...baseQuery, avgRating: { $gte: 4 } })
      .sort({ numReviews: -1, avgRating: -1 })
      .limit(limit)
    const rest = await Product.find({ ...baseQuery, avgRating: { $lt: 4 } })
      .sort({ createdAt: -1 })
      .limit(limit)
    return JSON.parse(JSON.stringify([...products, ...rest].slice(0, limit))) as IProduct[]
  }

  const products = await Product.find(baseQuery)
    .sort(SORT_MAP[sort])
    .limit(limit)
  return JSON.parse(JSON.stringify(products)) as IProduct[]
}

export async function getAllProducts({
  page = 1,
  limit = 20,
}: {
  page?: number
  limit?: number
} = {}) {
  await connectToDatabase()
  const skip = (page - 1) * limit
  const [products, total] = await Promise.all([
    Product.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Product.countDocuments(),
  ])
  return {
    products: JSON.parse(JSON.stringify(products)) as IProduct[],
    total,
    pages: Math.ceil(total / limit),
  }
}

export async function getProductBySlug(slug: string) {
  await connectToDatabase()
  const product = await Product.findOne({ slug })
  if (!product) return null
  return JSON.parse(JSON.stringify(product)) as IProduct
}

export async function getProductById(id: string) {
  await connectToDatabase()
  const product = await Product.findById(id)
  if (!product) return null
  return JSON.parse(JSON.stringify(product)) as IProduct
}

export async function createProduct(
  data: z.infer<typeof ProductInputSchema>
) {
  const session = await auth()
  if (session?.user?.role !== 'admin') {
    return { success: false, error: 'Non autorisé' }
  }

  const parsed = ProductInputSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message }
  }

  await connectToDatabase()
  const existing = await Product.findOne({ slug: parsed.data.slug })
  if (existing) {
    return { success: false, error: 'Un produit avec ce slug existe déjà.' }
  }

  const product = await Product.create(parsed.data)
  revalidatePath('/admin/products')
  revalidatePath('/')
  return { success: true, productId: product._id.toString() }
}

export async function updateProduct(
  id: string,
  data: z.infer<typeof ProductInputSchema>
) {
  const session = await auth()
  if (session?.user?.role !== 'admin') {
    return { success: false, error: 'Non autorisé' }
  }

  const parsed = ProductInputSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message }
  }

  await connectToDatabase()
  const product = await Product.findByIdAndUpdate(id, parsed.data, {
    new: true,
  })
  if (!product) return { success: false, error: 'Produit introuvable' }

  revalidatePath('/admin/products')
  revalidatePath('/')
  return { success: true }
}

export async function toggleProductPublished(id: string) {
  const session = await auth()
  if (session?.user?.role !== 'admin') {
    return { success: false, error: 'Non autorisé' }
  }

  await connectToDatabase()
  const product = await Product.findById(id)
  if (!product) return { success: false, error: 'Produit introuvable' }

  product.isPublished = !product.isPublished
  await product.save()

  revalidatePath('/admin/products')
  revalidatePath('/')
  return { success: true, isPublished: product.isPublished as boolean }
}

export async function deleteProduct(id: string) {
  const session = await auth()
  if (session?.user?.role !== 'admin') {
    return { success: false, error: 'Non autorisé' }
  }

  await connectToDatabase()
  const product = await Product.findByIdAndDelete(id)
  if (!product) return { success: false, error: 'Produit introuvable' }

  revalidatePath('/admin/products')
  revalidatePath('/')
  return { success: true }
}

export async function generateSlug(name: string) {
  return toSlug(name)
}
