import { getOrCreateGuestId } from '@/lib/chat/guest'
import { io, Socket } from 'socket.io-client'

let socket: Socket | null = null

export const getChatSocket = (userId?: string, role?: 'user' | 'admin'): Socket => {
	if (!socket) {
		const isGuest = !userId
		const guestId = isGuest ? getOrCreateGuestId() : undefined

		socket = io('http://localhost:3000', {
			transports: ['websocket'],
			query: {
				userId: userId ?? '',
				guestId: guestId ?? '',
				role: role ?? (isGuest ? 'guest' : 'user'),
			},
		})

		socket.on('connect', () => {
			console.log('[chat socket] connected:', socket?.id)
		})

		socket.on('disconnect', () => {
			console.log('[chat socket] disconnected')
		})
	}

	return socket
}
