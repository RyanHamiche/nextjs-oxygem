import SignUpForm from '@/components/shared/auth/sign-up-form'
import { Metadata } from 'next'

export const metadata: Metadata = { title: 'Inscription' }

export default function SignUpPage() {
  return <SignUpForm />
}
