import {z} from 'zod';

export const SubrepositValidator = z.object({
    name: z.string().min(3).max(21),
})

export const SubrepositSubscriptionValidator = z.object({
    subrepositId: z.string()
})

export type CreateSubrepositPayload = z.infer<typeof SubrepositValidator>
export type SubscribeToSubrepositPayload = z.infer<typeof SubrepositSubscriptionValidator>