const Joi = require('joi');
const helper = require('../helpers/helper')
const user = require('../models/userModels')
const httpStatus = require('http-status-codes');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dbconfig = require('../config/secret')


module.exports = {
    async createUser(req, res) {
        // console.log(req.body)
        const schema = Joi.object().keys({
            username: Joi.string().min(5).max(15).required(),
            email: Joi.string().email().required(),
            password: Joi.string().required().min(5)
        });
        const {
            error,
            value
        } = Joi.validate(req.body, schema)
        // console.log(value);
        if (error && error.details) {
            return res.status(httpStatus.BAD_REQUEST)
                .json({
                    message: error.details
                })
        }

        const userEmail = await user.findOne({
            email: helper.lowerCase(req.body.email)
        });
        if (userEmail) {
            return res.status(httpStatus.CONFLICT)
                .json({
                    message: 'Email is aleary exits'
                })
        }

        const userName = await user.findOne({
            username: helper.firstupper(req.body.username)
        })
        if (userName) {
            return res.status(httpStatus.CONFLICT)
                .json({
                    message: 'user is aleary exits'
                })
        }
        return bcrypt.hash(value.password, 10, (err, hash) => {
            if (err) {
                return res.status(httpStatus.CONFLICT)
                    .json({
                        message: 'password cant be hash'
                    })
            }
            const body = {
                username: helper.firstupper(value.username),
                email: helper.lowerCase(value.email),
                password: hash
            };
            user.create(body).then(user => {
                    const token = jwt.sign({
                        data: user
                    }, dbconfig.secret, {
                        expiresIn: "1h"
                    });
                    res.cookie('auth', token)
                    res.status(httpStatus.CREATED)
                        .json({
                            message: 'user was craeted',
                            user,
                            token
                        });
                })
                .catch(err => {
                    res.status(httpStatus.INTERNAL_SERVER_ERROR)
                        .json({
                            message: 'Error'
                        })
                })

        });

    },

    // loginapi
    async loginuser(req, res) {
        if (!req.body.username || !req.body.password) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                message: 'No empty fields allwod'
            })
        }
        await user.findOne({
            username: helper.firstupper(req.body.username)
        }).then(user => {
            if (!user) {
                return res.status(httpStatus.NOT_FOUND).json({
                    message: 'user not found'
                })
            }
            return bcrypt.compare(req.body.password, user.password).then((result) => {
                if (!result) {
                    return res.status(httpStatus.INTERNAL_SERVER_ERROR)
                        .json({
                            message: 'password not match'
                        })

                }
                console.log(result)

                const token = jwt.sign({
                    data: user
                }, dbconfig.secret, {
                    expiresIn: '12hr'
                });
                res.cookie('auth', token);
                return res.status(httpStatus.OK)
                    .json({
                        message: 'login success',
                        user,
                        token
                    })

            })

        }).catch(err => {
            console.log(err)
            return res.status(httpStatus.INTERNAL_SERVER_ERROR)
                .json({
                    message: 'error in login try agian'
                })


        })


    }


}