import { OrderStatus } from '@/types'

export const getOrderStatusColor = (status: string) => {
	switch (status) {
		case OrderStatus.Accepted:
			return 'bg-yellow-100 text-yellow-800'
		case OrderStatus.Handled_To_Courier:
			return 'bg-blue-100 text-blue-800'
		case OrderStatus.Delivered:
			return 'bg-green-100 text-green-800'
		case OrderStatus.Canceled:
			return 'bg-red-100 text-red-800'
		default:
			return 'bg-gray-100 text-gray-800'
	}
}
