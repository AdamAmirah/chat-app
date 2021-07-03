const mongoose  = require('mongoose')
const config = require('../config.json');
const DB_URL = config.DB_URL
const bcrypt  = require('bcrypt')
const Chat = require('./chat.model').Chat

const userSchema = mongoose.Schema({
    username: String,
    email: String,
    password: String,
    image: {type: String , default: "defualt-user-imgae.png"},
    isOnline: { type: Boolean , default: false},
    friends : {
        type: [{name : String, image: String, id: String, chatId: String}],
        default: []
    },
    friendRequests: {
        type: [{name: String, id:String}],
        default:[]
    },
    sentRequests: {
        type: [{name: String, id: String }],
        default:[]
    }
})

const User = mongoose.model ('user' , userSchema)

exports.createUser= (username, email , password)=>{
        return new Promise ((resolve , reject) => {
            mongoose.connect(DB_URL , { useUnifiedTopology: true ,useNewUrlParser: true }).then(()=>{
                return User.findOne({email:email})
            }).then (user => {
                if(user){
                    mongoose.disconnect()
                    reject("Email exists")
                }
                else return bcrypt.hash(password, 10)
                
            }).then(hashedPassword => {
                  let user = new User ({
                      username : username,
                      email:email,
                      password: hashedPassword
                  })
                  return user.save()
            }).then(()=>{
                mongoose.disconnect()
                resolve()
            }).catch(err => {
                mongoose.disconnect()
                reject(err)
            })
        })
}


exports.login = (email, password)=>{
    console.log("welcome");
    return new Promise ((resolve , reject)=>{
        mongoose.connect(DB_URL ,  { useUnifiedTopology: true ,useNewUrlParser: true })
        .then(()=> User.findOne({email:email}))
        .then(user =>{
            if(!user){
                mongoose.disconnect();
                reject("this email does not  exist")
            }else{
                bcrypt.compare(password, user.password).then(same =>{
                    if(!same){
                        mongoose.disconnect()
                        reject("password is inncorrect")
                    }else {
                        mongoose.disconnect()
                        resolve(user)
                    }
                })
            }
        }).catch(err =>{
            mongoose.disconnect()
            reject(err)
        })
    })
}

exports.logout= ()=>{
     return new Promise ((resolve, reject)=>{
         mongoose.connect(DB_URL , { useUnifiedTopology: true ,useNewUrlParser: true })
         .then(()=>{
             return find({})
         })
     })  
}


exports.getAllUsers= () =>{
    return new Promise ( (resolve , reject) =>{
        mongoose.connect(DB_URL , { useUnifiedTopology: true ,useNewUrlParser: true })
        .then(()=>{
            return User.find({})
        })
        .then( users => {
            mongoose.disconnect()
            resolve(users)
        })
        .catch(err => {
            mongoose.disconnect()
             reject(err)
        })

    })
}


exports.getUserData = (id) =>{
    return new Promise((resolve, reject) =>{
        //console.log(id);
        mongoose.connect(DB_URL , { useUnifiedTopology: true ,useNewUrlParser: true })
        .then(()=>{
            return User.findById(id)
        })
        .then((data)=>{
            mongoose.disconnect()
            resolve(data)
        })
        .catch(err =>{
            mongoose.disconnect()
            reject(err)
        })
    })
}


///////////////////////////////////////////////

exports.sendFriendRequest = async data=>{
        //await : wait for the function to finish
        //asynch 

     /// my is the one who is requesting 
     /// friend is the one who is recieving

     //add user1 to user2 friend requests
    try{
        await mongoose.connect(DB_URL,  { useUnifiedTopology: true ,useNewUrlParser: true })
        await User.updateOne(
            {_id:data.friendId} , 
            {$push: {friendRequests: {name:data.myName , id: data.myId}}}
        );
     //add user2 to user1 sent requests
        await User.updateOne(
            {_id:data.myId} , 
            {$push: {sentRequests: {name:data.friendName , id: data.friendId }}}
        );

        mongoose.disconnect()

        return 
        } catch(error) {
            mongoose.disconnect()
            throw new Error(error)
        }


}

exports.cancelFriendRequest = async (data)=>{
    try {
        await mongoose.connect(DB_URL,  { useUnifiedTopology: true ,useNewUrlParser: true })
        await User.updateOne(
            {_id:data.friendId} , 
            {$pull: {friendRequests: {name:data.myName , id: data.myId}}}
        )
        await User.updateOne(
            {_id:data.myId} , 
            {$pull: {sentRequests: {name:data.friendName , id: data.friendId}}}
        )

        mongoose.disconnect()
        return
    } catch(error) {
        mongoose.disconnect()
        throw new Error(error)
    }

}


exports.acceptFriendRequest = async (data)=>{

    try{
    // delete from friends request  user2
    await mongoose.connect(DB_URL,  { useUnifiedTopology: true ,useNewUrlParser: true })
    await User.updateOne(
            {_id: data.myId},
            {$pull: {friendRequests : { name: data.friendName , id:data.friendId}}}
        )
    // delete request in sentrequest user 1
        await User.updateOne(
            {_id:data.friendId} , 
            {$pull: {sentRequests: {name:data.myName , id: data.myId}}}
        )

        let newChat = new Chat({
            users: [data.myId , data.friendId]
        })
        let chatDoc = await newChat.save()

    // add user1 in user2 friends
        await User.updateOne(
            {_id:data.friendId} , 
            {$push: {friends: {name:data.myName , id: data.myId, image : data.myImage, chatId:chatDoc._id}}}
        );
 
    // add user2 in user1 friends
        await User.updateOne(
            {_id:data.myId} , 
            {$push: {friends: {name:data.friendName , id: data.friendId, image : data.friendImage, chatId:chatDoc._id }}}
        );
   
        mongoose.disconnect()
        return
    } catch(error) {
        mongoose.disconnect()
        throw new Error(error)
    }
    
}

exports.rejectFriendRequest = async (data)=>{
    try{

        await mongoose.connect(DB_URL,  { useUnifiedTopology: true ,useNewUrlParser: true })
        // remove the request from from user2
        await User.updateOne(
            {_id:data.myId},
            {$pull: {friendRequests : { name: data.friendName , id:data.friendId}}}
        )
        // update to rejected in request sent from user1 
        await User.updateOne(
            {_id:data.friendId} , 
            {$pull: {sentRequests: {name:data.myName, id: data.myId}}}
        )
        mongoose.disconnect()
        return
    }catch(error) {
        mongoose.disconnect()
        throw new Error(error)
    }  
}

exports.deleteFriend = async(data)=>{
    try {
        await mongoose.connect(DB_URL,  { useUnifiedTopology: true ,useNewUrlParser: true })
           
        await User.updateOne(
            {_id:data.friendId} , 
            {$pull: {friends: {id: data.myId }}},{multi: true}
        )
        await User.updateOne(
            {_id:data.myId} , 
            {$pull: {friends: {id: data.friendId}}},{multi: true}
        )

        mongoose.disconnect()
        return
    } catch(error) {
        mongoose.disconnect()
        throw new Error(error)
    }

}

///////////////////////////

exports.getFriendRequests = async id =>{
    try{
        await mongoose.connect(DB_URL,  { useUnifiedTopology: true ,useNewUrlParser: true })
        let data = await User.findById( id, {friendRequests: true})
        mongoose.disconnect()
        return data.friendRequests
    }catch(error) {
        mongoose.disconnect()
        throw new Error(error)
    }
}


exports.getFriends = async id =>{
    try { 
        await mongoose.connect(DB_URL,  { useUnifiedTopology: true ,useNewUrlParser: true })
        let data = await User.findById( id, {friends: true})
        mongoose.disconnect()
        return data.friends
    }catch (error){
        mongoose.disconnect()
        throw new Error(error)
    }
}