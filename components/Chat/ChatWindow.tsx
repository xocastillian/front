'use client'

import { useEffect, useRef, useState } from 'react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { getOrCreateGuestId } from '@/lib/chat/guest'
import { getChatSocket } from '../../lib/api/chatSocket'
import { ScrollArea } from '../ui/scroll-area'
import api from '@/lib/api/axios'
import { useAuthStore } from '@/stores/auth-store'

type Message = {
	_id?: string
	text: string
	senderId: string
	senderType: 'user' | 'guest' | 'admin'
	sessionId?: string
}

interface ChatWindowProps {
	open: boolean
	onOpenChange: (open: boolean) => void
}

export function ChatWindow({ open, onOpenChange }: ChatWindowProps) {
	const { user } = useAuthStore()
	const isAuth = !!user
	const userId = user?._id
	const role = user?.role

	const [messages, setMessages] = useState<Message[]>([])
	const [text, setText] = useState('')
	const sessionIdRef = useRef<string | null>(null)
	const socketRef = useRef<ReturnType<typeof getChatSocket> | null>(null)

	useEffect(() => {
		if (!open) return

		const guestId = isAuth ? undefined : getOrCreateGuestId()
		const socket = getChatSocket(userId, role)
		socketRef.current = socket

		const init = async () => {
			try {
				const sessionRes = await api.get(isAuth ? `/chat/session?userId=${userId}` : `/chat/session?guestId=${guestId}`)

				const sessionId = sessionRes.data._id
				sessionIdRef.current = sessionId

				const messagesRes = await api.get(`/chat/session/${sessionId}/messages`)
				setMessages(messagesRes.data)

				socket.on('new_message', (msg: Message) => {
					setMessages(prev => [...prev, msg])
				})
			} catch (err) {
				console.error('Ошибка инициализации чата:', err)
			}
		}

		init()

		return () => {
			socketRef.current?.off('new_message')
		}
	}, [open, isAuth, userId, role])

	const handleSend = () => {
		const socket = socketRef.current
		const sessionId = sessionIdRef.current
		if (!text.trim() || !socket || !sessionId) return

		const senderId = isAuth ? userId! : getOrCreateGuestId()
		const senderType = isAuth ? 'user' : 'guest'

		const message: Message = {
			senderId,
			senderType,
			text,
		}

		socket.emit('send_message', message)
		setText('')
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className='w-full max-w-md p-0 flex flex-col h-[600px]'>
				<DialogTitle className='px-4 pt-4 text-lg font-semibold'>Поддержка</DialogTitle>
				<ScrollArea className='flex-1 p-4 space-y-2 overflow-y-auto'>
					{messages.map((msg, i) => (
						<div
							key={i}
							className={`rounded-lg px-3 py-2 text-sm max-w-[80%] ${
								msg.senderType === (isAuth ? 'user' : 'guest') ? 'ml-auto bg-primary text-white' : 'bg-muted'
							}`}
						>
							{msg.text}
						</div>
					))}
				</ScrollArea>
				<div className='flex border-t px-4 py-3'>
					<Input
						value={text}
						onChange={e => setText(e.target.value)}
						onKeyDown={e => e.key === 'Enter' && handleSend()}
						placeholder='Введите сообщение...'
					/>
				</div>
			</DialogContent>
		</Dialog>
	)
}
