import { create } from 'zustand'
import { Product, RawCartItem } from '@/types'
import api from '@/lib/api/axios'
import { useAuthStore } from './auth-store'
import { OrderFormData } from '@/lib/validation/orderSchema'
import { ensureGuestUserId } from '@/utils'

export interface CartItem extends Product {
	quantity: number
	cartItemId: string
}

export type CreateOrderRequest = OrderFormData & {
	items: {
		productId: string
		quantity: number
		price: number
	}[]
	userId?: string
}

interface CartState {
	items: CartItem[]
	cartItemCount: number
	fetchCart: () => Promise<void>
	addToCart: (item: CartItem) => Promise<void>
	updateQuantity: (id: string, quantity: number) => void
	removeFromCart: (id: string) => void
	clearCart: () => void
	createOrder: (data: OrderFormData) => Promise<void>
	totalPrice: () => number
	loadFromStorage: () => void
	saveToStorage: () => void
}

export const useCartStore = create<CartState>((set, get) => ({
	items: [],
	cartItemCount: 0,

	loadFromStorage: () => {
		if (typeof window === 'undefined') return
		try {
			const raw = localStorage.getItem('guest_cart')
			if (raw) {
				const parsed: CartItem[] = JSON.parse(raw)
				set({ items: parsed, cartItemCount: parsed.length })
			}
		} catch (e) {
			console.error('Ошибка при загрузке корзины из localStorage', e)
		}
	},

	saveToStorage: () => {
		if (typeof window === 'undefined') return
		const items = get().items
		localStorage.setItem('guest_cart', JSON.stringify(items))
	},

	fetchCart: async () => {
		const isAuth = useAuthStore.getState().isAuthenticated
		if (!isAuth) return

		try {
			const res = await api.get('/cart')
			const rawItems: RawCartItem[] = res.data.items || []

			const items: CartItem[] = rawItems.map(item => ({
				...item.productId,
				quantity: item.quantity,
				cartItemId: item._id,
			}))

			set({ items, cartItemCount: items.length })
		} catch (err) {
			console.error('Ошибка при получении корзины:', err)
		}
	},

	addToCart: async item => {
		const isAuth = useAuthStore.getState().isAuthenticated

		if (isAuth) {
			try {
				await api.post('/cart/items', {
					productId: item._id,
					quantity: item.quantity,
				})
				await get().fetchCart()
				return
			} catch (err) {
				console.error('Ошибка при добавлении в серверную корзину:', err)
			}
		}

		// Гостевая корзина
		set(state => {
			const existingItem = state.items.find(i => i._id === item._id)
			const updatedItems = existingItem
				? state.items.map(i => (i._id === item._id ? { ...i, quantity: i.quantity + item.quantity } : i))
				: [...state.items, item]

			localStorage.setItem('guest_cart', JSON.stringify(updatedItems))
			return { items: updatedItems, cartItemCount: updatedItems.length }
		})
	},

	updateQuantity: async (id, quantity) => {
		if (quantity < 1) return
		set(state => {
			const updatedItems = state.items.map(i => (i.cartItemId === id || i._id === id ? { ...i, quantity } : i))
			localStorage.setItem('guest_cart', JSON.stringify(updatedItems))
			return { items: updatedItems }
		})
		return Promise.resolve()
	},

	removeFromCart: async id => {
		const isAuth = useAuthStore.getState().isAuthenticated

		if (isAuth) {
			try {
				await api.delete(`/cart/items/${id}`)
				await get().fetchCart()
				return
			} catch (err) {
				console.error('Ошибка при удалении из серверной корзины:', err)
			}
		}

		const state = get()
		const updatedItems = state.items.filter(i => i.cartItemId !== id && i._id !== id)
		localStorage.setItem('guest_cart', JSON.stringify(updatedItems))
		set({ items: updatedItems, cartItemCount: updatedItems.length })
		return Promise.resolve()
	},

	clearCart: async () => {
		const isAuth = useAuthStore.getState().isAuthenticated

		if (isAuth) {
			try {
				await api.delete('/cart')
				const res = await api.get('/cart')
				const rawItems: RawCartItem[] = res.data.items || []

				const items: CartItem[] = rawItems.map(item => ({
					...item.productId,
					quantity: item.quantity,
					cartItemId: item._id,
				}))

				set({ items, cartItemCount: items.length })
				return
			} catch (err) {
				console.error('Ошибка при очистке серверной корзины:', err)
			}
		}

		set({ items: [], cartItemCount: 0 })
		localStorage.removeItem('guest_cart')
		return Promise.resolve()
	},

	createOrder: async (data: OrderFormData) => {
		const items = get().items

		const orderDto: CreateOrderRequest = {
			items: items.map(item => ({
				productId: item._id,
				quantity: item.quantity,
				price: item.price,
			})),
			...data,
		}

		const isAuth = useAuthStore.getState().isAuthenticated
		if (!isAuth) {
			orderDto.userId = ensureGuestUserId()
		}

		try {
			await api.post('/orders', orderDto)
			await get().clearCart()
		} catch (err) {
			console.error('Ошибка при оформлении заказа:', err)
			throw err
		}
	},

	totalPrice: () => {
		const sum = get().items.reduce((acc, item) => acc + item.price * item.quantity, 0)
		return parseFloat(sum.toFixed(2))
	},
}))
