export interface Product {
	_id: string
	name: string
	description: string
	price: number
	imageUrl?: string
	options?: string[]
}

export interface RawCartItem {
	productId: Product
	quantity: number
	_id: string
}

export interface Profile {
	_id: string
	name: string
	email: string
	phone: string
	role?: string
}

export interface Category {
	_id: string
	name: string
	slug: string
	imageUrl: string
	createdAt: string
	updatedAt: string
}
