'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { UserSignUpSchema } from '@/lib/validator'
import { signUpUser } from '@/lib/actions/user.actions'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { signIn } from 'next-auth/react'

type SignUpFormValues = z.infer<typeof UserSignUpSchema>

export default function SignUpForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(UserSignUpSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  })

  const onSubmit = async (values: SignUpFormValues) => {
    setError(null)
    const result = await signUpUser(values)
    if (!result.success) {
      setError(result.error || 'Une erreur est survenue.')
      return
    }
    await signIn('credentials', {
      redirect: false,
      email: values.email,
      password: values.password,
    })
    router.push('/')
    router.refresh()
  }

  return (
    <div className='w-full max-w-md bg-card rounded-2xl shadow-xl p-8 border border-border'>
      <div className='mb-6 text-center'>
        <h1 className='text-2xl font-bold text-foreground'>Créer un compte</h1>
        <p className='text-muted-foreground text-sm mt-1'>
          Rejoignez Oxygemstudio dès aujourd&apos;hui.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom</FormLabel>
                <FormControl>
                  <Input placeholder='Votre nom' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type='email'
                    placeholder='votre@email.fr'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mot de passe</FormLabel>
                <FormControl>
                  <div className='relative'>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder='••••••••'
                      {...field}
                    />
                    <button
                      type='button'
                      onClick={() => setShowPassword((v) => !v)}
                      className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground'
                    >
                      {showPassword ? (
                        <EyeOff className='h-4 w-4' />
                      ) : (
                        <Eye className='h-4 w-4' />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='confirmPassword'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirmer le mot de passe</FormLabel>
                <FormControl>
                  <Input
                    type='password'
                    placeholder='••••••••'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {error && (
            <p className='text-sm text-destructive bg-destructive/10 p-3 rounded-lg'>
              {error}
            </p>
          )}

          <Button
            type='submit'
            className='w-full gradient-primary text-white'
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <Loader2 className='h-4 w-4 animate-spin mr-2' />
            ) : null}
            Créer mon compte
          </Button>
        </form>
      </Form>

      <p className='mt-6 text-center text-sm text-muted-foreground'>
        Déjà un compte ?{' '}
        <Link
          href='/sign-in'
          className='text-primary font-medium hover:underline'
        >
          Se connecter
        </Link>
      </p>
    </div>
  )
}
