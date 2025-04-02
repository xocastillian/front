'use client'

import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { CreateProductForm } from '@/components/forms/create-product-form'
import { CreateCategoryForm } from '@/components/forms/create-category-form'
import { Category } from '@/types'
import { useState } from 'react'
import { CreateProductFormData } from '@/lib/validation/createProductSchema'
import { CreateCategoryFormData } from '@/lib/validation/createCategorySchema'

interface Props {
	categories: Category[]
	loadingProduct: boolean
	loadingCategory: boolean
	onCreateProduct: (data: CreateProductFormData) => void
	onCreateCategory: (data: CreateCategoryFormData) => void
}

export const CreateTab = ({ categories, loadingProduct, loadingCategory, onCreateProduct, onCreateCategory }: Props) => {
	const [openProduct, setOpenProduct] = useState(false)
	const [openCategory, setOpenCategory] = useState(false)

	return (
		<div className='space-y-6 max-w-xl mx-auto'>
			<Dialog open={openProduct} onOpenChange={setOpenProduct}>
				<DialogTrigger asChild>
					<Button className='w-full'>Добавить товар</Button>
				</DialogTrigger>
				<DialogContent>
					<DialogTitle>Добавить товар</DialogTitle>
					<CreateProductForm onSubmit={onCreateProduct} isLoading={loadingProduct} categories={categories} />
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
		</div>
	)
}
