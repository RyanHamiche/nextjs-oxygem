import SignInForm from '@/components/shared/auth/sign-in-form'
import { Metadata } from 'next'

export const metadata: Metadata = { title: 'Connexion' }

export default function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>
}) {
  return <SignInForm searchParams={searchParams} />
}
