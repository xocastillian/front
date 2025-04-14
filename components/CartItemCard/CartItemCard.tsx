import { FC, useState } from 'react'
import Image from 'next/image'
import { CartItem, useCartStore } from '@/stores/cart-store'
import { Button } from '@/components/ui/button'
import { Trash2, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface CartItemCardProps {
	item: CartItem
}

export const CartItemCard: FC<CartItemCardProps> = ({ item }) => {
	const removeFromCart = useCartStore(s => s.removeFromCart)
	const updateQuantity = useCartStore(s => s.updateQuantity)

	const [loadingId, setLoadingId] = useState<string | null>(null)
	const id = item.cartItemId || item._id

	const handleRemove = () => {
		setLoadingId(id)
		removeFromCart(id)
		toast.success('Товар удалён из корзины')
		setLoadingId(null)
	}

	const increment = () => {
		setLoadingId(id)
		updateQuantity(id, item.quantity + 1)
		setLoadingId(null)
	}

	const decrement = () => {
		if (item.quantity <= 1) return
		setLoadingId(id)
		updateQuantity(id, item.quantity - 1)
		setLoadingId(null)
	}

	return (
		<div className='border p-4 rounded-xl flex items-center gap-4'>
			{item.imageUrl && (
				<div className='relative w-24 h-24 flex-shrink-0 rounded-md overflow-hidden'>
					<Image src={item.imageUrl} alt={item.name} fill className='object-cover' />
				</div>
			)}

			<div className='flex justify-between items-center w-full'>
				<div>
					<p className='font-semibold'>{item.name}</p>
					<div className='text-sm text-muted-foreground mb-1'>
						{item.price} ₸ × {item.quantity}
					</div>
					<div className='flex items-center gap-2'>
						<Button variant='outline' size='sm' onClick={decrement} disabled={loadingId === id || item.quantity <= 1}>
							−
						</Button>
						<span className='w-6 text-center'>{item.quantity}</span>
						<Button variant='outline' size='sm' onClick={increment} disabled={loadingId === id}>
							+
						</Button>
					</div>
				</div>

				<div className='flex items-center gap-4'>
					<p className='font-semibold whitespace-nowrap'>{(item.price * item.quantity).toFixed(2)} ₸</p>
					<Button variant='ghost' size='icon' className='text-destructive' onClick={handleRemove} disabled={loadingId === id}>
						{loadingId === id ? <Loader2 className='h-4 w-4 animate-spin' /> : <Trash2 className='h-4 w-4' />}
					</Button>
				</div>
			</div>
		</div>
	)
}
