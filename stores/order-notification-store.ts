import { create } from 'zustand'

interface OrderNotificationState {
	hasNewOrder: boolean
	setHasNewOrder: (value: boolean) => void
}

export const useOrderNotificationStore = create<OrderNotificationState>(set => ({
	hasNewOrder: false,
	setHasNewOrder: value => set({ hasNewOrder: value }),
}))
