'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createCategory, fetchCategories } from '@/lib/api/category'
import { createProduct, fetchProducts, updateProduct, deleteProduct } from '@/lib/api/products'
import { fetchOrders, updateOrderStatus } from '@/lib/api/orders'
import { Category, Order, OrderStatus, Product } from '@/types'
import { ProductFormData } from '@/lib/validation/productSchema'
import { CategoryFormData } from '@/lib/validation/categorySchema'
import { Sidebar } from '@/components/Sidebar/Sidebar'
import { getSocket } from '@/lib/api/socket'
import { CreateTab } from '@/components/CreateTab/CreateTab'
import { OrdersTab } from '@/components/OrdersTab/OrdersTab'

export default function AdminPanelPage() {
	const router = useRouter()
	const [loadingProduct, setLoadingProduct] = useState(false)
	const [loadingCategory, setLoadingCategory] = useState(false)
	const [categories, setCategories] = useState<Category[]>([])
	const [orders, setOrders] = useState<Order[]>([])
	const [activeSection, setActiveSection] = useState<'create' | 'orders'>('create')
	const [products, setProducts] = useState<Product[]>([])
	const [loadingProducts, setLoadingProducts] = useState(false)

	useEffect(() => {
		setLoadingProducts(true)
		fetchProducts(1, 100)
			.then(setProducts)
			.finally(() => setLoadingProducts(false))
	}, [])

	useEffect(() => {
		fetchCategories().then(setCategories)
	}, [])

	useEffect(() => {
		fetchOrders().then(setOrders)

		const socket = getSocket()
		socket.on('order:new', (order: Order) => {
			setOrders(prev => [order, ...prev])
		})

		return () => {
			socket.off('order:new')
		}
	}, [])

	const handleProductSubmit = async (data: ProductFormData) => {
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

	const handleUpdateProduct = async (id: string, data: ProductFormData) => {
		setLoadingProduct(true)
		try {
			await updateProduct(id, data)
			const updated = await fetchProducts(1, 100)
			setProducts(updated)
		} catch (err) {
			console.error('Ошибка при обновлении товара:', err)
		} finally {
			setLoadingProduct(false)
		}
	}

	const handleDeleteProduct = async (id: string) => {
		setLoadingProduct(true)
		try {
			await deleteProduct(id)
			setProducts(prev => prev.filter(p => p._id !== id))
		} catch (err) {
			console.error('Ошибка при удалении товара:', err)
		} finally {
			setLoadingProduct(false)
		}
	}

	const handleCategorySubmit = async (data: CategoryFormData) => {
		setLoadingCategory(true)
		try {
			await createCategory(data)
			const updated = await fetchCategories()
			setCategories(updated)
		} catch (err) {
			console.error('Ошибка при создании категории:', err)
		} finally {
			setLoadingCategory(false)
		}
	}

	const handleUpdateOrderStatus = async (orderId: string, status: OrderStatus) => {
		try {
			const updated = await updateOrderStatus(orderId, status)
			setOrders(prev => prev.map(o => (o._id === updated._id ? { ...o, status: updated.status } : o)))
		} catch (err) {
			console.error('Ошибка при обновлении статуса заказа:', err)
		}
	}

	const sidebarItems = [
		{
			label: 'Добавить',
			value: 'create',
			onClick: () => setActiveSection('create'),
			active: activeSection === 'create',
		},
		{
			label: 'Заказы',
			value: 'orders',
			onClick: () => setActiveSection('orders'),
			active: activeSection === 'orders',
		},
	]

	return (
		<div className='flex min-h-screen'>
			<Sidebar items={sidebarItems} />

			<main className='flex-1 p-6'>
				{activeSection === 'create' && (
					<CreateTab
						categories={categories}
						loadingCategory={loadingCategory}
						loadingProduct={loadingProduct}
						onCreateCategory={handleCategorySubmit}
						onCreateProduct={handleProductSubmit}
						onUpdateProduct={handleUpdateProduct}
						onDeleteProduct={handleDeleteProduct}
						products={products}
						loadingProducts={loadingProducts}
						hasMore={false}
					/>
				)}

				{activeSection === 'orders' && <OrdersTab orders={orders} onUpdateOrderStatus={handleUpdateOrderStatus} />}
			</main>
		</div>
	)
}
