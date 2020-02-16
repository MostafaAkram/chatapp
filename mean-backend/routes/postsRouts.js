const express = require('express');
const router = express.Router();

const postCtrl = require('../controllers/posts');
const authhepler = require('../helpers/AuthHelper')

router.get('/posts', authhepler.Verifytoken,postCtrl.GetAllPosts);
router.get('/post/:id', authhepler.Verifytoken,postCtrl.GetPost);

router.post('/post/add-post', authhepler.Verifytoken,postCtrl.Addposts);
router.post('/post/add-like', authhepler.Verifytoken,postCtrl.AddLike);
router.post('/post/add-comment', authhepler.Verifytoken,postCtrl.Addcoment);



module.exports =router;