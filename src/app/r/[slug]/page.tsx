import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import {notFound} from 'next/navigation';
// import { MiniCreatePost } from '@/components/ui/MiniCreatePost';
import MiniCreatePost from './../../../components/MiniCreatePost';
import PostFeed from './../../../components/PostFeed';
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from '@/config';


interface PageProps {
  params: {
    slug: string
  }
}

const page = async ({params}: PageProps) => {
  const {slug} = params;

  const session = await getAuthSession();

  const subreposit = await db.subreposit.findFirst({
    where: {name: slug},
    include: {
      posts: {
        include: {
          author: true,
          votes: true,
          comments: true,
          subreposit: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: INFINITE_SCROLLING_PAGINATION_RESULTS,
      },
    },
  })

  if(!subreposit)
    return notFound()
  
  return (
    <>
    <h1 className="font-bold text-3xl md:text-4xl h-14">
      r/{subreposit.name}
    </h1>
    <MiniCreatePost session={session}/>
    {/* TODO: Show posts in out feed */}
    <PostFeed initialPosts={subreposit.posts} subrepositName={subreposit.name} />
    </>
  )
}

export default page;