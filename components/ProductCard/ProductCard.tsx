'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Product } from '@/types'
import { Loader2 } from 'lucide-react'
import styles from './ProductCard.module.scss'

interface ProductCardProps {
	product: Product
	onClick?: () => void
}

export function ProductCard({ product, onClick }: ProductCardProps) {
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
				<p className={styles.price}>{product.price} ₸</p>
			</div>
		</div>
	)
}
