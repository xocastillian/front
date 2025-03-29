import { z } from 'zod'

export const registerSchema = z.object({
	name: z.string().min(2, 'Введите имя'),
	email: z.string().email('Введите корректный email'),
	password: z.string().min(6, 'Минимум 6 символов'),
	phone: z.string().min(6, 'Введите номер телефона'),
})

export type RegisterFormData = z.infer<typeof registerSchema>
