module.exports = io =>{
    io.on("connection" , socket => {
        socket.on('joinNotificationRoom', id => {
            socket.join(id)
         //   console.log('join' , id);
        })

        socket.on('goOnline' , id => {
            io.onlineUsers[id] = true;
            //console.log(io.onlineUsers);
            socket.on('disconnect' , () =>{
                io.onlineUsers[id] = false;
                //console.log(io.onlineUsers);
            })
        })
    })
}

