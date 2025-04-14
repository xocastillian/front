'use client'

import { useRouter } from 'next/navigation'
import { LoginForm } from '@/components/forms/login-form'
import { LoginFormData } from '@/lib/validation/loginSchema'
import { loginUser } from '@/lib/api/auth'
import { useRedirectIfAuthenticated } from '@/hooks/useRedirectIfAuthenticated'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

export default function LoginPage() {
	const router = useRouter()
	useRedirectIfAuthenticated()
	const [loading, setLoading] = useState(false)

	const handleLogin = async (data: LoginFormData, form: ReturnType<typeof useForm<LoginFormData>>) => {
		setLoading(true)
		const success = await loginUser(data, form)
		setLoading(false)
		if (success) router.replace('/')
	}

	return (
		<div className='flex justify-center items-center min-h-screen'>
			<LoginForm onSubmit={handleLogin} isLoading={loading} />
		</div>
	)
}
