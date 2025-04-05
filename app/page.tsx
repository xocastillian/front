'use client'

import { useEffect, useState } from 'react'
import { Product } from '@/types'
import { ProductList } from '@/components/ProductList/ProductList'
import { fetchCategories } from '@/lib/api/category'
import { Category } from '@/types'
import { Tabs } from '@/components/Tabs/Tabs'
import { fetchProducts } from '@/lib/api/products'
import { SortBox } from '@/components/SortBox/SortBox'
import { Input } from '@/components/ui/input'
import { useDebounce } from '@/hooks/useDebounce'

const sortOptions = [
	{ label: 'Без сортировки', value: '' },
	{ label: 'Цена ↑', value: 'priceAsc' },
	{ label: 'Цена ↓', value: 'priceDesc' },
	{ label: 'По новизне', value: 'new' },
]

export default function Home() {
	const [products, setProducts] = useState<Product[]>([])
	const [categories, setCategories] = useState<Category[]>([])
	const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
	const [sort, setSort] = useState<string>('')
	const [page, setPage] = useState(1)
	const [loading, setLoading] = useState(false)
	const [hasMore, setHasMore] = useState(true)
	const [search, setSearch] = useState('')
	const debouncedSearch = useDebounce(search, 500)

	const limit = 10

	const loadProducts = async (page: number, categoryId?: string, sort?: string, search?: string) => {
		setLoading(true)
		try {
			const newProducts = await fetchProducts(page, limit, categoryId, sort, search)

			setProducts(prev => {
				if (page === 1) return newProducts
				const merged = [...prev, ...newProducts]
				return Array.from(new Map(merged.map(p => [p._id, p])).values())
			})

			if (newProducts.length < limit) setHasMore(false)
		} catch (err) {
			console.error('Ошибка при получении продуктов:', err)
		} finally {
			setLoading(false)
		}
	}

	const handleTabClick = (categoryId: string | null) => {
		setSelectedCategory(categoryId)
		setPage(1)
		setHasMore(true)
	}

	const handleSortChange = (value: string) => {
		setSort(value)
		setPage(1)
		setHasMore(true)
	}

	const handleLoadMore = () => {
		const nextPage = page + 1
		setPage(nextPage)
	}

	useEffect(() => {
		fetchCategories().then(setCategories)
	}, [])

	useEffect(() => {
		loadProducts(page, selectedCategory ?? undefined, sort, debouncedSearch)
	}, [page, selectedCategory, sort, debouncedSearch])

	return (
		<main className='px-6 py-14'>
			<div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6'>
				<Tabs items={categories.map(c => ({ id: c._id, name: c.name }))} selected={selectedCategory} onSelect={handleTabClick} />

				<div className='flex gap-4'>
					<Input type='text' placeholder='Поиск по имени...' value={search} onChange={e => setSearch(e.target.value)} className='w-full max-w-md' />
					<SortBox value={sort} onChange={handleSortChange} options={sortOptions} placeholder='Сортировка...' widthClass='w-[220px]' />
				</div>
			</div>

			<ProductList products={products} loading={loading} onLoadMore={handleLoadMore} hasMore={hasMore} />
		</main>
	)
}
