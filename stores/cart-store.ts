import { create } from 'zustand'
import { Product, RawCartItem } from '@/types'
import api from '@/lib/api/axios'

export interface CartItem extends Product {
	quantity: number
}

interface CartState {
	items: CartItem[]
	cartItemCount: number
	fetchCart: () => Promise<void>
	addToCart: (item: CartItem) => Promise<void>
	removeFromCart: (id: string) => void
	clearCart: () => void
	totalPrice: () => number
}

export const useCartStore = create<CartState>((set, get) => ({
	items: [],
	cartItemCount: 0,

	fetchCart: async () => {
		try {
			const res = await api.get('/cart')
			const items: RawCartItem[] = res.data.items || []
			const count = items.length
			set({ items: items as unknown as CartItem[], cartItemCount: count })
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
			get().fetchCart()
		} catch (err) {
			console.error('Ошибка при добавлении в корзину:', err)
			// В оффлайн-режиме (неавторизован) добавляем в локальный стор
			set(state => {
				const existingItem = state.items.find(i => i._id === item._id)
				const updatedItems = existingItem
					? state.items.map(i => (i._id === item._id ? { ...i, quantity: i.quantity + item.quantity } : i))
					: [...state.items, item]

				return {
					items: updatedItems,
					cartItemCount: updatedItems.reduce((acc, i) => acc + i.quantity, 0),
				}
			})
		}
	},

	removeFromCart: id => {
		set(state => {
			const updated = state.items.filter(item => item._id !== id)
			return {
				items: updated,
				cartItemCount: updated.reduce((acc, i) => acc + i.quantity, 0),
			}
		})
	},

	clearCart: () => set({ items: [], cartItemCount: 0 }),

	totalPrice: () => get().items.reduce((acc, item) => acc + item.price * item.quantity, 0),
}))
