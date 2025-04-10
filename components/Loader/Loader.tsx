'use client'

import React from 'react'

export function Loader() {
	return (
		<div
			className='fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm animate-fadeIn'
			role='status'
			aria-live='polite'
			aria-busy='true'
		>
			<div className='h-10 w-10 animate-spin rounded-full border-4 border-s-black border-t-transparent' />
		</div>
	)
}
