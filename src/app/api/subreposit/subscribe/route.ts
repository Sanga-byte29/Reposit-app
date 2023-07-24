import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { SubrepositSubscriptionValidator } from '@/lib/validators/subreposit';
import {z} from 'zod';

export async function POST(req: Request){
    try {
        const session = await getAuthSession()

        if (!session?.user){
            return new Response('Unauthorized', {status: 401})
        }
        const body = await req.json()

        const {subrepositId} = SubrepositSubscriptionValidator.parse(body)

        const subscriptionExists = await db.subscription.findFirst({
            where: {
                subrepositId,
                userId: session.user.id,
            }
        })
        if (subscriptionExists) {
            return new Response('You are already subscribed to this community',{status: 400,})
        }
        await db.subscription.create({
            data: {
                subrepositId,
                userId: session.user.id,
            },
        })
        return new Response(subrepositId)
    }catch (error) {
        if(error instanceof z.ZodError){
            return new Response('Invalid request data passed', {status: 422})
        }

        return new Response('Could not subscribe, please try again',{status: 500})
    }
}
