const mongoosoe = require('mongoose');
const postSchema = mongoosoe.Schema({
    user : {type : mongoosoe.Schema.Types.ObjectId , ref:'user'},
    username : {type : String , default : ''},
    posts : {type:String , default :''},
    comments :[
        {
            userId :{type : mongoosoe.Schema.Types.ObjectId , ref:'user'},
            username : {type : String , default : ''},
            comment : {type : String , default : '' },
            createdAt:{type : Date , default : Date.now()}

        }
    ],
    totallikes : {type : Number , default : 0},
    likes:[{
        username : {type : String , default : ''}
    }
    ],
    created:{type:Date , default :Date.now()}
    

});
module.exports = mongoosoe.model('posts' ,postSchema)