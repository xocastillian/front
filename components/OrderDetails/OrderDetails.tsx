'use client'

import { ReactNode } from 'react'
import { Order, OrderStatus } from '@/types'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'

interface OrderDetailsDialogProps {
	order: Order
	open: boolean
	onOpenChange: (open: boolean) => void
	onStatusChange: (status: OrderStatus) => Promise<void>
	updating: boolean
	trigger: ReactNode
}

export function OrderDetails({ order, open, onOpenChange, onStatusChange, updating, trigger }: OrderDetailsDialogProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogTrigger asChild>{trigger}</DialogTrigger>

			<DialogContent>
				<DialogTitle>Детали заказа</DialogTitle>

				<div className='space-y-3 text-sm'>
					<div>
						<strong>Имя:</strong> {order.recipientName}
					</div>
					<div>
						<strong>Телефон:</strong> {order.phone}
					</div>
					<div>
						<strong>Адрес:</strong> {order.address}
					</div>
					<div>
						<strong>Сумма:</strong> {order.totalPrice} ₸
					</div>
					<div>
						<strong>Статус:</strong> {order.status}
					</div>
					<div>
						<strong>Дата:</strong> {format(new Date(order.createdAt), 'dd.MM.yyyy HH:mm')}
					</div>
					<div className='pt-2'>
						<strong>Состав:</strong>
						<ul className='list-disc list-inside'>
							{order.items.map((item, index) => (
								<li key={index}>
									{item.productId.name} × {item.quantity}
								</li>
							))}
						</ul>
					</div>

					<div className='pt-4 space-x-2'>
						<Button
							disabled={updating || order.status === OrderStatus.Accepted}
							variant='outline'
							onClick={() => onStatusChange(OrderStatus.Accepted)}
						>
							Принят
						</Button>
						<Button
							disabled={updating || order.status === OrderStatus.Delivered}
							variant='outline'
							onClick={() => onStatusChange(OrderStatus.Delivered)}
						>
							Доставлен
						</Button>
						<Button
							disabled={updating || order.status === OrderStatus.Canceled}
							variant='destructive'
							onClick={() => onStatusChange(OrderStatus.Canceled)}
						>
							Отменён
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}
