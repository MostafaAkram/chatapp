const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/users');
const authhelper = require('../helpers/AuthHelper');


router.get('/users',authhelper.Verifytoken,userCtrl.getAlluser);
router.get('/user/:id',authhelper.Verifytoken,userCtrl.getuser);
router.get('/username/:username',authhelper.Verifytoken,userCtrl.getusername);


module.exports =router;