export interface Product {
	_id: string
	name: string
	description: string
	price: number
	imageUrl?: string
	options?: string[]
	categoryId: Category
	createdAt: Date
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

export interface OrderItem {
	productId: Product
	quantity: number
	price: number
}

export enum OrderStatus {
	Accepted = 'accepted',
	Delivered = 'delivered',
	Canceled = 'canceled',
	Pending = 'pending',
	Handled_To_Courier = 'handed_to_courier',
}

export interface Order {
	_id: string
	orderNumber: string
	userId?: string
	items: OrderItem[]
	totalPrice: number
	status: OrderStatus
	phone: string
	address: string | null
	recipientName: string | null
	createdAt: string
	updatedAt: string
	__v: number
}

export enum UserRole {
	Admin = 'admin',
	User = 'user',
}

export interface User {
	name: string
	email: string
	phone: string
	_id?: string
	role?: UserRole
}

export interface SupportSession {
	_id: string
	guestId?: string
	userId?: User
	adminId: string
	isActive: boolean
	createdAt: string
	updatedAt: string
}

export interface SessionMessage {
	_id: string
	text: string
	senderId: string
	senderType: 'user' | 'guest' | 'admin'
	sessionId: string
	createdAt: string
	updatedAt: string
}
