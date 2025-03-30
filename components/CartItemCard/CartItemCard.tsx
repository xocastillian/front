'use client'

import { FC } from 'react'
import { CartItem, useCartStore } from '@/stores/cart-store'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'

interface CartItemCardProps {
	item: CartItem
}

export const CartItemCard: FC<CartItemCardProps> = ({ item }) => {
	const removeFromCart = useCartStore(state => state.removeFromCart)
	const updateQuantity = useCartStore(state => state.updateQuantity)

	const handleRemove = () => {
		removeFromCart(item.cartItemId || item._id)
	}

	const increment = () => updateQuantity(item.cartItemId || item._id, item.quantity + 1)
	const decrement = () => {
		if (item.quantity > 1) {
			updateQuantity(item.cartItemId || item._id, item.quantity - 1)
		}
	}

	return (
		<div className='border p-4 rounded-xl flex justify-between items-center'>
			<div>
				<p className='font-semibold'>{item.name}</p>
				<div className='text-sm text-muted-foreground mb-1'>
					{item.price} ₸ × {item.quantity}
				</div>
				<div className='flex items-center gap-2'>
					<Button variant='outline' size='sm' onClick={decrement}>
						−
					</Button>
					<span className='w-6 text-center'>{item.quantity}</span>
					<Button variant='outline' size='sm' onClick={increment}>
						+
					</Button>
				</div>
			</div>

			<div className='flex items-center gap-4'>
				<p className='font-semibold whitespace-nowrap'>{(item.price * item.quantity).toFixed(2)} ₸</p>
				<Button variant='ghost' size='icon' className='text-destructive' onClick={handleRemove}>
					<Trash2 className='h-4 w-4' />
				</Button>
			</div>
		</div>
	)
}
