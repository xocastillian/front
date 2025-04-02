import { Order, OrderStatus } from '@/types'
import api from './axios'

export async function fetchOrders(): Promise<Order[]> {
	const res = await api.get('/orders')
	return res.data
}

export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order> {
	const res = await api.patch(`/orders/${orderId}/status`, { status })
	return res.data
}
