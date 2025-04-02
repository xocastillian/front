'use client'

interface TabsProps<T extends string | number> {
	items: { id: T; name: string }[]
	selected: T | null
	onSelect: (id: T | null) => void
	allLabel?: string
}

export function Tabs<T extends string | number>({ items, selected, onSelect, allLabel = 'Все' }: TabsProps<T>) {
	return (
		<div className='flex gap-2 mb-6 overflow-auto'>
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
		</div>
	)
}
