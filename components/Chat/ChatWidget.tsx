'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ChatWindow } from './ChatWindow'

export function ChatWidget() {
	const [open, setOpen] = useState(false)

	return (
		<>
			<ChatWindow open={open} onOpenChange={setOpen} />
			<div className='fixed bottom-6 right-6 z-50'>
				<Button onClick={() => setOpen(true)}>Помощь</Button>
			</div>
		</>
	)
}
