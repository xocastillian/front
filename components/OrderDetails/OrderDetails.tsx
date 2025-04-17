'use client'

import { ReactNode } from 'react'
import { Order, OrderStatus } from '@/types'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { getOrderStatusColor } from '@/utils'

interface OrderDetailsDialogProps {
	order: Order
	open: boolean
	onOpenChange: (open: boolean) => void
	onStatusChange: (status: OrderStatus) => Promise<void>
	loading: boolean
	trigger: ReactNode
}

export function OrderDetails({ order, open, onOpenChange, onStatusChange, loading, trigger }: OrderDetailsDialogProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogTrigger asChild>{trigger}</DialogTrigger>

			<DialogContent className='max-w-[95vw] sm:max-w-lg w-full'>
				{loading && <div className='absolute inset-0 z-10 flex items-center justify-center bg-white/50 backdrop-blur-sm rounded-xl' />}
				{loading && (
					<div className='absolute inset-0 z-50 flex items-center justify-center'>
						<Loader2 className='w-6 h-6 animate-spin text-gray-500' />
					</div>
				)}

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
						<strong>Статус: </strong>
						<span className={`px-2 py-1 rounded-md text-xs font-medium ${getOrderStatusColor(order.status)}`}>{order.status}</span>
					</div>
					<div>
						<strong>Дата:</strong> {format(new Date(order.createdAt), 'dd.MM.yyyy HH:mm')}
					</div>
					<div className='pt-2'>
						<strong>Состав:</strong>
						<ul className='list-disc list-inside'>
							{order.items.map((item, index) => (
								<li key={index}>{item.productId?.name ? `${item.productId.name} × ${item.quantity}` : `Неизвестный товар × ${item.quantity}`}</li>
							))}
						</ul>
					</div>

					<div className='pt-4 flex flex-col sm:flex-row sm:flex-wrap gap-2'>
						<Button
							disabled={loading || order.status === OrderStatus.Accepted}
							variant='outline'
							onClick={() => onStatusChange(OrderStatus.Accepted)}
						>
							Принят
						</Button>
						<Button
							disabled={loading || order.status === OrderStatus.Handled_To_Courier}
							variant='outline'
							onClick={() => onStatusChange(OrderStatus.Handled_To_Courier)}
						>
							Передан курьеру
						</Button>
						<Button
							disabled={loading || order.status === OrderStatus.Delivered}
							variant='outline'
							onClick={() => onStatusChange(OrderStatus.Delivered)}
						>
							Доставлен
						</Button>
						<Button
							disabled={loading || order.status === OrderStatus.Canceled}
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
