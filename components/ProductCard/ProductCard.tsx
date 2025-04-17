'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Product } from '@/types'
import { Loader2 } from 'lucide-react'
import styles from './ProductCard.module.scss'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/stores/cart-store'
import { QuantityCounter } from '../QuantityCounter/QuantityCounter'

interface ProductCardProps {
	product: Product
	onClick?: () => void
	showAddToCart?: boolean
	onAddToCart?: (product: Product) => void
	isAdded?: boolean
	isLoading?: boolean
}

export function ProductCard({ product, onClick, showAddToCart }: ProductCardProps) {
	const [loadingId, setLoadingId] = useState<string | null>(null)
	const isLoading = loadingId === product._id
	const [isImageLoading, setIsImageLoading] = useState(true)
	const cartItems = useCartStore(state => state.items)
	const addToCart = useCartStore(state => state.addToCart)
	const updateQuantity = useCartStore(state => state.updateQuantity)
	const removeFromCart = useCartStore(state => state.removeFromCart)
	const cartItem = cartItems.find(i => i._id === product._id)
	const quantity = cartItem?.quantity || 0

	const handleAdd = async () => {
		setLoadingId(product._id)
		await addToCart({ ...product, quantity: 1, cartItemId: product._id })
		setLoadingId(null)
	}

	const handleUpdate = async (newQuantity: number) => {
		const id = cartItem?.cartItemId || product._id

		if (newQuantity < 1) {
			setLoadingId(product._id)
			await removeFromCart(id)
			setLoadingId(null)
			return
		}

		setLoadingId(product._id)
		await updateQuantity(id, newQuantity)
		setLoadingId(null)
	}

	return (
		<div className={styles.prod} onClick={onClick}>
			<div className={styles.img}>
				{product.imageUrl && (
					<Image
						src={product.imageUrl}
						alt={product.name}
						fill
						className={`${styles.imgItem} ${isImageLoading ? styles.hidden : ''}`}
						onLoad={() => setIsImageLoading(false)}
					/>
				)}

				{isImageLoading && (
					<div className={styles.loader}>
						<Loader2 className='w-6 h-6 animate-spin text-muted-foreground' />
					</div>
				)}
			</div>

			<div className={styles.info}>
				<div className={styles.text}>
					<p className={styles.name}>{product.name}</p>
					<p className={styles.descr}>{product.description}</p>
				</div>

				<div className={styles.priceBox}>
					<p className={styles.price}>{product.price} ₸</p>

					{showAddToCart && (
						<div onClick={e => e.stopPropagation()}>
							{isLoading ? (
								<Button variant='default' size='sm' className={styles.btn} onClick={e => e.stopPropagation()}>
									<Loader2 className='w-4 h-4 animate-spin' />
								</Button>
							) : quantity > 0 ? (
								<div className={styles.btn} onClick={e => e.stopPropagation()}>
									<QuantityCounter
										min={0}
										value={quantity}
										onIncrement={() => handleUpdate(quantity + 1)}
										onDecrement={() => handleUpdate(quantity - 1)}
									/>
								</div>
							) : (
								<Button variant='default' size='sm' onClick={handleAdd} className={styles.btn}>
									В корзину
								</Button>
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
