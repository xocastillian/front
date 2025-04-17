'use client'

import { FC, useState } from 'react'
import Image from 'next/image'
import { CartItem, useCartStore } from '@/stores/cart-store'
import { Button } from '@/components/ui/button'
import { Trash2, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import clsx from 'clsx'
import { QuantityCounter } from '../QuantityCounter/QuantityCounter'

interface CartItemCardProps {
	item: CartItem
}

export const CartItemCard: FC<CartItemCardProps> = ({ item }) => {
	const removeFromCart = useCartStore(s => s.removeFromCart)
	const updateQuantity = useCartStore(s => s.updateQuantity)
	const [loadingId, setLoadingId] = useState<string | null>(null)
	const id = item.cartItemId || item._id
	const isLoading = loadingId === id

	const handleRemove = async () => {
		setLoadingId(id)
		await removeFromCart(id)
		toast.success('Товар удалён из корзины')
		setLoadingId(null)
	}

	const increment = async () => {
		setLoadingId(id)
		await updateQuantity(id, item.quantity + 1)
		setLoadingId(null)
	}

	const decrement = async () => {
		if (item.quantity <= 1) return
		setLoadingId(id)
		await updateQuantity(id, item.quantity - 1)
		setLoadingId(null)
	}

	return (
		<div className='relative'>
			{isLoading && (
				<div className='absolute inset-0 z-10 flex items-center justify-center bg-white/50 backdrop-blur-sm rounded-xl'>
					<Loader2 className='h-6 w-6 animate-spin text-muted-foreground' color='red' />
				</div>
			)}

			<div
				className={clsx(
					'border p-4 rounded-xl flex flex-col sm:flex-row sm:items-center gap-4 transition',
					isLoading && 'opacity-60 pointer-events-none select-none'
				)}
			>
				{item.imageUrl && (
					<div className='relative w-24 h-24 flex-shrink-0 rounded-md overflow-hidden mx-auto sm:mx-0'>
						<Image src={item.imageUrl} alt={item.name} fill className='object-cover' />
					</div>
				)}

				<div className='flex flex-col sm:flex-row justify-between items-center sm:items-center text-center sm:text-left w-full gap-4'>
					<div className='flex flex-col items-center sm:items-start'>
						<p className='font-semibold'>{item.name}</p>
						<div className='text-sm text-muted-foreground mb-1'>
							{item.price} ₸ × {item.quantity}
						</div>
						<div className='flex items-center gap-2'>
							<QuantityCounter value={item.quantity} onIncrement={increment} onDecrement={decrement} />
						</div>
					</div>

					<div className='flex items-center gap-4'>
						<p className='font-semibold whitespace-nowrap'>{(item.price * item.quantity).toFixed(2)} ₸</p>
						<Button variant='ghost' size='icon' className='text-destructive' onClick={handleRemove} disabled={isLoading}>
							<Trash2 className='h-4 w-4' />
						</Button>
					</div>
				</div>
			</div>
		</div>
	)
}
