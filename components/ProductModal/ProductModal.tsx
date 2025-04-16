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
			<DialogContent className='w-auto max-w-3xl sm:max-w-4xl p-0 overflow-hidden border-0 ring-0 outline-none shadow-none'>
				<div className='flex flex-col md:flex-row items-stretch h-full'>
					{product.imageUrl && (
						<div className='relative w-full h-[250px] md:w-[400px] md:h-[400px] flex-shrink-0'>
							<Image src={product.imageUrl} alt={product.name} fill className='object-cover' sizes='(max-width: 768px) 100vw, 300px' />
						</div>
					)}

					<div className='p-6 flex flex-col justify-between w-full min-w-[300px] h-full'>
						<div className='flex flex-col'>
							<DialogHeader>
								<DialogTitle>{product.name}</DialogTitle>
							</DialogHeader>

							<div className='flex flex-col items-start gap-2 mt-4'>
								<p className='text-sm text-muted-foreground'>{product.description}</p>

								{product.options && product.options.length > 0 && (
									<ul className='list-disc list-inside text-sm text-muted-foreground'>
										{product.options.map((option, index) => (
											<li key={index}>{option}</li>
										))}
									</ul>
								)}

								<div className='flex items-center gap-4 mt-4'>
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
							</div>
						</div>

						<Button className='w-full mt-6' onClick={handleAddToCart} disabled={loading}>
							{loading ? <Loader2 className='h-4 w-4 animate-spin' /> : `В корзину за ${(product.price * quantity).toFixed(2)} ₸`}
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}
