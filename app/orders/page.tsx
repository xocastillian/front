'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import api from '@/lib/api/axios'
import { OrderItem } from '@/types'

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
						<Card key={order._id}>
							<CardHeader>
								<CardTitle className='text-lg'>
									Заказ от{' '}
									{new Date(order.createdAt).toLocaleString('ru-RU', {
										day: '2-digit',
										month: '2-digit',
										year: 'numeric',
										hour: '2-digit',
										minute: '2-digit',
									})}
								</CardTitle>

								<p className='text-sm text-muted-foreground'>Статус: {order.status}</p>
							</CardHeader>
							<CardContent className='space-y-2'>
								{order.items.map((item, idx) => (
									<div key={idx} className='flex justify-between text-sm'>
										<span>
											{item.productId?.name ?? 'Товар удалён'} × {item.quantity}
										</span>
										<span>{item.price * item.quantity} ₸</span>
									</div>
								))}
								<Separator />
								<div className='flex justify-between font-semibold'>
									<span>Итого:</span>
									<span>{order.totalPrice} ₸</span>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			)}
		</div>
	)
}
