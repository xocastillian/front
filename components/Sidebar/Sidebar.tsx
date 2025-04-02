'use client'

import { Button } from '@/components/ui/button'

type SidebarItem = {
	label: string
	onClick: () => void
	active?: boolean
}

type SidebarProps = {
	items: SidebarItem[]
}

export function Sidebar({ items }: SidebarProps) {
	return (
		<aside className='w-60 border-r p-4 bg-muted'>
			<div className='flex flex-col gap-2'>
				{items.map(item => (
					<Button key={item.label} variant={item.active ? 'default' : 'ghost'} className='justify-start' onClick={item.onClick}>
						{item.label}
					</Button>
				))}
			</div>
		</aside>
	)
}
