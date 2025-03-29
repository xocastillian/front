import { z } from 'zod'

export const RegisterResponseSchema = z.object({
	user: z.object({
		name: z.string(),
		email: z.string(),
		phone: z.string(),
	}),
	access_token: z.string(),
	refresh_token: z.string(),
})

export const registerSchema = z.object({
	name: z.string().min(2, 'Введите имя'),
	email: z.string().email('Введите корректный email'),
	password: z.string().min(6, 'Минимум 6 символов'),
	phone: z.string().min(6, 'Введите номер телефона'),
})

export type RegisterFormData = z.infer<typeof registerSchema>
