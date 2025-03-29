'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { ProductCard } from '../ProductCard/ProductCard'
import { Product } from '@/types/product'

interface ProductListProps {
	products: Product[]
	loading: boolean
}

export const ProductList = ({ products, loading }: ProductListProps) => {
	return (
		<div>
			<h1 className='text-2xl font-bold mb-6'>Список продуктов</h1>
			<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
				{loading
					? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className='h-40 w-full rounded-xl' />)
					: products.map(product => <ProductCard key={product._id} product={product} />)}
			</div>
		</div>
	)
}
