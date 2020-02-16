const Joi = require('joi');
const helper = require('../helpers/helper')
const httpStatus = require('http-status-codes');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const dbconfig = require('../config/secret')
const post = require('../models/postModels')
const user = require('../models/userModels')
const cloudinary = require('cloudinary')


cloudinary.config({
    cloud_name: 'noor999',
    api_key: '516735959146433',
    api_secret: 'uNiZ8nD0rmuVo8QMHkku_AusJGo'
});
module.exports = {
    uploadImage(req, res) {
        // console.log(req.body)
        cloudinary.uploader.upload(req.body.img, async result => {
                console.log(result);
                await user.update({
                    _id: req.user._id
                }, {
                    $push: {
                        images: {
                            imgId: result.public_id,
                            imgVersion: result.version
                        }
                    }
                }).then(() => {
                    res.status(httpStatus.OK).json({
                        message: 'image is upload y ngm'
                    })
                }).catch(err => res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                    message: 'errr'
                }))
            }

        )
    },
   async setprofileimg(req , res){
            const { imgId , imgVersion} = req.params;
            await user.update({
                _id: req.user._id
            },
                {
                    picId   :imgId,
                    picVersion :imgVersion
                }
            ).then(() => {
                res.status(httpStatus.OK).json({
                    message: 'image is set defualt y ngm'
                })
            }).catch(err => res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                message: 'errr'
            }))
    }
}