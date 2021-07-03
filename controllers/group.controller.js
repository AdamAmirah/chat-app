const userModel = require("../models/user.model") 
const groupModel =  require("../models/group.model") 
const groupMessagesModel = require("../models/group.messages.model")
const validationResult = require("express-validator").validationResult



exports.getGroup= (req, res, next)=>{
    groupModel.getGroups(req.session.userId).then((groups)=>{
        res.render('group', {
            isLogged : req.session.userId,
            page: "Groups"  ,
            friendRequests : req.friendRequests,
            groups: groups  
        })
    })
}
exports.getCreateGroup= (req, res, next)=>{
    userModel.getFriends(req.session.userId).then((friends)=>{
        res.render('create-group', {
            isLogged : req.session.userId,
            page: "Create Group"  ,
            friendRequests : req.friendRequests,
            friends: friends  ,
            validationErrors: req.flash('validationErrors')

        })
    })
   
}

exports.createGroup = (req, res, next) =>{
    let list = []
    if(validationResult(req).isEmpty()){

            userModel.getFriends(req.session.userId).then((friends)=>{
                for(let friend of friends){
                        if(req.body[friend.id] === 'on'){
                            list.push(friend.id)
                        }
                    }
                    list.push(req.session.userId)
            })
            .then(()=>{
                groupModel.createGroupChat(list,req.body.groupName,req.file.filename).then(()=>{
                    res.redirect('/group')
                })
                .catch(err =>{
                    res.redirect('/error')
                })
            }).catch(err =>{
                res.redirect('/error')
            })
    }

    else{
        req.flash('validationErrors' , validationResult(req).array())
        console.log(validationResult(req).array());
        res.redirect('/group/create-group')
    }

    
  
}

////////////////////////////////////////////////////////////////////////////////////////



exports.getChat = (req, res, next) =>{
    let gChatId = req.params.id
    groupMessagesModel.getMessages(gChatId)
    .then((messages)=>{
            if(messages.length === 0){
                groupModel.getChat(gChatId).then((chat)=>{
                    let membersData = chat.users.filter(
                        user => user._id != req.session.userId
                    )
                   // console.log(chat);
                   // console.log(membersData);

                    res.render('group-chat', {
                        page:chat.name + ' group',
                        isLogged : req.session.userId,
                        friendRequests: req.friendRequests,
                        messages: messages,
                        membersData: membersData,
                        groupId: chat._id,
                        groupName: chat.name,
                        groupImage: chat.image
                    })
                })
            } else{
                let membersData = messages[0].group.users.filter(
                    user => user._id != req.session.userId
                ) 
                let groupName = messages[0].group.name
                let groupId = messages[0].group._id
               // console.log(messages[0].group.image);
                res.render('group-chat', {
                    page:groupName + ' group',
                    isLogged : req.session.userId,
                    friendRequests: req.friendRequests,
                    messages: messages,
                    membersData: membersData,
                    groupId: groupId,
                    groupName: groupName,
                    groupImage: messages[0].group.image
                })
            }
    })
}
