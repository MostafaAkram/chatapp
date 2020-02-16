const mongoose = require('mongoose');




const messageSchema = mongoose.Schema({
  conversationId :{type : mongoose.Schema.Types.ObjectId , ref :'conversation'},
  sender: {type :String},
  receiver:{type :String},
  message:[
      {
          senderId : {type:mongoose.Schema.Types.ObjectId , ref:'user'},
          receiverId:{type:mongoose.Schema.Types.ObjectId , ref:'user'},
          sendername : {type:String},
          recivername:{type:String},
          body:{type:String , default:''},
          isread:{type:Boolean,default:false},
          createdAt:{type:Date,default:Date.now()}

      }
  ]



})
module.exports = mongoose.model('messages' , messageSchema);