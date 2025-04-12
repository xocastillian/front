'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export const Footer = () => {
	const [year, setYear] = useState<number | null>(null)

	useEffect(() => {
		setYear(new Date().getFullYear())
	}, [])

	return (
		<footer className='w-full bg-black text-white border-t border-neutral-800 py-8'>
			<div className='container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm'>
				<div>
					<h2 className='font-semibold text-lg text-white mb-2'>FOOD UPНИСЬ!</h2>
					<p>Выполнил: Кулясов Тимофей</p>
					<p>Группа: ПИ 22-1 Р (кол)</p>
				</div>

				<div>
					<h3 className='font-medium mb-2'>Навигация</h3>
					<ul className='space-y-1'>
						<li>
							<Link href='/' className='hover:underline'>
								Главная
							</Link>
						</li>
						<li>
							<Link href='/cart' className='hover:underline'>
								Корзина
							</Link>
						</li>
						<li>
							<Link href='/orders' className='hover:underline'>
								Заказы
							</Link>
						</li>
					</ul>
				</div>

				<div>
					<h3 className='font-medium mb-2'>Контакты</h3>
					<ul className='space-y-1'>
						<li>
							Email:{' '}
							<a href='mailto:xocastillian@gmail.com' className='hover:underline'>
								xocastillian@gmail.com
							</a>
						</li>
						<li>
							Телефон:{' '}
							<a href='tel:+77001234567' className='hover:underline'>
								+7 (777) 163-83-83
							</a>
						</li>
						<li>Адрес: г. Алматы, Казахстан</li>
					</ul>
				</div>
			</div>

			<div className='mt-8 text-center text-xs'>&copy; {year !== null ? year : ''} FOOD UPНИСЬ! Дипломная работа.</div>

			<div className='mt-6 flex justify-center'>
				<Image src='/LOGO_NEW_ru.png' alt='Логотип университета' width={200} height={200} />
			</div>
		</footer>
	)
}
