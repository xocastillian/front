'use client'

import { Button } from '@/components/ui/button'

type SidebarItem = {
	label: string
	onClick: () => void
	active?: boolean
	hasNotification?: boolean
}

type SidebarProps = {
	items: SidebarItem[]
}

export function Sidebar({ items }: SidebarProps) {
	return (
		<aside className='w-60 border-r p-4 bg-muted'>
			<div className='flex flex-col gap-2'>
				{items.map(item => (
					<Button key={item.label} variant={item.active ? 'default' : 'ghost'} className='justify-between' onClick={item.onClick}>
						<span className='flex items-center gap-2'>
							{item.label}
							{item.hasNotification && <span className='w-2 h-2 rounded-full bg-red-500 animate-pulse' />}
						</span>
					</Button>
				))}
			</div>
		</aside>
	)
}
