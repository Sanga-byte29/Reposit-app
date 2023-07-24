import { getAuthSession } from '@/lib/auth';
import { SubrepositValidator } from '@/lib/validators/subreposit';
import { db } from '@/lib/db';
import { z } from 'zod';

export async function POST(req: Request){
    try{
        const session = await getAuthSession()
        if(!session?.user){
            return new Response('Unauthorized', {status: 401})
        }
        const body = await req.json()
        const {name}  = SubrepositValidator.parse(body);


        const subrepositExists = await db.subreposit.findFirst({
            where: {
                name,
            }
        })
        if (subrepositExists){
            return new Response('Subreposit already exists',{status: 409})
        }
        const subreposit = await db.subreposit.create({
            data: {
                name,
                creatorId: session.user.id,
            },
        })

        await db.subscription.create({
            data: {
                userId: session.user.id,
                subrepositId: subreposit.id,
            },
        })
        return new Response(subreposit.name)

    }
    catch(error) {
        if(error instanceof z.ZodError){
            return new Response(error.message, {status: 422})
        }

        return new Response('Could not create subreposit',{status: 500})


    }
}