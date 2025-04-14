'use client'

import { FC } from 'react'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Order } from '@/types'
import { getOrderStatusColor } from '@/utils'

interface OrderCardProps {
	order: Order
}

export const OrderCard: FC<OrderCardProps> = ({ order }) => {
	return (
		<Card>
			<CardHeader>
				<CardTitle className='text-lg flex justify-between items-center'>
					<span>№ {order.orderNumber}</span>
					<span className='text-xs text-muted-foreground'>
						{new Date(order.createdAt).toLocaleString('ru-RU', {
							day: '2-digit',
							month: '2-digit',
							year: 'numeric',
							hour: '2-digit',
							minute: '2-digit',
						})}
					</span>
				</CardTitle>

				<p className='text-sm mt-2'>
					Статус: <span className={`px-2 py-1 rounded-md text-xs font-medium ${getOrderStatusColor(order.status)}`}>{order.status}</span>
				</p>
			</CardHeader>

			<CardContent className='space-y-4'>
				{order.items.map((item, idx) => (
					<div key={idx} className='flex gap-4 items-center'>
						{item.productId?.imageUrl ? (
							<div className='relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden'>
								<Image src={item.productId.imageUrl} alt={item.productId.name} fill className='object-cover' />
							</div>
						) : (
							<div className='relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden bg-gray-100'>
								<div className='absolute inset-0 flex items-center justify-center text-xs text-muted-foreground'>Нет фото</div>
							</div>
						)}

						<div className='flex justify-between items-center w-full text-sm'>
							<span>
								{item.productId?.name ?? 'Товар удалён'} × {item.quantity}
							</span>
							<span>{(item.price * item.quantity).toFixed(2)} ₸</span>
						</div>
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
