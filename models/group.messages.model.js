const mongoose = require('mongoose')

const config = require('../config.json');
const DB_URL = config.DB_URL

const groupMessagesSchema = mongoose.Schema({
    group: {type: mongoose.Schema.Types.ObjectId, ref: 'group'},
    content: String,
    sender: String,
    timestamp: String
})

const groupMessage =mongoose.model('group-message' , groupMessagesSchema);

exports.getMessages = async groupId =>{

    try{
        await mongoose.connect(DB_URL,  { useUnifiedTopology: true ,useNewUrlParser: true })
        let messages=  await groupMessage.find({group: groupId}, null , {sort: {timestamp:1}}).populate({
            path: 'group', //field
            model: 'group',
            populate: {
                path: 'users',
                model: 'user',
                select: 'username image'
            }
        });
        // console.log('messages in messages model ', messages[0].group.users)
        mongoose.disconnect()
        return messages;
    }catch(error){
        mongoose.disconnect()
        throw new Error(error)
    }
}


exports.newMessage = async (msg) =>{
    try{
        await mongoose.connect(DB_URL,  { useUnifiedTopology: true ,useNewUrlParser: true })
        var d = new Date();
        msg.timestamp = d.toLocaleTimeString();
        let newMsg = new groupMessage(msg) 
        await newMsg.save()
        mongoose.disconnect()
        return 
    }catch(error){
        mongoose.disconnect()
        throw new Error(error)
    }
}
