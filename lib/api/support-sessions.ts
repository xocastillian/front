import { SupportSession } from '@/types'
import api from './axios'
import { useAuthStore } from '@/stores/auth-store'

export async function fetchSupportSessions(): Promise<SupportSession[]> {
	const adminId = useAuthStore.getState().user?._id
	if (!adminId) throw new Error('Admin ID не найден')

	const res = await api.get<SupportSession[]>(`/chat/admin/${adminId}/sessions`)
	return res.data
}
