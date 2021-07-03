const sendFriendRequest = require('../models/user.model').sendFriendRequest

module.exports = io =>{
        io.on('connection' , socket=>{
                socket.on('sendFriendRequest', data=>{
                   sendFriendRequest(data)
                        .then(()=>{
                                socket.emit('requestSent');
                                io.to(data.friendId).emit('newFriendRequest', {
                                        name:data.myName,
                                        id: data.myId
                                })   
                        })
                        .catch(err=>{
                                socket.emit('requestFailed')
                        })
                }) 
        })
}

