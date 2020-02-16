const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/users');
const authhelper = require('../helpers/AuthHelper');
const friendsCtrl = require('../controllers/friends');


router.post('/follow-user',authhelper.Verifytoken,friendsCtrl.Followuser);
router.post('/unfollow-user',authhelper.Verifytoken,friendsCtrl.UnFollowuser);
router.post('/mark/:id' , authhelper.Verifytoken,friendsCtrl.Marknotifaction)
router.post('/mark-all' , authhelper.Verifytoken,friendsCtrl.MarknotifactionAll)

module.exports =router;