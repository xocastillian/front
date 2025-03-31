'use client'

import { Category } from '@/types'

interface CategoryTabsProps {
	categories: Category[]
	selectedCategory: string | null
	onSelect: (categoryId: string | null) => void
}

export const CategoryTabs = ({ categories, selectedCategory, onSelect }: CategoryTabsProps) => {
	return (
		<div className='flex gap-2 mb-6 overflow-auto'>
			<button
				className={`px-4 py-2 rounded-full ${selectedCategory === null ? 'bg-black text-white' : 'bg-gray-200'}`}
				onClick={() => onSelect(null)}
			>
				Все
			</button>
			{categories.map(cat => (
				<button
					key={cat._id}
					className={`px-4 py-2 rounded-full ${selectedCategory === cat._id ? 'bg-black text-white' : 'bg-gray-200'}`}
					onClick={() => onSelect(cat._id)}
				>
					{cat.name}
				</button>
			))}
		</div>
	)
}
