import { Document, Model, model, models, Schema } from 'mongoose'

export interface ICartItem {
  productId: string
  name: string
  images: string[]
  price: number
  listPrice: number
  qty: number
  slug: string
}

export interface ICart extends Document {
  _id: string
  userId: string
  items: ICartItem[]
  totalPrice: number
  createdAt: Date
  updatedAt: Date
}

const cartItemSchema = new Schema<ICartItem>(
  {
    productId: { type: String, required: true },
    name: { type: String, required: true },
    images: { type: [String], required: true },
    price: { type: Number, required: true },
    listPrice: { type: Number, required: true, default: 0 },
    qty: { type: Number, required: true, default: 1 },
    slug: { type: String, required: true },
  },
  { _id: false }
)

const cartSchema = new Schema<ICart>(
  {
    userId: { type: String, required: true, unique: true },
    items: [cartItemSchema],
    totalPrice: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
)

if (models.Cart) {
  delete (models as Record<string, unknown>).Cart
}
const Cart = model<ICart>('Cart', cartSchema)
export default Cart
