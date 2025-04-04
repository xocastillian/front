import * as z from 'zod'

export const categorySchema = z.object({
	name: z.string().min(1, 'Введите название'),
	slug: z.string().min(1, 'Введите slug (латиницей)'),
})

export type CategoryFormData = z.infer<typeof categorySchema>
