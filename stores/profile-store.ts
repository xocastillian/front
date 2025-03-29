import { create } from 'zustand'
import api from '@/lib/api/axios'
import { Profile } from '@/types'
import { useAuthStore } from './auth-store'

interface ProfileState {
	profile: Profile | null
	loading: boolean
	error: string | null
	setProfile: (data: Profile) => void
	updateProfile: (id: string, data: Partial<Profile>) => Promise<void>
	initialize: () => Promise<void>
}

export const useProfileStore = create<ProfileState>(set => ({
	profile: null,
	loading: false,
	error: null,

	setProfile: data => {
		set({ profile: data })
	},

	updateProfile: async (id, data) => {
		set({ loading: true, error: null })
		try {
			const res = await api.patch(`/users/${id}`, data)
			set({ profile: res.data, loading: false })
		} catch (err) {
			set({ error: 'Ошибка обновления профиля', loading: false })
			console.error(err)
		}
	},

	initialize: async () => {
		const { isAuthenticated, user } = useAuthStore.getState()
		if (!isAuthenticated || !user) return

		set({ loading: true, error: null })
		try {
			const res = await api.get(`/users/${user._id}`)
			set({ profile: res.data, loading: false })
		} catch (err) {
			console.error(err)
			set({ error: 'Ошибка загрузки профиля', loading: false })
		}
	},
}))
