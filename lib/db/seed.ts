import data from '@/lib/data'
import { connectToDatabase } from '.'
import Product from './models/product.model'
import User from './models/user.model'
import { cwd } from 'process'
import { loadEnvConfig } from '@next/env'
import bcrypt from 'bcryptjs'

loadEnvConfig(cwd())

const main = async () => {
  try {
    const { products } = data
    await connectToDatabase(process.env.MONGODB_URI)

    await Product.deleteMany()
    const createdProducts = await Product.insertMany(products)

    await User.deleteMany()
    const adminPassword = await bcrypt.hash('admin123', 10)
    const userPassword = await bcrypt.hash('user123', 10)
    const createdUsers = await User.insertMany([
      {
        name: 'Admin Oxygem',
        email: 'admin@oxygem.fr',
        password: adminPassword,
        role: 'admin',
      },
      {
        name: 'Utilisateur Test',
        email: 'user@oxygem.fr',
        password: userPassword,
        role: 'user',
      },
    ])

    console.log({ createdProducts, createdUsers, message: 'Base de données initialisée' })
    process.exit(0)
  } catch (error) {
    console.error(error)
    throw new Error('Échec de l\'initialisation')
  }
}

main()
