'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/stores/auth-store'
import { useCartStore } from '@/stores/cart-store'
import { useProfileStore } from '@/stores/profile-store'

export function AppInitializer() {
	const initialize = useAuthStore(state => state.initializeFromStorage)
	const isAuthenticated = useAuthStore(state => state.isAuthenticated)
	const fetchCart = useCartStore(state => state.fetchCart)
	const initializeProfile = useProfileStore(state => state.initialize)

	useEffect(() => {
		initialize()
	}, [])

	useEffect(() => {
		if (isAuthenticated) {
			fetchCart()
			initializeProfile()
		}
	}, [isAuthenticated])

	return null
}
