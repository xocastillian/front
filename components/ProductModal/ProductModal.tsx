'use client'

import { useState } from 'react'
import { Product } from '@/types'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { CartItem, useCartStore } from '@/stores/cart-store'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'

interface ProductModalProps {
	product: Product
	onClose: () => void
}

export function ProductModal({ product, onClose }: ProductModalProps) {
	const [quantity, setQuantity] = useState(1)
	const [loading, setLoading] = useState(false)
	const addToCart = useCartStore(state => state.addToCart)

	const handleAddToCart = async () => {
		setLoading(true)
		try {
			const cartItem: CartItem = {
				...product,
				quantity,
				cartItemId: product._id,
			}
			await addToCart(cartItem)
			toast.success('Товар добавлен в корзину')
			onClose()
		} catch (err) {
			console.error('Ошибка при добавлении в корзину:', err)
			toast.error('Не удалось добавить товар')
		} finally {
			setLoading(false)
		}
	}

	const increment = () => setQuantity(q => q + 1)
	const decrement = () => setQuantity(q => (q > 1 ? q - 1 : 1))

	return (
		<Dialog open onOpenChange={onClose}>
			<DialogContent>
				{product.imageUrl && (
					<div className='relative w-full h-48 mb-4 rounded-md overflow-hidden'>
						<Image src={product.imageUrl} alt={product.name} fill className='object-cover' sizes='(max-width: 768px) 100vw, 33vw' priority={false} />
					</div>
				)}

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

				<p className='font-semibold mb-4'>Итог: {(product.price * quantity).toFixed(2)} ₸</p>

				<Button className='w-full' onClick={handleAddToCart} disabled={loading}>
					{loading ? <Loader2 className='h-4 w-4 animate-spin' /> : 'В корзину'}
				</Button>
			</DialogContent>
		</Dialog>
	)
}
