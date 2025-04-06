'use client'

import { useAuthStore } from '@/stores/auth-store'
import { ChatWidget } from '@/components/Chat/ChatWidget'
import Header from '@/components/Header/Header'

export default function Layout({ children }: { children: React.ReactNode }) {
	const { user } = useAuthStore()
	const isAdmin = user?.role === 'admin'

	return (
		<>
			<Header />
			{!isAdmin && <ChatWidget />}
			<main className='pt-16'>{children}</main>
		</>
	)
}
