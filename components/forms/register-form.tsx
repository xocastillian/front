'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema, RegisterFormData } from '@/lib/validation/registerSchema'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Loader } from '../Loader/Loader'

interface RegisterFormProps {
	onSubmit: (data: RegisterFormData) => void
	isLoading?: boolean
}

export const RegisterForm = ({ onSubmit, isLoading }: RegisterFormProps) => {
	const form = useForm<RegisterFormData>({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			name: '',
			email: '',
			password: '',
			phone: '',
		},
	})

	return isLoading ? (
		<Loader />
	) : (
		<Card className='w-[400px]'>
			<CardHeader>
				<CardTitle>Регистрация</CardTitle>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
						<FormField
							control={form.control}
							name='name'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Имя</FormLabel>
									<FormControl>
										<Input placeholder='Ваше имя' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='email'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input placeholder='email@example.com' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='password'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Пароль</FormLabel>
									<FormControl>
										<Input type='password' placeholder='******' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='phone'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Телефон</FormLabel>
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
						<Button type='submit' className='w-full' disabled={isLoading}>
							Зарегистрироваться
						</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	)
}
