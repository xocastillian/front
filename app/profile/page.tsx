'use client'

import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useProfileStore } from '@/stores/profile-store'
import { Loader } from '@/components/Loader/Loader'
import { toast } from 'sonner'

export default function ProfilePage() {
	const { profile, updateProfile, loading } = useProfileStore()

	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [phone, setPhone] = useState('')

	const [initialName, setInitialName] = useState('')
	const [initialEmail, setInitialEmail] = useState('')
	const [initialPhone, setInitialPhone] = useState('')

	useEffect(() => {
		if (profile) {
			setName(profile.name)
			setEmail(profile.email)
			setPhone(profile.phone)

			setInitialName(profile.name)
			setInitialEmail(profile.email)
			setInitialPhone(profile.phone)
		}
	}, [profile])

	const isUnchanged = name === initialName && email === initialEmail && phone === initialPhone

	const handleUpdate = async () => {
		if (!profile?._id || isUnchanged) return

		try {
			await updateProfile(profile._id, { name, email, phone })
			toast.success('Профиль обновлён')

			setInitialName(name)
			setInitialEmail(email)
			setInitialPhone(phone)
		} catch (err) {
			console.error('Ошибка при обновлении профиля:', err)
			toast.error('Ошибка при обновлении')
		}
	}

	return (
		<div className='relative max-w-md mx-auto px-6 py-14'>
			{loading && <Loader />}
			<h1 className='text-2xl font-bold mb-6'>Мой профиль</h1>
			<div className='space-y-4'>
				<Input placeholder='Имя' value={name} onChange={e => setName(e.target.value)} />
				<Input placeholder='Email' value={email} onChange={e => setEmail(e.target.value)} />
				<Input placeholder='Телефон' value={phone} onChange={e => setPhone(e.target.value)} />
				<Button className='w-full' onClick={handleUpdate} disabled={loading || isUnchanged}>
					{loading ? 'Сохранение...' : 'Сохранить'}
				</Button>
			</div>
		</div>
	)
}
