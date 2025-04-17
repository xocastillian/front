'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Product } from '@/types'
import { Loader2 } from 'lucide-react'
import styles from './ProductCard.module.scss'
import { Button } from '@/components/ui/button'

interface ProductCardProps {
	product: Product
	onClick?: () => void
	onAddToCart?: (product: Product) => void
	isAdded?: boolean
	isLoading?: boolean
	showAddToCart?: boolean
}

export function ProductCard({ product, onClick, onAddToCart, isAdded, isLoading, showAddToCart }: ProductCardProps) {
	const [isImageLoading, setIsImageLoading] = useState(true)

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
						<Button
							className={styles.btn}
							variant={isAdded ? 'secondary' : 'default'}
							size='sm'
							onClick={e => {
								e.stopPropagation()
								onAddToCart?.(product)
							}}
						>
							{isLoading ? <Loader2 className='w-4 h-4 animate-spin' /> : isAdded ? 'Добавить ещё' : 'В корзину'}
						</Button>
					)}
				</div>
			</div>
		</div>
	)
}
