'use client'

import { useState } from 'react'
import { Order, OrderStatus } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { format } from 'date-fns'
import { Tabs } from '../Tabs/Tabs'
import { OrderDetails } from '../OrderDetails/OrderDetails'
import { getOrderStatusColor } from '@/utils'

interface OrdersTabProps {
	orders: Order[]
	onUpdateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>
}

const statusTabs = [
	{ id: OrderStatus.Pending, name: 'Ожидает' },
	{ id: OrderStatus.Accepted, name: 'Принят' },
	{ id: OrderStatus.Handled_To_Courier, name: 'Передан курьеру' },
	{ id: OrderStatus.Delivered, name: 'Доставлен' },
	{ id: OrderStatus.Canceled, name: 'Отменён' },
] as const

export const OrdersTab = ({ orders, onUpdateOrderStatus }: OrdersTabProps) => {
	const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
	const [updating, setUpdating] = useState(false)
	const [selectedStatus, setSelectedStatus] = useState<string | null>(null)

	const handleStatusChange = async (orderId: string, status: OrderStatus) => {
		setUpdating(true)
		try {
			await onUpdateOrderStatus(orderId, status)
			setSelectedOrder(null)
		} finally {
			setUpdating(false)
		}
	}

	const sortedOrders = [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
	const filteredOrders = selectedStatus === null ? sortedOrders : sortedOrders.filter(o => o.status === selectedStatus)

	return (
		<div className='space-y-4'>
			<h2 className='text-xl font-semibold'>Заказы</h2>
			<Tabs items={statusTabs.map(tab => ({ id: tab.id, name: tab.name }))} selected={selectedStatus} onSelect={setSelectedStatus} allLabel='Все' />

			{filteredOrders.length === 0 ? (
				<p className='text-muted-foreground'>Нет заказов.</p>
			) : (
				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
					{filteredOrders.map(order => {
						const isOpen = selectedOrder?._id === order._id

						return (
							<OrderDetails
								key={order._id}
								order={order}
								open={isOpen}
								onOpenChange={open => {
									if (!open) setSelectedOrder(null)
									else setSelectedOrder(order)
								}}
								onStatusChange={status => handleStatusChange(order._id, status)}
								updating={updating}
								trigger={
									<Card className={`${getOrderStatusColor(order.status)} cursor-pointer hover:shadow-md transition`}>
										<CardHeader>
											<CardTitle className='text-base'>Заказ № {order.orderNumber}</CardTitle>
										</CardHeader>
										<CardContent className='text-sm text-muted-foreground space-y-1'>
											<div>Сумма: {order.totalPrice} ₸</div>
											<div>Дата: {format(new Date(order.createdAt), 'dd.MM.yyyy HH:mm')}</div>
										</CardContent>
									</Card>
								}
							/>
						)
					})}
				</div>
			)}
		</div>
	)
}
