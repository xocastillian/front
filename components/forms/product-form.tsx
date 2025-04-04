import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { X } from 'lucide-react'
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Category } from '@/types'
import { ProductFormData, productSchema } from '@/lib/validation/productSchema'

type Props = {
	categories: Category[]
	isLoading: boolean
	onSubmit: (data: ProductFormData) => void
}

export function ProductForm({ categories, isLoading, onSubmit }: Props) {
	const form = useForm<ProductFormData>({
		resolver: zodResolver(productSchema),
		defaultValues: {
			name: '',
			description: '',
			price: undefined,
			categoryId: '',
			options: [''],
			image: null,
		},
	})

	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: 'options',
	})

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
				<FormField
					name='name'
					control={form.control}
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
					control={form.control}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Описание</FormLabel>
							<Textarea {...field} className='resize-none' />
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					name='price'
					control={form.control}
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
					control={form.control}
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
					control={form.control}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Изображение</FormLabel>
							<Input type='file' accept='image/*' onChange={e => field.onChange(e.target.files)} />
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className='space-y-2'>
					<FormLabel>Опции</FormLabel>
					{fields.map((fieldItem, index) => (
						<div key={fieldItem.id} className='flex items-center gap-2'>
							<Input {...form.register(`options.${index}`)} placeholder={`Опция ${index + 1}`} />
							<Button type='button' variant='destructive' size='icon' onClick={() => remove(index)}>
								<X className='w-4 h-4' />
							</Button>
						</div>
					))}
					<Button type='button' variant='outline' onClick={() => append('')}>
						Добавить опцию
					</Button>
				</div>

				<Button type='submit' disabled={isLoading}>
					{isLoading ? 'Загрузка...' : 'Создать'}
				</Button>
			</form>
		</Form>
	)
}
