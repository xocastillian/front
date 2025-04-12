'use client'

import { useEffect, useState } from 'react'
import { useFieldArray, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ImagePlus, Loader2, X } from 'lucide-react'
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Category, Product } from '@/types'
import { ProductFormData, createProductSchema, updateProductSchema } from '@/lib/validation/productSchema'
import { ConfirmDialog } from '../ConfirmDialog/ConfirmDialog'

type Props = {
	categories: Category[]
	isLoading: boolean
	onSubmit: (data: ProductFormData) => void
	initialData?: Product | null
	onDelete?: () => void
}

export function ProductForm({ categories, isLoading, onSubmit, initialData, onDelete }: Props) {
	const form = useForm<ProductFormData>({
		resolver: zodResolver(initialData ? updateProductSchema : createProductSchema),
		defaultValues: {
			name: initialData?.name ?? '',
			description: initialData?.description ?? '',
			price: initialData?.price ?? undefined,
			categoryId: initialData?.categoryId?._id ?? '',
			options: initialData?.options ?? [''],
			image: null,
		},
	})

	const {
		handleSubmit,
		control,
		register,
		formState: { isDirty },
	} = form

	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: 'options',
	})

	const imageFileList = useWatch({ control, name: 'image' })
	const imageFile = imageFileList?.[0]

	const [preview, setPreview] = useState<string | null>(null)

	useEffect(() => {
		if (imageFile) {
			const objectUrl = URL.createObjectURL(imageFile)
			setPreview(objectUrl)
			return () => URL.revokeObjectURL(objectUrl)
		}
		if (initialData?.imageUrl) {
			setPreview(initialData.imageUrl)
		}
	}, [imageFile, initialData])

	return (
		<Form {...form}>
			<form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
				<fieldset disabled={isLoading} className='space-y-4'>
					<FormField
						name='name'
						control={control}
						render={({ field }) => (
							<FormItem>
								<FormLabel>Название</FormLabel>
								<Input {...field} />
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						name='description'
						control={control}
						render={({ field }) => (
							<FormItem>
								<FormLabel>Описание</FormLabel>
								<Textarea {...field} className='resize-none' maxLength={120} />
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						name='price'
						control={control}
						render={({ field }) => (
							<FormItem>
								<FormLabel>Цена</FormLabel>
								<Input
									type='text'
									inputMode='decimal'
									pattern='[0-9]*[.,]?[0-9]+'
									placeholder='Введите цену'
									value={field.value ?? ''}
									onChange={field.onChange}
								/>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						name='categoryId'
						control={control}
						render={({ field }) => (
							<FormItem>
								<FormLabel>Категория</FormLabel>
								<Select onValueChange={field.onChange} value={field.value}>
									<SelectTrigger className='w-full'>
										<SelectValue placeholder='Выберите категорию' />
									</SelectTrigger>
									<SelectContent>
										{categories.map(cat => (
											<SelectItem key={cat._id} value={cat._id}>
												{cat.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						name='image'
						control={control}
						render={({ field }) => (
							<FormItem>
								<FormLabel>Изображение</FormLabel>
								<div className='w-full'>
									<label className='group relative block w-full h-40 border border-dashed border-muted-foreground rounded-md cursor-pointer overflow-hidden hover:bg-muted/40 transition'>
										{preview ? (
											<img src={preview} alt='Превью' className='object-cover w-full h-full' /> // eslint-disable-line
										) : (
											<div className='flex flex-col items-center justify-center h-full text-muted-foreground'>
												<ImagePlus className='w-8 h-8 mb-1' />
												<span className='text-sm'>Добавить фото</span>
											</div>
										)}
										<Input
											type='file'
											accept='image/*'
											className='absolute inset-0 opacity-0 cursor-pointer'
											onChange={e => field.onChange(e.target.files)}
										/>
									</label>
								</div>
								<FormMessage />
							</FormItem>
						)}
					/>

					<div className='space-y-2'>
						<FormLabel>Опции</FormLabel>
						{fields.map((fieldItem, index) => (
							<div key={fieldItem.id} className='flex items-center gap-2'>
								<Input {...register(`options.${index}`)} placeholder={`Опция ${index + 1}`} />
								<Button type='button' variant='destructive' size='icon' onClick={() => remove(index)}>
									<X className='w-4 h-4' />
								</Button>
							</div>
						))}
						<Button type='button' variant='outline' onClick={() => append('')}>
							Добавить опцию
						</Button>
					</div>
				</fieldset>

				<div className='flex items-center gap-4'>
					{initialData && onDelete && (
						<ConfirmDialog
							trigger={
								<Button type='button' variant='destructive'>
									Удалить товар
								</Button>
							}
							title='Удаление товара'
							description='Вы уверены, что хотите удалить этот товар?'
							onConfirm={onDelete}
						/>
					)}

					<Button type='submit' disabled={isLoading || (!!initialData && !isDirty)}>
						{isLoading ? <Loader2 className='w-4 h-4 mr-2 animate-spin' /> : initialData ? 'Сохранить' : 'Создать'}
					</Button>
				</div>
			</form>
		</Form>
	)
}
