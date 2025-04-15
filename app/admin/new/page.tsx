'use client'

import { useState, useEffect } from 'react'
import { createCategory, deleteCategory, fetchCategories } from '@/lib/api/category'
import { createProduct, fetchProducts, updateProduct, deleteProduct } from '@/lib/api/products'
import { updateOrderStatus, fetchAllOrdersForAdmin } from '@/lib/api/orders'
import { Category, Order, OrderStatus, Product } from '@/types'
import { ProductFormData } from '@/lib/validation/productSchema'
import { CategoryFormData } from '@/lib/validation/categorySchema'
import { Sidebar } from '@/components/Sidebar/Sidebar'
import { CreateTab } from '@/components/CreateTab/CreateTab'
import { OrdersTab } from '@/components/OrdersTab/OrdersTab'
import { toast } from 'sonner'
import { Loader } from '@/components/Loader/Loader'
import { useAuthGuard } from '@/hooks/useAuthGuard'
import { getSocket } from '@/lib/api/ordersSocket'

export default function AdminPanelPage() {
	useAuthGuard('admin')

	const [loadingProduct, setLoadingProduct] = useState(false)
	const [loadingCategory, setLoadingCategory] = useState(false)
	const [loadingProducts, setLoadingProducts] = useState(false)
	const [categories, setCategories] = useState<Category[]>([])
	const [products, setProducts] = useState<Product[]>([])
	const [orders, setOrders] = useState<Order[]>([])
	const [activeSection, setActiveSection] = useState<'create' | 'orders'>('create')
	const [hasNewOrder, setHasNewOrder] = useState(false)

	useEffect(() => {
		setLoadingProducts(true)
		fetchProducts(1, 1000)
			.then(setProducts)
			.finally(() => setLoadingProducts(false))
	}, [])

	useEffect(() => {
		fetchCategories()
			.then(setCategories)
			.catch(err => {
				console.error('Ошибка при получении категорий:', err)
				toast.error('Не удалось загрузить категории')
			})
	}, [])

	useEffect(() => {
		fetchAllOrdersForAdmin()
			.then(setOrders)
			.catch(err => {
				console.error('Ошибка при получении заказов администратора:', err)
				toast.error('Не удалось загрузить заказы')
			})
	}, [])

	useEffect(() => {
		if (typeof window !== 'undefined') {
			const socket = getSocket()

			const handleNewOrder = (order: Order) => {
				localStorage.setItem('has_new_order', '1')
				setHasNewOrder(true)
				setOrders(prev => [order, ...prev])
			}

			socket.on('order:new', handleNewOrder)

			return () => {
				socket.off('order:new', handleNewOrder)
			}
		}
	}, [])

	useEffect(() => {
		const hasNew = localStorage.getItem('has_new_order') === '1'
		setHasNewOrder(hasNew)

		function handleStorage(event: StorageEvent) {
			if (event.key === 'has_new_order') {
				setHasNewOrder(event.newValue === '1')
			}
		}

		window.addEventListener('storage', handleStorage)
		return () => {
			window.removeEventListener('storage', handleStorage)
		}
	}, [])

	useEffect(() => {
		if (activeSection === 'orders') {
			setHasNewOrder(false)
			localStorage.removeItem('has_new_order')
		}
	}, [activeSection])

	const handleProductSubmit = async (data: ProductFormData) => {
		setLoadingProduct(true)
		try {
			await createProduct(data)
			const updated = await fetchProducts(1, 1000)
			setProducts(updated)
			toast.success('Товар создан')
		} catch (err) {
			console.error('Ошибка при создании товара:', err)
			toast.error('Не удалось создать товар')
		} finally {
			setLoadingProduct(false)
		}
	}

	const handleUpdateProduct = async (id: string, data: ProductFormData) => {
		setLoadingProduct(true)
		try {
			await updateProduct(id, data)
			const updated = await fetchProducts(1, 1000)
			setProducts(updated)
			toast.success('Товар обновлён')
		} catch (err) {
			console.error('Ошибка при обновлении товара:', err)
			toast.error('Не удалось обновить товар')
		} finally {
			setLoadingProduct(false)
		}
	}

	const handleDeleteProduct = async (id: string) => {
		setLoadingProduct(true)
		try {
			await deleteProduct(id)
			const updated = await fetchProducts(1, 1000)
			setProducts(updated)
			toast.success('Товар удалён')
		} catch (err) {
			console.error('Ошибка при удалении товара:', err)
			toast.error('Не удалось удалить товар')
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
			toast.success('Категория создана')
		} catch (err) {
			console.error('Ошибка при создании категории:', err)
			toast.error('Не удалось создать категорию')
		} finally {
			setLoadingCategory(false)
		}
	}

	const handleDeleteCategory = async (id: string) => {
		setLoadingCategory(true)
		try {
			await deleteCategory(id)
			const updated = await fetchCategories()
			setCategories(updated)
			toast.success('Категория удалена')
		} catch (err) {
			console.error('Ошибка при удалении категории:', err)
			toast.error('Не удалось удалить категорию')
		} finally {
			setLoadingCategory(false)
		}
	}

	const handleUpdateOrderStatus = async (orderId: string, status: OrderStatus) => {
		try {
			const updatedOrder = await updateOrderStatus(orderId, status)
			setOrders(prev => prev.map(o => (o._id === updatedOrder._id ? { ...o, status: updatedOrder.status } : o)))
			toast.success('Статус заказа обновлён')
		} catch (err) {
			console.error('Ошибка при обновлении статуса заказа:', err)
			toast.error('Не удалось обновить статус')
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
			hasNotification: hasNewOrder,
		},
	]

	return (
		<div className='flex min-h-screen relative'>
			{(loadingProducts || loadingProduct || loadingCategory) && <Loader />}

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
						onDeleteCategory={handleDeleteCategory}
					/>
				)}

				{activeSection === 'orders' && <OrdersTab orders={orders} onUpdateOrderStatus={handleUpdateOrderStatus} />}
			</main>
		</div>
	)
}
