'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from '@/components/ui/navigation-menu'
import { useAuthStore } from '@/stores/auth-store'

export default function Header() {
	const router = useRouter()
	const pathname = usePathname()
	const { isAuthenticated, user, logout, initializeFromStorage } = useAuthStore()

	useEffect(() => {
		initializeFromStorage()
	}, [pathname])

	return (
		<header className='fixed top-0 left-0 right-0 z-50 bg-white border-b shadow-sm px-6 py-4 flex items-center justify-between'>
			{/* Логотип */}
			<Link href='/' className='text-xl font-bold'>
				FoodApp
			</Link>

			{/* Меню */}
			<NavigationMenu>
				<NavigationMenuList>
					<NavigationMenuItem>
						<Link href='/' className='px-4 py-2'>
							Главная
						</Link>
					</NavigationMenuItem>
					<NavigationMenuItem>
						<Link href='/products' className='px-4 py-2'>
							Продукты
						</Link>
					</NavigationMenuItem>
					<NavigationMenuItem>
						<Link href='/categories' className='px-4 py-2'>
							Категории
						</Link>
					</NavigationMenuItem>
				</NavigationMenuList>
			</NavigationMenu>

			{/* Аккаунт */}
			{isAuthenticated ? (
				<Popover>
					<PopoverTrigger asChild>
						<Button variant='ghost'>{user?.name || 'Аккаунт'}</Button>
					</PopoverTrigger>
					<PopoverContent className='w-40 space-y-2'>
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
		</header>
	)
}
