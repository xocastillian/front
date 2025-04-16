'use client'

import { useRouter } from 'next/navigation'
import { RegisterForm } from '@/components/forms/register-form'
import { RegisterFormData } from '@/lib/validation/registerSchema'
import { registerUser } from '@/lib/api/auth'
import { useRedirectIfAuthenticated } from '@/hooks/useRedirectIfAuthenticated'
import { useState } from 'react'

export default function RegisterPage() {
	const router = useRouter()
	useRedirectIfAuthenticated()
	const [loading, setLoading] = useState(false)

	const handleRegister = async (data: RegisterFormData) => {
		setLoading(true)
		const success = await registerUser(data)
		setLoading(false)
		if (success) router.replace('/')
	}

	return (
		<div className='flex justify-center items-center min-h-screen px-4 py-12'>
			<RegisterForm onSubmit={handleRegister} isLoading={loading} />
		</div>
	)
}
