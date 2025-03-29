import api from './axios'
import { AxiosError } from 'axios'
import { RegisterFormData, RegisterResponseSchema } from '@/lib/validation/registerSchema'
import { LoginFormData, LoginResponseSchema } from '@/lib/validation/loginSchema'
import { useAuthStore } from '@/stores/auth-store'

export async function registerUser(data: RegisterFormData): Promise<boolean> {
	try {
		const res = await api.post('/users/register', data)

		const parsed = RegisterResponseSchema.safeParse(res.data)
		if (!parsed.success) throw new Error('Некорректный ответ от сервера')

		const { user, access_token, refresh_token } = parsed.data

		useAuthStore.getState().login(user, access_token, refresh_token)
		return true
	} catch (error) {
		let message = 'Ошибка при регистрации'

		if (error instanceof AxiosError) {
			message = error.response?.data?.message || error.response?.data?.error || message
		} else if (error instanceof Error) {
			message = error.message
		}

		alert(message)
		return false
	}
}

export async function loginUser(data: LoginFormData): Promise<boolean> {
	try {
		const res = await api.post('/auth/login', data)

		const parsed = LoginResponseSchema.safeParse(res.data)
		if (!parsed.success) throw new Error('Некорректный ответ от сервера')

		const { access_token, refresh_token, user } = parsed.data
		useAuthStore.getState().login(user, access_token, refresh_token)

		return true
	} catch (error) {
		let message = 'Ошибка при входе'

		if (error instanceof AxiosError) {
			message = error.response?.data?.message || error.response?.data?.error || message
		} else if (error instanceof Error) {
			message = error.message
		}

		alert(message)
		return false
	}
}

export function getTokenFromStorage(): string | null {
	if (typeof window === 'undefined') return null
	return localStorage.getItem('token')
}
