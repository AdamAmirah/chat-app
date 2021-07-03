const addbtn = document.getElementById('addBtn')
const form = document.getElementById('friends-form')
const myId = document.getElementById('myId').value
const myName = document.getElementById('myName').value
const myImage = document.getElementById('myImage').value
const friendId = document.getElementById('friendId').value
const friendName = document.getElementById('friendName').value
const friendImage = document.getElementById('friendImage').value

addbtn.onclick = (e)=>{
    e.preventDefault() // do not submit the form
    socket.emit('sendFriendRequest', {
        myId,
        myImage,
        myName,
        friendImage,
        friendId,
        friendName
    })

}

  


socket.on('requestSent' , () =>{
    addBtn.remove()
    form.innerHTML+= `<input type="submit" value= "Cancel Request" class="btn btn-danger" formaction= "/friend/cancel">`
})

