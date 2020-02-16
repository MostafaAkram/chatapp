const  express= require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require ('cors');

// const logger = require('morgan');
 



const app = express();
const dbConfig = require('./config/secret')

const serve = require('http').createServer(app);
const io =require('socket.io').listen(serve);
app.use(cors());
app.use((req , res , next) =>{

    res.header('Access-Control-Allow-Origin' , '*');
    res.header('Access-Control-Allow-Methods' ,'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Access-Control-Allow-Headers' ,  'X-API-KEY, Origin, X-Requested-With , Accept, Access-Control-Request-Method, Authorization');
    res.header('Access-Control-Allow-Credentials' , 'true');
    next();
})


app.use(express.json({limit:'50mb'}))
app.use(express.urlencoded({extended:true , limit:'50mb'}))
app.use(cookieParser())



// app.use(logger('dev'))

mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.url ,  { useNewUrlParser: true });

require('./socket/streams')(io);

const auth = require('./routes/authRoutes');
const posts = require('./routes/postsRouts');
const users = require('./routes/userRoutes');
const friends = require('./routes/friendsRoutes');
const message = require('./routes/messageRouts');
const image = require('./routes/imagesRoutes');

app.use('/api/mean',auth);
app.use('/api/mean',posts);
app.use('/api/mean',users);
app.use('/api/mean',friends);
app.use('/api/mean',message);
app.use('/api/mean',image);


serve.listen(3000 , ()=>{
    console.log('is works')
})
