'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createCategory, fetchCategories } from '@/lib/api/category'
import { createProduct } from '@/lib/api/products'
import { Category } from '@/types'
import { CreateProductFormData } from '@/lib/validation/createProductSchema'
import { CreateCategoryFormData } from '@/lib/validation/createCategorySchema'
import { CreateProductForm } from '@/components/forms/create-product-form'
import { CreateCategoryForm } from '@/components/forms/create-category-form'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

export default function CreatePage() {
	const router = useRouter()
	const [loadingProduct, setLoadingProduct] = useState(false)
	const [loadingCategory, setLoadingCategory] = useState(false)
	const [categories, setCategories] = useState<Category[]>([])

	const [openProductModal, setOpenProductModal] = useState(false)
	const [openCategoryModal, setOpenCategoryModal] = useState(false)

	useEffect(() => {
		fetchCategories().then(setCategories)
	}, [])

	const handleProductSubmit = async (data: CreateProductFormData) => {
		setLoadingProduct(true)
		try {
			await createProduct(data)
			router.push('/')
		} catch (err) {
			console.error('Ошибка при создании товара:', err)
		} finally {
			setLoadingProduct(false)
		}
	}

	const handleCategorySubmit = async (data: CreateCategoryFormData) => {
		setLoadingCategory(true)
		try {
			await createCategory(data)
			const updated = await fetchCategories()
			setCategories(updated)
			setOpenCategoryModal(false)
		} catch (err) {
			console.error('Ошибка при создании категории:', err)
		} finally {
			setLoadingCategory(false)
		}
	}

	return (
		<div className='max-w-xl mx-auto px-4 py-10 space-y-6'>
			<Dialog open={openProductModal} onOpenChange={setOpenProductModal}>
				<DialogTrigger asChild>
					<Button className='w-full'>Добавить товар</Button>
				</DialogTrigger>
				<DialogContent>
					<DialogTitle>Добавить товар</DialogTitle>
					<CreateProductForm onSubmit={handleProductSubmit} isLoading={loadingProduct} categories={categories} />
				</DialogContent>
			</Dialog>

			<Dialog open={openCategoryModal} onOpenChange={setOpenCategoryModal}>
				<DialogTrigger asChild>
					<Button variant='outline' className='w-full'>
						Добавить категорию
					</Button>
				</DialogTrigger>
				<DialogContent>
					<DialogTitle>Добавить категорию</DialogTitle>
					<CreateCategoryForm onSubmit={handleCategorySubmit} isLoading={loadingCategory} />
				</DialogContent>
			</Dialog>
		</div>
	)
}
