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
import { useCartStore, CartItem } from '@/stores/cart-store'
import { toast } from 'sonner'

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
	const [addingProductId, setAddingProductId] = useState<string | null>(null)
	const addToCart = useCartStore(state => state.addToCart)
	const cartItems = useCartStore(state => state.items)
	const limit = 10

	const isProductAdded = (productId: string) => {
		return cartItems.some(item => item._id === productId)
	}

	const handleAddToCart = async (product: Product) => {
		setAddingProductId(product._id)

		try {
			const cartItem: CartItem = {
				...product,
				quantity: 1,
				cartItemId: product._id,
			}
			await addToCart(cartItem)
			toast.success('Товар добавлен в корзину')
		} catch (err) {
			console.error('Ошибка при добавлении в корзину:', err)
			toast.error('Не удалось добавить товар')
		} finally {
			setAddingProductId(null)
		}
	}

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
		<main className='px-4 py-8 max-w-[1300px] mx-auto'>
			<div className='flex flex-col gap-4 xl:flex-row xl:justify-between xl:items-center mb-6'>
				<Tabs items={categories.map(c => ({ id: c._id, name: c.name }))} selected={selectedCategory} onSelect={handleTabClick} />

				<div className='flex flex-col xl:flex-row gap-4 w-full xl:w-auto'>
					<Input
						type='text'
						placeholder='Поиск по имени...'
						value={search}
						onChange={e => setSearch(e.target.value)}
						className='w-full xl:max-w-md'
					/>
					<SortBox value={sort} onChange={handleSortChange} options={sortOptions} placeholder='Сортировка...' widthClass='xl:w-[220px] w-full' />
				</div>
			</div>

			<ProductList
				products={products}
				loading={loading}
				onLoadMore={handleLoadMore}
				hasMore={hasMore}
				onAddToCart={handleAddToCart}
				getIsAdded={isProductAdded}
				addingProductId={addingProductId ?? undefined}
			/>
		</main>
	)
}
