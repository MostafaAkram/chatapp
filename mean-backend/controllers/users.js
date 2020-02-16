const Joi = require('joi');
const helper = require('../helpers/helper')
const httpStatus =require('http-status-codes');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const dbconfig = require('../config/secret')
const post = require('../models/postModels')
const user = require('../models/userModels')

module.exports ={
    async getAlluser(req ,res){
        await user.find({})
        .populate('posts.postId')
        .populate('following.userfollowed')
        .populate('followers.follower')
        .then(resulat =>{
            res.status(httpStatus.OK).json({message : 'All users' , resulat})
        })
        .catch(err =>{
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message : 'no data' , err})
        })
    }
,
 async getuser(req , res){
    await user.findOne({_id:req.params.id})
          .populate('posts.postId')
          .populate('following.userfollowed')
          .populate('followers.follower')
            .then(resulat =>{
            res.status(httpStatus.OK).json({message : 'usr by id' , resulat})
        })
        .catch(err =>{
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message : 'no data' , err})
        })

    },

async getusername(req , res){
    // console.log(req.params)
    await user.findOne({username :req.params.username})
    .populate('posts.postId')
    .populate('following.userfollowed')
    .populate('followers.follower')
      .then(resulat =>{
      res.status(httpStatus.OK).json({message : 'usr by name' , resulat})
  })
  .catch(err =>{
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message : 'no data' , err})
  })
}



}