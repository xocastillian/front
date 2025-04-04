'use client'

import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ProductForm } from '@/components/forms/product-form'
import { CreateCategoryForm } from '@/components/forms/category-form'
import { Category, Product } from '@/types'
import { useState } from 'react'
import { ProductFormData } from '@/lib/validation/productSchema'
import { CategoryFormData } from '@/lib/validation/categorySchema'
import { ProductList } from '../ProductList/ProductList'

interface Props {
	categories: Category[]
	loadingProduct: boolean
	loadingCategory: boolean
	onCreateProduct: (data: ProductFormData) => void
	onUpdateProduct: (id: string, data: ProductFormData) => void
	onDeleteProduct: (id: string) => void
	onCreateCategory: (data: CategoryFormData) => void
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
	products,
	loadingProducts,
	hasMore,
}: Props) => {
	const [openProduct, setOpenProduct] = useState(false)
	const [openCategory, setOpenCategory] = useState(false)
	const [editingProduct, setEditingProduct] = useState<Product | null>(null)

	const handleEditSubmit = (data: ProductFormData) => {
		if (editingProduct) {
			onUpdateProduct(editingProduct._id, data)
			setEditingProduct(null)
		}
	}

	const handleDelete = () => {
		if (editingProduct) {
			onDeleteProduct(editingProduct._id)
			setEditingProduct(null)
		}
	}

	return (
		<div className='space-y-6 mx-auto'>
			<Dialog open={openProduct} onOpenChange={setOpenProduct}>
				<DialogTrigger asChild>
					<Button className='w-full'>Добавить товар</Button>
				</DialogTrigger>
				<DialogContent>
					<DialogTitle>Добавить товар</DialogTitle>
					<ProductForm onSubmit={onCreateProduct} isLoading={loadingProduct} categories={categories} />
				</DialogContent>
			</Dialog>

			<Dialog open={openCategory} onOpenChange={setOpenCategory}>
				<DialogTrigger asChild>
					<Button variant='outline' className='w-full'>
						Добавить категорию
					</Button>
				</DialogTrigger>
				<DialogContent>
					<DialogTitle>Добавить категорию</DialogTitle>
					<CreateCategoryForm onSubmit={onCreateCategory} isLoading={loadingCategory} />
				</DialogContent>
			</Dialog>

			<ProductList
				products={products}
				loading={loadingProducts}
				hasMore={hasMore}
				isAdminPanel
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
