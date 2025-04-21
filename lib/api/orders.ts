import { Order, OrderStatus } from '@/types'
import api from './axios'
import { useAuthStore } from '@/stores/auth-store'

export async function fetchOrders(): Promise<Order[]> {
	const res = await api.get('/orders')
	return res.data
}

export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order> {
	const res = await api.patch(`/orders/${orderId}/status`, { status })
	return res.data
}

export async function fetchAllOrdersForAdmin(): Promise<Order[]> {
	const user = useAuthStore.getState().user

	if (!user || user.role !== 'admin') {
		throw new Error('Access denied: only admin can fetch all orders.')
	}

	const res = await api.get('/orders/admin')
	return res.data
}

export async function fetchHasNewOrdersForAdmin(): Promise<boolean> {
	const user = useAuthStore.getState().user

	if (!user || user.role !== 'admin') {
		return false
	}

	const res = await api.get('/orders/admin/has-new')
	return res.data.hasNew
}
