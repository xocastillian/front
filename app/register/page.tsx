'use client'

import { useRouter } from 'next/navigation'
import { RegisterForm } from '@/components/forms/register-form'
import { RegisterFormData } from '@/lib/validation/registerSchema'
import { registerUser } from '@/lib/api/auth'
import { useRedirectIfAuthenticated } from '@/hooks/useRedirectIfAuthenticated'

export default function RegisterPage() {
	const router = useRouter()
	useRedirectIfAuthenticated()

	const handleRegister = async (data: RegisterFormData) => {
		const success = await registerUser(data)
		if (success) router.push('/')
	}

	return (
		<div className='flex justify-center items-center min-h-screen'>
			<RegisterForm onSubmit={handleRegister} />
		</div>
	)
}
