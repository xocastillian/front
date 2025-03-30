'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCartStore } from '@/stores/cart-store'
import { useProfileStore } from '@/stores/profile-store'
import { useRouter } from 'next/navigation'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useEffect } from 'react'
import { OrderFormData, OrderFormSchema } from '@/lib/validation/orderSchema'

export function OrderForm() {
	const { createOrder } = useCartStore()
	const { profile } = useProfileStore()
	const router = useRouter()

	const form = useForm<OrderFormData>({
		resolver: zodResolver(OrderFormSchema),
		defaultValues: {
			phone: '',
			address: '',
			recipientName: '',
		},
	})

	useEffect(() => {
		if (profile) {
			if (profile.phone) form.setValue('phone', profile.phone)
			if (profile.name) form.setValue('recipientName', profile.name)
		}
	}, [profile, form])

	const onSubmit = async (data: OrderFormData) => {
		try {
			await createOrder(data)
			router.push('/')
		} catch (err) {
			console.error('Ошибка при оформлении заказа:', err)
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
				<FormField
					control={form.control}
					name='phone'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Номер телефона *</FormLabel>
							<FormControl>
								<Input placeholder='+7 777 123 4567' {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='address'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Адрес доставки *</FormLabel>
							<FormControl>
								<Input placeholder='Улица, дом, квартира' {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='recipientName'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Имя получателя</FormLabel>
							<FormControl>
								<Input placeholder='Иван Иванов' {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type='submit' className='w-full' disabled={form.formState.isSubmitting}>
					{form.formState.isSubmitting ? 'Оформляем...' : 'Оформить заказ'}
				</Button>
			</form>
		</Form>
	)
}
