'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { payOrder } from '@/lib/actions/order.actions'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { CreditCardIcon, Loader2 } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

export default function PayButton({
  orderId,
  total,
}: {
  orderId: string
  total: number
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handlePay = async () => {
    setLoading(true)
    const result = await payOrder(orderId)
    setLoading(false)
    if (result.success) {
      toast.success('Paiement confirmé !')
      router.refresh()
    } else {
      toast.error(result.error ?? 'Erreur lors du paiement')
    }
  }

  return (
    <div className='bg-card rounded-2xl border border-border p-6'>
      <h2 className='font-semibold mb-2'>Paiement</h2>
      <p className='text-sm text-muted-foreground mb-4'>
        Montant à payer :{' '}
        <span className='font-bold text-primary'>{formatCurrency(total)}</span>
      </p>
      <div className='bg-secondary/50 rounded-xl p-4 mb-4 text-sm text-muted-foreground'>
        <p className='font-medium text-foreground mb-1'>Mode de paiement simulé</p>
        <p>
          Cliquez sur le bouton ci-dessous pour simuler le paiement de votre
          commande. Aucun débit réel ne sera effectué.
        </p>
      </div>
      <Button
        className='w-full gradient-primary text-white'
        onClick={handlePay}
        disabled={loading}
      >
        {loading ? (
          <Loader2 className='h-4 w-4 animate-spin mr-2' />
        ) : (
          <CreditCardIcon className='h-4 w-4 mr-2' />
        )}
        Confirmer le paiement ({formatCurrency(total)})
      </Button>
    </div>
  )
}
