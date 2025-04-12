'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/auth-store'

export const useAuthGuard = (requiredRole?: 'admin' | 'user') => {
	const router = useRouter()
	const isAuthenticated = useAuthStore(state => state.isAuthenticated)
	const isInitialized = useAuthStore(state => state.isInitialized)
	const user = useAuthStore(state => state.user)

	useEffect(() => {
		if (!isInitialized) return

		if (!isAuthenticated) {
			router.replace('/login')
			return
		}

		if (requiredRole && user?.role !== requiredRole) {
			router.replace('/')
		}
	}, [isInitialized, isAuthenticated, user, requiredRole])
}
