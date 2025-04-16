'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCartStore } from '@/stores/cart-store'
import { useProfileStore } from '@/stores/profile-store'
import { useRouter } from 'next/navigation'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { OrderFormData, OrderFormSchema } from '@/lib/validation/orderSchema'
import { Loader } from '@/components/Loader/Loader'
import { toast } from 'sonner'

export function OrderForm() {
	const { createOrder } = useCartStore()
	const { profile } = useProfileStore()
	const router = useRouter()
	const [loading, setLoading] = useState(false)

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
		setLoading(true)
		try {
			await createOrder(data)
			toast.success('Заказ оформлен')
			router.push('/')
		} catch (err) {
			console.error('Ошибка при оформлении заказа:', err)
			toast.error('Не удалось оформить заказ')
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className='relative'>
			{loading && <Loader />}
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 w-full pt-4 sm:pt-6'>
					<FormField
						control={form.control}
						name='phone'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Номер телефона *</FormLabel>
								<FormControl>
									<Input
										{...field}
										placeholder='+7 777 123 4567'
										onChange={e => {
											const formatted = e.target.value.replace(/[^\d+ ]/g, '').slice(0, 16)
											field.onChange(formatted)
										}}
									/>
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
					<Button type='submit' className='w-full' disabled={form.formState.isSubmitting || loading}>
						{form.formState.isSubmitting || loading ? 'Оформляем...' : 'Оформить заказ'}
					</Button>
				</form>
			</Form>
		</div>
	)
}
