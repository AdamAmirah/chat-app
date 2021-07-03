const newNessage = require('../models/group.messages.model').newMessage

module.exports = io =>{
    io.on('connection', socket =>{
        socket.on('joinGroup', groupId=>{
            socket.join(groupId)
        })
        socket.on('sendGMessage', (msg, cb )=>{
             newNessage(msg).then(()=>{
                io.to(msg.group).emit('newMessageG', msg)
                cb()
             })
        })
    })
}