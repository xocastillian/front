import * as z from 'zod'

export const createProductSchema = z.object({
	name: z.string().min(1, 'Введите название'),
	description: z.string().min(1, 'Введите описание'),
	price: z.coerce.number().positive('Цена должна быть больше 0'),
	categoryId: z.string().min(1, 'Выберите категорию'),
	options: z.array(z.string().min(1)).optional(),
	image: z.any().refine(file => file instanceof File || (file && file.length > 0), {
		message: 'Загрузите изображение',
	}),
})

export type CreateProductFormData = z.infer<typeof createProductSchema>
