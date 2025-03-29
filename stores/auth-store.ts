import { create } from 'zustand'
import api from '@/lib/api/axios'

interface User {
	name: string
	email: string
	phone: string
	id?: string
}

interface AuthState {
	isAuthenticated: boolean
	user: User | null
	accessToken: string | null
	refreshToken: string | null
	login: (user: User, accessToken: string, refreshToken: string) => void
	logout: () => void
	initializeFromStorage: () => void
	refreshAccessToken: () => Promise<void>
}

export const useAuthStore = create<AuthState>(set => ({
	isAuthenticated: false,
	user: null,
	accessToken: null,
	refreshToken: null,

	login: (user, accessToken, refreshToken) => {
		localStorage.setItem('token', accessToken)
		localStorage.setItem('refreshToken', refreshToken)
		localStorage.setItem('user', JSON.stringify(user))
		set({ isAuthenticated: true, user, accessToken, refreshToken })
	},

	logout: () => {
		localStorage.removeItem('token')
		localStorage.removeItem('refreshToken')
		localStorage.removeItem('user')
		set({ isAuthenticated: false, user: null, accessToken: null, refreshToken: null })
	},

	initializeFromStorage: () => {
		const token = localStorage.getItem('token')
		const refresh = localStorage.getItem('refreshToken')
		const user = localStorage.getItem('user')
		if (token && refresh && user) {
			set({
				isAuthenticated: true,
				user: JSON.parse(user),
				accessToken: token,
				refreshToken: refresh,
			})
		}
	},

	refreshAccessToken: async () => {
		const refreshToken = localStorage.getItem('refreshToken')
		const user = useAuthStore.getState().user
		const userId = useAuthStore.getState().user?.id

		if (!refreshToken || !user?.email) return

		try {
			const res = await api.post('/users/refresh', {
				userId,
				refreshToken,
			})
			const { access_token } = res.data
			localStorage.setItem('token', access_token)
			set({ accessToken: access_token })
		} catch (err) {
			console.error('Ошибка при обновлении токена:', err)
			useAuthStore.getState().logout()
		}
	},
}))
