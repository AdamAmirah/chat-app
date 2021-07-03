const {sendFriendRequest , getFriends} = require('../models/user.model')

module.exports = io =>{
    io.on('connection' , socket =>{
        socket.on('getOnlineFriends', id =>{
            getFriends(id).then( friends =>{
                let onlineFriends = friends.filter(friend => io.onlineUsers[friend.id])
                socket.emit('takeOnlineFriends' , onlineFriends)
            })
        })
    })
}