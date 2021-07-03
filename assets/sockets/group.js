const sendbtn = document.getElementById('sendbtn')

const groupId = document.getElementById('groupId').value
const message = document.getElementById('msg')

const timestamp = document.getElementById('timestamp')
const contentmsg = document.getElementById('content')

const membersData = document.getElementById('membersData').value
myObject = JSON.parse(membersData);



socket.emit('joinGroup', groupId)

sendbtn.onclick = (e)=>{
    e.preventDefault() // do not submit the form

    let content = message.value
    socket.emit('sendGMessage', {
        group: groupId,
        content: content,
        sender: userId
    } , () =>{
        message.value= ''
    })

}

socket.on('newMessageG', msg =>{

    let messagesContainer= document.getElementById('messages-container')
    let senderName
    let senderId

    for(member of myObject){
        if(String(member._id) === String(msg.sender)){
            senderName = member.username
            senderId = member._id
            break;
        }
    }
    
    if(String(msg.sender) === String(senderId)){
        messagesContainer.innerHTML+= `
        <div class="message">
        <p id="friendName" class="meta"> ${senderName}  <span id="timestamp"> ${msg.timestamp}</span></p>
        <p id="content" class="text">
            ${msg.content}
        </p>
        </div>
        `    
    }
    else {
        messagesContainer.innerHTML+= `
        <div style= "background-color: #457b9d;" class="message">
        <p id="friendName" class="meta"> Me <span style= "color: rgb(0, 0, 0);" id="timestamp">${msg.timestamp}</span></p>
        <p id="content" class="text">
            ${msg.content}
        </p>
        </div>
        `
    }
  
})