'use client'

import { useState } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { ProductCard } from '../ProductCard/ProductCard'
import { ProductModal } from '../ProductModal/ProductModal'
import { Product } from '@/types'
import { Button } from '@/components/ui/button'

interface ProductListProps {
	products: Product[]
	loading: boolean
	onLoadMore?: () => void
	hasMore: boolean
	isAdminPanel?: boolean
}

export const ProductList = ({ products, loading, onLoadMore, hasMore, isAdminPanel }: ProductListProps) => {
	const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

	return (
		<div>
			<h1 className='text-2xl font-bold mb-6'>Список продуктов</h1>
			<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
				{products.map(product => (
					<div
						key={product._id}
						onClick={() => {
							if (!isAdminPanel) setSelectedProduct(product)
						}}
					>
						<ProductCard product={product} />
					</div>
				))}

				{loading && Array.from({ length: 3 }).map((_, i) => <Skeleton key={`skeleton-${i}`} className='h-40 w-full rounded-xl' />)}
			</div>

			{hasMore && (
				<div className='flex justify-center mt-6'>
					<Button onClick={onLoadMore} disabled={loading}>
						{loading ? 'Загрузка...' : 'Показать ещё'}
					</Button>
				</div>
			)}

			{selectedProduct && !isAdminPanel && <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
		</div>
	)
}
