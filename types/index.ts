export interface Product {
	_id: string
	name: string
	description: string
	price: number
	imageUrl?: string
	options?: string[]
}

export interface RawCartItem {
	productId: string
	quantity: number
	_id: string
}
