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
		<footer className='w-full bg-black text-white border-t border-neutral-800 px-4 py-10'>
			<div className='max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-sm'>
				<div>
					<h2 className='font-semibold text-xl mb-2'>FOOD UPНИСЬ!</h2>
					<p>Выполнил: Кулясов Тимофей</p>
					<p>Группа: ПИ 22-1 Р (кол)</p>
				</div>

				<div>
					<h3 className='font-medium text-base mb-2'>Навигация</h3>
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
					<h3 className='font-medium text-base mb-2'>Контакты</h3>
					<ul className='space-y-1'>
						<li>
							Email:{' '}
							<a href='mailto:xocastillian@gmail.com' className='hover:underline break-words'>
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

			{year !== null && <div className='mt-8 text-center text-xs text-neutral-400'>&copy; {year} FOOD UPНИСЬ! Дипломная работа.</div>}

			<div className='mt-6 flex justify-center'>
				<Image
					src='/LOGO_NEW_ru.png'
					alt='Логотип университета'
					width={160}
					height={160}
					className='h-auto w-32 sm:w-40 md:w-44 lg:w-52 object-contain'
				/>
			</div>
		</footer>
	)
}
