const mongoose = require('mongoose')
const config = require('../config.json');
const DB_URL = config.DB_URL

const messageSchema = mongoose.Schema({
    chat: {type: mongoose.Schema.Types.ObjectId, ref: 'chat'},
    content: String,
    sender: String,
    timestamp: String
})

const Message =mongoose.model('message' , messageSchema);

exports.getMessages = async chatId =>{
    try{
        await mongoose.connect(DB_URL,  { useUnifiedTopology: true ,useNewUrlParser: true })
        let messages=  await Message.find({chat: chatId}, null , {sort: {timestamp:1}}).populate({
            path: 'chat', //field
            model: 'chat',
            populate: {
                path: 'users',
                model: 'user',
                select: 'username image'
            }
        });
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
        let newMsg = new Message(msg) 
        await newMsg.save()
        mongoose.disconnect()
        return 
    }catch(error){
        mongoose.disconnect()
        throw new Error(error)
    }
}
