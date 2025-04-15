'use client'

import Header from '@/components/Header/Header'
import { Footer } from './Footer/Footer'
import { useAdminSocket } from '@/hooks/useAdminSocket'

export default function Layout({ children }: { children: React.ReactNode }) {
	useAdminSocket()

	return (
		<div className='flex flex-col flex-1'>
			<Header />
			<main className='flex-1'>{children}</main>
			<Footer />
		</div>
	)
}
