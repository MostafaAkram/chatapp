const jwt = require('jsonwebtoken');
const httpstatus = require('http-status-codes');
const dbconfif = require('../config/secret');

module.exports = {
    Verifytoken : (req , res , next) =>{
        // console.log(req.headers)
        if(!req.headers.authorization){
            return res.status(httpstatus.UNAUTHORIZED).json
            ({message : 'No Auth'})
        }
        const token = req.cookies.auth  || req.headers.authorization.split(' ')[1];


        if(!token){
            return res.status(httpstatus.FORBIDDEN).json({message : 'no token'})
        }
        
        return jwt.verify(token , dbconfif.secret, (err,decoded) =>{
            console.log(err)
            if (err) {
                if(err.expiredAt < new Date()){
                    return res.status(httpstatus.INTERNAL_SERVER_ERROR).
                    json({message : 'token is expired' , token:null});
                }
                next();

            }
            req.user =decoded.data;
            next();

        })



    }

}