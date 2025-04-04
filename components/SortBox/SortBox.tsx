'use client'

import * as React from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

interface ComboboxProps {
	value: string
	onChange: (value: string) => void
	options: { label: string; value: string }[]
	placeholder?: string
	widthClass?: string
}

export function SortBox({ value, onChange, options, placeholder = 'Выберите...', widthClass = 'w-[200px]' }: ComboboxProps) {
	const [open, setOpen] = React.useState(false)

	const selectedLabel = options.find(opt => opt.value === value)?.label || placeholder

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button variant='outline' role='combobox' aria-expanded={open} className={cn(widthClass, 'justify-between')}>
					{selectedLabel}
					<ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
				</Button>
			</PopoverTrigger>
			<PopoverContent className={cn(widthClass, 'p-0')}>
				<Command>
					<CommandList>
						<CommandEmpty>Не найдено</CommandEmpty>
						<CommandGroup>
							{options.map(option => (
								<CommandItem
									key={option.value}
									value={option.value}
									onSelect={current => {
										onChange(current === value ? '' : current)
										setOpen(false)
									}}
								>
									{option.label}
									<Check className={cn('ml-auto h-4 w-4', value === option.value ? 'opacity-100' : 'opacity-0')} />
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	)
}
