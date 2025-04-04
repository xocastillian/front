import { CategoryFormData } from '../validation/categorySchema'
import api from './axios'
import { Category } from '@/types'

export const fetchCategories = async (): Promise<Category[]> => {
	const res = await api.get('/categories')
	return res.data
}

export const createCategory = async (data: CategoryFormData): Promise<void> => {
	await api.post('/categories', {
		name: data.name,
		slug: data.slug,
	})
}

export const deleteCategory = async (id: string): Promise<void> => {
	await api.delete(`/categories/${id}`)
}
