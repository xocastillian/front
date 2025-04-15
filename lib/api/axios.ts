import axios from 'axios'
import { useAuthStore } from '@/stores/auth-store'

const getBaseURL = () => {
	if (typeof window !== 'undefined') {
		return process.env.NEXT_PUBLIC_API_URL
	}

	return process.env.NEXT_PUBLIC_API_URL || 'https://food-upnis.onrender.com'
}

const api = axios.create({
	baseURL: getBaseURL(),
	withCredentials: true,
	headers: {
		'Content-Type': 'application/json',
	},
})

export const refreshClient = axios.create({
	baseURL: getBaseURL(),
	withCredentials: true,
	headers: {
		'Content-Type': 'application/json',
	},
})

api.interceptors.request.use(config => {
	const token = useAuthStore.getState().accessToken
	if (token) {
		config.headers.Authorization = `Bearer ${token}`
	}
	return config
})

api.interceptors.response.use(
	res => res,
	async error => {
		const originalRequest = error.config
		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true
			try {
				await useAuthStore.getState().refreshAccessToken()
				const newToken = useAuthStore.getState().accessToken
				if (newToken) {
					originalRequest.headers['Authorization'] = `Bearer ${newToken}`
					return api(originalRequest)
				}
			} catch (err) {
				console.error('Ошибка при обновлении токена:', err)
				useAuthStore.getState().logout()
			}
		}
		return Promise.reject(error)
	}
)

export default api
