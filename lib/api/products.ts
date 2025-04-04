import api from './axios'
import { Product } from '@/types'
import { ProductFormData } from '@/lib/validation/productSchema'

export const fetchProducts = async (page: number, limit: number, categoryId?: string, sort?: string): Promise<Product[]> => {
	const query = new URLSearchParams({ page: String(page), limit: String(limit) })
	if (categoryId) query.append('categoryId', categoryId)
	if (sort) query.append('sort', sort)

	const res = await api.get(`/products?${query.toString()}`)
	return res.data
}

export const createProduct = async (data: ProductFormData): Promise<void> => {
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

export const updateProduct = async (id: string, data: ProductFormData): Promise<void> => {
	let imageUrl: string | undefined

	if (data.image && data.image.length > 0) {
		const formData = new FormData()
		formData.append('file', data.image[0])

		const uploadRes = await api.post('/products/upload-image', formData, {
			headers: { 'Content-Type': 'multipart/form-data' },
		})
		imageUrl = uploadRes.data.secure_url
	}

	await api.patch(`/products/${id}`, {
		name: data.name,
		description: data.description,
		price: data.price,
		categoryId: data.categoryId,
		options: data.options?.filter(opt => opt.trim() !== '') || [],
		...(imageUrl && { imageUrl }),
	})
}

export const deleteProduct = async (id: string): Promise<void> => {
	await api.delete(`/products/${id}`)
}
