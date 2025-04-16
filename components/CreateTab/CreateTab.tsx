'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { SortBox } from '@/components/SortBox/SortBox'
import { ProductForm } from '@/components/forms/product-form'
import { CreateCategoryForm } from '@/components/forms/category-form'
import { ProductList } from '../ProductList/ProductList'
import { Tabs } from '@/components/Tabs/Tabs'
import { useDebounce } from '@/hooks/useDebounce'
import { Category, Product } from '@/types'
import { ProductFormData } from '@/lib/validation/productSchema'
import { CategoryFormData } from '@/lib/validation/categorySchema'

interface Props {
	categories: Category[]
	loadingProduct: boolean
	loadingCategory: boolean
	onCreateProduct: (data: ProductFormData) => Promise<void>
	onUpdateProduct: (id: string, data: ProductFormData) => Promise<void>
	onDeleteProduct: (id: string) => Promise<void>
	onDeleteCategory: (id: string) => Promise<void>
	onCreateCategory: (data: CategoryFormData) => Promise<void>
	products: Product[]
	loadingProducts: boolean
	hasMore: boolean
}

const sortOptions = [
	{ label: 'Без сортировки', value: '' },
	{ label: 'Цена ↑', value: 'priceAsc' },
	{ label: 'Цена ↓', value: 'priceDesc' },
	{ label: 'По новизне', value: 'new' },
]

export const CreateTab = ({
	categories,
	loadingProduct,
	loadingCategory,
	onCreateProduct,
	onUpdateProduct,
	onDeleteProduct,
	onCreateCategory,
	onDeleteCategory,
	products,
	loadingProducts,
	hasMore,
}: Props) => {
	const [openProduct, setOpenProduct] = useState(false)
	const [openCategory, setOpenCategory] = useState(false)
	const [editingProduct, setEditingProduct] = useState<Product | null>(null)
	const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
	const [search, setSearch] = useState('')
	const [sort, setSort] = useState('')
	const debouncedSearch = useDebounce(search, 500)

	const handleCreateProduct = async (data: ProductFormData) => {
		await onCreateProduct(data)
		setOpenProduct(false)
	}

	const handleCreateCategory = async (data: CategoryFormData) => {
		await onCreateCategory(data)
		setOpenCategory(false)
	}

	const handleEditSubmit = async (data: ProductFormData) => {
		if (editingProduct) {
			await onUpdateProduct(editingProduct._id, data)
			setEditingProduct(null)
		}
	}

	const handleDelete = async () => {
		if (editingProduct) {
			await onDeleteProduct(editingProduct._id)
			setEditingProduct(null)
		}
	}

	const filteredByCategory = selectedCategory ? products.filter(p => p.categoryId?._id === selectedCategory) : products

	const searchedProducts = filteredByCategory.filter(p => p.name.toLowerCase().includes(debouncedSearch.toLowerCase()))

	const sortedProducts = [...searchedProducts].sort((a, b) => {
		if (sort === 'priceAsc') return a.price - b.price
		if (sort === 'priceDesc') return b.price - a.price
		if (sort === 'new') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
		return 0
	})

	return (
		<div className='space-y-6 mx-auto'>
			<Dialog open={openProduct} onOpenChange={setOpenProduct}>
				<DialogContent>
					<DialogTitle>Добавить товар</DialogTitle>
					<ProductForm onSubmit={handleCreateProduct} isLoading={loadingProduct} categories={categories} />
				</DialogContent>
			</Dialog>

			<Dialog open={openCategory} onOpenChange={setOpenCategory}>
				<DialogContent>
					<DialogTitle>Добавить категорию</DialogTitle>
					<CreateCategoryForm onSubmit={handleCreateCategory} isLoading={loadingCategory} />
				</DialogContent>
			</Dialog>

			<div className='flex flex-col xl:flex-row xl:justify-between xl:items-center gap-4 mb-6'>
				<Tabs
					items={categories.map(c => ({ id: c._id, name: c.name }))}
					selected={selectedCategory}
					onSelect={setSelectedCategory}
					isAdminPanel
					onAddCategoryClick={() => setOpenCategory(true)}
					onDeleteCategory={onDeleteCategory}
				/>

				<div className='flex flex-col xl:flex-row gap-4 w-full xl:w-auto'>
					<Input
						type='text'
						placeholder='Поиск по имени...'
						value={search}
						onChange={e => setSearch(e.target.value)}
						className='w-full xl:max-w-md'
					/>
					<SortBox value={sort} onChange={setSort} options={sortOptions} placeholder='Сортировка...' widthClass='xl:w-[220px] w-full' />
				</div>
			</div>

			<ProductList
				products={sortedProducts}
				loading={loadingProducts}
				hasMore={hasMore}
				isAdminPanel
				onAddProductClick={() => setOpenProduct(true)}
				onProductClick={product => setEditingProduct(product)}
			/>

			<Dialog open={!!editingProduct} onOpenChange={() => setEditingProduct(null)}>
				<DialogContent>
					<DialogTitle>Редактировать товар</DialogTitle>
					<ProductForm
						categories={categories}
						isLoading={loadingProduct}
						onSubmit={handleEditSubmit}
						initialData={editingProduct}
						onDelete={handleDelete}
					/>
				</DialogContent>
			</Dialog>
		</div>
	)
}
