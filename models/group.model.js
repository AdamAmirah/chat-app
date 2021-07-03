const mongoose = require('mongoose')
const config = require('../config.json');
const DB_URL = config.DB_URL

const groupSchema = mongoose.Schema({
    users: [ {type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
    name: String,
    image: String
})

const Group =mongoose.model('group' , groupSchema);
exports.Group = Group;

exports.createGroupChat = async (users, name, image) =>{
    try { 
        await mongoose.connect(DB_URL,  { useUnifiedTopology: true ,useNewUrlParser: true })
        let newGroup = new Group({
            users: users,
            name: name,
            image: image
        })
        let groupDoc = await newGroup.save()
        mongoose.disconnect()
        return 
    } catch (error){
        mongoose.disconnect()
        throw new Error(error)
    }
}

exports.getGroups = async id =>{
    try { 
        await mongoose.connect(DB_URL,  { useUnifiedTopology: true ,useNewUrlParser: true })
        let groups=  await Group.find({users: id})
        mongoose.disconnect()
        return groups
    }catch (error){
        mongoose.disconnect()
        throw new Error(error)
    }
}

/////////////////////////////////////////////////////////////////////

exports.getChat = async groupId =>{
    try{
        await mongoose.connect(DB_URL,  { useUnifiedTopology: true ,useNewUrlParser: true })
        let chat=  await Group.findById(groupId).populate({ path: 'users', select: 'username image' });
        mongoose.disconnect()
        return chat;
    }catch(error){
        mongoose.disconnect()
        throw new Error(error)
    }
}

