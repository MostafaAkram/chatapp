const Joi = require('joi');
const helper = require('../helpers/helper')
const httpStatus =require('http-status-codes');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const dbconfig = require('../config/secret')
const post = require('../models/postModels')
const user = require('../models/userModels')

module.exports = {
    Followuser(req , res){
       const followeruser= async ()=>{
           await user.update({
               _id : req.user._id,
               'following.userfollowed':{$ne : req.body.userfollowed}
           },
           {
               $push:{
                   following :{
                    userfollowed: req.body.userfollowed
                   }
               }
           }

           );
           await user.update({
            _id : req.body.userfollowed,
            'following.followers':{$ne : req.user._id}
        },
        {
            $push:{
                followers :{
                    follower: req.user._id
                },
                notifactions :{
                    senderId : req.user._id,
                    message : `${req.user.username} is now following you`,
                    created : new Date(),
                    viewProfile : false,
                    read:false
                }
            }
        }
        );
       };
       followeruser()
       .then(() => {
           res.status(httpStatus.OK).json({messge : 'your now follow the user'})
       })
       .catch(err =>{
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({messge : 'error'})
       })
    },
    UnFollowuser(req , res){
        const unfolloweruser= async ()=>{
            await user.update({
                _id : req.user._id,
            },
            {
                $pull:{
                    following :{
                     userfollowed: req.body.userfollowed
                    }
                }
            }
 
            );
            await user.update({
             _id : req.body.userfollowed,
         },
         {
             $pull:{
                 followers :{
                    follower: req.user._id
                 }
             }
         }
         );
        };
        unfolloweruser()
        .then(() => {
            res.status(httpStatus.OK).json({messge : 'your now unfollow the user'})
        })
        .catch(err =>{
         res.status(httpStatus.INTERNAL_SERVER_ERROR).json({messge : 'error'})
        })

    },
   async Marknotifaction(req , res){
        // console.log(req.body)
        if(!req.body.deletevalue){
         await user.updateOne(
             {
             _id :  req.user._id,
             'notifactions._id':req.params.id
             },
           {
            $set:{
             'notifactions.$.read' : true
                 }
            }
         ).then(()=>{
             res.status(httpStatus.OK).json({message:"message is marked"})
         })
         .catch(err =>{
             res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message : 'error'})
         })
        }
        else{
            await user.updateOne(
                {
                _id :  req.user._id,
                'notifactions._id':req.params.id
                },
              {
               $pull:{
                notifactions:{_id : req.params.id}
            }
               }).then(()=>{
                res.status(httpStatus.OK).json({message:"message is deleted"})
            })
            .catch(err =>{
                res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message : 'error'})
            })
        }
    },
    async MarknotifactionAll(req , res){
        await user.update({
            _id : req.user._id
        },
        {$set:{'notifactions.$[elem].read' : true}},
        {arrayFilters : [{'elem.read' : false}] , multi : true}
        ).then(()=>{
            res.status(httpStatus.OK).json({message:"message is deleted"})
        })
        .catch(err =>{
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message : 'error'})
        })

    }
}