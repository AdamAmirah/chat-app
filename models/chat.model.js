const mongoose = require('mongoose')
const config = require('../config.json');
const DB_URL = config.DB_URL

const chatSchema = mongoose.Schema({
    users: [ {type: mongoose.Schema.Types.ObjectId, ref: 'user' }]
})

const Chat =mongoose.model('chat' , chatSchema);
exports.Chat = Chat;

exports.getChat = async chatId =>{
    try{
        await mongoose.connect(DB_URL,  { useUnifiedTopology: true ,useNewUrlParser: true })
        let chat=  await Chat.findById(chatId).populate('users');
        mongoose.disconnect()
        return chat;
    }catch(error){
        mongoose.disconnect()
        throw new Error(error)
    }
}


