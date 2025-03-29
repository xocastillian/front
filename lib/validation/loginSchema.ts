import { z } from 'zod'

export const LoginResponseSchema = z.object({
	user: z.object({
		name: z.string(),
		email: z.string(),
		phone: z.string(),
	}),
	access_token: z.string(),
	refresh_token: z.string(),
})

export const loginSchema = z.object({
	email: z.string().email('Введите корректный email'),
	password: z.string().min(6, 'Минимум 6 символов'),
})

export type LoginFormData = z.infer<typeof loginSchema>
