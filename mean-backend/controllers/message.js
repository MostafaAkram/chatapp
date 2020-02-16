
const Joi = require('joi');
const helper = require('../helpers/helper')
const httpStatus =require('http-status-codes');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const dbconfig = require('../config/secret')
const post = require('../models/postModels')
const user = require('../models/userModels')
const convs = require('../models/conversationModel')
const msg = require('../models/messageModel')


module.exports ={
    Sendmessage(req , res){
        // console.log(req.body)
    const {sender_Id , receiver_Id} = req.params;
    convs.find({
        $or :[
            {
                participants  :
                {
                    $elemMatch:{senderId:sender_Id , receiverId : receiver_Id }
                }
            },
            {
                participants  :
                {
                    $elemMatch:{senderId:receiver_Id , receiverId : sender_Id }
                }     
            },
        ]
    },
        async (err , resulat ) =>{
            if(resulat.length > 0){
                await msg.update({
                    conversationId:resulat[0]._id
                },
                {
                    $push :{
                        message:{
                            senderId:req.user._id,
                            receiverId:req.params.receiver_Id,
                            sendername:req.user.username,
                            recivername:req.body.reciverName,
                            body:req.body.message
                        }
                    }


                }).then(()=>{
                    res.status(httpStatus.OK).json({message :'messsge send too'})
                }).catch(err =>{
                    res.status(httpStatus.OK).json({message :'msg not send'})
                }) 
            }else{
                const newconvs = new convs();
                newconvs.participants.push({
                    senderId:req.user._id,
                    receiverId : req.params.receiver_Id
                });
                const saveconvs = await newconvs.save();
                // console.log(saveconvs)
             const newmsg =new msg();
             newmsg.conversationId = saveconvs._id;
             newmsg.sender =req.user.username;
             newmsg.receiver=req.body.reciverName;
             newmsg.message.push({
                 senderId:req.user._id,
                 receiverId:req.params.receiver_Id,
                 sendername:req.user.username,
                 recivername:req.body.reciverName,
                 body:req.body.message
             });
             await user.update({
             _id : req.user._id
             },
              {
                  $push :
                  {
                    chatlist:{
                        $each :[{
                            receiverId : req.params.receiver_Id,
                            msgId : newmsg._id
                        }],
                        $position : 0
                    }
                  }
              }
              );
              await user.update({
                _id : req.params.receiver_Id
                },
                 {
                     $push :
                     {
                       chatlist:{
                           $each :[{
                               receiverId : req.user._id,
                               msgId : newmsg._id
                           }],
                           $position : 0
                       }
                     }
                 }
                 );



             await newmsg.save().then(()=>{
                 res.status(httpStatus.OK).json({message :'messsge send'})
             }).catch(err =>{
                 res.status(httpStatus.OK).json({message :'msg not send'})
             }) 
            }
        }
    )

    },
    async Getallmessage(req , res){
        const {sender_Id , receiver_Id } =req.params;
        const conversations = await convs.findOne({
            $or : [
                {
                 $and:[{'participants.senderId':sender_Id} , {'participants.receiverId' : receiver_Id}]
                },
                {
                 $and : [{'participants.senderId':receiver_Id} , {'participants.receiverId' : sender_Id}]   
                }
            ]
        }).select('_id')
        if(conversations){
            const messages  = await msg.findOne({conversationId : conversations._id});
            res.status(httpStatus.OK).json({message : 'msg is' , messages})
        }
    }





}

