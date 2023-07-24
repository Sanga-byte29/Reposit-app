import {Comment, Post, Subreposit, User,Vote} from "@prisma/client";


export type ExtendedPost = Post & {
    subreposit: Subreposit,
    votes: Vote[],
    author: User,
    comments: Comment[]
}