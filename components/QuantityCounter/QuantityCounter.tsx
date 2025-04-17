'use client'

import { Button } from '@/components/ui/button'

interface QuantityCounterProps {
	value: number
	onIncrement: () => void
	onDecrement: () => void
	min?: number
}

export function QuantityCounter({ value, onIncrement, onDecrement, min = 1 }: QuantityCounterProps) {
	return (
		<div className='flex items-center outline rounded-md '>
			<Button type='button' size='sm' variant='default' onClick={onDecrement} className='rounded-l-md' disabled={value <= min}>
				−
			</Button>
			<div className='w-full min-w-10 text-center select-none'>{value}</div>
			<Button type='button' size='sm' variant='default' onClick={onIncrement} className='rounded-r-md'>
				+
			</Button>
		</div>
	)
}
