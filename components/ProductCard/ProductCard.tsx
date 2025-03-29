'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Product } from '@/types/product'

interface ProductCardProps {
	product: Product
}

export function ProductCard({ product }: ProductCardProps) {
	return (
		<Card className='hover:shadow-md transition-shadow'>
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
