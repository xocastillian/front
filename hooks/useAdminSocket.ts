'use client'
import { useEffect } from 'react'
import { useAuthStore } from '@/stores/auth-store'
import { getSocket } from '@/lib/api/ordersSocket'
import { useOrderNotificationStore } from '@/stores/order-notification-store'
import { toast } from 'sonner'

export function useAdminSocket() {
	const user = useAuthStore(state => state.user)
	const setHasNewOrder = useOrderNotificationStore(state => state.setHasNewOrder)

	useEffect(() => {
		if (user?.role === 'admin') {
			const socket = getSocket()

			const handleNewOrder = () => {
				localStorage.setItem('has_new_order', '1')
				setHasNewOrder(true)
				toast.success('Поступил новый заказ', {
					duration: 15000,
				})
			}

			socket.on('order:new', handleNewOrder)

			return () => {
				socket.off('order:new', handleNewOrder)
			}
		}
	}, [user, setHasNewOrder])
}
