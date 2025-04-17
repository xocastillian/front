'use client'

import React from 'react'
import { Loader2 } from 'lucide-react'

export function Loader() {
	return (
		<div
			className='fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[1px] animate-fadeIn'
			role='status'
			aria-live='polite'
			aria-busy='true'
		>
			<Loader2 className='h-14 w-14 animate-spin text-gray-100' />
		</div>
	)
}
