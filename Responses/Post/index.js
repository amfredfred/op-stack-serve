const dayjs = require('dayjs')
var relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)

const PostResource = (post) => ({
    "userId": post?.user_id,
    "type": post?.type,
    "title": post?.title,
    "postId": post?.post_id,
    "description": post?.description,
    "content": post?.content,
    "rewardEarnings": post?.points_earned,
    "visibility": post?.visibility,
    "isLive": post?.paused,
    "views": post?.views,
    "createdAt": post?.createdAt ? { relative: dayjs(post?.createdAt).fromNow(), absolute: post?.createdAt } : '',
    "updatedAt": post?.createdAt ? { relative: dayjs(post?.updatedAt).fromNow(), absolute: post?.createdAt } : ''
})

const PostCollection = (posts = []) => posts.map(post => PostResource(post))
module.exports.PostResource = PostResource
module.exports.PostCollection = PostCollection




