import { z } from 'zod'

export const OrderFormSchema = z.object({
	phone: z.string().min(1, 'Укажите номер телефона'),
	address: z.string().min(1, 'Укажите адрес доставки'),
	recipientName: z.string().optional(),
})

export type OrderFormData = z.infer<typeof OrderFormSchema>
