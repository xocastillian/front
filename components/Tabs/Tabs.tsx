'use client'

import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@/components/ui/context-menu'

interface TabsProps<T extends string | number> {
	items: { id: T; name: string }[]
	selected: T | null
	onSelect: (id: T | null) => void
	onDeleteCategory?: (id: T) => void
	allLabel?: string
	isAdminPanel?: boolean
	onAddCategoryClick?: () => void
}

export function Tabs<T extends string | number>({
	items,
	selected,
	onSelect,
	onDeleteCategory,
	allLabel = 'Все',
	isAdminPanel,
	onAddCategoryClick,
}: TabsProps<T>) {
	return (
		<div className='flex gap-2 overflow-auto'>
			<button className={`px-4 py-2 rounded-full ${selected === null ? 'bg-black text-white' : 'bg-gray-200'}`} onClick={() => onSelect(null)}>
				{allLabel}
			</button>

			{items.map((item, index) => {
				const tabButton = (
					<button
						key={index}
						className={`px-4 py-2 rounded-full ${selected === item.id ? 'bg-black text-white' : 'bg-gray-200'}`}
						onClick={() => onSelect(item.id)}
					>
						{item.name}
					</button>
				)

				if (!isAdminPanel || !onDeleteCategory) return tabButton

				return (
					<ContextMenu key={item.id}>
						<ContextMenuTrigger>{tabButton}</ContextMenuTrigger>
						<ContextMenuContent>
							<ContextMenuItem onClick={() => onDeleteCategory(item.id)} className='text-red-500 focus:text-red-600'>
								Удалить категорию
							</ContextMenuItem>
						</ContextMenuContent>
					</ContextMenu>
				)
			})}

			{isAdminPanel && onAddCategoryClick && (
				<button className='px-4 py-2 rounded-full bg-blue-500 text-white' onClick={onAddCategoryClick}>
					Добавить категорию
				</button>
			)}
		</div>
	)
}
