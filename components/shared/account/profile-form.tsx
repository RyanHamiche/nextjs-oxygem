'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { updateProfile } from '@/lib/actions/user.actions'
import { toast } from 'sonner'
import { Loader2, Eye, EyeOff } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

export default function ProfileForm({
  user,
}: {
  user: { name?: string | null; email?: string | null }
}) {
  const router = useRouter()
  const { update } = useSession()
  const [loading, setLoading] = useState(false)
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      name: user.name ?? '',
      currentPassword: '',
      newPassword: '',
    },
  })

  const newPassword = watch('newPassword')

  const onSubmit = async (values: { name: string; currentPassword: string; newPassword: string }) => {
    setLoading(true)
    const result = await updateProfile({
      name: values.name,
      currentPassword: values.currentPassword || undefined,
      newPassword: values.newPassword || undefined,
    })
    setLoading(false)
    if (!result.success) {
      toast.error(result.error)
    } else {
      await update({ name: values.name })
      toast.success('Profil mis à jour')
      router.refresh()
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
      {/* Nom */}
      <div className='space-y-2'>
        <Label htmlFor='name'>Nom</Label>
        <Input
          id='name'
          {...register('name', { required: 'Le nom est requis', minLength: { value: 2, message: 'Minimum 2 caractères' } })}
        />
        {errors.name && (
          <p className='text-xs text-destructive'>{errors.name.message}</p>
        )}
      </div>

      {/* Email (lecture seule) */}
      <div className='space-y-2'>
        <Label>Email</Label>
        <Input value={user.email ?? ''} disabled className='bg-muted/50 cursor-not-allowed' />
        <p className='text-xs text-muted-foreground'>L&apos;email ne peut pas être modifié.</p>
      </div>

      <Separator />

      <p className='text-sm font-medium'>Changer le mot de passe <span className='text-muted-foreground font-normal'>(optionnel)</span></p>

      {/* Mot de passe actuel */}
      <div className='space-y-2'>
        <Label htmlFor='currentPassword'>Mot de passe actuel</Label>
        <div className='relative'>
          <Input
            id='currentPassword'
            type={showCurrent ? 'text' : 'password'}
            placeholder='••••••••'
            {...register('currentPassword')}
          />
          <button
            type='button'
            onClick={() => setShowCurrent(v => !v)}
            className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground'
          >
            {showCurrent ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
          </button>
        </div>
      </div>

      {/* Nouveau mot de passe */}
      <div className='space-y-2'>
        <Label htmlFor='newPassword'>Nouveau mot de passe</Label>
        <div className='relative'>
          <Input
            id='newPassword'
            type={showNew ? 'text' : 'password'}
            placeholder='••••••••'
            {...register('newPassword', {
              validate: v => !v || v.length >= 6 || 'Minimum 6 caractères',
            })}
          />
          <button
            type='button'
            onClick={() => setShowNew(v => !v)}
            className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground'
          >
            {showNew ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
          </button>
        </div>
        {errors.newPassword && (
          <p className='text-xs text-destructive'>{errors.newPassword.message}</p>
        )}
        {newPassword && newPassword.length > 0 && newPassword.length < 6 && (
          <p className='text-xs text-muted-foreground'>{newPassword.length}/6 caractères minimum</p>
        )}
      </div>

      <Button
        type='submit'
        className='w-full gradient-primary text-white'
        disabled={loading}
      >
        {loading && <Loader2 className='h-4 w-4 animate-spin mr-2' />}
        Enregistrer les modifications
      </Button>
    </form>
  )
}
