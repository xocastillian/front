import { io, Socket } from 'socket.io-client'

let socket: Socket | null = null

const getSocketUrl = () => {
	if (typeof window !== 'undefined') {
		if (window.location.hostname === 'localhost') {
			return 'http://localhost:3000'
		} else {
			return 'wss://food-upnis.onrender.com'
		}
	}
	return 'wss://food-upnis.onrender.com'
}

export const getSocket = (): Socket => {
	if (!socket) {
		socket = io(getSocketUrl(), {
			transports: ['websocket'],
		})

		socket.on('connect', () => {
			console.log('[socket] connected:', socket?.id)
		})

		socket.on('disconnect', () => {
			console.log('[socket] disconnected')
		})
	}

	return socket
}
