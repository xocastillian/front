'use client'

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { ProductForm } from '@/components/forms/product-form'
import { CreateCategoryForm } from '@/components/forms/category-form'
import { Category, Product } from '@/types'
import { useState } from 'react'
import { ProductFormData } from '@/lib/validation/productSchema'
import { CategoryFormData } from '@/lib/validation/categorySchema'
import { ProductList } from '../ProductList/ProductList'
import { Tabs } from '@/components/Tabs/Tabs'

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

	const filteredProducts = selectedCategory ? products.filter(p => p.categoryId?._id === selectedCategory) : products

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

			<Tabs
				items={categories.map(c => ({ id: c._id, name: c.name }))}
				selected={selectedCategory}
				onSelect={setSelectedCategory}
				isAdminPanel
				onAddCategoryClick={() => setOpenCategory(true)}
				onDeleteCategory={onDeleteCategory}
			/>

			<ProductList
				products={filteredProducts}
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
