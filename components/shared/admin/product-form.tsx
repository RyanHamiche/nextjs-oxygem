'use client'

import { useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ProductInputSchema } from '@/lib/validator'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import CommaSeparatedInput from '@/components/ui/comma-input'
import { Button } from '@/components/ui/button'
import { createProduct, updateProduct } from '@/lib/actions/product.actions'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Loader2, UploadIcon, XIcon } from 'lucide-react'
import { IProduct } from '@/lib/db/models/product.model'
import { toSlug } from '@/lib/utils'
import { useRef, useState } from 'react'
import Image from 'next/image'

type ProductFormValues = z.infer<typeof ProductInputSchema>

export default function ProductForm({
  product,
}: {
  product?: IProduct
}) {
  const router = useRouter()
  const isEdit = !!product
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    const current = form.getValues('images')

    for (const file of Array.from(files)) {
      const fd = new FormData()
      fd.append('file', file)
      try {
        const res = await fetch('/api/upload', { method: 'POST', body: fd })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error ?? 'Erreur upload')
        form.setValue('images', [...current, data.url], { shouldValidate: true })
        current.push(data.url)
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Erreur upload')
      }
    }

    setUploading(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const form = useForm<ProductFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(ProductInputSchema) as Resolver<ProductFormValues>,
    defaultValues: product
      ? {
          name: product.name,
          slug: product.slug,
          category: product.category,
          images: product.images,
          description: product.description,
          isPublished: product.isPublished,
          price: product.price,
          listPrice: product.listPrice,
          tags: product.tags,
          avgRating: product.avgRating,
          numReviews: product.numReviews,
          ratingDistribution: product.ratingDistribution,
          reviews: [],
          numSales: product.numSales,
        }
      : {
          name: '',
          slug: '',
          category: '',
          images: [],
          description: '',
          isPublished: false,
          price: 0,
          listPrice: 0,
          tags: [],
          avgRating: 0,
          numReviews: 0,
          ratingDistribution: [
            { rating: 1, count: 0 },
            { rating: 2, count: 0 },
            { rating: 3, count: 0 },
            { rating: 4, count: 0 },
            { rating: 5, count: 0 },
          ],
          reviews: [],
          numSales: 0,
        },
  })

  const onSubmit = async (values: ProductFormValues) => {
    const result = isEdit
      ? await updateProduct(product._id, values)
      : await createProduct(values)

    if (!result.success) {
      toast.error(result.error ?? 'Erreur')
      return
    }
    toast.success(isEdit ? 'Produit mis à jour' : 'Produit créé')
    router.push('/admin/products')
    router.refresh()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-5'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom du produit</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Ex: Ongles Roses Fleuris'
                    {...field}
                    onChange={(e) => {
                      field.onChange(e)
                      if (!isEdit) {
                        form.setValue('slug', toSlug(e.target.value))
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='slug'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug (URL)</FormLabel>
                <FormControl>
                  <Input placeholder='ongles-roses-fleuris' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='category'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Catégorie</FormLabel>
                <FormControl>
                  <Input placeholder='Ongles' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='price'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prix (€)</FormLabel>
                <FormControl>
                  <Input type='number' step='0.01' placeholder='40.00' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='listPrice'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prix barré (€) — optionnel</FormLabel>
                <FormControl>
                  <Input type='number' step='0.01' placeholder='0.00' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='images'
            render={({ field }) => (
              <FormItem className='md:col-span-2'>
                <FormLabel>Images</FormLabel>
                <FormControl>
                  <div className='space-y-3'>
                    {/* Prévisualisation */}
                    {field.value.length > 0 && (
                      <div className='flex flex-wrap gap-3'>
                        {field.value.map((url, i) => (
                          <div key={i} className='relative group h-20 w-20 rounded-xl overflow-hidden border bg-secondary/40 flex-shrink-0'>
                            <Image src={url} alt={`image ${i + 1}`} fill sizes='80px' className='object-cover' />
                            <button
                              type='button'
                              onClick={() => field.onChange(field.value.filter((_, j) => j !== i))}
                              className='absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity'
                            >
                              <XIcon className='h-5 w-5 text-white' />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Bouton upload */}
                    <input
                      ref={fileInputRef}
                      type='file'
                      accept='image/*'
                      multiple
                      className='hidden'
                      onChange={handleUpload}
                    />
                    <Button
                      type='button'
                      variant='outline'
                      size='sm'
                      disabled={uploading}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {uploading
                        ? <Loader2 className='h-4 w-4 animate-spin mr-2' />
                        : <UploadIcon className='h-4 w-4 mr-2' />}
                      Ajouter une image
                    </Button>

                    {/* Saisie manuelle */}
                    <CommaSeparatedInput
                      value={field.value}
                      onChange={field.onChange}
                      placeholder='/images/p1.jpg, /images/p1-hover.jpg'
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='tags'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tags (séparés par des virgules)</FormLabel>
                <FormControl>
                  <CommaSeparatedInput
                    value={field.value}
                    onChange={field.onChange}
                    placeholder='nouveautes, homepage, best-seller'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='isPublished'
            render={({ field }) => (
              <FormItem className='flex items-center gap-3 pt-6'>
                <FormControl>
                  <input
                    type='checkbox'
                    checked={field.value}
                    onChange={field.onChange}
                    className='h-4 w-4 accent-primary'
                  />
                </FormControl>
                <FormLabel className='!mt-0 cursor-pointer'>
                  Publié (visible sur le site)
                </FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder='Décrivez votre produit...'
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='flex gap-3 pt-2'>
          <Button
            type='submit'
            className='gradient-primary text-white'
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <Loader2 className='h-4 w-4 animate-spin mr-2' />
            ) : null}
            {isEdit ? 'Mettre à jour' : 'Créer le produit'}
          </Button>
          <Button
            type='button'
            variant='outline'
            onClick={() => router.back()}
          >
            Annuler
          </Button>
        </div>
      </form>
    </Form>
  )
}
