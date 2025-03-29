import { create } from 'zustand'

interface User {
	name: string
	email: string
	phone: string
}

interface AuthState {
	isAuthenticated: boolean
	user: User | null
	login: (user: User, token: string) => void
	logout: () => void
	initializeFromStorage: () => void
}

export const useAuthStore = create<AuthState>(set => ({
	isAuthenticated: false,
	user: null,
	login: (user, token) => {
		localStorage.setItem('token', token)
		localStorage.setItem('user', JSON.stringify(user))
		set({ isAuthenticated: true, user })
	},
	logout: () => {
		localStorage.removeItem('token')
		localStorage.removeItem('user')
		set({ isAuthenticated: false, user: null })
	},
	initializeFromStorage: () => {
		const token = localStorage.getItem('token')
		const user = localStorage.getItem('user')
		if (token && user) {
			set({ isAuthenticated: true, user: JSON.parse(user) })
		}
	},
}))
