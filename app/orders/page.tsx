'use client'

import { useEffect, useState } from 'react'
import { Order } from '@/types'
import { OrderCard } from '@/components/OrderCard/OrderCard'
import { fetchOrders } from '@/lib/api/orders'
import { useAuthStore } from '@/stores/auth-store'
import { ensureGuestUserId } from '@/utils'
import api from '@/lib/api/axios'
import { getSocket } from '@/lib/api/ordersSocket'
import { Loader } from '@/components/Loader/Loader'

export default function OrdersPage() {
	const isAuth = useAuthStore(state => state.isAuthenticated)
	const [orders, setOrders] = useState<Order[]>([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const socket = getSocket()

		socket.on('order:status-updated', (updatedOrder: Order) => {
			setOrders(prev => prev.map(order => (order._id === updatedOrder._id ? updatedOrder : order)))
		})

		return () => {
			socket.off('order:status-updated')
		}
	}, [])

	useEffect(() => {
		const load = async () => {
			if (isAuth) {
				try {
					const userOrders = await fetchOrders()
					setOrders([...userOrders].reverse())
				} catch (err) {
					console.error('Ошибка при загрузке заказов:', err)
				}
			} else {
				try {
					const guestUserId = ensureGuestUserId()
					const res = await api.get(`/orders?userId=${guestUserId}`)
					setOrders([...res.data].reverse())
				} catch (e) {
					console.error('Ошибка при загрузке заказов гостя:', e)
				}
			}
			setLoading(false)
		}

		load()
	}, [isAuth])

	return (
		<div className='max-w-4xl mx-auto px-6 py-14'>
			<h1 className='text-2xl font-bold mb-6'>Мои заказы</h1>

			{loading ? (
				<Loader />
			) : orders.length === 0 ? (
				<p className='text-muted-foreground'>У вас нет заказов.</p>
			) : (
				<div className='space-y-6'>
					{orders.map(order => (
						<OrderCard key={order._id} order={order} />
					))}
				</div>
			)}
		</div>
	)
}
