import { create } from 'zustand'
import { Product, RawCartItem } from '@/types'
import api from '@/lib/api/axios'

export interface CartItem extends Product {
	quantity: number
	_id: string
}

interface CartState {
	items: CartItem[]
	cartItemCount: number
	fetchCart: () => Promise<void>
	addToCart: (item: CartItem) => Promise<void>
	updateQuantity: (id: string, quantity: number) => Promise<void>
	removeFromCart: (id: string) => Promise<void>
	clearCart: () => void
	totalPrice: () => number
}

export const useCartStore = create<CartState>((set, get) => ({
	items: [],
	cartItemCount: 0,

	fetchCart: async () => {
		try {
			const res = await api.get('/cart')
			const rawItems: RawCartItem[] = res.data.items || []

			const items: CartItem[] = rawItems.map(item => ({
				...item.productId,
				quantity: item.quantity,
				_id: item._id,
			}))

			set({
				items,
				cartItemCount: items.length,
			})
		} catch (err) {
			console.error('Ошибка при получении корзины:', err)
		}
	},

	addToCart: async item => {
		try {
			await api.post('/cart/items', {
				productId: item._id,
				quantity: item.quantity,
			})
			await get().fetchCart()
		} catch (err) {
			console.error('Ошибка при добавлении в корзину:', err)

			set(state => {
				const existingItem = state.items.find(i => i._id === item._id)
				const updatedItems = existingItem
					? state.items.map(i => (i._id === item._id ? { ...i, quantity: i.quantity + item.quantity } : i))
					: [...state.items, item]

				return {
					items: updatedItems,
					cartItemCount: updatedItems.length,
				}
			})
		}
	},

	updateQuantity: async (id, quantity) => {
		if (quantity < 1) return
		try {
			await api.patch(`/cart/items/${id}`, { quantity })
			await get().fetchCart()
		} catch (err) {
			console.error('Ошибка при обновлении количества:', err)
		}
	},

	removeFromCart: async id => {
		try {
			await api.delete(`/cart/items/${id}`)
			await get().fetchCart()
		} catch (err) {
			console.error('Ошибка при удалении из корзины:', err)
		}
	},

	totalPrice: () => {
		const sum = get().items.reduce((acc, item) => acc + item.price * item.quantity, 0)
		return parseFloat(sum.toFixed(2))
	},

	clearCart: async () => {
		try {
			await api.delete('/cart')
			get().fetchCart()
		} catch (err) {
			console.error('Ошибка при очистке корзины:', err)
		}
	},
}))
