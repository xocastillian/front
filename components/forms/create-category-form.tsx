'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { CreateCategoryFormData, createCategorySchema } from '@/lib/validation/createCategorySchema'

type Props = {
	onSubmit: (data: CreateCategoryFormData) => void
	isLoading: boolean
}

export function CreateCategoryForm({ onSubmit, isLoading }: Props) {
	const form = useForm<CreateCategoryFormData>({
		resolver: zodResolver(createCategorySchema),
		defaultValues: {
			name: '',
			slug: '',
		},
	})

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
				<FormField
					name='name'
					control={form.control}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Название категории</FormLabel>
							<Input {...field} />
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					name='slug'
					control={form.control}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Slug (латиницей)</FormLabel>
							<Input {...field} />
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type='submit' disabled={isLoading}>
					{isLoading ? 'Загрузка...' : 'Создать категорию'}
				</Button>
			</form>
		</Form>
	)
}
