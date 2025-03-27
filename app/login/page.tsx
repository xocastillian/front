'use client'

import { useRouter } from 'next/navigation'
import { LoginForm } from '@/components/forms/login-form'
import { LoginFormData } from '@/lib/validation/loginSchema'
import { loginUser } from '@/lib/api/auth'
import { useRedirectIfAuthenticated } from '@/hooks/useRedirectIfAuthenticated'

export default function LoginPage() {
	const router = useRouter()
	useRedirectIfAuthenticated()

	const handleLogin = async (data: LoginFormData) => {
		const success = await loginUser(data)
		if (success) router.push('/')
	}

	return (
		<div className='flex justify-center items-center min-h-screen'>
			<LoginForm onSubmit={handleLogin} />
		</div>
	)
}
