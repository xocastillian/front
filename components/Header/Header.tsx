'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { PackageCheck, ShoppingCart, Menu, User, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { useAuthStore } from '@/stores/auth-store'
import { useCartStore } from '@/stores/cart-store'
import { useProfileStore } from '@/stores/profile-store'
import { useState } from 'react'

export default function Header() {
	const [open, setOpen] = useState(false)
	const router = useRouter()
	const { isAuthenticated, logout } = useAuthStore()
	const { profile } = useProfileStore()
	const { cartItemCount } = useCartStore()
	const [sheetOpen, setSheetOpen] = useState(false)

	return (
		<header className='sticky top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur border-b shadow-sm px-6 py-4 flex items-center justify-between'>
			{/* Логотип */}
			<Link href='/' className='text-xl font-bold'>
				FOOD UPНИСЬ!
			</Link>

			{/* Desktop >640px */}
			<div className='hidden sm:flex items-center gap-4'>
				<Button variant='ghost' onClick={() => router.push('/cart')} className='relative'>
					<ShoppingCart className='h-5 w-5' />
					Корзина
					{cartItemCount > 0 && (
						<span className='absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center'>
							{cartItemCount}
						</span>
					)}
				</Button>

				<Button variant='ghost' onClick={() => router.push('/orders')}>
					<PackageCheck className='h-5 w-5' />
					Заказы
				</Button>

				{isAuthenticated ? (
					<Popover open={open} onOpenChange={setOpen}>
						<PopoverTrigger asChild>
							<Button variant='ghost'>
								<User className='h-5 w-5' />
								{profile?.name || 'Аккаунт'}
							</Button>
						</PopoverTrigger>
						<PopoverContent className='w-40 space-y-2'>
							<Button
								variant='outline'
								onClick={() => {
									setOpen(false)
									router.push('/profile')
								}}
								className='w-full'
							>
								<User className='h-5 w-5' />
								Профиль
							</Button>
							<Button variant='destructive' onClick={logout} className='w-full text-white'>
								Выйти
							</Button>
						</PopoverContent>
					</Popover>
				) : (
					<div className='flex gap-2'>
						<Button variant='outline' onClick={() => router.push('/login')}>
							Войти
						</Button>
						<Button onClick={() => router.push('/register')}>Зарегистрироваться</Button>
					</div>
				)}

				{isAuthenticated && profile?.role === 'admin' && (
					<Button variant='outline' onClick={() => router.push('/admin/new')}>
						<Settings className='h-5 w-5' />
						Админ панель
					</Button>
				)}
			</div>

			{/* Mobile <640px: Sheet */}
			<div className='sm:hidden'>
				<Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
					<SheetTrigger asChild>
						<button className='flex items-center justify-center'>
							<Menu className='w-5 h-5' />
						</button>
					</SheetTrigger>
					<SheetContent side='right' className='w-full max-w-none'>
						<SheetHeader>
							<SheetTitle className='text-lg text-center'>Меню</SheetTitle>
						</SheetHeader>
						<div className='sm:hidden'>
							<Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
								<SheetTrigger asChild>
									<button className='flex items-center justify-center'>
										<Menu className='w-5 h-5' />
									</button>
								</SheetTrigger>
								<SheetContent side='right' className='w-full max-w-none'>
									<SheetHeader>
										<SheetTitle className='text-lg text-center'>Меню</SheetTitle>
									</SheetHeader>
									<div className='mt-6 flex flex-col gap-4'>
										{/* Аккаунт */}
										{isAuthenticated && (
											<Button
												variant='ghost'
												onClick={() => {
													setSheetOpen(false)
													router.push('/profile')
												}}
												className='w-[200px] mx-auto justify-center text-center'
											>
												{profile?.name || 'Аккаунт'}
											</Button>
										)}

										{/* Корзина */}
										<Button
											variant='ghost'
											onClick={() => {
												setSheetOpen(false)
												router.push('/cart')
											}}
											className='relative w-fit mx-auto flex items-center gap-2'
										>
											<ShoppingCart className='h-5 w-5' />
											Корзина
											{cartItemCount > 0 && (
												<span className='absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center'>
													{cartItemCount}
												</span>
											)}
										</Button>

										{/* Заказы */}
										<Button
											variant='ghost'
											onClick={() => {
												setSheetOpen(false)
												router.push('/orders')
											}}
											className='w-fit mx-auto flex items-center gap-2'
										>
											<PackageCheck className='h-5 w-5' />
											Заказы
										</Button>

										{/* Админ панель */}
										{isAuthenticated && profile?.role === 'admin' && (
											<Button
												variant='outline'
												onClick={() => {
													setSheetOpen(false)
													router.push('/admin/new')
												}}
												className='w-[200px] mx-auto justify-center text-center'
											>
												Админ панель
											</Button>
										)}

										{/* Выйти */}
										{isAuthenticated && (
											<Button
												variant='destructive'
												onClick={() => {
													setSheetOpen(false)
													logout()
												}}
												className='w-[200px] mx-auto justify-center text-center text-white'
											>
												Выйти
											</Button>
										)}

										{/* Войти / Зарегистрироваться */}
										{!isAuthenticated && (
											<>
												<Button
													variant='outline'
													onClick={() => {
														setSheetOpen(false)
														router.push('/login')
													}}
													className='w-[200px] mx-auto justify-center text-center'
												>
													Войти
												</Button>
												<Button
													onClick={() => {
														setSheetOpen(false)
														router.push('/register')
													}}
													className='w-[200px] mx-auto justify-center text-center'
												>
													Зарегистрироваться
												</Button>
											</>
										)}
									</div>
								</SheetContent>
							</Sheet>
						</div>
					</SheetContent>
				</Sheet>
			</div>
		</header>
	)
}
