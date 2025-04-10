'use client'

import { FC } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { OrderItem } from '@/types'

type Order = {
	_id: string
	items: OrderItem[]
	totalPrice: number
	status: string
	createdAt: string
}

interface OrderCardProps {
	order: Order
}

export const OrderCard: FC<OrderCardProps> = ({ order }) => {
	return (
		<Card>
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
					<span>{order.totalPrice.toFixed(2)} ₸</span>
				</div>
			</CardContent>
		</Card>
	)
}
