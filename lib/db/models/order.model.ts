import { Document, Model, model, models, Schema } from 'mongoose'
import { IShippingAddress } from '@/lib/validator'

export interface IOrderItem {
  productId: string
  name: string
  images: string[]
  price: number
  qty: number
  slug: string
}

export interface IOrder extends Document {
  _id: string
  userId: string
  items: IOrderItem[]
  shippingAddress: IShippingAddress
  totalPrice: number
  isPaid: boolean
  paidAt?: Date
  isDelivered: boolean
  deliveredAt?: Date
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  createdAt: Date
  updatedAt: Date
}

const orderItemSchema = new Schema<IOrderItem>(
  {
    productId: { type: String, required: true },
    name: { type: String, required: true },
    images: { type: [String], required: true },
    price: { type: Number, required: true },
    qty: { type: Number, required: true },
    slug: { type: String, required: true },
  },
  { _id: false }
)

const shippingAddressSchema = new Schema(
  {
    fullName: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  { _id: false }
)

const orderSchema = new Schema<IOrder>(
  {
    userId: { type: String, required: true },
    items: [orderItemSchema],
    shippingAddress: { type: shippingAddressSchema, required: true },
    totalPrice: { type: Number, required: true },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    isDelivered: { type: Boolean, default: false },
    deliveredAt: { type: Date },
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
  },
  { timestamps: true }
)

if (models.Order) {
  delete (models as Record<string, unknown>).Order
}
const Order = model<IOrder>('Order', orderSchema)
export default Order
