'use client'

import { useEffect, useState } from 'react'
import api from '@/lib/api/axios'
import { OrderItem } from '@/types'
import { OrderCard } from '@/components/OrderCard/OrderCard'

type Order = {
	_id: string
	items: OrderItem[]
	totalPrice: number
	status: string
	createdAt: string
}

export default function OrdersPage() {
	const [orders, setOrders] = useState<Order[]>([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const load = async () => {
			try {
				const res = await api.get('/orders')
				const orders = res.data
				setOrders([...orders].reverse())
			} catch (err) {
				console.error('Ошибка при загрузке заказов:', err)
			} finally {
				setLoading(false)
			}
		}

		load()
	}, [])

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
