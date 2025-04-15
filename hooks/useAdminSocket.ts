'use client'
import { useEffect } from 'react'
import { useAuthStore } from '@/stores/auth-store'
import { getSocket } from '@/lib/api/ordersSocket'

export function useAdminSocket() {
	const user = useAuthStore(state => state.user)

	useEffect(() => {
		if (user?.role === 'admin') {
			const socket = getSocket()

			socket.on('order:new', () => {
				localStorage.setItem('has_new_order', '1')
			})

			return () => {
				socket.off('order:new')
			}
		}
	}, [user])
}
