'use client'

import { useState } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { ProductCard } from '../ProductCard/ProductCard'
import { ProductModal } from '../ProductModal/ProductModal'
import { Product } from '@/types'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

interface ProductListProps {
	products: Product[]
	loading: boolean
	onLoadMore?: () => void
	hasMore: boolean
	onProductClick?: (product: Product) => void
	isAdminPanel?: boolean
	onAddProductClick?: () => void
}

export const ProductList = ({ products, loading, onLoadMore, hasMore, isAdminPanel, onProductClick, onAddProductClick }: ProductListProps) => {
	const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

	return (
		<div>
			<h1 className='text-2xl font-bold mb-6'>Список продуктов</h1>
			{isAdminPanel && (
				<div
					onClick={onAddProductClick}
					className='flex items-center justify-center border-2 border-dashed rounded-xl cursor-pointer h-20 text-gray-500 hover:border-gray-400 transition'
				>
					<Plus className='mr-2' size={24} />
				</div>
			)}
			<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-5'>
				{products.map(product => (
					<div
						key={product._id}
						onClick={() => {
							if (isAdminPanel) {
								onProductClick?.(product)
							} else {
								setSelectedProduct(product)
							}
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
