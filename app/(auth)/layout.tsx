import { APP_NAME } from '@/lib/constants'
import Image from 'next/image'
import Link from 'next/link'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-secondary via-background to-accent/30 px-4'>
      <div className='mb-8'>
        <Link href='/' className='flex items-center gap-2'>
          <Image
            src='/icons/oxygemlogo.svg'
            width={40}
            height={40}
            alt={`${APP_NAME} logo`}
            style={{ width: 40, height: 'auto' }}
          />
          <span className='text-2xl font-bold text-primary'>{APP_NAME}</span>
        </Link>
      </div>
      {children}
    </div>
  )
}
