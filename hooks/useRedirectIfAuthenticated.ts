'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export function useRedirectIfAuthenticated() {
	const router = useRouter()

	useEffect(() => {
		const token = localStorage.getItem('token')
		if (token) {
			router.replace('/')
		}
	}, [router])
}
