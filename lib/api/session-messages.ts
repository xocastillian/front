import { SessionMessage } from '@/types'
import api from './axios'

export async function fetchSessionMessages(sessionId: string): Promise<SessionMessage[]> {
	const res = await api.get(`/chat/session/${sessionId}/messages`)
	return res.data
}
