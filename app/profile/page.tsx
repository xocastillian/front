'use client'

import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useProfileStore } from '@/stores/profile-store'

export default function ProfilePage() {
	const { profile, updateProfile, loading } = useProfileStore()
	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [phone, setPhone] = useState('')

	useEffect(() => {
		if (profile) {
			setName(profile.name)
			setEmail(profile.email)
			setPhone(profile.phone)
		}
	}, [profile])

	const handleUpdate = async () => {
		if (!profile?._id) return
		try {
			await updateProfile(profile._id, { name, email, phone })
			alert('Профиль обновлён')
		} catch (err) {
			console.error('Ошибка при обновлении профиля:', err)
		}
	}

	return (
		<div className='max-w-md mx-auto px-6 py-14'>
			<h1 className='text-2xl font-bold mb-6'>Мой профиль</h1>
			<div className='space-y-4'>
				<Input placeholder='Имя' value={name} onChange={e => setName(e.target.value)} />
				<Input placeholder='Email' value={email} onChange={e => setEmail(e.target.value)} />
				<Input placeholder='Телефон' value={phone} onChange={e => setPhone(e.target.value)} />
				<Button className='w-full' onClick={handleUpdate} disabled={loading}>
					{loading ? 'Сохранение...' : 'Сохранить'}
				</Button>
			</div>
		</div>
	)
}
