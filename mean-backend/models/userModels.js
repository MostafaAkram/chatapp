const mongoose = require('mongoose');

const userScheme = mongoose.Schema({
    username : {type:String},
    email :{type :String},
    password :{type:String},
    posts : [
        {
          postId : {type:mongoose.Types.ObjectId , ref:'posts'},
          post :{type : String},
          created : {type :Date , defualt:Date.now()}  

        }
    ],
    following :[
      {userfollowed : {type : mongoose.Schema.Types.ObjectId , ref:'user'}}
    ],
    followers:[
      {follower : {type : mongoose.Schema.Types.ObjectId , ref:'user'}}
    ],
    notifactions :[
      {
        senderId :{type : mongoose.Schema.Types.ObjectId , ref:'user'},
        message :{type : String},
        viewProfile : {type:Boolean , defualt:false},
        created : {type:Date ,defualt:Date.now()},
        read : {type:Boolean , defualt:false},
        date : {type:String ,defualt : ''}
      }
    ],
    chatlist:[
      {
        receiverId:{type:mongoose.Schema.Types.ObjectId , ref:'user'},
        msgId:{type:mongoose.Schema.Types.ObjectId , ref:'messages'}
      }
    ],
    picVersion:{type :String , defualt :'1580726944'},
    picId : {type :String ,defualt :'png-avatar-108-images-in-collection-page-3-png-avatar-300_300_dxkxqt.png'},
    images : [{
      imgId : {type : String ,defualt :''},
      imgVersion : {type:String , defualt:''}
    }]
});
module.exports = mongoose.model('user',userScheme);