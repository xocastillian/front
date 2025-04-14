import { create } from 'zustand'
import { Order } from '@/types'

interface GuestOrdersState {
	orders: Order[]
	loadFromStorage: () => void
	addOrder: (order: Order) => void
}

export const useGuestOrdersStore = create<GuestOrdersState>((set, get) => ({
	orders: [],
	loadFromStorage: () => {
		try {
			const raw = localStorage.getItem('guest_orders')
			if (raw) set({ orders: JSON.parse(raw) })
		} catch (e) {
			console.error('Ошибка загрузки заказов гостя', e)
		}
	},
	addOrder: order => {
		const updated = [...get().orders, order]
		set({ orders: updated })
		localStorage.setItem('guest_orders', JSON.stringify(updated))
	},
}))
