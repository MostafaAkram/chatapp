module.exports = function(io) {
    io.on('connection' ,socket=>{
        // console.log('server connect')
        socket.on('refresh',(data) =>{
            // console.log(data)
            io.emit('refreshPage' , {})
        })
    
    })


}