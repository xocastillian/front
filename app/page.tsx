'use client'

import { useEffect, useState } from 'react'
import api from '@/lib/api/axios'
import { ProductList } from '@/components/ProductList/ProductList'
import { Product } from '@/types/product'

export default function Home() {
	const [products, setProducts] = useState<Product[]>([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const fetchProducts = async () => {
			try {
				const res = await api.get('/products')
				setProducts(res.data)
			} catch (err) {
				console.error('Ошибка при получении продуктов:', err)
			} finally {
				setLoading(false)
			}
		}
		fetchProducts()
	}, [])

	return (
		<main className='px-6 py-14'>
			<ProductList products={products} loading={loading} />
		</main>
	)
}
