import * as z from 'zod'

export const createCategorySchema = z.object({
	name: z.string().min(1, 'Введите название'),
	slug: z.string().min(1, 'Введите slug (латиницей)'),
})

export type CreateCategoryFormData = z.infer<typeof createCategorySchema>
