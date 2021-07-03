const chatModel = require("../models/chat.model")
const messageModel = require("../models/message.model")
const userModel = require("../models/user.model")


exports.getChat = (req, res, next) =>{
    let chatId = req.params.id
    messageModel.getMessages(chatId)

    .then((messages)=>{
        if(messages.length === 0){
            chatModel.getChat(chatId).then((chat)=>{
                //console.log(chat)
                let friendData = chat.users.find(
                    user => user._id != req.session.userId
                )
                res.render('chat', {
                    page:friendData.username,
                    isLogged : req.session.userId,
                    friendRequests: req.friendRequests,
                    messages: messages,
                    friendData: friendData,
                    chatId: chatId
                })
            })
        }else{
            let friendData = messages[0].chat.users.find(
                user => user._id != req.session.userId
            )
    
            res.render('chat', {
                page:friendData.username,
                isLogged : req.session.userId,
                friendRequests: req.friendRequests,
                messages: messages,
                friendData: friendData,
                chatId: chatId
            })
        }
        
    })
}


exports.delete = (req , res ,next)=>{

    userModel.deleteFriend(req.body).then(()=>{
        res.redirect('/')
    })
    .catch(err =>{
        res.redirect('/error')
    })
}
