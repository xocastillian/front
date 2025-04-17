import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import './globals.css'
import { AppInitializer } from '@/components/AppInitializer'
import Layout from '@/components/Layout'
import { Toaster } from 'sonner'

const montserrat = Montserrat({
	subsets: ['latin'],
	variable: '--font-montserrat',
	display: 'swap',
})

export const metadata: Metadata = {
	title: 'Food Upнись!',
	description: 'Made by Timqa',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang='en'>
			<body className={`${montserrat.variable} antialiased flex flex-col min-h-screen`}>
				<AppInitializer />
				<Layout>{children}</Layout>
				<Toaster />
			</body>
		</html>
	)
}
