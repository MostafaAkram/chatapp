const express = require('express');
const router = express.Router();

const authhelper = require('../helpers/AuthHelper');
const messageCtrl = require('../controllers/message');


router.post('/chat-message/:sender_Id/:receiver_Id',authhelper.Verifytoken,messageCtrl.Sendmessage);
router.get('/chat-message/:sender_Id/:receiver_Id',authhelper.Verifytoken,messageCtrl.Getallmessage);

module.exports =router;