'use client'

import { useState } from 'react'
import { Product } from '@/types'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { CartItem, useCartStore } from '@/stores/cart-store'

interface ProductModalProps {
	product: Product
	onClose: () => void
}

export function ProductModal({ product, onClose }: ProductModalProps) {
	const [quantity, setQuantity] = useState(1)
	const addToCart = useCartStore(state => state.addToCart)

	const handleAddToCart = async () => {
		const cartItem: CartItem = { ...product, quantity, cartItemId: product._id }
		await addToCart(cartItem)
		onClose()
	}

	const increment = () => setQuantity(q => q + 1)
	const decrement = () => setQuantity(q => (q > 1 ? q - 1 : 1))

	return (
		<Dialog open onOpenChange={onClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{product.name}</DialogTitle>
				</DialogHeader>

				<p className='text-sm text-muted-foreground mb-4'>{product.description}</p>

				<div className='flex items-center gap-4 mb-4'>
					<span>Количество:</span>
					<div className='flex items-center border rounded-md'>
						<Button type='button' size='sm' variant='default' onClick={decrement} className='rounded-l-md'>
							−
						</Button>
						<div className='w-10 text-center select-none'>{quantity}</div>
						<Button type='button' size='sm' variant='default' onClick={increment} className='rounded-r-md'>
							+
						</Button>
					</div>
				</div>

				<p className='font-semibold mb-4'>Итог: {product.price * quantity} ₸</p>

				<Button className='w-full' onClick={handleAddToCart}>
					В корзину
				</Button>
			</DialogContent>
		</Dialog>
	)
}
