import { OrderStatus } from '@/types'

export const getOrderStatusColor = (status: string) => {
	switch (status) {
		case OrderStatus.Accepted:
			return 'bg-yellow-100 text-yellow-800'
		case OrderStatus.Handled_To_Courier:
			return 'bg-blue-100 text-blue-800'
		case OrderStatus.Delivered:
			return 'bg-green-100 text-green-800'
		case OrderStatus.Canceled:
			return 'bg-red-100 text-red-800'
		default:
			return 'bg-gray-100 text-gray-800'
	}
}

export function ensureGuestUserId(): string {
	if (typeof window === 'undefined') return ''
	let id = localStorage.getItem('guest_user_id')
	if (!id) {
		const timestamp = Date.now().toString(16).slice(-8)
		const randomHex = Array.from(crypto.getRandomValues(new Uint8Array(8)))
			.map(b => b.toString(16).padStart(2, '0'))
			.join('')
		id = `${timestamp}${randomHex}`.slice(0, 24)
		localStorage.setItem('guest_user_id', id)
	}
	return id
}
