const mongoose = require('mongoose');

const conversationSchema = mongoose.Schema({
    participants:[
       {
          senderId:{type:mongoose.Schema.Types.ObjectId , ref:'user'},
          receiverId:{type:mongoose.Schema.Types.ObjectId , ref:'user'}

       }

    ]



})
module.exports = mongoose.model('conversation' , conversationSchema);