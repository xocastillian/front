'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Order } from '@/types'
import { format } from 'date-fns'
import { getOrderStatusColor } from '@/utils'

interface OrderCardAdminProps {
	order: Order
	onClick?: () => void
}

export function OrderCardAdmin({ order, onClick }: OrderCardAdminProps) {
	return (
		<Card onClick={onClick} className={`${getOrderStatusColor(order.status)} cursor-pointer hover:shadow-md transition`}>
			<CardHeader className='flex flex-row items-center justify-between'>
				<CardTitle className='text-base'>Заказ № {order.orderNumber}</CardTitle>
				<span className={`px-2 py-1 rounded-md text-xs font-medium ${getOrderStatusColor(order.status)}`}>{order.status}</span>
			</CardHeader>
			<CardContent className='text-sm text-muted-foreground space-y-1'>
				<div>Сумма: {order.totalPrice} ₸</div>
				<div>Дата: {format(new Date(order.createdAt), 'dd.MM.yyyy HH:mm')}</div>
			</CardContent>
		</Card>
	)
}
