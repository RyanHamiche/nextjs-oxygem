import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { randomUUID } from 'crypto'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (session?.user?.role !== 'admin') {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  if (!file) {
    return NextResponse.json({ error: 'Aucun fichier reçu' }, { status: 400 })
  }

  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: 'Format non supporté (jpg, png, webp, gif, avif)' }, { status: 400 })
  }

  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
  const filename = `${randomUUID()}.${ext}`
  const imagesDir = path.join(process.cwd(), 'public', 'images')

  if (!existsSync(imagesDir)) {
    await mkdir(imagesDir, { recursive: true })
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  await writeFile(path.join(imagesDir, filename), buffer)

  return NextResponse.json({ url: `/images/${filename}` })
}
