'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Product } from '@/types'

interface ProductCardProps {
	product: Product
	onClick?: () => void
}

export function ProductCard({ product, onClick }: ProductCardProps) {
	return (
		<Card className='hover:shadow-md transition-shadow cursor-pointer' onClick={onClick}>
			<CardHeader>
				<CardTitle>{product.name}</CardTitle>
			</CardHeader>
			<CardContent>
				<p className='text-sm text-muted-foreground mb-2'>{product.description}</p>
				<p className='font-semibold'>{product.price} ₸</p>
			</CardContent>
		</Card>
	)
}
