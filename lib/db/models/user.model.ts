import { Document, Model, model, models, Schema } from 'mongoose'

export interface IUser extends Document {
  _id: string
  name: string
  email: string
  password?: string
  role: 'user' | 'admin'
  image?: string
  createdAt: Date
  updatedAt: Date
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    image: { type: String },
  },
  { timestamps: true }
)

const User = (models.User as Model<IUser>) || model<IUser>('User', userSchema)
export default User
