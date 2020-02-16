const Joi = require('joi');
const helper = require('../helpers/helper')
const httpStatus =require('http-status-codes');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dbconfig = require('../config/secret')
const post = require('../models/postModels')
const user = require('../models/userModels')


module.exports={
Addposts(req , res){
    const schema = Joi.object().keys({
        post : Joi.string().required()
    });

    const {error} = Joi.validate(req.body , schema);
    if(error && error.details){
        return res.status(httpStatus.BAD_REQUEST).json({message :error.details})
    }
    const body= {
        user : req.user._id,
        username : req.user.username,
        posts :req.body.post,
        created : new Date()
    }
    
    post.create(body).then(async post =>{
        await user.update({
            _id : req.user._id
        },
        {
            $push:{
                posts : {
                    postId : post._id,
                    post : req.body.post,
                    created : new Date()
                }

        }
            })
        res.status(httpStatus.OK).json({message : 'post created' , post})
    }).catch(err =>{
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message : 'then error'})
    })

},
//get all posts
async GetAllPosts(req , res){
    try{
        const posts = await post.find({})
        .populate('user')
        .sort({created : -1});

        const top = await post.find({totallikes : {$gte : 2}})
        .populate('user')
        .sort({created : -1});
    return res.status(httpStatus.OK).json({message : 'Allposts' , posts , top})
    }
    catch (err){
        console.log(err)
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message : 'Error Try letar' })

    }
    },
    // Add Like
     async AddLike(req , res){
        const postId = req.body._id;
        await post.update({
            _id : postId,
            "likes.username":{$ne : req.user.username}
        },{
            $push:{ likes:{
                username : req.user.username
            }},
       
            $inc : {totallikes : 1}
        })
        .then(() =>{
            res.status(httpStatus.OK).json({message : 'you liked this post <3'})
        })
        .catch(()=>{
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message : 'Error in server try agian'})
        })
    },
    async Addcoment(req , res){
        // console.log(req.body)
        const postId = req.body.id;
        await post.update({
            _id : postId
        },{
            $push:{
                comments:{
                    userId : req.user._id,
                    username : req.user.username,
                    comment : req.body.comment,
                    createdAt : new Date()
            }
        },
       
            $inc : {totallikes : 1}
        })
        .then(() =>{
            res.status(httpStatus.OK).json({message : 'you comment has added post <3'})
        })
        .catch(()=>{
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message : 'Error in server try agian'})
        })
    },
    async GetPost(req , res){
    await post.findOne({_id : req.params.id})
    .populate('user').populate('comments.userId')
    .then(post =>{
        res.status(httpStatus.OK).json({message : 'post found' , post})

    })
    .catch(err =>{
        res.status(httpStatus.NOT_FOUND)
        .json({message : 'not found' , err})
    })

    }

}