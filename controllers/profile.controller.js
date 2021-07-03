const userModel = require("../models/user.model")

exports.redirect =(req, res , next)=>{
    res.redirect("/profile/"+req.session.userId)
}

exports.getProfile = (req, res, next)=>{
     let id = req.params.id;
     if(!id) 
        return res.redirect("/profile/"+req.session.userId)
     userModel.getUserData(id)
     .then(data =>{
         //console.log(data)
         res.render("profile", {
             page: "Profile",
             isLogged : req.session.userId,

             myId: req.session.userId, // the one who is doing the action
             myName: req.session.name,
             myImage: req.session.image,
             
             friendId : data._id, // the other side
             friendName: data.username,
             friendImage : data.image,
             
             friendRequests : req.friendRequests,
             isOwner: (id===req.session.userId),
             isFriends: data.friends.find(friend =>friend.id === req.session.userId),
             isRequestSent: data.friendRequests.find(friend =>friend.id === req.session.userId),
             isRequestRecieved: data.sentRequests.find(friend =>friend.id === req.session.userId)

            })
     })
     .catch(err =>{
         res.redirect("/error/500")
     })
}