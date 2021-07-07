const express = require("express");
const { getPosts, createPost, updatePost, deletePost, likePost, getPostsBySearch, getPost, commentPost } = require("../controllers/posts");
const router = express.Router();

const auth =  require('../middleware/auth')

router.route('/search')
      .get(getPostsBySearch)

router.route('/')
      .get(getPosts)
      .post(auth, createPost)
      
router.route('/:id')
      .patch(auth, updatePost)
      .delete(auth, deletePost)
      .get(getPost)

router.route('/:id/likePost')
      .patch(auth, likePost)

router.route('/:id/commentPost')
      .post(auth, commentPost)

module.exports = router