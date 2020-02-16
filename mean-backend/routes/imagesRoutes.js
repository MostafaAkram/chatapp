const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/users');
const authhelper = require('../helpers/AuthHelper');
const imgCtrl = require('../controllers/images');



router.post('/upload-image',authhelper.Verifytoken,imgCtrl.uploadImage);
router.get('/set-default-image/:imgId/:imgVersion',authhelper.Verifytoken,imgCtrl.setprofileimg);


module.exports =router;