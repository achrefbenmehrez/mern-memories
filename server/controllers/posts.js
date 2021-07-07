const PostMessage = require('../models/PostMessage')
const mongoose = require('mongoose')

exports.getPosts = async (req, res) => {
    const {
        page
    } = req.query

    try {
        const LIMIT = 8
        const startIndex = (Number(page) - 1) * LIMIT
        const TOTAL = await PostMessage.countDocuments({})

        const posts = await PostMessage.find().sort({
            _id: -1
        }).limit(LIMIT).skip(startIndex);

        res.json({
            data: posts,
            currentPage: Number(page),
            numberOfPages: Math.ceil(TOTAL / LIMIT)
        })
    } catch (error) {
        res.status(404)
            .json({
                message: error.message
            })
    }
}

exports.getPostsBySearch = async (req, res) => {
    const {
        searchQuery,
        tags
    } = req.query;
    try {
        const title = new RegExp(searchQuery, 'i')

        const posts = await PostMessage.find({
            $or: [{
                title
            }, {
                tags: {
                    $in: tags.split(',')
                }
            }]
        });

        res.json({
            data: posts
        });
    } catch (error) {
        res.status(404)
            .json({
                message: error.message
            })
    }
}

exports.getPost = async (req, res) => {
    const {
        id
    } = req.params

    try {
        const post = await PostMessage.findById(id)

        res.json(post)
    } catch (error) {
        res.status(404)
            .json({
                message: error.message
            })
    }
}

exports.createPost = async (req, res) => {
    const post = req.body

    const newPost = new PostMessage({
        ...post,
        creator: req.userId,
        createdAt: new Date().toISOString()
    })

    try {
        await newPost.save()

        res.status(201).json(newPost)
    } catch (error) {
        res.status(409).json({
            message: error.message
        })
    }
}

exports.updatePost = async (req, res) => {
    const {
        id: _id
    } = req.params
    const post = req.body

    if (!mongoose.Types.ObjectId.isValid(_id))
        res.status(404).send('No posts with that ID')

    const updatedPost = await PostMessage.findByIdAndUpdate(_id, {
        ...post,
        _id
    }, {
        new: true
    })

    res.json(updatedPost)
}

exports.deletePost = async (req, res) => {
    const {
        id
    } = req.params

    if (!mongoose.Types.ObjectId.isValid(id))
        res.status(404).send('No posts with that ID')

    await PostMessage.findByIdAndDelete(id)

    res.json({
        message: 'Post deleted successfully'
    })
}

exports.likePost = async (req, res) => {
    const {
        id
    } = req.params

    if (!req.userId)
        return res.status(401).json({
            message: 'You must be logged in to like a memory'
        })

    if (!mongoose.Types.ObjectId.isValid(id))
        res.status(404).send('No posts with that ID')

    const post = await PostMessage.findById(id)

    const index = post.likes.findIndex((id) => id === String(req.userId))

    if (index === -1) {
        post.likes.push(req.userId)
    } else {
        post.likes.filter((id) => id !== String(req.userId))
    }

    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, {
        new: true
    })

    res.json(updatedPost)
}

exports.commentPost = async(req, res, next) => {
    const { id } = req.params
    const { value } = req.body

    const post = await PostMessage.findById(id)
    post.comments.push(value)
    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true })

    res.json(updatedPost);
}