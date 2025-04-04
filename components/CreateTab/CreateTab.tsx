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
	onCreateCategory,
	products,
	loadingProducts,
	hasMore,
}: Props) => {
	const [openProduct, setOpenProduct] = useState(false)
	const [openCategory, setOpenCategory] = useState(false)

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

			<ProductList products={products} loading={loadingProducts} hasMore={hasMore} isAdminPanel />
		</div>
	)
}
