import { db } from '@/lib/db';
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from './../config';
import PostFeed from './PostFeed';
import { getAuthSession } from '@/lib/auth';
import { notFound } from 'next/navigation';



const CustomFeed = async () => {
    const session = await getAuthSession();

    if(!session){
        return notFound()
    }

    const followedCommunities = await db.subscription.findMany({
        where:{
            userId: session?.user.id,
        },
        include: {
            subreposit: true
        }
    })

    const posts = await db.post.findMany({
        where: {
            subreposit: {
                name: {
                    in: followedCommunities.map((sub) => sub.subreposit?.id),
                },
            },
        },
        orderBy: {
            createdAt: 'desc',

        },
        include: {
            votes: true,
            author: true,
            comments: true,
            subreposit: true,
        },
        take: INFINITE_SCROLLING_PAGINATION_RESULTS,
    })

    return (
        <PostFeed initialPosts={posts} />
    );
}

export default CustomFeed;