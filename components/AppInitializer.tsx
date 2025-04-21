'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/stores/auth-store'
import { useCartStore } from '@/stores/cart-store'
import { useProfileStore } from '@/stores/profile-store'
import { useOrderNotificationStore } from '@/stores/order-notification-store'
import { fetchHasNewOrdersForAdmin } from '@/lib/api/orders'

export function AppInitializer() {
	const initialize = useAuthStore(state => state.initializeFromStorage)
	const isAuthenticated = useAuthStore(state => state.isAuthenticated)
	const fetchCart = useCartStore(state => state.fetchCart)
	const initializeProfile = useProfileStore(state => state.initialize)
	const user = useAuthStore(state => state.user)
	const setHasNewOrder = useOrderNotificationStore(state => state.setHasNewOrder)

	useEffect(() => {
		initialize()
		useCartStore.getState().loadFromStorage()
	}, [initialize])

	useEffect(() => {
		if (isAuthenticated) {
			fetchCart()
			initializeProfile()

			if (user?.role === 'admin') {
				const local = localStorage.getItem('has_new_order') === '1'
				if (!local) {
					fetchHasNewOrdersForAdmin()
						.then(hasNew => {
							if (hasNew) {
								localStorage.setItem('has_new_order', '1')
								setHasNewOrder(true)
							}
						})
						.catch(() => {})
				}
			}
		}
	}, [isAuthenticated, fetchCart, initializeProfile, user, setHasNewOrder])

	return null
}
