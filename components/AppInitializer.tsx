'use client'

import { useEffect } from 'react'
import { setupInterceptors } from '@/lib/api/interceptors'
import { useAuthStore } from '@/stores/auth-store'
import { useCartStore } from '@/stores/cart-store'

export function AppInitializer() {
	const initialize = useAuthStore(state => state.initializeFromStorage)
	const isAuthenticated = useAuthStore(state => state.isAuthenticated)
	const fetchCart = useCartStore(state => state.fetchCart)

	useEffect(() => {
		initialize()
		setupInterceptors()
	}, [])

	useEffect(() => {
		if (isAuthenticated) {
			fetchCart()
		}
	}, [isAuthenticated, fetchCart])

	return null
}
