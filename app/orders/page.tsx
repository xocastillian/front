'use client'

import { useEffect, useState } from 'react'
import { Order } from '@/types'
import { OrderCard } from '@/components/OrderCard/OrderCard'
import { fetchOrders } from '@/lib/api/orders'
import { useAuthStore } from '@/stores/auth-store'
import { useGuestOrdersStore } from '@/stores/orders-store'

export default function OrdersPage() {
	const isAuth = useAuthStore(state => state.isAuthenticated)
	const [orders, setOrders] = useState<Order[]>([])
	const [loading, setLoading] = useState(true)

	const loadGuestOrders = useGuestOrdersStore(state => state.loadFromStorage)

	useEffect(() => {
		const load = async () => {
			if (isAuth) {
				try {
					const userOrders = await fetchOrders()
					setOrders([...userOrders].reverse())
				} catch (err) {
					console.error('Ошибка при загрузке заказов:', err)
				} finally {
					setLoading(false)
				}
			} else {
				loadGuestOrders()
				const updated = useGuestOrdersStore.getState().orders
				setOrders([...updated].reverse())
				setLoading(false)
			}
		}

		load()
	}, [isAuth])

	return (
		<div className='max-w-4xl mx-auto px-6 py-14'>
			<h1 className='text-2xl font-bold mb-6'>Мои заказы</h1>

			{loading ? (
				<p className='text-muted-foreground'>Загрузка...</p>
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
