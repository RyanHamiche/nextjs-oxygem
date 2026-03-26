'use server'

import bcrypt from 'bcryptjs'
import { connectToDatabase } from '@/lib/db'
import User from '@/lib/db/models/user.model'
import { UserSignUpSchema } from '@/lib/validator'
import { z } from 'zod'
import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'

export async function updateProfile(data: { name: string; currentPassword?: string; newPassword?: string }) {
  const session = await auth()
  if (!session?.user?.id) return { success: false, error: 'Non connecté' }

  await connectToDatabase()
  const user = await User.findById(session.user.id)
  if (!user) return { success: false, error: 'Utilisateur introuvable' }

  if (data.name.trim().length < 2) {
    return { success: false, error: 'Le nom doit contenir au moins 2 caractères' }
  }
  user.name = data.name.trim()

  if (data.newPassword) {
    if (!data.currentPassword) {
      return { success: false, error: 'Le mot de passe actuel est requis' }
    }
    if (!user.password) {
      return { success: false, error: 'Impossible de changer le mot de passe' }
    }
    const valid = await bcrypt.compare(data.currentPassword, user.password)
    if (!valid) {
      return { success: false, error: 'Mot de passe actuel incorrect' }
    }
    if (data.newPassword.length < 6) {
      return { success: false, error: 'Le nouveau mot de passe doit contenir au moins 6 caractères' }
    }
    user.password = await bcrypt.hash(data.newPassword, 10)
  }

  await user.save()
  revalidatePath('/account')
  return { success: true }
}

export async function signUpUser(data: z.infer<typeof UserSignUpSchema>) {
  const parsed = UserSignUpSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message }
  }

  const { name, email, password } = parsed.data

  await connectToDatabase()
  const existing = await User.findOne({ email })
  if (existing) {
    return { success: false, error: 'Un compte avec cet email existe déjà.' }
  }

  const hashedPassword = await bcrypt.hash(password, 10)
  await User.create({ name, email, password: hashedPassword, role: 'user' })

  return { success: true }
}
