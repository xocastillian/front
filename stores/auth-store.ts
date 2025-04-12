import { create } from 'zustand'
import { refreshClient } from '@/lib/api/axios'
import { User } from '@/types'

interface AuthState {
	isAuthenticated: boolean
	isInitialized: boolean
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
	isInitialized: false,
	user: null,
	accessToken: null,
	refreshToken: null,

	login: (user, accessToken, refreshToken) => {
		localStorage.setItem('token', accessToken)
		localStorage.setItem('refreshToken', refreshToken)
		localStorage.setItem('user', JSON.stringify(user))
		localStorage.removeItem('guestId')
		set({
			isAuthenticated: true,
			user,
			accessToken,
			refreshToken,
			isInitialized: true,
		})
	},

	logout: () => {
		localStorage.removeItem('token')
		localStorage.removeItem('refreshToken')
		localStorage.removeItem('user')
		set({
			isAuthenticated: false,
			isInitialized: true,
			user: null,
			accessToken: null,
			refreshToken: null,
		})
		window.location.href = '/'
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
				isInitialized: true,
			})
		} else {
			set({ isInitialized: true })
		}
	},

	refreshAccessToken: async () => {
		const refreshToken = localStorage.getItem('refreshToken')
		if (!refreshToken) return

		try {
			const res = await refreshClient.post('/auth/refresh', { refreshToken })
			const { access_token } = res.data
			localStorage.setItem('token', access_token)
			set({ accessToken: access_token })
		} catch (err) {
			console.error('Ошибка при обновлении токена:', err)
			useAuthStore.getState().logout()
		}
	},
}))
