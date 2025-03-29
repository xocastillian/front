'use client'

import { useEffect, useState } from 'react'
import api from '@/lib/api/axios'
import { ProductList } from '@/components/ProductList/ProductList'
import { Product } from '@/types'

export default function Home() {
	const [products, setProducts] = useState<Product[]>([])
	const [page, setPage] = useState(1)
	const [loading, setLoading] = useState(false)
	const [hasMore, setHasMore] = useState(true)
	const limit = 10

	const fetchProducts = async (page: number) => {
		setLoading(true)
		try {
			const res = await api.get(`/products?page=${page}&limit=${limit}`)
			const newProducts: Product[] = res.data

			setProducts(prev => {
				const merged = [...prev, ...newProducts]
				const uniqueMap = new Map<string, Product>()
				for (const p of merged) {
					uniqueMap.set(p._id, p)
				}
				return Array.from(uniqueMap.values())
			})

			if (newProducts.length < limit) {
				setHasMore(false)
			}
		} catch (err) {
			console.error('Ошибка при получении продуктов:', err)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchProducts(1)
	}, [])

	const handleLoadMore = () => {
		const nextPage = page + 1
		setPage(nextPage)
		fetchProducts(nextPage)
	}

	return (
		<main className='px-6 py-14'>
			<ProductList products={products} loading={loading} onLoadMore={handleLoadMore} hasMore={hasMore} />
		</main>
	)
}
