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
				{product.options && (
					<ul className='list-disc list-inside text-sm text-muted-foreground mb-2'>
						{product.options.map((option, index) => (
							<li key={index}>{option}</li>
						))}
					</ul>
				)}
				<p className='font-semibold'>{product.price} ₸</p>
			</CardContent>
		</Card>
	)
}
