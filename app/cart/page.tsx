'use client'

import { useCartStore } from '@/stores/cart-store'
import { Button } from '@/components/ui/button'
import { CartItemCard } from '@/components/CartItemCard/CartItemCard'
import { ConfirmDialog } from '@/components/ConfirmDialog/ConfirmDialog'

export default function CartPage() {
	const { items, totalPrice, clearCart } = useCartStore()

	return (
		<div className='px-6 py-14 max-w-3xl mx-auto'>
			<h1 className='text-2xl font-bold mb-6'>Корзина</h1>

			{items.length === 0 ? (
				<p className='text-muted-foreground'>Ваша корзина пуста.</p>
			) : (
				<div className='space-y-6'>
					<div className='flex justify-between items-center'>
						<ConfirmDialog
							trigger={<Button variant='destructive'>Очистить корзину</Button>}
							title='Очистить корзину?'
							description='Вы уверены, что хотите удалить все товары из корзины?'
							onConfirm={clearCart}
						/>
						<p className='text-lg font-bold'>Всего: {totalPrice()} ₸</p>
					</div>

					{items.map(item => (
						<CartItemCard key={item._id} item={item} />
					))}

					<Button className='w-full'>Оформить заказ</Button>
				</div>
			)}
		</div>
	)
}
