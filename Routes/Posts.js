const express = require('express')
const ROUTE = express.Router()
const Post = require('../Models/post')
const crypto = require('crypto')
const { authenticated } = require('../Middlewares/account')
const { PostCollection } = require('../Responses/Post')


// GET POSTS 
ROUTE.post('/all', async (req, res) => {
    const { } = req.body
    const getsPsost = Post.find({})
    const [allPosts] = await Promise.allSettled([getsPsost.sort([['updatedAt', 'descending']]).exec()])
    if (allPosts.status === 'rejected') {
        return res.status(500).send("Posts - Could not fetch posts now 😢")
    }
    const posts = PostCollection(allPosts?.value)
    res.json({ posts })
})

// CREATE POST
ROUTE.post('', authenticated, async (req, res) => {
    const { type, title, description, content, visibility, paused } = req.body
    const { userId: user_id } = res.account
    const postId = crypto.randomBytes(10).toString('hex')
    const post_id = postId.toUpperCase()
    if (!Boolean(content)) return res.status(400).send("Post - Content is required!")
    const newPost = Post({ type, title, description, content, visibility, paused, post_id, user_id })
    const [post] = await Promise.allSettled([newPost.save()])
    if (post.status === 'rejected') return res.status(500).send("Post - something weent wrong!")
    res.status(201).send(post)
})

ROUTE.delete('', authenticated, async (req, res) => {
    const { postId: post_id, userId } = req.body
    const user_id = userId ?? res.account?.userId
    if (!Boolean(post_id)) return res.status(401).send("Post - Post id is required!")
    if (!Boolean(user_id)) return res.status(401).send("Post - User id is required!")
    const [post] = await Promise.allSettled([Post.findOneAndRemove({ post_id, user_id })])
    if (post.status === 'rejected') return res.status(500).send("Post - Something went wrong!")
    if (!Boolean(post?.value)) return res.send("Post - Post does not exist! 😒")
    res.send("Post - Post has been deleted!")
})


























module.exports = ROUTE