import api from './axios'
import { Product } from '@/types'
import { CreateProductFormData } from '@/lib/validation/createProductSchema'

export const fetchProducts = async (page: number, limit: number, categoryId?: string): Promise<Product[]> => {
	const query = new URLSearchParams({ page: String(page), limit: String(limit) })
	if (categoryId) query.append('categoryId', categoryId)

	const res = await api.get(`/products?${query.toString()}`)
	return res.data
}

export const createProduct = async (data: CreateProductFormData): Promise<void> => {
	const formData = new FormData()
	formData.append('file', data.image[0])

	const uploadRes = await api.post('/products/upload-image', formData, {
		headers: { 'Content-Type': 'multipart/form-data' },
	})

	const imageUrl = uploadRes.data.secure_url

	await api.post('/products', {
		name: data.name,
		description: data.description,
		price: data.price,
		categoryId: data.categoryId,
		imageUrl,
		options: data.options?.filter(opt => opt.trim() !== '') || [],
	})
}
