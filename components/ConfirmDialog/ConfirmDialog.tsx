'use client'

import { FC, ReactNode } from 'react'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface ConfirmDialogProps {
	trigger: ReactNode
	title: string
	description?: string
	onConfirm: () => void
}

export const ConfirmDialog: FC<ConfirmDialogProps> = ({ trigger, title, description, onConfirm }) => {
	return (
		<Dialog>
			<DialogTrigger asChild>{trigger}</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
				</DialogHeader>
				{description && <p className='text-sm text-muted-foreground'>{description}</p>}
				<DialogFooter className='mt-4'>
					<DialogClose asChild>
						<Button variant='ghost'>Отмена</Button>
					</DialogClose>
					<DialogClose asChild>
						<Button variant='destructive' onClick={onConfirm}>
							Подтвердить
						</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
