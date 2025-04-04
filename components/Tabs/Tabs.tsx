'use client'

interface TabsProps<T extends string | number> {
	items: { id: T; name: string }[]
	selected: T | null
	onSelect: (id: T | null) => void
	allLabel?: string
	isAdminPanel?: boolean
	onAddCategoryClick?: () => void
}

export function Tabs<T extends string | number>({ items, selected, onSelect, allLabel = 'Все', isAdminPanel, onAddCategoryClick }: TabsProps<T>) {
	return (
		<div className='flex gap-2 overflow-auto'>
			<button className={`px-4 py-2 rounded-full ${selected === null ? 'bg-black text-white' : 'bg-gray-200'}`} onClick={() => onSelect(null)}>
				{allLabel}
			</button>
			{items.map(item => (
				<button
					key={item.id}
					className={`px-4 py-2 rounded-full ${selected === item.id ? 'bg-black text-white' : 'bg-gray-200'}`}
					onClick={() => onSelect(item.id)}
				>
					{item.name}
				</button>
			))}
			{isAdminPanel && onAddCategoryClick && (
				<button className='px-4 py-2 rounded-full bg-blue-500 text-white' onClick={onAddCategoryClick}>
					Добавить категорию
				</button>
			)}
		</div>
	)
}
