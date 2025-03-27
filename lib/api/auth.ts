// src/lib/api/auth.ts
import api from './axios'
import { AxiosError } from 'axios'
import { RegisterFormData } from '@/lib/validation/registerSchema'
import { LoginFormData } from '@/lib/validation/loginSchema'

export async function registerUser(data: RegisterFormData): Promise<boolean> {
	try {
		await api.post('/users/register', data)
		return true
	} catch (error) {
		const err = error as AxiosError<{ message?: string; error?: string }>
		const message = err.response?.data?.message || err.response?.data?.error || 'Ошибка при регистрации'
		alert(message)
		return false
	}
}

export async function loginUser(data: LoginFormData): Promise<boolean> {
	try {
		const res = await api.post('/auth/login', data)
		const { access_token } = res.data
		localStorage.setItem('token', access_token)
		return true
	} catch (error) {
		const err = error as AxiosError<{ message?: string; error?: string }>
		const message = err.response?.data?.message || err.response?.data?.error || 'Ошибка при входе'
		alert(message)
		return false
	}
}
