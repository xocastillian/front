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
	const addToCart = useCartStore(state => state.addToCart)
	const [loading, setLoading] = useState(false)

	const handleAddToCart = async () => {
		setLoading(true)
		try {
			const cartItem: CartItem = {
				...product,
				quantity: 1,
				cartItemId: product._id,
			}
			await addToCart(cartItem)
			onClose()
		} catch (err) {
			console.error('Ошибка при добавлении в корзину:', err)
			toast.error('Не удалось добавить товар')
		} finally {
			setLoading(false)
		}
	}

	return (
		<Dialog open onOpenChange={onClose}>
			<DialogContent className='w-auto max-w-3xl sm:max-w-4xl p-0 overflow-hidden border-0 ring-0 outline-none shadow-none'>
				<div className='flex flex-col md:flex-row items-stretch h-full'>
					{product.imageUrl && (
						<div className='relative w-full aspect-square sm:w-[400px] sm:h-[400px] flex-shrink-0'>
							<Image src={product.imageUrl} alt={product.name} fill className='object-cover' sizes='(max-width: 768px) 100vw, 400px' />
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
							</div>
						</div>

						<Button className='w-full mt-6' onClick={handleAddToCart} disabled={loading}>
							{loading ? <Loader2 className='h-4 w-4 animate-spin' /> : `В корзину за ${product.price.toFixed(2)} ₸`}
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}
