const sendbtn = document.getElementById('sendbtn')
const chatId = document.getElementById('chatId').value
const message = document.getElementById('msg')
const friendname = document.getElementById('friendname').value
const friendId = document.getElementById('friendId').value

const friendName = document.getElementById('friendName')
const timestamp = document.getElementById('timestamp')
const contentmsg = document.getElementById('content')


socket.emit('joinChat', chatId)


sendbtn.onclick = (e)=>{
    e.preventDefault() // do not submit the form

    let content = message.value
    socket.emit('sendMessage', {
        chat: chatId,
        content: content,
        sender: userId
    } , () =>{
        message.value= ''
    })

}

socket.on('newMessage', msg =>{
    let messagesContainer= document.getElementById('messages-container')
    if(String(msg.sender) === String(friendId)){
        messagesContainer.innerHTML+= `
        <div class="message">
        <p id="friendName" class="meta"> ${friendname}  <span id="timestamp"> ${msg.timestamp}</span></p>
        <p id="content" class="text">
            ${msg.content}
        </p>
        </div>
        `    
    }
    else {
        messagesContainer.innerHTML+= `
        <div class="message">
        <p id="friendName" class="meta"> Me <span id="timestamp">${msg.timestamp}</span></p>
        <p id="content" class="text">
            ${msg.content}
        </p>
        </div>
        `
    }
    // friendName.innerHTML+= friendname
    // timestamp.innerHTML+= msg.timestamp
    // contentmsg.innerHTML+= msg.content
})