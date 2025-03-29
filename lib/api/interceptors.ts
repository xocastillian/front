import api from './axios'
import { useAuthStore } from '@/stores/auth-store'

export function setupInterceptors() {
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
					console.error(err)
					useAuthStore.getState().logout()
				}
			}

			return Promise.reject(error)
		}
	)
}
