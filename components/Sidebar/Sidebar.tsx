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
		<aside className='w-full xl:w-60 border-b xl:border-b-0 xl:border-r bg-muted'>
			<div className='flex flex-row xl:flex-col gap-2 p-4 overflow-x-auto'>
				{items.map(item => (
					<Button
						key={item.label}
						variant={item.active ? 'default' : 'ghost'}
						className={`justify-between whitespace-nowrap transition-colors duration-300 ${item.active === false ? 'hover:bg-[#eeeeee]' : ''}`}
						onClick={item.onClick}
					>
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
